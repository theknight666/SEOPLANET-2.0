import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv('.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def main():
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        print("MONGO_URL not found in .env")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'seoplanet')]

    print("=== Create New SEO Planet Client ===")
    username = input("Enter client username (e.g., acme_corp): ")
    company_name = input("Enter client company name (e.g., Acme Corp): ")
    password = input("Enter client password: ")

    hashed_password = pwd_context.hash(password)

    client_doc = {
        "username": username,
        "company_name": company_name,
        "password_hash": hashed_password,
        "status": "active",
        "timeline": [
            {"step": 1, "title": "Onboarding & Access", "status": "completed"},
            {"step": 2, "title": "Technical SEO Audit", "status": "in_progress"},
            {"step": 3, "title": "Keyword Strategy", "status": "pending"},
            {"step": 4, "title": "Content Execution", "status": "pending"},
        ],
        "documents": [
            {"title": "Welcome Guide & Roadmap", "url": "#"},
            {"title": "Initial Audit Report", "url": "#"},
        ]
    }

    # Check if exists
    existing = await db.clients.find_one({"username": username})
    if existing:
        print(f"Client {username} already exists! Updating instead...")
        await db.clients.update_one({"username": username}, {"$set": client_doc})
    else:
        await db.clients.insert_one(client_doc)
        print(f"Client {username} successfully created!")

if __name__ == "__main__":
    asyncio.run(main())
