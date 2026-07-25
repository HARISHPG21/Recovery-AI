import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, X, Volume2, Shield } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { apiService } from '../services/api';

export const FloatingCoach: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isListening, transcript, startListening, stopListening, speakText, isSpeaking, stopSpeaking } = useVoice();
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickResponse, setQuickResponse] = useState<string | null>(null);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        processVoiceInput(transcript);
      }
    } else {
      setQuickResponse(null);
      startListening();
    }
  };

  const processVoiceInput = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await apiService.sendCoachPrompt(text);
      const outputText = res.empathetic_response + " " + res.next_action;
      setQuickResponse(outputText);
      speakText(outputText);
    } catch (e) {
      console.error(e);
      setQuickResponse("I'm right here with you. Take a deep breath in through your nose and out through your mouth.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 glass-panel p-5 rounded-2xl border border-indigo-500/30 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-bold text-white">Quick Voice Companion</span>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 mb-4 min-h-12 flex flex-col justify-center">
              {isListening ? (
                <div className="flex items-center gap-2 text-teal-400 font-medium animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  Listening... "{transcript || 'Speak naturally'}"
                </div>
              ) : isProcessing ? (
                <div className="text-indigo-300 font-medium">Gemini is reflecting...</div>
              ) : quickResponse ? (
                <div className="text-slate-200 leading-relaxed font-medium">
                  {quickResponse}
                </div>
              ) : (
                <span className="text-slate-400">
                  Tap the mic and speak naturally. Zero typing required.
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleMicClick}
                className={`p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isListening ? 'Stop & Respond' : 'Tap & Speak'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-0.5 shadow-2xl shadow-indigo-500/40 cursor-pointer flex items-center justify-center group"
        aria-label="Open Voice Companion"
      >
        <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
          <Mic className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
      </motion.button>
    </div>
  );
};
