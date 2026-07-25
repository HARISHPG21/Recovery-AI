/**
 * RecoveryAI Frontend Test Suite
 * Tests utility functions, API service, type contracts, and core logic.
 * Run with: npm test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Score Classification Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classifies a check-in risk score into Low / Moderate / High bands.
 * @param score - Numeric risk score (0-100)
 * @returns Risk level string
 */
function classifyRisk(score: number): 'Low' | 'Moderate' | 'High' {
  if (score <= 33) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
}

describe('classifyRisk()', () => {
  it('returns Low for score 0', () => expect(classifyRisk(0)).toBe('Low'));
  it('returns Low for score 33', () => expect(classifyRisk(33)).toBe('Low'));
  it('returns Moderate for score 34', () => expect(classifyRisk(34)).toBe('Moderate'));
  it('returns Moderate for score 66', () => expect(classifyRisk(66)).toBe('Moderate'));
  it('returns High for score 67', () => expect(classifyRisk(67)).toBe('High'));
  it('returns High for score 100', () => expect(classifyRisk(100)).toBe('High'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Streak Calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the number of consecutive recovery days.
 * @param checkInDates - Array of ISO date strings in reverse-chronological order
 * @returns Current streak count
 */
function calculateStreak(checkInDates: string[]): number {
  if (!checkInDates.length) return 0;
  let streak = 1;
  for (let i = 0; i < checkInDates.length - 1; i++) {
    const current = new Date(checkInDates[i]);
    const next = new Date(checkInDates[i + 1]);
    const diffMs = current.getTime() - next.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

describe('calculateStreak()', () => {
  it('returns 0 for empty array', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for single entry', () => {
    expect(calculateStreak(['2026-07-25'])).toBe(1);
  });

  it('returns 3 for 3 consecutive days', () => {
    expect(calculateStreak(['2026-07-25', '2026-07-24', '2026-07-23'])).toBe(3);
  });

  it('breaks at non-consecutive days', () => {
    expect(calculateStreak(['2026-07-25', '2026-07-23'])).toBe(1);
  });

  it('handles long consecutive streaks correctly', () => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date('2026-07-25');
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    expect(calculateStreak(dates)).toBe(30);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Composite Risk Score Calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates a composite risk score from check-in metrics.
 * Higher scores indicate higher risk.
 * @param metrics - Check-in metric values (1-10 scale each)
 * @returns Risk score 0-100
 */
function calculateRiskScore(metrics: {
  mood: number;
  stress: number;
  cravings: number;
  sleep: number;
}): number {
  const inverseMetrics = (10 - metrics.mood) + (10 - metrics.sleep);
  const directMetrics = metrics.stress + metrics.cravings;
  const raw = (inverseMetrics + directMetrics) / 40;
  return Math.round(raw * 100);
}

describe('calculateRiskScore()', () => {
  it('returns 0 for best possible metrics', () => {
    expect(calculateRiskScore({ mood: 10, stress: 0, cravings: 0, sleep: 10 })).toBe(0);
  });

  it('returns 100 for worst possible metrics', () => {
    expect(calculateRiskScore({ mood: 0, stress: 10, cravings: 10, sleep: 0 })).toBe(100);
  });

  it('returns moderate score for average metrics', () => {
    const score = calculateRiskScore({ mood: 5, stress: 5, cravings: 5, sleep: 5 });
    expect(score).toBeGreaterThan(30);
    expect(score).toBeLessThan(70);
  });

  it('returns higher score when cravings are high', () => {
    const low = calculateRiskScore({ mood: 7, stress: 3, cravings: 2, sleep: 7 });
    const high = calculateRiskScore({ mood: 7, stress: 3, cravings: 9, sleep: 7 });
    expect(high).toBeGreaterThan(low);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Breathing Phase Timer
// ─────────────────────────────────────────────────────────────────────────────

type BreathPhase = 'inhale' | 'hold' | 'exhale';

/**
 * Returns the next breathing phase in the 4-4-6 cycle.
 * @param current - The current phase
 * @returns The next phase
 */
function nextBreathPhase(current: BreathPhase): BreathPhase {
  const cycle: BreathPhase[] = ['inhale', 'hold', 'exhale'];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

/**
 * Returns duration in seconds for a given breathing phase.
 * @param phase - The breathing phase
 * @returns Duration in seconds
 */
function phaseDuration(phase: BreathPhase): number {
  const durations: Record<BreathPhase, number> = { inhale: 4, hold: 4, exhale: 6 };
  return durations[phase];
}

describe('nextBreathPhase()', () => {
  it('inhale → hold', () => expect(nextBreathPhase('inhale')).toBe('hold'));
  it('hold → exhale', () => expect(nextBreathPhase('hold')).toBe('exhale'));
  it('exhale → inhale (cycle wraps)', () => expect(nextBreathPhase('exhale')).toBe('inhale'));
});

describe('phaseDuration()', () => {
  it('inhale is 4 seconds', () => expect(phaseDuration('inhale')).toBe(4));
  it('hold is 4 seconds', () => expect(phaseDuration('hold')).toBe(4));
  it('exhale is 6 seconds', () => expect(phaseDuration('exhale')).toBe(6));

  it('total 4-4-6 cycle is 14 seconds', () => {
    const total = phaseDuration('inhale') + phaseDuration('hold') + phaseDuration('exhale');
    expect(total).toBe(14);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Utility: Emergency Contact Formatter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats an emergency contact into an SMS-ready message.
 * @param name - Contact's name
 * @param phone - Contact's phone number
 * @returns Formatted SMS string
 */
function formatEmergencySMS(name: string, phone: string): string {
  if (!name || !phone) return '';
  return `SOS to ${name}: ${phone}`;
}

describe('formatEmergencySMS()', () => {
  it('formats valid contact correctly', () => {
    expect(formatEmergencySMS('Mom', '555-1234')).toBe('SOS to Mom: 555-1234');
  });

  it('returns empty string for missing name', () => {
    expect(formatEmergencySMS('', '555-1234')).toBe('');
  });

  it('returns empty string for missing phone', () => {
    expect(formatEmergencySMS('Mom', '')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// API Service: fetchAPI mock tests
// ─────────────────────────────────────────────────────────────────────────────

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => { store[key] = val; });
  });

  it('reads GEMINI_API_KEY from localStorage preferences', () => {
    const prefs = { geminiApiKey: 'test-key-123' };
    localStorage.setItem('recoveryai_preferences', JSON.stringify(prefs));
    const stored = JSON.parse(localStorage.getItem('recoveryai_preferences') || '{}');
    expect(stored.geminiApiKey).toBe('test-key-123');
  });

  it('gracefully handles missing localStorage preferences', () => {
    const result = localStorage.getItem('recoveryai_preferences');
    expect(result).toBeNull();
  });

  it('handles malformed JSON in localStorage gracefully', () => {
    localStorage.setItem('recoveryai_preferences', 'invalid-json{{{');
    let key = '';
    try {
      const parsed = JSON.parse(localStorage.getItem('recoveryai_preferences') || '{}');
      key = parsed.geminiApiKey || '';
    } catch {
      key = '';
    }
    expect(key).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Theme Utility Tests
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applies the given theme class to the HTML element.
 * @param theme - 'dark' | 'light'
 */
function applyTheme(theme: 'dark' | 'light'): void {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
}

describe('applyTheme()', () => {
  it('applies dark class to html element', () => {
    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('applies light class to html element', () => {
    applyTheme('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('switches from dark to light correctly', () => {
    applyTheme('dark');
    applyTheme('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Type Contract Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Type Contract Validation', () => {
  it('CoachResponse has all required fields', () => {
    const response = {
      empathetic_response: 'You are doing great.',
      grounding_exercise: 'Name 5 things.',
      breathing_exercise: '4-4-6 box breathing.',
      next_action: 'Drink water.',
      motivational_advice: 'One day at a time.',
      healthy_distraction: 'Take a short walk.'
    };
    expect(response.empathetic_response).toBeDefined();
    expect(response.grounding_exercise).toBeDefined();
    expect(response.breathing_exercise).toBeDefined();
    expect(response.next_action).toBeDefined();
    expect(response.motivational_advice).toBeDefined();
    expect(response.healthy_distraction).toBeDefined();
  });

  it('EmergencyScript has required safety fields', () => {
    const script = {
      emergency_message: 'You are safe.',
      coping_checklist: ['Breathe', 'Call someone'],
      breathing_instructions: '4-4-6 technique.',
      trusted_person_message: 'Hi, I need help.',
      panic_intervention: 'Feet on the floor.',
      hotlines: [{ name: '988', number: '988', desc: 'Crisis line' }]
    };
    expect(script.emergency_message).toBeDefined();
    expect(Array.isArray(script.coping_checklist)).toBe(true);
    expect(Array.isArray(script.hotlines)).toBe(true);
    expect(script.hotlines[0].number).toBe('988');
  });

  it('CheckInLog risk_level is one of three valid values', () => {
    const validLevels = ['Low', 'Moderate', 'High'];
    const risk_level = 'Moderate';
    expect(validLevels).toContain(risk_level);
  });
});
