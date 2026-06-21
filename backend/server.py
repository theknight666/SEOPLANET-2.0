from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
from jose import JWTError, jwt
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import urllib.request
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import smtplib
from email.message import EmailMessage
import secrets
import string

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Web3Forms setup
WEB3FORMS_ACCESS_KEY = os.environ.get('WEB3FORMS_ACCESS_KEY', '')
AGENCY_EMAIL = os.environ.get('AGENCY_EMAIL', 'enquiry@seoplanet.in')

# SMTP Setup
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', AGENCY_EMAIL)

app = FastAPI(title="SEO Planet API")
api_router = APIRouter(prefix="/api")

# ===== Auth Configuration =====
SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-key-for-seoplanet-onboarding-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password, hashed_password):
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    return bcrypt.checkpw(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_client(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    onboarding_user = os.environ.get('ONBOARDING_ADMIN_USER', 'onboardingadmin')
    portal_user = os.environ.get('PORTAL_ADMIN_USER', 'portaladmin')

    if username == onboarding_user:
        return {"username": username, "company_name": "Onboarding Command", "role": "admin"}
    elif username == portal_user:
        return {"username": username, "company_name": "Portal Control", "role": "admin"}
    
    client_doc = await db.clients.find_one({"username": username}, {"_id": 0, "password_hash": 0})
    if client_doc is None:
        raise credentials_exception
    client_doc["role"] = "client"
    return client_doc

# ===== Models =====
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default="", max_length=160)
    message: str = Field(..., min_length=1, max_length=4000)


class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: str = ""
    message: str
    email_sent: bool = False
    email_error: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ===== Helpers =====
def _build_email_html(payload: ContactCreate) -> str:
    safe_company = payload.company or "—"
    safe_message = (payload.message or "").replace("\n", "<br/>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#05050A;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0A0A0F;border:1px solid rgba(0,255,148,0.25);border-radius:16px;padding:32px;">
          <tr><td>
            <p style="margin:0 0 8px 0;color:#00FF94;letter-spacing:0.2em;font-size:12px;text-transform:uppercase;">SEO Planet · New Transmission</p>
            <h1 style="margin:0 0 24px 0;color:#ffffff;font-size:24px;line-height:1.2;">A new lead just opened a channel</h1>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);">
              <tr><td style="padding:14px 0;color:#9CA3AF;font-size:12px;width:140px;">Name</td><td style="padding:14px 0;color:#ffffff;font-size:14px;">{payload.name}</td></tr>
              <tr><td style="padding:14px 0;color:#9CA3AF;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">Email</td><td style="padding:14px 0;color:#ffffff;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);">{payload.email}</td></tr>
              <tr><td style="padding:14px 0;color:#9CA3AF;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">Company</td><td style="padding:14px 0;color:#ffffff;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);">{safe_company}</td></tr>
              <tr><td style="padding:14px 0;color:#9CA3AF;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);vertical-align:top;">Message</td><td style="padding:14px 0;color:#ffffff;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);line-height:1.6;">{safe_message}</td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def _send_contact_email(payload: ContactCreate) -> tuple[bool, Optional[str]]:
    # Web3Forms blocked backend submissions on the free plan (403 Forbidden).
    # The email is now sent directly from the frontend React app.
    # We just return True here so the submission gets logged to the DB successfully.
    return True, None

def _send_welcome_email(to_email: str, username: str, password: str, company_name: str) -> bool:
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Skipping welcome email.")
        return False
        
    try:
        msg = EmailMessage()
        msg['Subject'] = 'Welcome to SEO Planet - Your Portal Credentials'
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        # Professional HTML template matching the dark theme of SEO Planet
        html_content = f"""
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#05050A;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#0A0A0F;border:1px solid rgba(0,255,148,0.25);border-radius:16px;padding:32px;">
              <tr><td>
                <p style="margin:0 0 8px 0;color:#00FF94;letter-spacing:0.2em;font-size:12px;text-transform:uppercase;">SEO Planet Portal Access</p>
                <h1 style="margin:0 0 24px 0;color:#ffffff;font-size:24px;line-height:1.2;">Welcome, {company_name}</h1>
                <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin-bottom:24px;">Your dedicated SEO engine is now live. Use the credentials below to access your command center and track your strategy.</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);border-radius:8px;padding:16px;margin-bottom:24px;">
                  <tr><td style="padding:8px 0;color:#9CA3AF;font-size:12px;width:100px;">Portal URL</td><td style="padding:8px 0;color:#00FF94;font-size:14px;"><a href="https://portal.seoplanet.in" style="color:#00FF94;text-decoration:none;">portal.seoplanet.in</a></td></tr>
                  <tr><td style="padding:8px 0;color:#9CA3AF;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">Username</td><td style="padding:8px 0;color:#ffffff;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);font-family:monospace;">{username}</td></tr>
                  <tr><td style="padding:8px 0;color:#9CA3AF;font-size:12px;border-top:1px solid rgba(255,255,255,0.05);">Password</td><td style="padding:8px 0;color:#ffffff;font-size:14px;border-top:1px solid rgba(255,255,255,0.05);font-family:monospace;">{password}</td></tr>
                </table>
                
                <p style="color:#9CA3AF;font-size:12px;line-height:1.6;margin:0;">For security reasons, we recommend changing your password after your first login.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
        """
        
        msg.add_alternative(html_content, subtype='html')
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            
        logger.info(f"Welcome email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        return False



# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "SEO Planet API online"}

# --- Auth & Onboarding Routes ---
class LoginRequest(BaseModel):
    username: str
    password: str
    domain: Optional[str] = None

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    try:
        onboarding_user = os.environ.get('ONBOARDING_ADMIN_USER', 'onboardingadmin')
        onboarding_pass = os.environ.get('ONBOARDING_ADMIN_PASS', 'onboardingpass2026')
        portal_user = os.environ.get('PORTAL_ADMIN_USER', 'portaladmin')
        portal_pass = os.environ.get('PORTAL_ADMIN_PASS', 'portalpass2026')
        
        is_admin = False
        valid_admin = False
        
        if req.username == onboarding_user:
            is_admin = True
            if req.password == onboarding_pass and req.domain != "portal":
                valid_admin = True
        elif req.username == portal_user:
            is_admin = True
            if req.password == portal_pass and req.domain != "onboarding":
                valid_admin = True
                
        if is_admin:
            if not valid_admin:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials or domain")
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(data={"sub": req.username}, expires_delta=access_token_expires)
            return {"access_token": access_token, "token_type": "bearer"}

        client_doc = await db.clients.find_one({"username": req.username})
        if not client_doc or not verify_password(req.password, client_doc["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Incorrect username or password.",
            )
            
        if req.domain == "onboarding":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Clients cannot access onboarding domain")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": client_doc["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        raise HTTPException(status_code=400, detail=str(traceback.format_exc()))

@api_router.get("/onboarding/dashboard")
async def get_onboarding_dashboard(current_client: dict = Depends(get_current_client)):
    return {
        "status": "success",
        "data": current_client
    }

class ClientCreate(BaseModel):
    username: str
    company_name: str
    email: EmailStr
    password: str
    tier: str = "Launch System"

@api_router.post("/onboarding/clients")
async def create_new_client(payload: ClientCreate, current_client: dict = Depends(get_current_client)):
    if current_client.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    existing = await db.clients.find_one({"username": payload.username})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Client already exists")
        
    hashed_password = hash_password(payload.password)
    client_doc = {
        "username": payload.username,
        "company_name": payload.company_name,
        "email": payload.email,
        "password_hash": hashed_password,
        "status": "active",
        "tier": payload.tier,
        "metrics": {
            "traffic": "0",
            "rankings": "0",
            "da": "0",
            "backlinks": "0"
        },
        "metrics_changes": {
            "traffic": "+0%",
            "rankings": "+0%",
            "da": "+0",
            "backlinks": "+0"
        },
        "current_focus": "Phase 1: Technical Foundation & Access",
        "recent_activity": [
            {"date": datetime.now(timezone.utc).isoformat(), "title": "Portal access provisioned"}
        ],
        "timeline": [
            {"step": 1, "title": "Onboarding & Access", "status": "completed"},
            {"step": 2, "title": "Technical SEO Audit", "status": "in_progress"},
            {"step": 3, "title": "Keyword Strategy", "status": "pending"},
            {"step": 4, "title": "Content Execution", "status": "pending"}
        ],
        "documents": [],
        "traffic_trend": [],
        "keyword_rankings": [],
        "competitors": [],
        "goals": [],
        "full_deliverables": [],
        "content_calendar": [],
        "monthly_reports": [],
        "messages": [],
        "invoices": []
    }
    await db.clients.insert_one(client_doc)
    
    # Send email synchronously
    email_sent = _send_welcome_email(payload.email, payload.username, payload.password, payload.company_name)
    
    return {"status": "success", "message": "Client created", "email_sent": email_sent}

@api_router.get("/onboarding/clients")
async def get_all_clients(current_client: dict = Depends(get_current_client)):
    if current_client.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    onboarding_user = os.environ.get('ONBOARDING_ADMIN_USER', 'onboardingadmin')
    portal_user = os.environ.get('PORTAL_ADMIN_USER', 'portaladmin')
    
    clients = await db.clients.find({
        "username": {"$nin": ["admin", onboarding_user, portal_user]}
    }, {"_id": 0, "password_hash": 0}).to_list(100)
    
    return {"status": "success", "data": clients}

class ClientUpdate(BaseModel):
    status: str = "active"
    tier: str = "Launch System"
    metrics: dict
    metrics_changes: dict = {}
    current_focus: str
    timeline: list
    recent_activity: list
    documents: list
    traffic_trend: list = []
    keyword_rankings: list = []
    competitors: list = []
    goals: list = []
    full_deliverables: list = []
    content_calendar: list = []
    monthly_reports: list = []
    progress_reports: list = []
    messages: list = []
    invoices: list = []

@api_router.put("/onboarding/clients/{username}")
async def update_client(username: str, payload: ClientUpdate, current_client: dict = Depends(get_current_client)):
    if current_client.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    update_data = {
        "status": payload.status,
        "metrics": payload.metrics,
        "metrics_changes": payload.metrics_changes,
        "current_focus": payload.current_focus,
        "timeline": payload.timeline,
        "recent_activity": payload.recent_activity,
        "documents": payload.documents,
        "traffic_trend": payload.traffic_trend,
        "keyword_rankings": payload.keyword_rankings,
        "competitors": payload.competitors,
        "goals": payload.goals,
        "full_deliverables": payload.full_deliverables,
        "content_calendar": payload.content_calendar,
        "monthly_reports": payload.monthly_reports,
        "progress_reports": payload.progress_reports,
        "messages": payload.messages,
        "invoices": payload.invoices
    }
    result = await db.clients.update_one({"username": username}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return {"status": "success", "message": "Client updated"}

@api_router.delete("/onboarding/clients/{username}")
async def delete_client(username: str, password: str = None, current_client: dict = Depends(get_current_client)):
    if current_client.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    if username in ["admin", "onboardingadmin", "portaladmin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete admin accounts")
    
    onboarding_pass = os.environ.get('ONBOARDING_ADMIN_PASS', 'onboardingpass2026')
    portal_pass = os.environ.get('PORTAL_ADMIN_PASS', 'portalpass2026')
    
    if password not in [onboarding_pass, portal_pass]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin password. Deletion cancelled.")
    
    result = await db.clients.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return {"status": "success", "message": "Client deleted"}

class ContentStatusUpdate(BaseModel):
    item_index: int
    status: str

@api_router.put("/onboarding/clients/me/content-status")
async def update_content_status(payload: ContentStatusUpdate, current_client: dict = Depends(get_current_client)):
    if not current_client or current_client.get("role") == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only clients can update content status")
    
    username = current_client["username"]
    update_field = f"content_calendar.{payload.item_index}.status"
    result = await db.clients.update_one(
        {"username": username},
        {"$set": {update_field: payload.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return {"status": "success", "message": "Status updated"}

class SendMessage(BaseModel):
    text: str
    tagged_item: str = ""
    date: str

@api_router.post("/onboarding/clients/me/messages")
async def send_client_message(payload: SendMessage, current_client: dict = Depends(get_current_client)):
    if not current_client or current_client.get("role") == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only clients can send messages via this route")
    
    username = current_client["username"]
    new_message = {
        "sender": "Client",
        "text": payload.text,
        "tagged_item": payload.tagged_item,
        "date": payload.date
    }
    result = await db.clients.update_one(
        {"username": username},
        {"$push": {"messages": new_message}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return {"status": "success", "message": "Message sent"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    rows = (
        await db.status_checks.find({}, {"_id": 0})
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )
    for r in rows:
        if isinstance(r.get('timestamp'), str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.post("/contact")
async def submit_contact(payload: ContactCreate):
    email_sent, email_error = await _send_contact_email(payload)
    submission = ContactSubmission(
        name=payload.name,
        email=payload.email,
        company=payload.company or "",
        message=payload.message,
        email_sent=email_sent,
        email_error=email_error,
    )
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    
    if not email_sent:
        return {
            "status": "error",
            "message": f"Saved to DB, but email failed: {email_error}"
        }
        
    return {
        "status": "success",
        "id": submission.id,
        "email_sent": email_sent,
        "message": "Transmission received. We will be in contact shortly.",
    }


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contact_submissions(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    rows = (
        await db.contact_submissions.find({}, {"_id": 0})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )
    for r in rows:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return rows


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(ping_server())

async def ping_server():
    url = os.environ.get('RENDER_EXTERNAL_URL')
    if not url:
        logger.info("RENDER_EXTERNAL_URL not set, skipping self-ping.")
        return
    
    logger.info(f"Starting self-ping to {url} every 10 minutes to prevent sleep.")
    while True:
        try:
            await asyncio.sleep(10 * 60) # 10 minutes
            logger.info("Sending self-ping to keep Render server awake...")
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, urllib.request.urlopen, f"{url.rstrip('/')}/api/")
            logger.info("Self-ping successful.")
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error during self-ping: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
