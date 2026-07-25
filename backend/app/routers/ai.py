from fastapi import APIRouter, HTTPException, Depends
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

@router.post("/coach", response_model=CoachResponse)
async def voice_coach_endpoint(req: CoachRequest):
    try:
        res = await gemini_service.get_coach_response(
            user_input=req.user_input,
            history=req.conversation_history,
            context=req.user_context
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emergency", response_model=EmergencyResponse)
async def emergency_endpoint(req: EmergencyRequest):
    try:
        res = await gemini_service.get_emergency_response(
            trigger_reason=req.trigger_reason or "Acute craving",
            user_name=req.user_name or "Friend",
            trusted_contact=req.trusted_contact_name or "Trusted Support"
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/caregiver", response_model=CaregiverResponse)
async def caregiver_endpoint(req: CaregiverRequest):
    try:
        res = await gemini_service.get_caregiver_response(
            question=req.question,
            patient_context=req.patient_context or ""
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/education", response_model=EducationResponse)
async def education_endpoint(req: EducationRequest):
    try:
        res = await gemini_service.get_education_response(topic=req.topic)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/checkin-analysis", response_model=CheckInResponse)
async def checkin_analysis_endpoint(req: CheckInRequest):
    try:
        res = await gemini_service.get_checkin_analysis(
            mood=req.mood,
            stress=req.stress,
            sleep=req.sleep,
            energy=req.energy,
            cravings=req.cravings,
            journal_entry=req.journal_entry or ""
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/safety-analyze", response_model=SafetyAnalyzeResponse)
async def safety_analyze_endpoint(req: SafetyAnalyzeRequest):
    try:
        res = await gemini_service.get_safety_analysis(
            cravings=req.cravings,
            stress=req.stress,
            sleep=req.sleep,
            isolation_score=req.isolation_score or 5,
            recent_text=req.recent_text or ""
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/motivation", response_model=MotivationResponse)
async def motivation_endpoint():
    try:
        res = await gemini_service.get_daily_motivation()
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
