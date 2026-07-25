"""
AI Engine API Routers

Exposes high-performance, asynchronous endpoints for the RecoveryAI platform:
- /coach: Voice AI Recovery Coach
- /emergency: SOS Emergency Script Generator
- /caregiver: Caregiver De-escalation & Guidance Assistant
- /education: Evidence-Based AI Education Hub
- /checkin-analysis: Multi-Metric Daily Recovery Analysis
- /safety-analyze: Real-Time Safety & Risk Analyzer
- /motivation: Daily Inspirational Quotes & Reflection Prompts

All endpoints validate input via Pydantic schemas, apply input sanitization,
and return structured JSON responses with proper HTTP status codes.
"""

from fastapi import APIRouter, HTTPException, Header, status
from typing import Optional
from app.schemas import (
    CoachRequest, CoachResponse,
    EmergencyRequest, EmergencyResponse,
    CaregiverRequest, CaregiverResponse,
    EducationRequest, EducationResponse,
    CheckInRequest, CheckInResponse,
    SafetyAnalyzeRequest, SafetyAnalyzeResponse,
    MotivationResponse
)
from app.services.gemini_service import gemini_service
import logging

logger = logging.getLogger("ai_router")

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])


@router.post(
    "/coach",
    response_model=CoachResponse,
    status_code=status.HTTP_200_OK,
    summary="Voice AI Recovery Coach",
    description="Processes speech transcripts or text prompts to return structured empathetic recovery guidance."
)
async def voice_coach_endpoint(
    req: CoachRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Processes speech transcripts or user text prompts for structured empathetic guidance.

    Generates grounding exercises, breathing steps, motivational advice,
    and healthy distraction suggestions from user voice input.

    Args:
        req: CoachRequest payload containing user_input, conversation_history, user_context.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CoachResponse dict with structured AI coaching outputs.

    Raises:
        HTTPException: 422 on validation error (handled by FastAPI), 500 on AI failure.
    """
    try:
        res = await gemini_service.get_coach_response(
            user_input=req.user_input,
            history=req.conversation_history,
            context=req.user_context,
            custom_api_key=x_gemini_api_key
        )
        return res
    except ValueError as e:
        logger.warning(f"Coach validation error: {e}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"Coach endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post(
    "/emergency",
    response_model=EmergencyResponse,
    status_code=status.HTTP_200_OK,
    summary="SOS Emergency Script Generator",
    description="Generates a personalized crisis intervention package with calming scripts, coping checklists, and hotlines."
)
async def emergency_endpoint(
    req: EmergencyRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Generates a personalized emergency cognitive reset script and crisis support package.

    Produces a calming emergency message, coping checklist, breathing instructions,
    ready-to-send SMS text for trusted contacts, panic intervention steps, and hotlines.

    Args:
        req: EmergencyRequest payload with trigger_reason, user_name, trusted_contact_name.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        EmergencyResponse payload with structured crisis support items.

    Raises:
        HTTPException: 500 on AI service failure.
    """
    try:
        res = await gemini_service.get_emergency_response(
            trigger_reason=req.trigger_reason or "Acute craving",
            user_name=req.user_name or "Friend",
            trusted_contact=req.trusted_contact_name or "Trusted Support",
            custom_api_key=x_gemini_api_key
        )
        return res
    except Exception as e:
        logger.error(f"Emergency endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post(
    "/caregiver",
    response_model=CaregiverResponse,
    status_code=status.HTTP_200_OK,
    summary="Caregiver De-escalation Assistant",
    description="Provides evidence-based de-escalation protocols and verbal boundary guides for family caregivers."
)
async def caregiver_endpoint(
    req: CaregiverRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Provides evidence-based caregiver guidance, de-escalation scripts, and self-care tips.

    Answers caregiver questions with compassionate, clinically-grounded protocols
    including warning sign detection and verbal boundary guidance.

    Args:
        req: CaregiverRequest containing question and optional patient_context.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CaregiverResponse payload with structured caregiver guidance.

    Raises:
        HTTPException: 422 on validation error, 500 on AI failure.
    """
    try:
        res = await gemini_service.get_caregiver_response(
            question=req.question,
            patient_context=req.patient_context or "",
            custom_api_key=x_gemini_api_key
        )
        return res
    except ValueError as e:
        logger.warning(f"Caregiver validation error: {e}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"Caregiver endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post(
    "/education",
    response_model=EducationResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Education Hub Search",
    description="Synthesizes comprehensive, evidence-based recovery articles on demand."
)
async def education_endpoint(
    req: EducationRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Synthesizes comprehensive, evidence-based recovery articles on recovery topics.

    Generates structured educational content on withdrawal, relapse prevention,
    coping techniques, and therapy options.

    Args:
        req: EducationRequest containing target topic.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        EducationResponse structured article with overview, takeaways, and strategies.

    Raises:
        HTTPException: 422 on validation error, 500 on AI failure.
    """
    try:
        res = await gemini_service.get_education_response(
            topic=req.topic,
            custom_api_key=x_gemini_api_key
        )
        return res
    except ValueError as e:
        logger.warning(f"Education validation error: {e}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"Education endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post(
    "/checkin-analysis",
    response_model=CheckInResponse,
    status_code=status.HTTP_200_OK,
    summary="Multi-Metric Daily Check-In Analysis",
    description="Evaluates mood, stress, sleep, energy, and craving metrics to produce AI-powered risk analysis."
)
async def checkin_analysis_endpoint(
    req: CheckInRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Evaluates holistic check-in metrics to output recovery risk classification.

    Analyzes mood, stress, sleep, energy, cravings, and optional journal text
    to produce risk tier, positive highlights, and personalized action steps.

    Args:
        req: CheckInRequest containing numeric metrics and optional journal entry.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CheckInResponse payload with risk level, summary, and recommendations.

    Raises:
        HTTPException: 422 on validation error, 500 on AI failure.
    """
    try:
        res = await gemini_service.get_checkin_analysis(
            mood=req.mood,
            stress=req.stress,
            sleep=req.sleep,
            energy=req.energy,
            cravings=req.cravings,
            journal_entry=req.journal_entry or "",
            custom_api_key=x_gemini_api_key
        )
        return res
    except ValueError as e:
        logger.warning(f"CheckIn validation error: {e}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"CheckIn endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post(
    "/safety-analyze",
    response_model=SafetyAnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Real-Time Safety & Risk Analyzer",
    description="Analyzes acute risk metrics in real-time to determine safety level and generate immediate interventions."
)
async def safety_analyze_endpoint(
    req: SafetyAnalyzeRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Analyzes acute risk metrics and text indicators to determine immediate safety risk.

    Evaluates craving intensity, stress, sleep quality, and isolation score
    to generate a safety tier, trigger list, immediate actions, and grounding exercises.

    Args:
        req: SafetyAnalyzeRequest containing cravings, stress, sleep, isolation_score.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        SafetyAnalyzeResponse payload with risk assessment and interventions.

    Raises:
        HTTPException: 500 on AI service failure.
    """
    try:
        res = await gemini_service.get_safety_analysis(
            cravings=req.cravings,
            stress=req.stress,
            sleep=req.sleep,
            isolation_score=req.isolation_score or 5,
            recent_text=req.recent_text or "",
            custom_api_key=x_gemini_api_key
        )
        return res
    except Exception as e:
        logger.error(f"Safety analyze endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get(
    "/motivation",
    response_model=MotivationResponse,
    status_code=status.HTTP_200_OK,
    summary="Daily Inspirational Quote & Focus",
    description="Returns a daily AI-generated recovery quote, reflection prompt, and focus theme."
)
async def motivation_endpoint(
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """Returns a daily AI-generated recovery quote, reflection prompt, and focus area.

    Synthesizes an inspirational recovery quote with author attribution,
    a reflection prompt, and a daily focus theme for motivation.

    Args:
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        MotivationResponse payload with quote, author, reflection_prompt, daily_focus.

    Raises:
        HTTPException: 500 on AI service failure.
    """
    try:
        res = await gemini_service.get_daily_motivation(custom_api_key=x_gemini_api_key)
        return res
    except Exception as e:
        logger.error(f"Motivation endpoint error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
