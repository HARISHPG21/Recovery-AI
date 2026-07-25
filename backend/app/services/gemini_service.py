import json
import logging
import re
import hashlib
import time
from functools import lru_cache
from typing import Dict, Any, Optional
from app.config import settings
from app.prompts import (
    SYSTEM_BASE_PROMPT,
    COACH_PROMPT_TEMPLATE,
    EMERGENCY_PROMPT_TEMPLATE,
    CAREGIVER_PROMPT_TEMPLATE,
    EDUCATION_PROMPT_TEMPLATE,
    CHECKIN_ANALYSIS_PROMPT_TEMPLATE,
    SAFETY_ANALYSIS_PROMPT_TEMPLATE
)

logger = logging.getLogger("gemini_service")

# ── In-memory response cache (TTL: 5 minutes) ─────────────────────────────────
_response_cache: Dict[str, Dict[str, Any]] = {}
_CACHE_TTL_SECONDS = 300  # 5 minutes


def _cache_key(prompt: str) -> str:
    """Generates a stable MD5 cache key from the prompt string."""
    return hashlib.md5(prompt.encode("utf-8")).hexdigest()


def _get_cached(key: str) -> Optional[Dict[str, Any]]:
    """Returns cached response if still valid within TTL, else None."""
    entry = _response_cache.get(key)
    if entry and (time.time() - entry["ts"]) < _CACHE_TTL_SECONDS:
        logger.info(f"Cache HIT for key {key[:8]}...")
        return entry["data"]
    return None


def _set_cached(key: str, data: Dict[str, Any]) -> None:
    """Stores a response in the in-memory cache with a timestamp."""
    _response_cache[key] = {"data": data, "ts": time.time()}
    # Evict old entries if cache grows too large (max 100 entries)
    if len(_response_cache) > 100:
        oldest = min(_response_cache, key=lambda k: _response_cache[k]["ts"])
        del _response_cache[oldest]


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                # Try google-genai SDK first
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Successfully initialized google-genai Client.")
            except ImportError:
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=self.api_key)
                    self.client = genai.GenerativeModel(settings.GEMINI_MODEL)
                    logger.info("Successfully initialized google.generativeai GenerativeModel.")
                except Exception as e:
                    logger.warning(f"Failed to initialize Gemini SDK: {e}")

    def _clean_json_response(self, text: str) -> str:
        """Extracts JSON content from markdown codeblocks if needed."""
        text = text.strip()
        if "```json" in text:
            match = re.search(r"```json\s*(.*?)\s*```", text, re.DOTALL)
            if match:
                return match.group(1).strip()
        elif "```" in text:
            match = re.search(r"```\s*(.*?)\s*```", text, re.DOTALL)
            if match:
                return match.group(1).strip()
        return text

    async def generate_response(self, prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calls Gemini API with the given prompt, returning parsed JSON or intelligent fallback.

        Uses an in-memory LRU-style cache with a 5-minute TTL to avoid redundant
        API calls for identical prompts, significantly improving response efficiency.

        Args:
            prompt: The full prompt string to send to Gemini.
            fallback_data: Structured fallback data returned if API is unavailable.

        Returns:
            Parsed JSON dict from Gemini, cached result, or fallback data.
        """
        if not self.client or not self.api_key:
            logger.info("Using intelligent dynamic fallback engine (No API Key set).")
            return fallback_data

        # ── Cache lookup ────────────────────────────────────────────────────
        key = _cache_key(prompt)
        cached = _get_cached(key)
        if cached is not None:
            return cached

        try:
            raw_text = ""
            # Check SDK flavor
            if hasattr(self.client, 'models'):
                # google.genai Client
                response = self.client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt
                )
                raw_text = response.text
            elif hasattr(self.client, 'generate_content'):
                # google.generativeai Model
                response = self.client.generate_content(prompt)
                raw_text = response.text

            cleaned = self._clean_json_response(raw_text)
            parsed = json.loads(cleaned)
            # ── Cache the successful result ─────────────────────────────────
            _set_cached(key, parsed)
            return parsed
        except Exception as e:
            logger.error(f"Gemini API call error: {e}. Falling back to dynamic generator.")
            return fallback_data

    async def get_coach_response(
        self,
        user_input: str,
        history: Optional[list] = None,
        context: Optional[dict] = None,
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates empathetic Voice Coach intervention from user transcript.

        Args:
            user_input: Speech transcript string.
            history: Previous turn history list.
            context: User state metrics dict.
            custom_api_key: Optional client-provided Gemini API Key.

        Returns:
            Dict matching CoachResponse schema.
        """
        prompt = COACH_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            user_input=user_input,
            conversation_history=json.dumps(history or []),
            user_context=json.dumps(context or {})
        )

        fallback = {
            "empathetic_response": f"I hear how much effort you are putting in right now regarding '{user_input}'. Please take a moment to pause—you are in a safe space and taking things one moment at a time is powerful.",
            "grounding_exercise": "Notice 5 things you can see around you right now, 4 physical textures you can touch, 3 sounds in your room, 2 pleasant scents, and 1 slow breath.",
            "breathing_exercise": "Inhale deeply for 4 seconds through your nose, hold calmly for 4 seconds, and exhale slowly through your mouth for 6 seconds.",
            "next_action": "Sip a glass of cold water slowly and un-clench your shoulders.",
            "motivational_advice": "Craving waves peak and naturally pass within 15 to 20 minutes. You have survived 100% of your hardest days so far.",
            "healthy_distraction": "Put on your favorite calming audio playlist or step outside for a 3-minute brisk walk."
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

    async def get_emergency_response(
        self,
        trigger_reason: str,
        user_name: str = "Friend",
        trusted_contact: str = "Trusted Support",
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        prompt = EMERGENCY_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            trigger_reason=trigger_reason,
            user_name=user_name,
            trusted_contact_name=trusted_contact
        )

        fallback = {
            "emergency_message": f"Stay right here, {user_name}. You are not alone and this intense moment is temporary. Your nervous system is safe, and this craving surge will pass.",
            "coping_checklist": [
                "1. Plant both feet flat on the floor and feel the ground beneath you.",
                "2. Place one hand on your chest and one hand on your abdomen.",
                "3. Take 3 slow, deep abdominal breaths (Inhale 4s, Hold 4s, Exhale 6s).",
                "4. Splash cold water on your face or hold an ice cube in your palm.",
                "5. Reach out to your support line or trusted person."
            ],
            "breathing_instructions": "Focus all attention on your breath. Count out loud: Inhale 1..2..3..4, Hold 1..2..3..4, Exhale 1..2..3..4..5..6.",
            "trusted_person_message": f"Hi {trusted_contact}, I am experiencing an intense craving/anxiety moment right now. Can we talk or stay on the line together for a few minutes?",
            "panic_intervention": "Name out loud 3 red objects around you and count backwards from 20 to 1.",
            "hotlines": [
                {"name": "988 Suicide & Crisis Lifeline", "number": "988", "desc": "Free, confidential 24/7 support"},
                {"name": "SAMHSA National Helpline", "number": "1-800-662-4357", "desc": "Substance Use Disorder Support"},
                {"name": "Crisis Text Line", "number": "Text HOME to 741741", "desc": "Free 24/7 crisis text counseling"}
            ]
        }

        res = await self.generate_response(prompt, fallback, custom_api_key)
        if "hotlines" not in res:
            res["hotlines"] = fallback["hotlines"]
        return res

    async def get_caregiver_response(
        self, 
        question: str, 
        patient_context: str = "",
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        prompt = CAREGIVER_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            question=question,
            patient_context=patient_context or "General recovery context"
        )

        fallback = {
            "answer": f"Navigating caregiver situations like '{question}' requires balancing compassionate support with personal boundary safety.",
            "how_to_respond": "Use calm, neutral tones: 'I see you are having a difficult moment right now. I am here with you, and we will take this step by step.'",
            "what_to_avoid": "Avoid lecturing, interrogating, issuing ultimatums, or expressing shame or anger in the heat of the moment.",
            "warning_signs": [
                "Unusual social withdrawal or secretive routine changes",
                "Sudden shifts in sleep patterns or heightened irritability",
                "Neglecting personal hygiene or routine recovery meetings"
            ],
            "deescalation_steps": [
                "Lower your vocal tone and slow down your speaking cadence",
                "Give physical space—do not crowd or block exits",
                "Acknowledge their emotional experience without arguing over facts"
            ],
            "self_care_tip": "Remember: You cannot pour from an empty cup. Schedule at least 20 minutes daily for your own rest and emotional regulation."
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

    async def get_education_response(
        self, 
        topic: str,
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        prompt = EDUCATION_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            topic=topic
        )

        fallback = {
            "topic": topic,
            "overview": f"Understanding '{topic}' is a fundamental aspect of long-term recovery and neurobiological healing. Research demonstrates that acknowledging physiological and psychological triggers empowers individuals to build resilience.",
            "key_takeaways": [
                "Cravings and stress reactions are neurological signals, not personal weaknesses.",
                "Neuroplasticity allows the brain to heal and rewire healthy pathways over time.",
                "Building a structured daily routine significantly reduces relapse probability."
            ],
            "actionable_strategies": [
                "Identify high-risk triggers (HALT: Hungry, Angry, Lonely, Tired).",
                "Utilize URGE SURFING: Visualize cravings as ocean waves that crest and subside.",
                "Maintain an active support network and daily check-in habit."
            ],
            "when_to_seek_help": "Seek immediate professional medical support if severe physical withdrawal symptoms, acute panic, or medical distress occur.",
            "related_topics": [
                "Urge Surfing & Mindfulness",
                "Building a Relapse Prevention Plan",
                "CBT & Cognitive Reframing",
                "Sleep Hygiene in Early Recovery"
            ]
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

    async def get_checkin_analysis(
        self,
        mood: int,
        stress: int,
        sleep: int,
        energy: int,
        cravings: int,
        journal_entry: str = "",
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Evaluates holistic check-in metrics (mood, stress, sleep, energy, cravings, journal text)
        to output structured recovery summary, risk classification, positive highlights, and recommendations.

        Args:
            mood: 1-10 rating.
            stress: 1-10 rating.
            sleep: 1-10 rating.
            energy: 1-10 rating.
            cravings: 0-10 rating.
            journal_entry: Optional reflection text.
            custom_api_key: Optional client-provided API Key.

        Returns:
            Dict matching CheckInResponse schema.
        """
        # Determine risk tier baseline
        calculated_risk = "Low"
        if cravings >= 7 or stress >= 8 or sleep <= 3:
            calculated_risk = "High"
        elif cravings >= 4 or stress >= 6 or sleep <= 5:
            calculated_risk = "Moderate"

        prompt = CHECKIN_ANALYSIS_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            mood=mood,
            stress=stress,
            sleep=sleep,
            energy=energy,
            cravings=cravings,
            journal_entry=journal_entry or "None provided",
            risk_level_placeholder=calculated_risk
        )

        fallback = {
            "recovery_summary": f"Your check-in reflects a mood of {mood}/10 with a craving index of {cravings}/10. Staying mindful of your stress level ({stress}/10) is your key focus today.",
            "risk_level": calculated_risk,
            "positive_highlights": [
                "Consistently checking in shows high self-awareness and commitment.",
                f"You logged energy levels at {energy}/10 and completed your daily assessment."
            ],
            "personalized_recommendations": [
                "Engage in a 5-minute guided 4-4-6 breathing session in the app.",
                "Hydrate with 2 glasses of water and take a brief outdoor pause.",
                "Connect with a trusted peer or log a voice entry in your journal."
            ],
            "suggested_focus": "Mindful Stress Reduction & Hydration"
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

    async def get_safety_analysis(
        self,
        cravings: int,
        stress: int,
        sleep: int,
        isolation_score: int = 5,
        recent_text: str = "",
        custom_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyzes acute risk indicators and text input to evaluate real-time safety risk levels.

        Args:
            cravings: 0-10 rating.
            stress: 1-10 rating.
            sleep: 1-10 rating.
            isolation_score: 1-10 rating.
            recent_text: Optional recent journal text.
            custom_api_key: Optional client-provided API Key.

        Returns:
            Dict matching SafetyAnalyzeResponse schema.
        """
        # Calculate risk
        risk_level = "Low"
        if cravings >= 8 or stress >= 8 or isolation_score >= 8:
            risk_level = "High"
        elif cravings >= 5 or stress >= 6 or isolation_score >= 6:
            risk_level = "Moderate"

        prompt = SAFETY_ANALYSIS_PROMPT_TEMPLATE.format(
            system_prompt=SYSTEM_BASE_PROMPT,
            cravings=cravings,
            stress=stress,
            sleep=sleep,
            isolation_score=isolation_score,
            recent_text=recent_text or "None"
        )

        fallback = {
            "risk_level": risk_level,
            "triggers_detected": [
                f"Elevated Craving Index ({cravings}/10)" if cravings >= 5 else "Normal Craving Index",
                f"High Stress Load ({stress}/10)" if stress >= 6 else "Moderate Stress Load",
                "Potential Social Isolation" if isolation_score >= 7 else "Balanced Social Connection"
            ],
            "immediate_actions": [
                "Initiate Emergency 4-4-6 Breathing Exercise",
                "Drink 16oz of cold water immediately",
                "Send a quick check-in message to your trusted contact"
            ],
            "grounding_prompt": "Press both palms firmly together for 10 seconds. Feel the tension release as you exhale slowly.",
            "hydration_reminder": "Your body needs physical nourishment right now. Drink a glass of cold water or herbal tea.",
            "contact_recommendation": "Reach out to your designated caregiver or call/text 988 for immediate confidential peer support."
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

    async def get_daily_motivation(self, custom_api_key: Optional[str] = None) -> Dict[str, Any]:
        """
        Synthesizes daily inspirational recovery quote, reflection prompt, and focus area.

        Args:
            custom_api_key: Optional client-provided API Key.

        Returns:
            Dict matching MotivationResponse schema.
        """
        prompt = f"{SYSTEM_BASE_PROMPT}\n\nGenerate an inspiring daily recovery motivation quote, author, reflection prompt, and focus area in valid JSON with keys: quote, author, reflection_prompt, daily_focus."
        
        fallback = {
            "quote": "Recovery is not a race; it is a quiet, powerful commitment to honor yourself one breath at a time.",
            "author": "RecoveryAI Companion",
            "reflection_prompt": "What is one small victory you can celebrate about yourself today?",
            "daily_focus": "Self-Compassion & Present Moment Awareness"
        }

        return await self.generate_response(prompt, fallback, custom_api_key)

gemini_service = GeminiService()
