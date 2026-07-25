import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertOctagon,
  PhoneCall,
  Volume2,
  Copy,
  Share2,
  Download,
  CheckCircle,
  Wind,
  ShieldCheck,
  Send,
  Sparkles,
  Check
} from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';
import { useVoice } from '../context/VoiceContext';
import { apiService } from '../services/api';
import { EmergencyScript } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const EmergencyPage: React.FC = () => {
  const { emergencyContacts, showToast } = useRecovery();
  const { speakText, stopSpeaking, isSpeaking } = useVoice();

  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<EmergencyScript | null>(null);
  const [triggerReason, setTriggerReason] = useState('Acute craving surge');
  const [copied, setCopied] = useState(false);

  const primaryContact = emergencyContacts.find(c => c.isPrimary) || emergencyContacts[0];

  const handleTriggerSOS = async () => {
    setIsLoading(true);
    showToast('Generating personalized SOS emergency script with Gemini...', 'warning');

    try {
      const res = await apiService.triggerEmergency(
        triggerReason,
        'Friend',
        primaryContact ? primaryContact.name : 'Trusted Support'
      );
      setScript(res);
      showToast('Personalized emergency script ready!', 'success');

      // Auto-read emergency message aloud
      speakText(res.emergency_message);
    } catch (err) {
      console.error(err);
      showToast('Failed to generate script. Displaying standard crisis protocol.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    if (!script) return;
    const fullText = `EMERGENCY RECOVERY SCRIPT\n\n${script.emergency_message}\n\nCOPING CHECKLIST:\n${script.coping_checklist.join('\n')}\n\nTRUSTED CONTACT MESSAGE:\n${script.trusted_person_message}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Emergency script copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareScript = async () => {
    if (!script) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RecoveryAI Emergency Script',
          text: script.trusted_person_message,
        });
        showToast('Shared successfully', 'success');
      } catch (e) {
        console.log(e);
      }
    } else {
      handleCopyScript();
    }
  };

  const handleDownloadScript = () => {
    if (!script) return;
    const fullText = `RECOVERYAI EMERGENCY SCRIPT\nDate: ${new Date().toLocaleString()}\n\n${script.emergency_message}\n\nCOPING CHECKLIST:\n${script.coping_checklist.join('\n')}\n\nBREATHING GUIDE:\n${script.breathing_instructions}\n\nSMS TO TRUSTED CONTACT:\n${script.trusted_person_message}\n\nPANIC INTERVENTION:\n${script.panic_intervention}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RecoveryAI-Emergency-Script-${Date.now()}.txt`;
    link.click();
    showToast('Downloaded script as text file', 'success');
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Feature 2: Emergency SOS Mode</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Personalized Emergency Script</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Tap the SOS button to instantly generate a life-saving cognitive reset script, coping steps, and trusted contact alert.
        </p>
      </div>

      {/* Main SOS Trigger Button */}
      {!script && (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTriggerSOS}
            disabled={isLoading}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-1 shadow-2xl shadow-rose-500/50 cursor-pointer flex items-center justify-center group animate-pulse-slow"
          >
            <div className="w-full h-full bg-[#090D16] rounded-full flex flex-col items-center justify-center gap-2 group-hover:bg-slate-950 transition-colors">
              <AlertOctagon className="w-16 h-16 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black text-white font-outfit uppercase tracking-wider">
                TRIGGER SOS
              </span>
            </div>
          </motion.button>
          <span className="text-xs text-slate-400 mt-6 font-medium">
            Single Tap • Zero Typing • Gemini Powered
          </span>
        </div>
      )}

      {/* Emergency Output Script View */}
      {script && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Action Toolbar */}
          <div 
            className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-rose-500/40 bg-rose-950/20"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>SOS Script Active</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyScript}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareScript}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speakText(script.emergency_message)}
                leftIcon={<Volume2 className="w-4 h-4 text-teal-400" />}
              >
                Speak Aloud
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadScript}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTriggerSOS}
                leftIcon={<Sparkles className="w-4 h-4 text-indigo-400" />}
              >
                Regenerate
              </Button>
            </div>
          </div>

          {/* Emergency Affirmation Card */}
          <Card glowColor="rose" className="border-rose-500/40 bg-rose-950/30 space-y-3">
            <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">
              Personal Emergency Message
            </h3>
            <p className="text-lg font-bold text-white leading-relaxed">
              "{script.emergency_message}"
            </p>
          </Card>

          {/* Checklist & Breathing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coping Checklist */}
            <Card glowColor="indigo" className="space-y-3">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Coping Action Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {script.coping_checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Breathing & Panic Reset */}
            <Card glowColor="teal" className="space-y-3">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Panic Reset & Breathing
              </h3>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-300">4-4-6 Guide:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{script.breathing_instructions}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-2">
                <span className="text-xs font-bold text-teal-300">Cognitive Reset:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{script.panic_intervention}</p>
              </div>
            </Card>
          </div>

          {/* Ready SMS to Support Contact */}
          <Card glowColor="amber" className="space-y-3 bg-amber-950/20 border-amber-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4" />
                Ready-To-Send SMS for Support Contact
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(script.trusted_person_message);
                  showToast('SMS script copied', 'success');
                }}
              >
                Copy SMS Text
              </Button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-amber-200 border border-amber-500/20">
              "{script.trusted_person_message}"
            </div>
          </Card>
        </motion.div>
      )}

      {/* Immediate Helpline Cards */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white font-outfit">Direct 24/7 Crisis Helplines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="tel:988"
            className="glass-card p-4 rounded-2xl border border-rose-500/30 hover:border-rose-400 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">988 Suicide & Crisis</div>
              <div className="text-xs text-rose-400 font-semibold">Call or Text 988</div>
            </div>
          </a>

          <a
            href="tel:1-800-662-4357"
            className="glass-card p-4 rounded-2xl border border-teal-500/30 hover:border-teal-400 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">SAMHSA Helpline</div>
              <div className="text-xs text-teal-400 font-semibold">1-800-662-4357</div>
            </div>
          </a>

          <a
            href="sms:741741?body=HOME"
            className="glass-card p-4 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Crisis Text Line</div>
              <div className="text-xs text-indigo-400 font-semibold">Text HOME to 741741</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
