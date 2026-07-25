import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface BreathingCircleProps {
  onComplete?: () => void;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 4-4-6 timing sequence
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev > 1) return prev - 1;

          // Transition phases
          if (phase === 'inhale') {
            setPhase('hold');
            return 4; // Hold for 4s
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 6; // Exhale for 6s
          } else {
            // Completed cycle
            setCyclesCompleted(c => c + 1);
            setPhase('inhale');
            if (onComplete && cyclesCompleted >= 4) {
              onComplete();
            }
            return 4; // Inhale for 4s
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, phase, cyclesCompleted, onComplete]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  const phaseConfig = {
    inhale: {
      label: 'Inhale Deeply',
      color: 'from-teal-400 to-indigo-500',
      textColor: 'text-teal-300',
      subtext: 'Breathe in slowly through your nose...',
      scale: 1.35,
      duration: 4,
    },
    hold: {
      label: 'Hold Calmly',
      color: 'from-indigo-500 to-purple-500',
      textColor: 'text-indigo-300',
      subtext: 'Hold your breath softly in your chest...',
      scale: 1.35,
      duration: 4,
    },
    exhale: {
      label: 'Exhale Slowly',
      color: 'from-rose-500 to-amber-500',
      textColor: 'text-rose-300',
      subtext: 'Release all tension slowly through your mouth...',
      scale: 1.0,
      duration: 6,
    },
  };

  const currentConfig = phaseConfig[phase];

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center">
      {/* Top Cycles Counter */}
      <div className="flex items-center gap-2 mb-8 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/60">
        <ShieldCheck className="w-4 h-4 text-teal-400" />
        <span className="text-xs font-semibold text-slate-300">
          Cycles Completed: <span className="text-teal-400">{cyclesCompleted}</span>
        </span>
      </div>

      {/* Main Animated Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center my-6">
        {/* Outer Glow Circle */}
        <motion.div
          animate={{
            scale: isActive ? currentConfig.scale : 1,
            opacity: isActive ? 0.9 : 0.4,
          }}
          transition={{
            duration: isActive ? currentConfig.duration : 0.5,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentConfig.color} blur-2xl opacity-50`}
        />

        {/* Middle Pulsing Ring */}
        <motion.div
          animate={{
            scale: isActive ? currentConfig.scale : 1,
          }}
          transition={{
            duration: isActive ? currentConfig.duration : 0.5,
            ease: 'easeInOut',
          }}
          className={`w-56 h-56 rounded-full border-2 border-white/20 backdrop-blur-xl flex flex-col items-center justify-center shadow-2xl relative z-10 bg-slate-900/40`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase + secondsLeft}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col items-center"
            >
              <span className="text-5xl font-black tracking-tight text-white mb-1">
                {secondsLeft}
              </span>
              <span className={`text-sm font-bold tracking-wide uppercase ${currentConfig.textColor}`}>
                {currentConfig.label}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Instructional Subtext */}
      <p className="text-slate-300 text-sm h-12 max-w-sm mb-6 font-medium">
        {isActive ? currentConfig.subtext : "Tap Start to begin the calming 4-4-6 box breathing technique."}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant={isActive ? 'secondary' : 'teal'}
          size="lg"
          onClick={() => setIsActive(!isActive)}
          leftIcon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        >
          {isActive ? 'Pause' : 'Start Exercise'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-teal-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
        </Button>
      </div>
    </div>
  );
};
