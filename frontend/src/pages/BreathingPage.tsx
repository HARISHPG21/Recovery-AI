import React from 'react';
import { Wind, Sparkles, Heart, ShieldCheck } from 'lucide-react';
import { BreathingCircle } from '../components/BreathingCircle';
import { Card } from '../components/Card';
import { useRecovery } from '../context/RecoveryContext';

export const BreathingPage: React.FC = () => {
  const { showToast } = useRecovery();

  const handleComplete = () => {
    showToast('Completed 4 breathing cycles! Nervous system reset.', 'success');
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          <Wind className="w-4 h-4 text-teal-400" />
          <span>Feature 7: Guided Breathing Exercises</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">4-4-6 Box Breathing</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Regulate your autonomic nervous system during acute craving waves or anxiety spikes with rhythmically timed abdominal breathing.
        </p>
      </div>

      {/* Main Interactive Breathing Component */}
      <Card glowColor="teal" className="bg-slate-900/90 border border-teal-500/30">
        <BreathingCircle onComplete={handleComplete} />
      </Card>

      {/* Why 4-4-6 Breathing Works Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glowColor="indigo" className="space-y-2">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Inhale 4 Seconds</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Expand diaphragm down to pull oxygen deep into lower lungs, signaling safety to the brainstem.
          </p>
        </Card>

        <Card glowColor="teal" className="space-y-2">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">Hold 4 Seconds</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pausing breath balances blood CO2 levels and slows rapid heart rate during acute panic.
          </p>
        </Card>

        <Card glowColor="rose" className="space-y-2">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Exhale 6 Seconds</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Extended exhale activates the vagus nerve, engaging parasympathetic "rest & digest" relaxation.
          </p>
        </Card>
      </div>
    </div>
  );
};
