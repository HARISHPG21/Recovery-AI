import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  AlertOctagon,
  CalendarCheck,
  HeartHandshake,
  Sparkles,
  Flame,
  Activity,
  Wind,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRecovery } from '../context/RecoveryContext';

export const DashboardPage: React.FC = () => {
  const { checkIns, streakDays, motivation, refreshMotivation } = useRecovery();
  const latestCheckIn = checkIns[0];

  const cravingLevel = latestCheckIn ? latestCheckIn.cravings : 2;
  const moodScore = latestCheckIn ? latestCheckIn.mood : 8;
  const stressLevel = latestCheckIn ? latestCheckIn.stress : 3;

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight">
            Welcome back to your <span className="text-indigo-400">Recovery Hub</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Zero-typing voice intervention and real-time AI guidance at your fingertips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/checkin">
            <Button variant="teal" size="md" leftIcon={<CalendarCheck className="w-4 h-4" />}>
              {latestCheckIn && new Date(latestCheckIn.date).toDateString() === new Date().toDateString()
                ? 'Update Today\'s Check-In'
                : 'Log Today\'s Check-In'}
            </Button>
          </Link>
          <Link to="/emergency">
            <Button variant="danger" size="md" leftIcon={<AlertOctagon className="w-4 h-4" />}>
              SOS Mode
            </Button>
          </Link>
        </div>
      </div>

      {/* Daily Motivation Quote Banner */}
      {motivation && (
        <Card glowColor="teal" className="bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-indigo-950/40 border border-teal-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>AI Daily Motivation</span>
              </div>
              <p className="text-lg font-medium text-slate-100 italic">
                "{motivation.quote}"
              </p>
              <div className="text-xs text-slate-400">
                — {motivation.author} • Focus: <span className="text-teal-300 font-semibold">{motivation.daily_focus}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshMotivation}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="shrink-0"
            >
              Refresh
            </Button>
          </div>
        </Card>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Recovery Streak */}
        <Card glowColor="teal">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recovery Streak</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              🔥
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">
            {streakDays} <span className="text-base font-normal text-slate-400">Days</span>
          </div>
          <p className="text-xs text-teal-400 font-medium mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active recovery commitment
          </p>
        </Card>

        {/* Card 2: Today's Mood */}
        <Card glowColor="indigo">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Mood</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">
            {moodScore} <span className="text-base font-normal text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {moodScore >= 7 ? '✨ Grounded & Calm' : moodScore >= 4 ? '⚖️ Balanced State' : '⚠️ Mindful Focus Needed'}
          </p>
        </Card>

        {/* Card 3: Craving Level */}
        <Card glowColor={cravingLevel > 5 ? 'rose' : 'teal'}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Craving Level</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cravingLevel > 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'}`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">
            {cravingLevel} <span className="text-base font-normal text-slate-400">/ 10</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${cravingLevel > 6 ? 'bg-rose-500' : cravingLevel > 3 ? 'bg-amber-400' : 'bg-teal-400'}`}
              style={{ width: `${(cravingLevel / 10) * 100}%` }}
            />
          </div>
        </Card>

        {/* Card 4: Stress Level */}
        <Card glowColor="amber">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stress Index</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">
            {stressLevel} <span className="text-base font-normal text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {stressLevel > 6 ? '⚠️ Try 4-4-6 Breathing' : '✅ Manageable stress load'}
          </p>
        </Card>
      </div>

      {/* Feature Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voice AI Coach Card */}
        <Card glowColor="indigo" className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-outfit">Voice AI Recovery Coach</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Speak naturally without typing. Get instant grounding, breathing exercises, and empathetic advice powered by Gemini.
            </p>
          </div>
          <Link to="/coach" className="block pt-2">
            <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Voice Coach
            </Button>
          </Link>
        </Card>

        {/* SOS Emergency Mode Card */}
        <Card glowColor="rose" className="space-y-4 border-rose-500/30 bg-rose-950/10">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-outfit">SOS Emergency Mode</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Single-tap emergency generator. Access personalized panic scripts, coping checklists, and instant SMS support text.
            </p>
          </div>
          <Link to="/emergency" className="block pt-2">
            <Button variant="danger" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open SOS Script Generator
            </Button>
          </Link>
        </Card>

        {/* Caregiver Guide Card */}
        <Card glowColor="teal" className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-outfit">Caregiver Assistance</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Dedicated tools for family and support leads. Learn de-escalation steps, warning signs, and compassionate responses.
            </p>
          </div>
          <Link to="/caregiver" className="block pt-2">
            <Button variant="teal" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Caregiver Guide
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Check-In AI Summary */}
      {latestCheckIn && latestCheckIn.analysis && (
        <Card glowColor="indigo" className="bg-slate-900/60 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Latest AI Check-In Analysis ({new Date(latestCheckIn.date).toLocaleDateString()})</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              latestCheckIn.analysis.risk_level === 'High'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : latestCheckIn.analysis.risk_level === 'Moderate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
            }`}>
              Risk Level: {latestCheckIn.analysis.risk_level}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {latestCheckIn.analysis.recovery_summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="font-bold text-teal-400">Positive Highlights:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {latestCheckIn.analysis.positive_highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="font-bold text-indigo-400">AI Recommendations:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {latestCheckIn.analysis.personalized_recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
