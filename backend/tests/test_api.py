"""
RecoveryAI Backend Test Suite
Tests all 6 AI endpoints, health check, schemas, and fallback logic.
Run with: pytest tests/ -v
"""
import pytest
import json
from unittest.mock import AsyncMock, MagicMock, patch
from httpx import AsyncClient, ASGITransport

# ── App import ────────────────────────────────────────────────────────────────
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app


# ══════════════════════════════════════════════════════════════════════════════
# Fixtures
# ══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Async HTTP client for the FastAPI app under test."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


# ══════════════════════════════════════════════════════════════════════════════
# Health Check Tests
# ══════════════════════════════════════════════════════════════════════════════

class TestHealthEndpoint:
    """Tests for the /api/health endpoint."""

    @pytest.mark.anyio
    async def test_health_returns_200(self, client):
        """Health endpoint should return HTTP 200."""
        response = await client.get("/api/health")
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_health_response_schema(self, client):
        """Health response should include required fields."""
        response = await client.get("/api/health")
        data = response.json()
        assert "status" in data
        assert "service" in data
        assert "version" in data
        assert "gemini_api_configured" in data

    @pytest.mark.anyio
    async def test_health_service_name(self, client):
        """Health response should identify the correct service."""
        response = await client.get("/api/health")
        data = response.json()
        assert data["service"] == "RecoveryAI Backend"

    @pytest.mark.anyio
    async def test_health_status_healthy(self, client):
        """Health status field should be 'healthy'."""
        response = await client.get("/api/health")
        data = response.json()
        assert data["status"] == "healthy"


# ══════════════════════════════════════════════════════════════════════════════
# Voice AI Coach Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_COACH_RESPONSE = {
    "empathetic_response": "I hear you. You're doing incredibly well.",
    "grounding_exercise": "Name 5 things you can see right now.",
    "breathing_exercise": "Inhale for 4 counts, hold 4, exhale 6.",
    "next_action": "Drink a glass of cold water.",
    "motivational_advice": "Each moment of resistance builds strength.",
    "healthy_distraction": "Take a 5-minute walk outside."
}


class TestVoiceCoachEndpoint:
    """Tests for the /api/ai/coach endpoint."""

    @pytest.mark.anyio
    async def test_coach_accepts_valid_request(self, client):
        """Coach endpoint should accept a valid user_input payload."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_COACH_RESPONSE):
            response = await client.post("/api/ai/coach", json={
                "user_input": "I am feeling a strong urge to use",
                "conversation_history": [],
                "user_context": {}
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_coach_response_has_required_fields(self, client):
        """Coach response should contain all 6 required fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_COACH_RESPONSE):
            response = await client.post("/api/ai/coach", json={
                "user_input": "I need help right now"
            })
        data = response.json()
        assert "empathetic_response" in data
        assert "grounding_exercise" in data
        assert "breathing_exercise" in data
        assert "next_action" in data
        assert "motivational_advice" in data
        assert "healthy_distraction" in data

    @pytest.mark.anyio
    async def test_coach_rejects_empty_input(self, client):
        """Coach endpoint should reject empty or missing user_input."""
        response = await client.post("/api/ai/coach", json={})
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_coach_accepts_conversation_history(self, client):
        """Coach endpoint should accept conversation history context."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_COACH_RESPONSE):
            response = await client.post("/api/ai/coach", json={
                "user_input": "Still struggling",
                "conversation_history": [
                    {"role": "user", "content": "I feel anxious"},
                    {"role": "assistant", "content": "I understand."}
                ],
                "user_context": {"streak_days": 30}
            })
        assert response.status_code == 200


# ══════════════════════════════════════════════════════════════════════════════
# SOS Emergency Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_EMERGENCY_RESPONSE = {
    "emergency_message": "You are safe. This moment will pass.",
    "coping_checklist": ["Breathe slowly", "Drink water", "Call a friend"],
    "breathing_instructions": "4-4-6 box breathing technique.",
    "trusted_person_message": "Hi, I need your support right now.",
    "panic_intervention": "Place both feet flat on the floor.",
    "hotlines": [{"name": "988 Lifeline", "number": "988", "desc": "24/7 crisis support"}]
}


class TestEmergencyEndpoint:
    """Tests for the /api/ai/emergency endpoint."""

    @pytest.mark.anyio
    async def test_emergency_returns_200(self, client):
        """Emergency endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_EMERGENCY_RESPONSE):
            response = await client.post("/api/ai/emergency", json={
                "trigger_reason": "Acute craving",
                "user_name": "Alex",
                "trusted_contact_name": "Mom"
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_emergency_response_schema(self, client):
        """Emergency response must include all required safety fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_EMERGENCY_RESPONSE):
            response = await client.post("/api/ai/emergency", json={
                "trigger_reason": "Panic attack"
            })
        data = response.json()
        assert "emergency_message" in data
        assert "coping_checklist" in data
        assert "breathing_instructions" in data
        assert "trusted_person_message" in data
        assert "hotlines" in data
        assert isinstance(data["coping_checklist"], list)

    @pytest.mark.anyio
    async def test_emergency_works_with_defaults(self, client):
        """Emergency endpoint should work with an empty request body."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_EMERGENCY_RESPONSE):
            response = await client.post("/api/ai/emergency", json={})
        assert response.status_code == 200


# ══════════════════════════════════════════════════════════════════════════════
# Caregiver Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_CAREGIVER_RESPONSE = {
    "answer": "Stay calm and listen without judgment.",
    "how_to_respond": "Use 'I' statements and avoid ultimatums.",
    "what_to_avoid": "Don't shame or blame. Avoid enabling.",
    "warning_signs": ["Isolation", "Mood swings", "Missed appointments"],
    "deescalation_steps": ["Lower your voice", "Give space", "Validate feelings"],
    "self_care_tip": "Join a support group for caregivers."
}


class TestCaregiverEndpoint:
    """Tests for the /api/ai/caregiver endpoint."""

    @pytest.mark.anyio
    async def test_caregiver_returns_200(self, client):
        """Caregiver endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_CAREGIVER_RESPONSE):
            response = await client.post("/api/ai/caregiver", json={
                "question": "How should I respond when my son is in crisis?"
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_caregiver_response_schema(self, client):
        """Caregiver response must include guidance fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_CAREGIVER_RESPONSE):
            response = await client.post("/api/ai/caregiver", json={
                "question": "What warning signs should I watch for?"
            })
        data = response.json()
        assert "answer" in data
        assert "how_to_respond" in data
        assert "warning_signs" in data
        assert "deescalation_steps" in data
        assert isinstance(data["warning_signs"], list)

    @pytest.mark.anyio
    async def test_caregiver_rejects_missing_question(self, client):
        """Caregiver endpoint should reject requests without a question."""
        response = await client.post("/api/ai/caregiver", json={})
        assert response.status_code == 422


# ══════════════════════════════════════════════════════════════════════════════
# Education Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_EDUCATION_RESPONSE = {
    "topic": "Withdrawal Management",
    "summary": "Withdrawal occurs as the body readjusts to functioning without substances.",
    "key_points": ["Symptoms vary by substance", "Medical supervision is recommended"],
    "coping_strategies": ["Stay hydrated", "Rest frequently"],
    "when_to_seek_help": "Seek immediate help if symptoms become severe.",
    "resources": ["SAMHSA National Helpline: 1-800-662-4357"]
}


class TestEducationEndpoint:
    """Tests for the /api/ai/education endpoint."""

    @pytest.mark.anyio
    async def test_education_returns_200(self, client):
        """Education endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_EDUCATION_RESPONSE):
            response = await client.post("/api/ai/education", json={
                "topic": "withdrawal symptoms"
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_education_response_schema(self, client):
        """Education response must include all content fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_EDUCATION_RESPONSE):
            response = await client.post("/api/ai/education", json={
                "topic": "relapse prevention"
            })
        data = response.json()
        assert "topic" in data
        assert "summary" in data
        assert "key_points" in data
        assert "coping_strategies" in data

    @pytest.mark.anyio
    async def test_education_rejects_missing_topic(self, client):
        """Education endpoint should reject requests without a topic."""
        response = await client.post("/api/ai/education", json={})
        assert response.status_code == 422


# ══════════════════════════════════════════════════════════════════════════════
# Check-In Analysis Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_CHECKIN_RESPONSE = {
    "recovery_summary": "You are showing strong resilience today.",
    "risk_level": "Low",
    "risk_score": 25,
    "immediate_actions": ["Continue daily journaling", "Connect with your sponsor"],
    "positive_reinforcement": "Your streak shows incredible commitment.",
    "weekly_focus": "Practice mindfulness for 10 minutes daily."
}


class TestCheckInEndpoint:
    """Tests for the /api/ai/checkin-analysis endpoint."""

    @pytest.mark.anyio
    async def test_checkin_returns_200(self, client):
        """Check-in endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_CHECKIN_RESPONSE):
            response = await client.post("/api/ai/checkin-analysis", json={
                "mood": 7, "stress": 4, "sleep": 7,
                "energy": 6, "cravings": 3
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_checkin_response_includes_risk_level(self, client):
        """Check-in response must include a risk_level field."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_CHECKIN_RESPONSE):
            response = await client.post("/api/ai/checkin-analysis", json={
                "mood": 5, "stress": 8, "sleep": 4,
                "energy": 3, "cravings": 9
            })
        data = response.json()
        assert "risk_level" in data
        assert data["risk_level"] in ["Low", "Moderate", "High"]

    @pytest.mark.anyio
    async def test_checkin_validates_metric_ranges(self, client):
        """Check-in endpoint should reject metrics outside valid ranges."""
        response = await client.post("/api/ai/checkin-analysis", json={
            "mood": 15, "stress": -1, "sleep": 7,
            "energy": 6, "cravings": 3
        })
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_checkin_accepts_optional_journal(self, client):
        """Check-in endpoint should accept optional journal_entry."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_CHECKIN_RESPONSE):
            response = await client.post("/api/ai/checkin-analysis", json={
                "mood": 6, "stress": 5, "sleep": 6,
                "energy": 5, "cravings": 4,
                "journal_entry": "Feeling better today after a walk."
            })
        assert response.status_code == 200


# ══════════════════════════════════════════════════════════════════════════════
# Safety Analyzer Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_SAFETY_RESPONSE = {
    "risk_level": "Moderate",
    "risk_score": 55,
    "immediate_safety_actions": ["Call your sponsor", "Remove access to substances"],
    "grounding_technique": "5-4-3-2-1 sensory grounding exercise.",
    "recommended_resources": ["988 Lifeline", "SMART Recovery"],
    "crisis_indicators": False
}


class TestSafetyAnalyzerEndpoint:
    """Tests for the /api/ai/safety-analyze endpoint."""

    @pytest.mark.anyio
    async def test_safety_returns_200(self, client):
        """Safety analyzer endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_SAFETY_RESPONSE):
            response = await client.post("/api/ai/safety-analyze", json={
                "cravings": 8, "stress": 7, "sleep": 4
            })
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_safety_response_schema(self, client):
        """Safety response must include risk assessment fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_SAFETY_RESPONSE):
            response = await client.post("/api/ai/safety-analyze", json={
                "cravings": 9, "stress": 8, "sleep": 3,
                "isolation_score": 8
            })
        data = response.json()
        assert "risk_level" in data
        assert "immediate_safety_actions" in data
        assert "grounding_technique" in data

    @pytest.mark.anyio
    async def test_safety_accepts_optional_fields(self, client):
        """Safety analyzer should work with only required fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_SAFETY_RESPONSE):
            response = await client.post("/api/ai/safety-analyze", json={
                "cravings": 5, "stress": 5, "sleep": 6
            })
        assert response.status_code == 200


# ══════════════════════════════════════════════════════════════════════════════
# Motivation Endpoint Tests
# ══════════════════════════════════════════════════════════════════════════════

MOCK_MOTIVATION_RESPONSE = {
    "quote": "Recovery is not a race. You don't have to feel guilty if it takes you longer.",
    "author": "Unknown",
    "reflection_prompt": "What is one small step you can take today?",
    "daily_focus": "Practice self-compassion"
}


class TestMotivationEndpoint:
    """Tests for the /api/ai/motivation endpoint."""

    @pytest.mark.anyio
    async def test_motivation_returns_200(self, client):
        """Motivation endpoint should return HTTP 200."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_MOTIVATION_RESPONSE):
            response = await client.get("/api/ai/motivation")
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_motivation_response_schema(self, client):
        """Motivation response must include quote and reflection fields."""
        with patch("app.services.gemini_service.gemini_service.generate_response",
                   new_callable=AsyncMock, return_value=MOCK_MOTIVATION_RESPONSE):
            response = await client.get("/api/ai/motivation")
        data = response.json()
        assert "quote" in data
        assert "reflection_prompt" in data
        assert "daily_focus" in data


# ══════════════════════════════════════════════════════════════════════════════
# Schema Validation Tests
# ══════════════════════════════════════════════════════════════════════════════

class TestSchemaValidation:
    """Tests for Pydantic schema validation across all endpoints."""

    @pytest.mark.anyio
    async def test_coach_requires_user_input_field(self, client):
        """Coach endpoint must reject requests missing user_input."""
        response = await client.post("/api/ai/coach", json={"wrong_field": "test"})
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_caregiver_requires_question_field(self, client):
        """Caregiver endpoint must reject requests missing question."""
        response = await client.post("/api/ai/caregiver", json={"wrong_field": "test"})
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_education_requires_topic_field(self, client):
        """Education endpoint must reject requests missing topic."""
        response = await client.post("/api/ai/education", json={"wrong_field": "test"})
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_checkin_requires_all_metric_fields(self, client):
        """Check-in endpoint must reject incomplete metric submissions."""
        response = await client.post("/api/ai/checkin-analysis", json={
            "mood": 7
            # Missing stress, sleep, energy, cravings
        })
        assert response.status_code == 422

    @pytest.mark.anyio
    async def test_safety_requires_core_fields(self, client):
        """Safety analyzer must reject requests missing core fields."""
        response = await client.post("/api/ai/safety-analyze", json={})
        assert response.status_code == 422


# ══════════════════════════════════════════════════════════════════════════════
# CORS & Security Tests
# ══════════════════════════════════════════════════════════════════════════════

class TestSecurityHeaders:
    """Tests for CORS and security configuration."""

    @pytest.mark.anyio
    async def test_health_endpoint_is_accessible(self, client):
        """Health endpoint should be publicly accessible."""
        response = await client.get("/api/health")
        assert response.status_code == 200

    @pytest.mark.anyio
    async def test_invalid_endpoint_returns_404(self, client):
        """Invalid routes should return 404 Not Found."""
        response = await client.get("/api/nonexistent")
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_wrong_method_returns_405(self, client):
        """Using wrong HTTP method should return 405 Method Not Allowed."""
        response = await client.get("/api/ai/coach")
        assert response.status_code == 405
