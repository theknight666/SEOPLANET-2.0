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
import resend
import secrets
import string

try:
    from logo_b64 import LOGO_B64
except ImportError:
    LOGO_B64 = ""

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Web3Forms setup (Deprecated in favor of Resend)
WEB3FORMS_ACCESS_KEY = os.environ.get('WEB3FORMS_ACCESS_KEY', '')
AGENCY_EMAIL = os.environ.get('AGENCY_EMAIL', 'founder@seoplanet.in')

# Resend Email Setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', 're_2SErXCjJ_4BsnX1FwvkVhS1AFB1G3NJVs')
resend.api_key = RESEND_API_KEY
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'hello@seoplanet.in')

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
    safe_company = payload.company or "N/A"
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
    # The email is now sent directly from the frontend React app using Web3Forms.
    # We just return True here so the submission gets logged to the DB successfully.
    return True, None

def _send_welcome_email(to_email: str, username: str, password: str, company_name: str) -> bool:
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured. Skipping welcome email.")
        return False
        
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Unbounded:wght@400;600;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0;padding:0;background-color:#020205;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#ffffff;line-height:1.6;-webkit-font-smoothing:antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020205;padding:60px 20px;">
            <tr><td align="center">
              
              <!-- Main Container with subtle glowing border simulation -->
              <table width="640" cellpadding="0" cellspacing="0" style="background:#0A0A0F;border-radius:16px;overflow:hidden;border:1px solid #1F1F2E;box-shadow:0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,148,0.05);">
                
                <!-- Header Section -->
                <tr><td style="padding:60px 48px 40px 48px;text-align:center;background:linear-gradient(180deg, #101018 0%, #0A0A0F 100%);border-bottom:1px solid #151520;">
                  <img src="cid:logo" alt="SEO Planet" width="140" style="display:block;margin:0 auto 32px auto;border:0;" />
                  <h1 style="font-family:'Unbounded',sans-serif;font-weight:300;font-size:56px;letter-spacing:-0.02em;margin:0 0 16px 0;color:#ffffff;line-height:1.1;">
                    Welcome
                  </h1>
                  <p style="margin:0;color:#6B7280;font-size:12px;letter-spacing:6px;text-transform:uppercase;font-family:'JetBrains Mono',monospace;">
                    To The New Era
                  </p>
                  <p style="margin:24px 0 0 0;color:#00FF94;font-size:16px;letter-spacing:2px;text-transform:uppercase;font-weight:600;font-family:'Inter',sans-serif;">
                    {company_name}
                  </p>
                </td></tr>

                <!-- Content Section -->
                <tr><td style="padding:48px;text-align:left;">
                  <p style="color:#A1A1AA;font-size:16px;line-height:1.8;margin:0 0 24px 0;font-weight:300;">
                    It is with profound honor and deep respect that we formally welcome you into the exclusive ranks of the SEO Planet family. By forging this alliance today, you haven't just signed up for a service - you have claimed your rightful throne in the digital ecosystem. You have drawn a definitive line in the sand, signaling to the world that you are no longer competing; you are conquering.
                  </p>
                  
                  <p style="color:#A1A1AA;font-size:16px;line-height:1.8;margin:0 0 24px 0;font-weight:300;">
                    We understand the monumental weight of the trust you have placed within our walls. Building an empire is not a task for the faint of heart, and we do not take our role as your strategic architects lightly. From this exact moment onward, you are surrounded by an elite vanguard of specialists who treat your brand's legacy as fiercely as their own.
                  </p>

                  <p style="color:#A1A1AA;font-size:16px;line-height:1.8;margin:0 0 24px 0;font-weight:300;">
                    So, take a deep breath. Let the burden of the unseen algorithmic wars fall from your shoulders. The hardest battles are now ours to fight. While you sit at the helm and focus entirely on the grand vision of your empire, our engineers are already moving in the shadows deploying relentless precision to ensure your name echoes across every search query that matters.
                  </p>

                  <p style="color:#A1A1AA;font-size:16px;line-height:1.8;margin:0 0 24px 0;font-weight:300;">
                    We are not here to merely meet expectations; we are here to shatter them and rewrite the rules of your industry entirely. The era of compromises is over. Welcome to your new legacy. Welcome to unparalleled, royal success.
                  </p>

                  <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0 0 40px 0;font-weight:500;">
                    - Mukul Bhardwaj<br>
                    <span style="font-size:14px;color:#8B8B99;font-weight:400;">CEO, Founder</span>
                  </p>

                  <!-- Divider -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                    <tr><td style="height:1px;background:linear-gradient(90deg, rgba(0,255,148,0) 0%, rgba(0,255,148,0.3) 50%, rgba(0,255,148,0) 100%);"></td></tr>
                  </table>

                  <h3 style="margin:0 0 16px 0;font-size:12px;font-weight:600;color:#ffffff;letter-spacing:0.1em;text-transform:uppercase;font-family:'JetBrains Mono',monospace;">
                    <span style="color:#00FF94;margin-right:8px;">//</span> SECURE COMMAND CENTER
                  </h3>
                  
                  <p style="color:#A1A1AA;font-size:15px;line-height:1.6;margin:0 0 32px 0;font-weight:300;">
                    Below are the keys to your dedicated sanctuary where strategy meets flawless execution. Inside, you'll track real-time project goals, access exclusive deliverables, and review project timelines.
                  </p>

                  <!-- Credentials Card - Premium Glass/Terminal effect -->
                  <div style="background:#050508;border:1px solid #1A1A24;border-left:3px solid #00FF94;border-radius:8px;padding:24px 32px;margin-bottom:40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:12px 0;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;width:120px;border-bottom:1px solid rgba(255,255,255,0.05);">ACCESS_ID</td>
                        <td style="padding:12px 0;color:#ffffff;font-size:15px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.05);">{username}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;padding-top:16px;">PASSKEY</td>
                        <td style="padding:12px 0;color:#00FF94;font-size:15px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;padding-top:16px;">{password}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Premium Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:48px;">
                    <tr><td align="center">
                      <a href="https://portal.seoplanet.in" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:18px 48px;border-radius:100px;font-family:'Inter',sans-serif;">
                        INITIALIZE PORTAL
                      </a>
                    </td></tr>
                  </table>
                  
                  <!-- Signature -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1A1A24;padding-top:32px;">
                    <tr>
                      <td style="width:48px;vertical-align:top;">
                        <div style="width:32px;height:32px;background:#101018;border-radius:50%;border:1px solid #1F1F2E;display:inline-block;text-align:center;line-height:32px;color:#00FF94;font-family:'Unbounded',sans-serif;font-size:14px;font-weight:900;">S</div>
                      </td>
                      <td>
                        <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">The SEO Planet Team</p>
                        <p style="margin:4px 0 0 0;color:#6B7280;font-size:13px;">Engineering digital dominance.</p>
                      </td>
                    </tr>
                  </table>

                </td></tr>
              </table>
              
              <!-- Footer Text -->
              <table width="640" cellpadding="0" cellspacing="0">
                <tr><td style="padding:32px 0;text-align:center;">
                  <p style="margin:0;color:#4B5563;font-size:11px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">
                    ENCRYPTED TRANSMISSION &middot; SEO PLANET INC.
                  </p>
                </td></tr>
              </table>

            </td></tr>
          </table>
        </body>
        </html>
        """
        
        params: resend.Emails.SendParams = {
            "from": f"SEO Planet Portal <{FROM_EMAIL}>",
            "to": [to_email],
            "subject": "Welcome to SEO Planet - Your Portal Credentials",
            "html": html_content,
        }
        
        if LOGO_B64:
            params["attachments"] = [
                {
                    "filename": "email-logo-white.png",
                    "content": LOGO_B64,
                    "content_id": "logo"
                }
            ]
            
        resend.Emails.send(params)
            
        logger.info(f"Welcome email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email via Resend: {e}")
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
