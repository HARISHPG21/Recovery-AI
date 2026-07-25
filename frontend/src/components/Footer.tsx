import React from 'react';
import { Shield, PhoneCall, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-400" />
            <span className="text-xl font-bold text-white font-outfit">
              Recovery<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-modal GenAI-powered recovery & prevention platform supporting individuals navigating substance use disorders and their caregivers.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <span>Powered by</span>
            <span className="font-semibold text-indigo-400">Google Gemini AI</span>
          </div>
        </div>

        {/* Col 2: Crisis Hotlines */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
            Immediate Crisis Hotlines
          </h4>
          <a
            href="tel:988"
            className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            988 Suicide & Crisis Lifeline (24/7)
          </a>
          <a
            href="tel:1-800-662-4357"
            className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            SAMHSA Helpline: 1-800-662-4357
          </a>
          <p className="text-[11px] text-slate-400 mt-1">
            Free, confidential support available 24 hours a day, 365 days a year.
          </p>
        </div>

        {/* Col 3: Key Tools */}
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
            Platform Tools
          </h4>
          <a href="/coach" className="hover:text-indigo-400 transition-colors">Zero-Typing Voice Coach</a>
          <a href="/emergency" className="hover:text-rose-400 transition-colors">Personalized SOS Scripts</a>
          <a href="/caregiver" className="hover:text-indigo-400 transition-colors">Caregiver De-escalation</a>
          <a href="/checkin" className="hover:text-teal-400 transition-colors">Daily AI Check-In</a>
          <a href="/safety" className="hover:text-amber-400 transition-colors">Real-Time Safety Analyzer</a>
        </div>

        {/* Col 4: Medical Disclaimer */}
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
            Safety & Medical Notice
          </h4>
          <p className="text-[11px] leading-relaxed">
            RecoveryAI is an AI supportive tool and does not replace medical diagnosis, psychiatric care, or clinical emergency services. If you are experiencing a life-threatening emergency, please call 911 or reach out to 988 immediately.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <span>© 2026 RecoveryAI Platform. Built for Google PromptWars Hackathon.</span>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          <span>for compassionate AI healthcare</span>
        </div>
      </div>
    </footer>
  );
};
