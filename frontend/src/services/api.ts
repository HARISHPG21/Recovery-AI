/**
 * RecoveryAI Service Layer
 * 
 * Asynchronous HTTP client providing typed integration with backend FastAPI AI endpoints.
 * Handles automatic propagation of custom user Gemini API keys stored in localStorage.
 */

import {
  CoachResponse,
  EmergencyScript,
  CaregiverGuide,
  EducationArticle,
  CheckInLog,
  SafetyStatus,
  DailyMotivation
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic HTTP fetch helper with automatic header injection and error handling.
 * 
 * @template T - Expected response JSON type
 * @param endpoint - Relative API endpoint path
 * @param options - Fetch RequestInit options
 * @returns Parsed JSON response
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let customApiKey = '';
  try {
    const prefs = localStorage.getItem('recoveryai_preferences');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      if (parsed.geminiApiKey) customApiKey = parsed.geminiApiKey;
    }
  } catch (e) {
    // ignore
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (customApiKey) {
    headers['X-Gemini-Api-Key'] = customApiKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  /**
   * Sends user speech transcripts or text prompts to the Voice AI Coach endpoint.
   */
  async sendCoachPrompt(
    userInput: string,
    history: { sender: string; text: string }[] = [],
    context: Record<string, any> = {}
  ): Promise<CoachResponse> {
    const formattedHistory = history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    }));

    return fetchAPI<CoachResponse>('/api/ai/coach', {
      method: 'POST',
      body: JSON.stringify({
        user_input: userInput,
        conversation_history: formattedHistory,
        user_context: context
      })
    });
  },

  /**
   * Triggers single-tap SOS Emergency Mode to generate personalized crisis intervention scripts.
   */
  async triggerEmergency(
    triggerReason: string = 'Acute craving surge',
    userName: string = 'Friend',
    trustedContact: string = 'Trusted Support'
  ): Promise<EmergencyScript> {
    return fetchAPI<EmergencyScript>('/api/ai/emergency', {
      method: 'POST',
      body: JSON.stringify({
        trigger_reason: triggerReason,
        user_name: userName,
        trusted_contact_name: trustedContact
      })
    });
  },

  /**
   * Queries the Caregiver Assistant for evidence-based de-escalation protocols.
   */
  async askCaregiverQuestion(
    question: string,
    patientContext: string = ''
  ): Promise<CaregiverGuide> {
    return fetchAPI<CaregiverGuide>('/api/ai/caregiver', {
      method: 'POST',
      body: JSON.stringify({
        question,
        patient_context: patientContext
      })
    });
  },

  /**
   * Searches the AI Education Hub to synthesize evidence-based articles.
   */
  async fetchEducationTopic(topic: string): Promise<EducationArticle> {
    return fetchAPI<EducationArticle>('/api/ai/education', {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  },

  /**
   * Analyzes multi-metric daily check-ins to output risk classification and focus areas.
   */
  async analyzeCheckIn(data: {
    mood: number;
    stress: number;
    sleep: number;
    energy: number;
    cravings: number;
    journal_entry?: string;
  }): Promise<{
    recovery_summary: string;
    risk_level: 'Low' | 'Moderate' | 'High';
    positive_highlights: string[];
    personalized_recommendations: string[];
    suggested_focus: string;
  }> {
    return fetchAPI('/api/ai/checkin-analysis', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Evaluates real-time risk indicators and recent text.
   */
  async analyzeSafety(data: {
    cravings: number;
    stress: number;
    sleep: number;
    isolation_score?: number;
    recent_text?: string;
  }): Promise<SafetyStatus> {
    return fetchAPI<SafetyStatus>('/api/ai/safety-analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Fetches daily inspirational recovery quote and reflection prompt.
   */
  async fetchDailyMotivation(): Promise<DailyMotivation> {
    return fetchAPI<DailyMotivation>('/api/ai/motivation', {
      method: 'GET'
    });
  }
};
