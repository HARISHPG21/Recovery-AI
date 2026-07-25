// Frontend Data Contracts & Types for RecoveryAI

export interface CoachResponse {
  empathetic_response: string;
  grounding_exercise: string;
  breathing_exercise: string;
  next_action: string;
  motivational_advice: string;
  healthy_distraction: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  structured?: CoachResponse;
}

export interface HotlineItem {
  name: string;
  number: string;
  desc: string;
}

export interface EmergencyScript {
  emergency_message: string;
  coping_checklist: string[];
  breathing_instructions: string;
  trusted_person_message: string;
  panic_intervention: string;
  hotlines: HotlineItem[];
}

export interface CaregiverGuide {
  answer: string;
  how_to_respond: string;
  what_to_avoid: string;
  warning_signs: string[];
  deescalation_steps: string[];
  self_care_tip: string;
}

export interface EducationArticle {
  topic: string;
  overview: string;
  key_takeaways: string[];
  actionable_strategies: string[];
  when_to_seek_help: string;
  related_topics: string[];
}

export interface CheckInLog {
  id: string;
  date: string;
  mood: number;
  stress: number;
  sleep: number;
  energy: number;
  cravings: number;
  journal_entry?: string;
  analysis?: {
    recovery_summary: string;
    risk_level: 'Low' | 'Moderate' | 'High';
    positive_highlights: string[];
    personalized_recommendations: string[];
    suggested_focus: string;
  };
}

export interface SafetyStatus {
  risk_level: 'Low' | 'Moderate' | 'High';
  triggers_detected: string[];
  immediate_actions: string[];
  grounding_prompt: string;
  hydration_reminder: string;
  contact_recommendation: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'high-contrast';
  voiceSpeed: number; // 0.8 - 1.2
  voicePitch: number; // 0.8 - 1.2
  voiceName: string;
  autoSpeak: boolean;
  largeFont: boolean;
  caregiverMode: boolean;
  geminiApiKey?: string;
}

export interface DailyMotivation {
  quote: string;
  author: string;
  reflection_prompt: string;
  daily_focus: string;
}
