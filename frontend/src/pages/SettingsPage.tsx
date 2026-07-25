import React from 'react';
import { Settings, Volume2, Sun, Moon, Type, Shield, Trash2, Download, Check } from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';
import { useVoice } from '../context/VoiceContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, resetAllData, showToast, checkIns, emergencyContacts } = useRecovery();
  const { voices, selectedVoice, setSelectedVoice, voiceSpeed, setVoiceSpeed, voicePitch, setVoicePitch } = useVoice();

  const handleExportData = () => {
    const exportObj = {
      timestamp: new Date().toISOString(),
      checkIns,
      emergencyContacts,
      preferences,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RecoveryAI-Data-Export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data exported successfully', 'success');
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Feature 10: Preferences & Accessibility</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Settings & Customization</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Configure SpeechSynthesis TTS voices, large typography, high contrast modes, and manage your local data privacy.
        </p>
      </div>

      {/* Voice & Speech Synthesis Settings */}
      <Card glowColor="indigo" className="space-y-6">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-400" />
          Voice AI Speech Synthesis Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voice Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select TTS Voice:</label>
            <select
              value={selectedVoice}
              onChange={e => setSelectedVoice(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name} className="bg-slate-900 text-white">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Speech Rate Speed ({voiceSpeed}x)</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.1"
              value={voiceSpeed}
              onChange={e => setVoiceSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </Card>

      {/* Accessibility & Visual Controls */}
      <Card glowColor="teal" className="space-y-6">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Type className="w-5 h-5 text-teal-400" />
          Accessibility & Cognitive Load Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Large Typography Toggle */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Large Typography</span>
              <p className="text-xs text-slate-400">Increase font sizes for cognitive ease</p>
            </div>
            <button
              onClick={() => updatePreferences({ largeFont: !preferences.largeFont })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${preferences.largeFont ? 'bg-teal-500' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.largeFont ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Auto Speak Responses */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Auto Speak AI Responses</span>
              <p className="text-xs text-slate-400">Read AI coach replies aloud automatically</p>
            </div>
            <button
              onClick={() => updatePreferences({ autoSpeak: !preferences.autoSpeak })}
              className={`w-12 h-6 rounded-full transition-colors p-1 ${preferences.autoSpeak ? 'bg-indigo-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.autoSpeak ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </Card>

      {/* Data Privacy & Reset */}
      <Card glowColor="rose" className="space-y-4 border-rose-500/30 bg-rose-950/10">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-400" />
          Data Privacy & Storage
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          RecoveryAI operates in anonymous guest mode. Your check-in history, contacts, and journal entries are stored strictly in your browser's local persistent storage. No login required.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4 text-indigo-400" />}
          >
            Export All Recovery Data (JSON)
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all local check-ins and preferences?")) {
                resetAllData();
              }
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear Local Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
