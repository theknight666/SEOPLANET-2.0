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
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone, timedelta

import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
AGENCY_EMAIL = os.environ.get('AGENCY_EMAIL', 'founder@seoplanet.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

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
    
    client_doc = await db.clients.find_one({"username": username}, {"_id": 0, "password_hash": 0})
    if client_doc is None:
        raise credentials_exception
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
    if not RESEND_API_KEY:
        return False, "RESEND_API_KEY not configured"
    params = {
        "from": SENDER_EMAIL,
        "to": [AGENCY_EMAIL],
        "reply_to": payload.email,
        "subject": f"[SEO Planet] New transmission from {payload.name}",
        "html": _build_email_html(payload),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return True, None
    except Exception as e:
        return False, str(e)


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "SEO Planet API online"}

# --- Auth & Onboarding Routes ---
class LoginRequest(BaseModel):
    username: str
    password: str

@api_router.post("/auth/login")
async def login(req: LoginRequest):
    try:
        client_doc = await db.clients.find_one({"username": req.username})
        if not client_doc or not verify_password(req.password, client_doc["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": client_doc["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
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
    password: str

@api_router.post("/onboarding/clients")
async def create_new_client(payload: ClientCreate, current_client: dict = Depends(get_current_client)):
    if current_client.get("username") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    existing = await db.clients.find_one({"username": payload.username})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Client already exists")
        
    hashed_password = hash_password(payload.password)
    client_doc = {
        "username": payload.username,
        "company_name": payload.company_name,
        "password_hash": hashed_password,
        "status": "active",
        "timeline": [
            {"step": 1, "title": "Onboarding & Access", "status": "completed"},
            {"step": 2, "title": "Technical SEO Audit", "status": "in_progress"},
            {"step": 3, "title": "Keyword Strategy", "status": "pending"},
            {"step": 4, "title": "Content Execution", "status": "pending"},
        ],
        "documents": [
            {"title": "Welcome Guide & Roadmap", "url": "#"}
        ]
    }
    await db.clients.insert_one(client_doc)
    return {"status": "success", "message": "Client created"}


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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
