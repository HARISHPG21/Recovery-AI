"""
Health Check Router

Provides system status, app version, and Gemini API readiness diagnostics.
"""

from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["System Health"])

@router.get("/api/health", summary="Health Check Endpoint")
async def health_check():
    """
    Returns system readiness status, service name, version, and Gemini API configuration state.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }
