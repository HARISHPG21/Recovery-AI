"""
RecoveryAI Backend Main Application Module

Production-grade FastAPI application providing secure CORS policies,
security header middleware, openapi tags metadata, and route inclusion.
"""

import logging
import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import ai, health

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

tags_metadata = [
    {
        "name": "Health Status",
        "description": "System readiness, version, and Gemini API configuration health checks.",
    },
    {
        "name": "AI Engine",
        "description": "Google Gemini 2.5 powered recovery interventions, voice coaching, SOS scripts, and caregiver guides.",
    },
]

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade AI Powered Recovery & Prevention Platform API",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── Security Headers Middleware ────────────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    start_time = time.time()
    response: Response = await call_next(request)
    process_time = time.time() - start_time
    
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# CORS setup
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
if "*" in allowed_origins or not allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Gemini-Api-Key"],
)

app.include_router(health.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to RecoveryAI Backend API",
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "health": "/api/health",
        "security": "enabled"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
