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

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  // Feature 1: Voice AI Recovery Coach
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
        user_context: context,
      }),
    });
  },

  // Feature 2: SOS Emergency Script Generator
  async triggerEmergency(
    triggerReason = 'Acute craving / panic',
    userName = 'Friend',
    trustedContact = 'Trusted Support'
  ): Promise<EmergencyScript> {
    return fetchAPI<EmergencyScript>('/api/ai/emergency', {
      method: 'POST',
      body: JSON.stringify({
        trigger_reason: triggerReason,
        user_name: userName,
        trusted_contact_name: trustedContact,
      }),
    });
  },

  // Feature 3: Caregiver Guidance
  async askCaregiverQuestion(question: string, patientContext = ''): Promise<CaregiverGuide> {
    return fetchAPI<CaregiverGuide>('/api/ai/caregiver', {
      method: 'POST',
      body: JSON.stringify({
        question,
        patient_context: patientContext,
      }),
    });
  },

  // Feature 4: AI Education Hub Search
  async searchEducation(topic: string): Promise<EducationArticle> {
    return fetchAPI<EducationArticle>('/api/ai/education', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  },

  // Feature 5: Daily Recovery Check-in Analysis
  async analyzeCheckIn(data: {
    mood: number;
    stress: number;
    sleep: number;
    energy: number;
    cravings: number;
    journal_entry?: string;
  }): Promise<NonNullable<CheckInLog['analysis']>> {
    return fetchAPI<NonNullable<CheckInLog['analysis']>>('/api/ai/checkin-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Feature 6: Real-time Safety Analyzer
  async analyzeSafety(data: {
    cravings: number;
    stress: number;
    sleep: number;
    isolation_score?: number;
    recent_text?: string;
  }): Promise<SafetyStatus> {
    return fetchAPI<SafetyStatus>('/api/ai/safety-analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Daily Motivation Quote
  async fetchDailyMotivation(): Promise<DailyMotivation> {
    return fetchAPI<DailyMotivation>('/api/ai/motivation', {
      method: 'GET',
    });
  },

  // Healthcheck
  async checkHealth(): Promise<{ status: string; gemini_api_configured: boolean }> {
    return fetchAPI<{ status: string; gemini_api_configured: boolean }>('/api/health');
  }
};
