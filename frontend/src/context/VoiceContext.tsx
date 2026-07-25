import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Speech Recognition and Synthesis Context contract.
 */
export interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  voiceSpeed: number;
  voicePitch: number;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  setSelectedVoice: (v: string) => void;
  setVoiceSpeed: (s: number) => void;
  setVoicePitch: (p: number) => void;
  isSupported: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

/**
 * VoiceProvider Component
 * 
 * Manages hands-free speech recognition (Web SpeechRecognition API)
 * and text-to-speech synthesis (Web SpeechSynthesis API) with custom voice pitch and rate controls.
 * 
 * @component
 */
export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize SpeechSynthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          const defaultEn = availableVoices.find(v => v.lang.includes('en') || v.default);
          if (defaultEn) setSelectedVoice(defaultEn.name);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoice]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        rec.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (e) {
        console.warn('Could not stop recognition:', e);
      }
    }
  }, [recognition]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop previous speech
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;

    if (selectedVoice) {
      const vObj = voices.find(v => v.name === selectedVoice);
      if (vObj) utterance.voice = vObj;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voiceSpeed, voicePitch, selectedVoice, voices]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isSpeaking,
        voices,
        selectedVoice,
        voiceSpeed,
        voicePitch,
        startListening,
        stopListening,
        clearTranscript,
        speakText,
        stopSpeaking,
        setSelectedVoice,
        setVoiceSpeed,
        setVoicePitch,
        isSupported,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
