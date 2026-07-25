"""
Pydantic Request & Response Schema Definitions

Defines all data models for RecoveryAI API endpoints with:
- Strict field validation using Pydantic v2 Field constraints
- Input sanitization via field_validator to strip control characters
- Full type annotations for all fields
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
import re


def sanitize_input_text(v: str) -> str:
    """Sanitizes user input string by stripping unprintable control characters and trimming length.

    Removes null bytes and ASCII control characters (except newline/tab),
    then trims the result to a maximum of 2000 characters to prevent overflow.

    Args:
        v: Raw input string to sanitize.

    Returns:
        Sanitized string, max 2000 characters, stripped of control characters.
    """
    if not v:
        return ""
    # Strip null bytes and control chars (preserve newline \x0a and tab \x09)
    v = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', v)
    # Trim excessive length to prevent overflow
    return v.strip()[:2000]


# ── Coach Schemas ──────────────────────────────────────────────────────────────

class CoachRequest(BaseModel):
    """Request schema for the Voice AI Recovery Coach endpoint."""

    user_input: str = Field(
        ...,
        min_length=1,
        description="Speech transcript or user text prompt"
    )
    conversation_history: Optional[List[Dict[str, str]]] = Field(
        default=[],
        description="Previous conversation turns as list of role/content dicts"
    )
    user_context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional user metrics or state (mood, craving level, etc)"
    )

    @field_validator('user_input')
    @classmethod
    def sanitize_user_input(cls, v: str) -> str:
        """Sanitizes user_input to remove control characters."""
        return sanitize_input_text(v)


class CoachResponse(BaseModel):
    """Response schema for the Voice AI Recovery Coach endpoint."""

    empathetic_response: str
    grounding_exercise: str
    breathing_exercise: str
    next_action: str
    motivational_advice: str
    healthy_distraction: str


# ── Emergency Schemas ──────────────────────────────────────────────────────────

class EmergencyRequest(BaseModel):
    """Request schema for the SOS Emergency Script Generator endpoint."""

    trigger_reason: Optional[str] = Field(
        default="Acute craving / panic episode",
        description="Reason for triggering emergency mode"
    )
    user_name: Optional[str] = Field(
        default="Friend",
        description="User's preferred name or anonymous tag"
    )
    trusted_contact_name: Optional[str] = Field(
        default="Trusted Support",
        description="Name of trusted contact person for SMS script"
    )


class EmergencyResponse(BaseModel):
    """Response schema for the SOS Emergency Script Generator endpoint."""

    emergency_message: str
    coping_checklist: List[str]
    breathing_instructions: str
    trusted_person_message: str
    panic_intervention: str
    hotlines: List[Dict[str, str]]


# ── Caregiver Schemas ──────────────────────────────────────────────────────────

class CaregiverRequest(BaseModel):
    """Request schema for the Caregiver De-escalation Assistant endpoint."""

    question: str = Field(
        ...,
        min_length=1,
        description="Caregiver's question or scenario description"
    )
    patient_context: Optional[str] = Field(
        default=None,
        description="Context about the individual in recovery"
    )

    @field_validator('question')
    @classmethod
    def sanitize_question(cls, v: str) -> str:
        """Sanitizes question to remove control characters."""
        return sanitize_input_text(v)


class CaregiverResponse(BaseModel):
    """Response schema for the Caregiver De-escalation Assistant endpoint."""

    answer: str
    how_to_respond: str
    what_to_avoid: str
    warning_signs: List[str]
    deescalation_steps: List[str]
    self_care_tip: str


# ── Education Schemas ──────────────────────────────────────────────────────────

class EducationRequest(BaseModel):
    """Request schema for the AI Education Hub endpoint."""

    topic: str = Field(
        ...,
        min_length=1,
        description="Recovery topic or query (e.g. 'withdrawal symptoms', 'relapse prevention')"
    )

    @field_validator('topic')
    @classmethod
    def sanitize_topic(cls, v: str) -> str:
        """Sanitizes topic to remove control characters."""
        return sanitize_input_text(v)


class EducationResponse(BaseModel):
    """Response schema for the AI Education Hub endpoint."""

    topic: str
    overview: str
    key_takeaways: List[str]
    actionable_strategies: List[str]
    when_to_seek_help: str
    related_topics: List[str]


# ── Check-In Schemas ───────────────────────────────────────────────────────────

class CheckInRequest(BaseModel):
    """Request schema for the Multi-Metric Daily Check-In Analysis endpoint."""

    mood: int = Field(..., ge=1, le=10, description="1-10 mood rating (higher is better)")
    stress: int = Field(..., ge=1, le=10, description="1-10 stress rating (higher is worse)")
    sleep: int = Field(..., ge=1, le=10, description="1-10 sleep quality rating (higher is better)")
    energy: int = Field(..., ge=1, le=10, description="1-10 energy level rating (higher is better)")
    cravings: int = Field(..., ge=0, le=10, description="0-10 craving intensity rating")
    journal_entry: Optional[str] = Field(
        default="",
        description="Optional free-text journal reflection"
    )


class CheckInResponse(BaseModel):
    """Response schema for the Multi-Metric Daily Check-In Analysis endpoint."""

    recovery_summary: str
    risk_level: str  # "Low", "Moderate", or "High"
    positive_highlights: List[str]
    personalized_recommendations: List[str]
    suggested_focus: str


# ── Safety Analyzer Schemas ────────────────────────────────────────────────────

class SafetyAnalyzeRequest(BaseModel):
    """Request schema for the Real-Time Safety & Risk Analyzer endpoint."""

    cravings: int = Field(..., ge=0, le=10, description="0-10 craving intensity rating")
    stress: int = Field(..., ge=1, le=10, description="1-10 stress level rating")
    sleep: int = Field(..., ge=1, le=10, description="1-10 sleep quality rating")
    isolation_score: Optional[int] = Field(
        default=5,
        ge=1, le=10,
        description="1-10 social isolation score (higher is more isolated)"
    )
    recent_text: Optional[str] = Field(
        default="",
        description="Optional recent journal note or user text"
    )


class SafetyAnalyzeResponse(BaseModel):
    """Response schema for the Real-Time Safety & Risk Analyzer endpoint."""

    risk_level: str  # "Low", "Moderate", or "High"
    triggers_detected: List[str]
    immediate_actions: List[str]
    grounding_prompt: str
    hydration_reminder: str
    contact_recommendation: str


# ── Daily Motivation Schema ────────────────────────────────────────────────────

class MotivationResponse(BaseModel):
    """Response schema for the Daily Inspirational Quote & Focus endpoint."""

    quote: str
    author: str
    reflection_prompt: str
    daily_focus: str
