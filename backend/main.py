from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, analyze, chat
from dotenv import load_dotenv
import os 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

load_dotenv()

app = FastAPI(title="DocuMind API")

# Allow Next.js frontend to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "DocuMind API is running"}