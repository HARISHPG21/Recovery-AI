import React from 'react';
import { Shield, PhoneCall } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';

/**
 * Footer Component
 * 
 * Application footer containing medical disclaimer, crisis hotline quick-dials (988 & SAMHSA),
 * quick feature site links, and Google Gemini engine attribution.
 * 
 * @component
 * @returns {React.ReactElement} Application footer view
 */
export const Footer: React.FC = () => {
  const { isDark } = useRecovery();

  const text = isDark ? 'text-slate-400' : 'text-slate-500';
  const heading = isDark ? 'text-white' : 'text-slate-800';

  return (
    <footer
      className="w-full glass-panel border-t mt-20 py-10 sm:py-12 px-4 sm:px-6 lg:px-8"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-400" />
            <span className={`text-xl font-bold font-outfit ${heading}`}>
              Recovery<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${text}`}>
            Multi-modal GenAI-powered recovery &amp; prevention platform supporting individuals
            navigating substance use disorders and their caregivers.
          </p>
          <div className={`flex items-center gap-2 text-xs ${text} pt-2`}>
            <span>Powered by</span>
            <span className="font-semibold text-indigo-400">Google Gemini AI</span>
          </div>
        </div>

        {/* Crisis Hotlines */}
        <div className="flex flex-col gap-2">
          <h4 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${heading}`}>
            Crisis Hotlines
          </h4>
          <a href="tel:988" className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors font-semibold">
            <PhoneCall className="w-3.5 h-3.5" />
            988 Suicide &amp; Crisis Lifeline (24/7)
          </a>
          <a href="tel:1-800-662-4357" className="flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 transition-colors font-semibold">
            <PhoneCall className="w-3.5 h-3.5" />
            SAMHSA: 1-800-662-4357
          </a>
          <p className={`text-[11px] mt-1 ${text}`}>
            Free, confidential support 24/7, 365 days a year.
          </p>
        </div>

        {/* Platform Tools */}
        <div className={`flex flex-col gap-2 text-xs ${text}`}>
          <h4 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${heading}`}>
            Platform Tools
          </h4>
          <a href="/coach"     className="hover:text-indigo-400 transition-colors">Zero-Typing Voice Coach</a>
          <a href="/emergency" className="hover:text-rose-400 transition-colors">Personalized SOS Scripts</a>
          <a href="/caregiver" className="hover:text-indigo-400 transition-colors">Caregiver De-escalation</a>
          <a href="/checkin"   className="hover:text-teal-400 transition-colors">Daily AI Check-In</a>
          <a href="/safety"    className="hover:text-amber-400 transition-colors">Real-Time Safety Analyzer</a>
        </div>

        {/* Medical Disclaimer */}
        <div className={`flex flex-col gap-2 text-xs ${text}`}>
          <h4 className={`text-sm font-semibold uppercase tracking-wider mb-1 ${heading}`}>
            Safety Notice
          </h4>
          <p className="text-[11px] leading-relaxed">
            RecoveryAI is an AI supportive tool and does not replace medical diagnosis,
            psychiatric care, or emergency services. In a life-threatening emergency,
            call 911 or 988 immediately.
          </p>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span className={`text-xs ${text}`}>
          © 2026 RecoveryAI Platform. Built for Google PromptWars Hackathon.
        </span>
        <span className={`text-xs ${text}`}>
          Made with ❤️ by Harish P.G. for compassionate AI healthcare
        </span>
      </div>
    </footer>
  );
};
