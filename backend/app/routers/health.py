from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["System Health"])

@router.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "gemini_api_configured": bool(settings.GEMINI_API_KEY)
    }
