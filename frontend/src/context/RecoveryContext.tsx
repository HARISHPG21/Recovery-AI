import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckInLog, EmergencyContact, UserPreferences, DailyMotivation } from '../types';
import { apiService } from '../services/api';

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface RecoveryContextType {
  checkIns: CheckInLog[];
  streakDays: number;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
  motivation: DailyMotivation | null;
  toasts: Toast[];
  isDark: boolean;
  toggleTheme: () => void;
  addCheckIn: (log: Omit<CheckInLog, 'id' | 'date'>) => Promise<CheckInLog>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  refreshMotivation: () => Promise<void>;
  resetAllData: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  voiceName: '',
  autoSpeak: true,
  largeFont: false,
  caregiverMode: false,
};

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Sarah Jenkins', relation: 'Sponsor / Support Lead', phone: '(555) 234-5678', isPrimary: true },
  { id: '2', name: 'Dr. Marcus Vance', relation: 'Recovery Counselor', phone: '(555) 987-6543' },
  { id: '3', name: 'National Crisis Line', relation: '24/7 Helpline', phone: '988', isPrimary: true },
];

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

export const RecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── Theme ──────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('recoveryai_theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
    localStorage.setItem('recoveryai_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);

  // ── Check-Ins ──────────────────────────────────────
  // Load state from localStorage
  const [checkIns, setCheckIns] = useState<CheckInLog[]>(() => {
    try {
      const saved = localStorage.getItem('recoveryai_checkins');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sample-1',
          date: new Date(Date.now() - 86400000).toISOString(),
          mood: 8,
          stress: 3,
          sleep: 8,
          energy: 7,
          cravings: 2,
          journal_entry: "Had a great morning walk and attended my local support group. Feeling grounded.",
          analysis: {
            recovery_summary: "Strong mental equilibrium and low craving triggers.",
            risk_level: "Low",
            positive_highlights: ["Low craving score", "Healthy physical activity"],
            personalized_recommendations: ["Maintain current routine", "Log evening reflection"],
            suggested_focus: "Consistent Routine & Physical Care"
          }
        }
      ];
    } catch {
      return [];
    }
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem('recoveryai_contacts');
      return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('recoveryai_prefs');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [motivation, setMotivation] = useState<DailyMotivation | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('recoveryai_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('recoveryai_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    localStorage.setItem('recoveryai_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Calculate recovery streak
  const streakDays = React.useMemo(() => {
    if (checkIns.length === 0) return 1;
    const uniqueDays = new Set(checkIns.map(c => new Date(c.date).toDateString()));
    return Math.max(uniqueDays.size, 1);
  }, [checkIns]);

  // Fetch motivation on load
  const refreshMotivation = async () => {
    try {
      const res = await apiService.fetchDailyMotivation();
      setMotivation(res);
    } catch (e) {
      console.warn('Failed to fetch motivation:', e);
      setMotivation({
        quote: "One day at a time. You are stronger than your hardest moments.",
        author: "RecoveryAI Companion",
        reflection_prompt: "What made you feel proud of yourself today?",
        daily_focus: "Mindful Resilience & Compassion"
      });
    }
  };

  useEffect(() => {
    refreshMotivation();
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addCheckIn = async (logData: Omit<CheckInLog, 'id' | 'date'>): Promise<CheckInLog> => {
    showToast("Analyzing check-in with Gemini AI...", "info");
    
    let analysis;
    try {
      analysis = await apiService.analyzeCheckIn({
        mood: logData.mood,
        stress: logData.stress,
        sleep: logData.sleep,
        energy: logData.energy,
        cravings: logData.cravings,
        journal_entry: logData.journal_entry,
      });
    } catch (err) {
      console.error(err);
      analysis = {
        recovery_summary: "Check-in logged successfully.",
        risk_level: (logData.cravings > 6 ? "High" : "Low") as 'Low' | 'Moderate' | 'High',
        positive_highlights: ["Completed self-assessment"],
        personalized_recommendations: ["Take 3 deep breaths", "Hydrate with water"],
        suggested_focus: "Mindfulness & Self-Care"
      };
    }

    const newLog: CheckInLog = {
      ...logData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      analysis,
    };

    setCheckIns(prev => [newLog, ...prev]);
    showToast("Daily check-in completed!", "success");
    return newLog;
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Math.random().toString(36).substring(2, 9),
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    showToast("Emergency contact added", "success");
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
    showToast("Contact removed", "info");
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
    showToast("Preferences updated", "success");
  };

  const resetAllData = () => {
    localStorage.removeItem('recoveryai_checkins');
    localStorage.removeItem('recoveryai_contacts');
    localStorage.removeItem('recoveryai_prefs');
    setCheckIns([]);
    setEmergencyContacts(DEFAULT_CONTACTS);
    setPreferences(DEFAULT_PREFERENCES);
    showToast("All local data reset", "warning");
  };

  return (
    <RecoveryContext.Provider
      value={{
        checkIns,
        streakDays,
        emergencyContacts,
        preferences,
        motivation,
        toasts,
        isDark,
        toggleTheme,
        addCheckIn,
        addEmergencyContact,
        removeEmergencyContact,
        updatePreferences,
        showToast,
        removeToast,
        refreshMotivation,
        resetAllData,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
};
