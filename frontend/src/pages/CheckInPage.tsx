import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Activity,
  Wind,
  Moon,
  Zap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileText
} from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';
import { CheckInLog } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const CheckInPage: React.FC = () => {
  const { addCheckIn, checkIns } = useRecovery();

  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(4);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [cravings, setCravings] = useState(2);
  const [journal, setJournal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedLog, setSubmittedLog] = useState<CheckInLog | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const log = await addCheckIn({
        mood,
        stress,
        sleep,
        energy,
        cravings,
        journal_entry: journal,
      });
      setSubmittedLog(log);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          <CalendarCheck className="w-4 h-4 text-teal-400" />
          <span>Feature 5: Daily Recovery Assessment</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Daily Recovery Check-In</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Log your holistic wellness metrics today. Gemini AI analyzes your scores to generate customized recovery recommendations and risk indicators.
        </p>
      </div>

      {/* Metric Sliders Form */}
      <Card glowColor="indigo" className="space-y-6">
        <div className="space-y-6">
          {/* Mood Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Mood Level (1-10)
              </span>
              <span className="text-indigo-400 font-bold text-lg font-outfit">{mood} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={e => setMood(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Cravings Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                Craving Intensity (0-10)
              </span>
              <span className={`font-bold text-lg font-outfit ${cravings > 6 ? 'text-rose-400' : 'text-teal-400'}`}>
                {cravings} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={cravings}
              onChange={e => setCravings(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Stress Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-400" />
                Stress Load (1-10)
              </span>
              <span className="text-amber-400 font-bold text-lg font-outfit">{stress} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={e => setStress(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                Sleep Quality (1-10)
              </span>
              <span className="text-indigo-300 font-bold text-lg font-outfit">{sleep} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sleep}
              onChange={e => setSleep(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-white">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                Physical Energy (1-10)
              </span>
              <span className="text-teal-400 font-bold text-lg font-outfit">{energy} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={e => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Optional Journal Reflection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Optional Journal Reflection / Daily Notes
            </label>
            <textarea
              rows={3}
              value={journal}
              onChange={e => setJournal(e.target.value)}
              placeholder="How are you feeling today? Any specific triggers or achievements?"
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <Button
          variant="teal"
          size="lg"
          onClick={handleSubmit}
          isLoading={isLoading}
          className="w-full mt-4"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          Submit Check-In & Analyze with Gemini AI
        </Button>
      </Card>

      {/* AI Analysis Result Output */}
      {submittedLog && submittedLog.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card glowColor="indigo" className="bg-slate-900/90 border border-teal-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Gemini Check-In Analysis</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                submittedLog.analysis.risk_level === 'High'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : submittedLog.analysis.risk_level === 'Moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }`}>
                Risk Status: {submittedLog.analysis.risk_level}
              </span>
            </div>

            <p className="text-base text-slate-100 font-medium leading-relaxed">
              {submittedLog.analysis.recovery_summary}
            </p>

            <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              Suggested Primary Focus Today: <span className="text-white font-bold">{submittedLog.analysis.suggested_focus}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Positive Highlights
                </span>
                <ul className="space-y-1 text-slate-300">
                  {submittedLog.analysis.positive_highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Personalized AI Recommendations
                </span>
                <ul className="space-y-1 text-slate-300">
                  {submittedLog.analysis.personalized_recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
