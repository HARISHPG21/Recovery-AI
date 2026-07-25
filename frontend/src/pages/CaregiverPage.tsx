import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Heart,
  Send,
  UserCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { CaregiverGuide } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRecovery } from '../context/RecoveryContext';

export const CaregiverPage: React.FC = () => {
  const { showToast } = useRecovery();
  const [question, setQuestion] = useState('');
  const [guide, setGuide] = useState<CaregiverGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const presetQuestions = [
    "How should I respond when my loved one is experiencing a severe craving?",
    "What specific phrases should I avoid saying when they are stressed?",
    "What subtle warning signs indicate an elevated relapse risk?",
    "How do I de-escalate an intense argument safely without causing guilt?",
    "How do I balance supporting them while protecting my own emotional boundaries?"
  ];

  const handleAskQuestion = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    showToast('Consulting Gemini AI Caregiver Engine...', 'info');

    try {
      const res = await apiService.askCaregiverQuestion(query);
      setGuide(res);
      showToast('Caregiver guidance generated', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch guidance. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
          <HeartHandshake className="w-4 h-4 text-indigo-400" />
          <span>Feature 3: Caregiver Assistant & De-Escalation</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Support & Caregiver Hub</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Tailored, compassionate guidance for partners, family members, and support leads navigating recovery together.
        </p>
      </div>

      {/* Preset Questions Bar */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Common Caregiver Inquiries:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(q)}
              className="p-3 rounded-xl text-xs text-left bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all font-medium flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Question Input */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
          placeholder="Ask any caregiver question (e.g. How to set boundaries gently?)..."
          className="flex-1 bg-slate-950/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <Button
          variant="primary"
          size="md"
          onClick={() => handleAskQuestion()}
          isLoading={isLoading}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Ask AI
        </Button>
      </div>

      {/* Gemini Caregiver Guidance Output */}
      {guide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Answer Overview */}
          <Card glowColor="indigo" className="space-y-3 bg-slate-900/80 border border-indigo-500/30">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Gemini Compassionate Guidance</span>
            </div>
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              {guide.answer}
            </p>
          </Card>

          {/* Do's and Don'ts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How to Respond (Do's) */}
            <Card glowColor="teal" className="space-y-3 bg-emerald-950/20 border-emerald-500/30">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                How Should I Respond?
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/50 p-3 rounded-xl border border-white/5">
                "{guide.how_to_respond}"
              </p>
            </Card>

            {/* What to Avoid (Don'ts) */}
            <Card glowColor="rose" className="space-y-3 bg-rose-950/20 border-rose-500/30">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                What Should I Avoid Saying?
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/50 p-3 rounded-xl border border-white/5">
                "{guide.what_to_avoid}"
              </p>
            </Card>
          </div>

          {/* De-escalation & Warning Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* De-escalation Steps */}
            <Card glowColor="amber" className="space-y-3">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                De-escalation Steps
              </h3>
              <ol className="space-y-2 text-xs text-slate-200 list-decimal list-inside">
                {guide.deescalation_steps.map((step, idx) => (
                  <li key={idx} className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    {step}
                  </li>
                ))}
              </ol>
            </Card>

            {/* Warning Signs */}
            <Card glowColor="rose" className="space-y-3">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Warning Signs to Monitor
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {guide.warning_signs.map((sign, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Caregiver Self-Care Card */}
          <Card glowColor="indigo" className="bg-indigo-950/30 border-indigo-500/30 space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Caregiver Self-Care Reminder
            </h3>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{guide.self_care_tip}"
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
