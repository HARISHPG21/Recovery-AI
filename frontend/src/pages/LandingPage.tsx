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
  Activity,
  Wind,
  PhoneCall,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useRecovery } from '../context/RecoveryContext';

export const LandingPage: React.FC = () => {
  const { isDark } = useRecovery();

  const title    = isDark ? 'text-white' : 'text-slate-900';
  const subtitle = isDark ? 'text-slate-300' : 'text-slate-600';
  const muted    = isDark ? 'text-slate-400' : 'text-slate-500';

  const features = [
    { icon: Mic,           title: 'Zero-Typing Voice AI Coach',         desc: 'Hands-free voice recognition converts natural speech into immediate, empathetic AI responses and grounding steps.',           color: 'teal',   link: '/coach'     },
    { icon: AlertOctagon,  title: 'Instant Personalized SOS Script',    desc: 'One-tap emergency intervention generating coping checklists, panic reset scripts, and trusted contact alerts.',             color: 'rose',   link: '/emergency' },
    { icon: HeartHandshake,title: 'Compassionate Caregiver Guide',      desc: 'Tailored de-escalation protocols, verbal boundaries, and warning sign monitoring for families and support networks.',        color: 'indigo', link: '/caregiver' },
    { icon: Activity,      title: 'Daily AI Recovery Analysis',         desc: 'Comprehensive multi-metric check-ins analyzing mood, stress, cravings, and sleep to calculate personalized guidance.',       color: 'amber',  link: '/checkin'   },
    { icon: Wind,          title: 'Guided 4-4-6 Breathing Tool',        desc: 'Interactive visual box breathing animations to soothe nervous system hyper-arousal during acute craving waves.',              color: 'teal',   link: '/breathing' },
    { icon: BookOpen,      title: 'Evidence-Based Education Hub',       desc: 'AI-generated explanations of withdrawal biology, relapse prevention strategies, and cognitive reframing tools.',             color: 'indigo', link: '/education' },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-20 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center pt-6 sm:pt-10 pb-10 sm:pb-14">

        {/* Announcement Chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-8 shadow-lg shadow-indigo-500/10"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Google PromptWars GenAI Platform</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight font-outfit mb-6 ${title}`}
        >
          Recovery Support Powered by{' '}
          <br className="hidden sm:inline" />
          <span className="text-gradient">Zero-Typing Voice AI</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`text-base sm:text-xl max-w-2xl font-normal leading-relaxed mb-10 ${subtitle}`}
        >
          A compassionate, zero-friction companion supporting individuals navigating substance use
          recovery and empowering caregivers when cognitive load is highest.
        </motion.p>

        {/* CTA Buttons */}
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 w-full max-w-4xl"
        >
          {[
            { label: 'Zero Typing Required',  value: '100% Voice First'      },
            { label: 'Generative Engine',     value: 'Gemini 2.5 AI'         },
            { label: 'Emergency Hotline',     value: '988 Direct'            },
            { label: 'Caregiver Support',     value: 'De-escalation Ready'   },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-3 sm:p-4 rounded-xl text-center border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className={`text-sm sm:text-base font-bold font-outfit ${title}`}>{stat.value}</div>
              <div className={`text-[11px] sm:text-xs mt-1 ${muted}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="space-y-8 sm:space-y-10">
        <div className="text-center space-y-3">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-outfit ${title}`}>
            Designed for Moments of High Cognitive Load
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${muted}`}>
            When craving waves strike or panic rises, complex typing fails. RecoveryAI delivers
            instant voice interaction and clear crisis paths.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link key={idx} to={feat.link}>
                <Card hoverEffect={true} className="h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 font-outfit ${title}`}>
                      {feat.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${subtitle}`}>
                      {feat.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 pt-5 sm:pt-6 group-hover:translate-x-1 transition-transform">
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="glass-card p-6 sm:p-8 lg:p-12 rounded-3xl border relative overflow-hidden"
        style={{ borderColor: 'rgba(99,102,241,0.2)', backgroundColor: isDark ? 'rgba(2,6,23,0.4)' : 'rgba(238,242,255,0.6)' }}
      >
        <div className="relative z-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Simple &amp; Intelligent</span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-outfit ${title}`}>How RecoveryAI Operates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: 1, color: 'bg-indigo-600 shadow-indigo-500/30',  h: 'Speak or Tap SOS',       p: 'Tap the microphone button or the large red SOS trigger. Zero typing required.' },
              { step: 2, color: 'bg-teal-600 shadow-teal-500/30',      h: 'Gemini AI Synthesis',    p: 'Google Gemini API evaluates context, craving level, and sentiment to generate tailored grounding steps.' },
              { step: 3, color: 'bg-emerald-600 shadow-emerald-500/30',h: 'Actionable Guidance',    p: 'Listen via SpeechSynthesis, execute 4-4-6 breathing, or share SMS scripts to support contacts.' },
            ].map(({ step, color, h, p }) => (
              <div key={step} className="flex flex-col items-center text-center space-y-3">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${color} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                  {step}
                </div>
                <h4 className={`text-base sm:text-lg font-bold font-outfit ${title}`}>{h}</h4>
                <p className={`text-xs leading-relaxed ${muted}`}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Emergency CTA ── */}
      <section
        className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: isDark ? 'rgba(68,6,6,0.2)' : 'rgba(255,241,242,0.6)' }}
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-rose-400 font-bold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Need Immediate Help Right Now?</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-extrabold font-outfit ${title}`}>
            Activate SOS Emergency Mode
          </h3>
          <p className={`text-sm max-w-xl ${subtitle}`}>
            Get instant personalized grounding scripts, ready-to-send SMS messages for your support
            lead, and direct helpline links.
          </p>
        </div>
        <Link to="/emergency" className="w-full sm:w-auto flex-shrink-0">
          <Button variant="danger" size="lg" className="w-full" leftIcon={<PhoneCall className="w-5 h-5" />}>
            Trigger Emergency SOS
          </Button>
        </Link>
      </section>
    </div>
  );
};
