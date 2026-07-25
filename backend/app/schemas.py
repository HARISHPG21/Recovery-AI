from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
import re

def sanitize_input_text(v: str) -> str:
    """Sanitizes user input string by stripping unprintable control characters and trimming length."""
    if not v:
        return ""
    # Strip null bytes and control chars
    v = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', v)
    # Trim excessive length to prevent overflow
    return v.strip()[:2000]

# Coach schemas
class CoachRequest(BaseModel):
    user_input: str = Field(..., min_length=1, description="Speech transcript or user text prompt")
    conversation_history: Optional[List[Dict[str, str]]] = Field(default=[], description="Previous conversation turns")
    user_context: Optional[Dict[str, Any]] = Field(default=None, description="Optional user metrics or state")

    @field_validator('user_input')
    @classmethod
    def sanitize_user_input(cls, v: str) -> str:
        return sanitize_input_text(v)

class CoachResponse(BaseModel):
    empathetic_response: str
    grounding_exercise: str
    breathing_exercise: str
    next_action: str
    motivational_advice: str
    healthy_distraction: str

# Emergency schemas
class EmergencyRequest(BaseModel):
    trigger_reason: Optional[str] = Field(default="Acute craving / panic episode", description="Reason for triggering emergency mode")
    user_name: Optional[str] = Field(default="Friend", description="User's preferred name or anonymous tag")
    trusted_contact_name: Optional[str] = Field(default="Trusted Support", description="Name of contact")

class EmergencyResponse(BaseModel):
    emergency_message: str
    coping_checklist: List[str]
    breathing_instructions: str
    trusted_person_message: str
    panic_intervention: str
    hotlines: List[Dict[str, str]]

# Caregiver schemas
class CaregiverRequest(BaseModel):
    question: str = Field(..., description="Caregiver's question or scenario description")
    patient_context: Optional[str] = Field(default=None, description="Context about the individual in recovery")

class CaregiverResponse(BaseModel):
    answer: str
    how_to_respond: str
    what_to_avoid: str
    warning_signs: List[str]
    deescalation_steps: List[str]
    self_care_tip: str

# Education schemas
class EducationRequest(BaseModel):
    topic: str = Field(..., description="Recovery topic or query, e.g. withdrawal symptoms")

class EducationResponse(BaseModel):
    topic: str
    overview: str
    key_takeaways: List[str]
    actionable_strategies: List[str]
    when_to_seek_help: str
    related_topics: List[str]

# Check-in schemas
class CheckInRequest(BaseModel):
    mood: int = Field(..., ge=1, le=10, description="1-10 mood rating")
    stress: int = Field(..., ge=1, le=10, description="1-10 stress rating")
    sleep: int = Field(..., ge=1, le=10, description="1-10 sleep rating")
    energy: int = Field(..., ge=1, le=10, description="1-10 energy rating")
    cravings: int = Field(..., ge=0, le=10, description="0-10 craving rating")
    journal_entry: Optional[str] = Field(default="", description="Optional thoughts or reflection")

class CheckInResponse(BaseModel):
    recovery_summary: str
    risk_level: str  # "Low", "Moderate", "High"
    positive_highlights: List[str]
    personalized_recommendations: List[str]
    suggested_focus: str

# Safety Analyzer schemas
class SafetyAnalyzeRequest(BaseModel):
    cravings: int
    stress: int
    sleep: int
    isolation_score: Optional[int] = 5
    recent_text: Optional[str] = ""

class SafetyAnalyzeResponse(BaseModel):
    risk_level: str
    triggers_detected: List[str]
    immediate_actions: List[str]
    grounding_prompt: str
    hydration_reminder: str
    contact_recommendation: str

# Daily Motivation schema
class MotivationResponse(BaseModel):
    quote: str
    author: str
    reflection_prompt: str
    daily_focus: str
