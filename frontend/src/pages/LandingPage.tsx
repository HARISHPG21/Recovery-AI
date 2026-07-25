import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Mic,
  AlertOctagon,
  HeartHandshake,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Activity,
  Wind,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Mic,
      title: 'Zero-Typing Voice AI Coach',
      desc: 'Hands-free voice recognition converts natural speech into immediate, empathetic AI responses and grounding steps.',
      color: 'teal',
      link: '/coach'
    },
    {
      icon: AlertOctagon,
      title: 'Instant Personalized SOS Script',
      desc: 'One-tap emergency intervention generating coping checklists, panic reset scripts, and trusted contact alerts.',
      color: 'rose',
      link: '/emergency'
    },
    {
      icon: HeartHandshake,
      title: 'Compassionate Caregiver Guide',
      desc: 'Tailored de-escalation protocols, verbal boundaries, and warning sign monitoring for families and support networks.',
      color: 'indigo',
      link: '/caregiver'
    },
    {
      icon: Activity,
      title: 'Daily AI Recovery Analysis',
      desc: 'Comprehensive multi-metric check-ins analyzing mood, stress, cravings, and sleep to calculate personalized guidance.',
      color: 'amber',
      link: '/checkin'
    },
    {
      icon: Wind,
      title: 'Guided 4-4-6 Breathing Tool',
      desc: 'Interactive visual box breathing animations to soothe nervous system hyper-arousal during acute craving waves.',
      color: 'teal',
      link: '/breathing'
    },
    {
      icon: BookOpen,
      title: 'Evidence-Based Education Hub',
      desc: 'AI-generated explanations of withdrawal biology, relapse prevention strategies, and cognitive reframing tools.',
      color: 'indigo',
      link: '/education'
    }
  ];

  return (
    <div className="flex flex-col gap-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-8 pb-12">
        {/* Top Announcement Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 shadow-lg shadow-indigo-500/10"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Google PromptWars GenAI Platform</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight font-outfit mb-6"
        >
          Recovery Support Powered by <br className="hidden sm:inline" />
          <span className="text-gradient">Zero-Typing Voice AI</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10"
        >
          A compassionate, zero-friction companion supporting individuals navigating substance use recovery and empowering caregivers when cognitive load is highest.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Recovery Journey
            </Button>
          </Link>
          <Link to="/emergency" className="w-full sm:w-auto">
            <Button variant="danger" size="lg" className="w-full sm:w-auto" leftIcon={<AlertOctagon className="w-5 h-5" />}>
              Instant SOS Mode
            </Button>
          </Link>
        </motion.div>

        {/* Hero Stats Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-4xl"
        >
          {[
            { label: 'Zero Typing Required', value: '100% Voice First' },
            { label: 'Generative Engine', value: 'Gemini 2.5 AI' },
            { label: 'Emergency Hotline', value: '988 Direct' },
            { label: 'Caregiver Support', value: 'De-escalation Ready' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-xl text-center border border-white/10">
              <div className="text-sm sm:text-base font-bold text-white font-outfit">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Designed for Moments of High Cognitive Load
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            When craving waves strike or panic rises, complex typing fails. RecoveryAI delivers instant voice interaction and clear crisis paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link key={idx} to={feat.link}>
                <Card hoverEffect={true} className="h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                      {feat.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 pt-6 group-hover:translate-x-1 transition-transform">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="glass-card p-8 sm:p-12 rounded-3xl border border-indigo-500/20 bg-slate-950/40 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Simple & Intelligent</span>
            <h2 className="text-3xl font-bold text-white font-outfit">How RecoveryAI Operates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                1
              </div>
              <h4 className="text-lg font-bold text-white font-outfit">Speak or Tap SOS</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tap the microphone button or the large red SOS trigger. Zero typing required.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                2
              </div>
              <h4 className="text-lg font-bold text-white font-outfit">Gemini AI Synthesis</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Google Gemini API evaluates context, craving level, and sentiment to generate tailored grounding steps.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h4 className="text-lg font-bold text-white font-outfit">Actionable Guidance</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Listen aloud via SpeechSynthesis, execute 4-4-6 breathing, or share SMS scripts to support contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="glass-card p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Need Immediate Help Right Now?</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white font-outfit">
            Activate SOS Emergency Mode
          </h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Get instant personalized grounding scripts, ready-to-send SMS messages for your support lead, and direct helpline links.
          </p>
        </div>

        <Link to="/emergency">
          <Button variant="danger" size="lg" leftIcon={<PhoneCall className="w-5 h-5" />}>
            Trigger Emergency SOS
          </Button>
        </Link>
      </section>
    </div>
  );
};
