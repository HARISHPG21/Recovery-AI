import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  Droplets,
  Wind,
  PhoneCall,
  Sparkles,
  Compass,
  UserX,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import { SafetyStatus } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRecovery } from '../context/RecoveryContext';

export const SafetyPage: React.FC = () => {
  const { showToast, checkIns } = useRecovery();
  const latestCheckIn = checkIns[0];

  const [cravings, setCravings] = useState(latestCheckIn ? latestCheckIn.cravings : 6);
  const [stress, setStress] = useState(latestCheckIn ? latestCheckIn.stress : 7);
  const [sleep, setSleep] = useState(latestCheckIn ? latestCheckIn.sleep : 4);
  const [isolationScore, setIsolationScore] = useState(6);
  const [recentText, setRecentText] = useState('');
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeSafety = async () => {
    setIsLoading(true);
    showToast('Running Safety Analyzer algorithm & Gemini risk engine...', 'warning');

    try {
      const res = await apiService.analyzeSafety({
        cravings,
        stress,
        sleep,
        isolation_score: isolationScore,
        recent_text: recentText,
      });
      setSafetyStatus(res);
      showToast('Safety analysis complete', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to complete safety analysis.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Feature 6: Context-Aware Safety Tools</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Safety & High-Risk Analyzer</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Detect high-risk triggers like acute cravings, social isolation, and stress spikes. AI generates immediate safety intervention paths.
        </p>
      </div>

      {/* Metric Input Grid */}
      <Card glowColor="amber" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cravings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Craving Intensity (0-10)</span>
              <span className={cravings > 6 ? 'text-rose-400' : 'text-teal-400'}>{cravings} / 10</span>
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

          {/* Stress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Stress Load (1-10)</span>
              <span className="text-amber-400">{stress} / 10</span>
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

          {/* Sleep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Sleep Hours / Quality (1-10)</span>
              <span className="text-indigo-400">{sleep} / 10</span>
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

          {/* Social Isolation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Social Isolation Level (1-10)</span>
              <span className="text-rose-300">{isolationScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={isolationScore}
              onChange={e => setIsolationScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>
        </div>

        <Button
          variant="teal"
          size="lg"
          onClick={handleAnalyzeSafety}
          isLoading={isLoading}
          className="w-full"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          Evaluate Safety & Triggers
        </Button>
      </Card>

      {/* Safety Analysis Output */}
      {safetyStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Risk Level Card */}
          <Card glowColor={safetyStatus.risk_level === 'High' ? 'rose' : 'amber'} className="border-rose-500/40 bg-slate-900/90 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Safety Risk Status</span>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                safetyStatus.risk_level === 'High'
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50 animate-pulse'
                  : safetyStatus.risk_level === 'Moderate'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  : 'bg-teal-500/30 text-teal-200 border border-teal-500/50'
              }`}>
                {safetyStatus.risk_level} Risk Level
              </span>
            </div>

            {/* Triggers Detected */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Triggers Detected:</span>
              <div className="flex flex-wrap gap-2">
                {safetyStatus.triggers_detected.map((t, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl text-xs bg-rose-950/60 border border-rose-500/30 text-rose-300 font-medium">
                    ⚠️ {t}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Immediate Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grounding Exercise */}
            <Card glowColor="indigo" className="space-y-2">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Grounding Exercise
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {safetyStatus.grounding_prompt}
              </p>
            </Card>

            {/* Hydration & Physical */}
            <Card glowColor="teal" className="space-y-2">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                Physical Hydration Care
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {safetyStatus.hydration_reminder}
              </p>
            </Card>

            {/* Contact Recommendation */}
            <Card glowColor="rose" className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                Social Outreach
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {safetyStatus.contact_recommendation}
              </p>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};
