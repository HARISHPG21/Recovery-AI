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
"""

from fastapi import APIRouter, HTTPException, Header
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

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])


@router.post("/coach", response_model=CoachResponse, summary="Voice AI Recovery Coach")
async def voice_coach_endpoint(
    req: CoachRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Processes speech transcripts or user text prompts to return structured
    empathetic guidance, grounding exercises, breathing steps, and next actions.

    Args:
        req: CoachRequest payload containing user_input, conversation_history, user_context.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CoachResponse dict with structured AI outputs.
    """
    try:
        res = await gemini_service.get_coach_response(
            user_input=req.user_input,
            history=req.conversation_history,
            context=req.user_context,
            custom_api_key=x_gemini_api_key
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/emergency", response_model=EmergencyResponse, summary="SOS Emergency Script Generator")
async def emergency_endpoint(
    req: EmergencyRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Generates a personalized emergency cognitive reset script, coping checklist,
    breathing instructions, ready-to-send SMS text, and panic intervention steps.

    Args:
        req: EmergencyRequest payload with trigger_reason, user_name, trusted_contact_name.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        EmergencyResponse payload with structured crisis support items.
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
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/caregiver", response_model=CaregiverResponse, summary="Caregiver De-escalation Assistant")
async def caregiver_endpoint(
    req: CaregiverRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Provides evidence-based answers, de-escalation protocols, verbal boundaries,
    and warning sign guides for family members supporting loved ones in recovery.

    Args:
        req: CaregiverRequest containing question and optional patient_context.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CaregiverResponse payload with structured guidance.
    """
    try:
        res = await gemini_service.get_caregiver_response(
            question=req.question,
            patient_context=req.patient_context or "",
            custom_api_key=x_gemini_api_key
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/education", response_model=EducationResponse, summary="AI Education Hub Search")
async def education_endpoint(
    req: EducationRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Synthesizes comprehensive, evidence-based recovery articles on topics like
    withdrawal, relapse prevention, coping techniques, and therapy options.

    Args:
        req: EducationRequest containing target topic.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        EducationResponse structured article.
    """
    try:
        res = await gemini_service.get_education_response(
            topic=req.topic,
            custom_api_key=x_gemini_api_key
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/checkin-analysis", response_model=CheckInResponse, summary="Multi-Metric Daily Check-In Analysis")
async def checkin_analysis_endpoint(
    req: CheckInRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Evaluates holistic check-in metrics (mood, stress, sleep, energy, cravings, journal)
    to output risk level classification, positive highlights, and action steps.

    Args:
        req: CheckInRequest containing numeric metrics and optional journal entry.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        CheckInResponse payload with risk level and recommendations.
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/safety-analyze", response_model=SafetyAnalyzeResponse, summary="Real-Time Safety & Risk Analyzer")
async def safety_analyze_endpoint(
    req: SafetyAnalyzeRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Analyzes acute risk metrics and text indicators to determine immediate risk level
    and generate immediate safety interventions and hydration reminders.

    Args:
        req: SafetyAnalyzeRequest containing cravings, stress, sleep, isolation.
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        SafetyAnalyzeResponse payload with risk assessment.
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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/motivation", response_model=MotivationResponse, summary="Daily Inspirational Quote & Focus")
async def motivation_endpoint(
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-Api-Key")
):
    """
    Returns a daily inspirational recovery quote, author attribution, reflection
    prompt, and daily focus theme.

    Args:
        x_gemini_api_key: Optional custom Gemini API Key passed via header.

    Returns:
        MotivationResponse payload.
    """
    try:
        res = await gemini_service.get_daily_motivation(custom_api_key=x_gemini_api_key)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
