import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  RefreshCw,
  Heart,
  Wind,
  ShieldCheck,
  Compass,
  Smile,
  Copy,
  Check
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useRecovery } from '../context/RecoveryContext';
import { apiService } from '../services/api';
import { CoachMessage, CoachResponse } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const VoiceCoachPage: React.FC = () => {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    speakText,
    isSpeaking,
    stopSpeaking,
    isSupported
  } = useVoice();

  const { showToast } = useRecovery();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Quick Zero-Typing Prompt Chips
  const presetPrompts = [
    "I'm experiencing an intense craving wave right now.",
    "I feel overwhelmed with stress and need to ground myself.",
    "I'm worried about relapsing today and need support.",
    "Walk me through a 2-minute relaxation exercise.",
    "How can I shift my focus away from negative thoughts?"
  ];

  // Auto-fill speech transcript into input
  useEffect(() => {
    if (transcript) {
      setTextInput(transcript);
    }
  }, [transcript]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      setTextInput('');
      startListening();
    }
  };

  const handleSendMessage = async (inputStr?: string) => {
    const promptToSend = inputStr || textInput;
    if (!promptToSend.trim() || isLoading) return;

    const userMsgId = Math.random().toString(36).substring(2, 9);
    const userMsg: CoachMessage = {
      id: userMsgId,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    clearTranscript();
    setIsLoading(true);

    try {
      // Build conversation history format
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const structuredRes: CoachResponse = await apiService.sendCoachPrompt(promptToSend, history);

      const aiMsgId = Math.random().toString(36).substring(2, 9);
      const aiMsg: CoachMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: structuredRes.empathetic_response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured: structuredRes,
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speak empathetic response & next action aloud via Web SpeechSynthesis
      const spokenText = `${structuredRes.empathetic_response} Here is your next action: ${structuredRes.next_action}`;
      speakText(spokenText);

    } catch (err: any) {
      console.error(err);
      showToast('Error generating AI response. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white font-outfit">Voice AI Recovery Coach</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
              Zero-Typing
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Tap the microphone and speak naturally. Gemini converts your speech into empathetic guidance, grounding steps, and breathing instructions.
          </p>
        </div>

        {/* TTS Audio Controls */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              leftIcon={<VolumeX className="w-4 h-4 text-rose-400" />}
            >
              Stop Speech
            </Button>
          )}
        </div>
      </div>

      {/* Preset Zero-Typing Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Quick Zero-Typing Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-left"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="flex-1 glass-card rounded-2xl p-4 sm:p-6 border border-white/10 overflow-y-auto space-y-6 max-h-[550px] min-h-[350px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-4 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-outfit">Your AI Coach is Ready</h3>
            <p className="text-sm max-w-md text-slate-300">
              Tap the large microphone below and speak out loud. Or choose a quick zero-typing prompt above.
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1 text-[11px] font-semibold text-slate-400">
                <span>{msg.sender === 'user' ? 'You' : 'Gemini AI Coach'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* User Bubble */}
              {msg.sender === 'user' ? (
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4 rounded-2xl rounded-tr-none max-w-lg shadow-lg text-sm leading-relaxed font-medium">
                  {msg.text}
                </div>
              ) : (
                /* Structured AI Response Card */
                <div className="w-full max-w-2xl space-y-4">
                  <div className="glass-panel p-5 rounded-2xl rounded-tl-none border border-teal-500/30 bg-slate-900/80 shadow-xl space-y-4">
                    {/* Empathetic Response */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                        <Heart className="w-4 h-4 fill-teal-400/20" />
                        <span>Empathetic Reflection</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(msg.structured?.empathetic_response || msg.text, msg.id)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedId === msg.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-sm text-slate-100 font-medium leading-relaxed">
                      {msg.structured?.empathetic_response || msg.text}
                    </p>

                    {/* Breakdown Sections */}
                    {msg.structured && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                        {/* Grounding Exercise */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-indigo-500/20 space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Sensory Grounding</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{msg.structured.grounding_exercise}</p>
                        </div>

                        {/* Breathing Exercise */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-teal-500/20 space-y-1">
                          <div className="flex items-center gap-1.5 text-teal-300 font-bold">
                            <Wind className="w-3.5 h-3.5" />
                            <span>4-4-6 Breathing</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{msg.structured.breathing_exercise}</p>
                        </div>

                        {/* Next Action */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Immediate Micro-Action</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{msg.structured.next_action}</p>
                        </div>

                        {/* Healthy Distraction */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <Smile className="w-3.5 h-3.5" />
                            <span>Healthy Distraction</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{msg.structured.healthy_distraction}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-3 text-indigo-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Gemini AI is processing your voice transcript...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Voice Input Control Bar */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        {/* Microphone Button */}
        <button
          onClick={handleMicToggle}
          className={`p-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30'
          }`}
          title={isListening ? 'Stop Listening' : 'Start Speech Recognition'}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? 'Listening to your voice...' : 'Type or speak your thoughts...'}
          className="flex-1 bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />

        {/* Send Button */}
        <Button
          variant="teal"
          size="md"
          onClick={() => handleSendMessage()}
          isLoading={isLoading}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
