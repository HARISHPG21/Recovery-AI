import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  PhoneCall,
  Sparkles,
  Music,
  Smile,
  BookOpen,
  Plus,
  Trash2,
  Heart,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const ToolkitPage: React.FC = () => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, showToast } = useRecovery();

  const [activeTab, setActiveTab] = useState<'contacts' | 'affirmations' | 'distractions' | 'journal'>('contacts');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [savedJournalLogs, setSavedJournalLogs] = useState<Array<{ id: string; date: string; text: string }>>([
    { id: '1', date: new Date().toLocaleDateString(), text: 'Focused on 4-4-6 breathing today. Felt very calm after my morning walk.' }
  ]);

  const affirmations = [
    "I am stronger than any temporary craving wave.",
    "My recovery is built one breath and one moment at a time.",
    "I forgive my past and actively create a healthy future.",
    "I have the right to feel calm, safe, and supported.",
    "My self-worth is independent of temporary emotional spikes."
  ];
  const [currentAffirmationIdx, setCurrentAffirmationIdx] = useState(0);

  const healthyDistractions = [
    { title: 'Ice Cube Sensory Reset', desc: 'Hold an ice cube in your hand until it melts completely while focusing on the cold sensation.' },
    { title: '3-Minute Brisk Walk', desc: 'Step outside or move briskly around your space to shift physical energy.' },
    { title: 'Brain Puzzle / Counting', desc: 'Count backwards from 100 by 7s out loud (100, 93, 86, 79...).' },
    { title: 'Calming Ambient Audio', desc: 'Listen to 432Hz frequency ocean waves or rainfall audio.' }
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      showToast('Please fill in contact name and phone number.', 'warning');
      return;
    }
    addEmergencyContact({
      name: newContactName,
      relation: newContactRelation || 'Support Lead',
      phone: newContactPhone,
    });
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
  };

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;
    setSavedJournalLogs(prev => [
      { id: Math.random().toString(36).substring(2, 9), date: new Date().toLocaleDateString(), text: journalEntry },
      ...prev
    ]);
    setJournalEntry('');
    showToast('Journal entry saved', 'success');
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>Feature 8: Recovery Toolkit</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Personal Recovery Toolkit</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Manage your emergency contacts, generate daily affirmations, explore sensory distractions, and log personal reflections.
        </p>
      </div>

      {/* Toolkit Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'contacts', label: 'Emergency Contacts', icon: PhoneCall },
          { id: 'affirmations', label: 'Daily Affirmations', icon: Sparkles },
          { id: 'distractions', label: 'Healthy Distractions', icon: Smile },
          { id: 'journal', label: 'Personal Journal', icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-white/5 border border-slate-700/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <Card glowColor="indigo" className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Support & Caregiver Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map(c => (
                <div key={c.id} className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{c.name}</span>
                      {c.isPrimary && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{c.relation}</div>
                    <a href={`tel:${c.phone}`} className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      {c.phone}
                    </a>
                  </div>
                  {!c.isPrimary && (
                    <button
                      onClick={() => removeEmergencyContact(c.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Contact Form */}
            <form onSubmit={handleAddContact} className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Add New Support Contact:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Sponsor)"
                  value={newContactRelation}
                  onChange={e => setNewContactRelation(e.target.value)}
                  className="bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className="bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Button type="submit" variant="teal" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Save Contact
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Tab 2: Affirmations */}
      {activeTab === 'affirmations' && (
        <Card glowColor="teal" className="text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Daily Affirmation</span>
            <h3 className="text-2xl font-extrabold text-white font-outfit italic">
              "{affirmations[currentAffirmationIdx]}"
            </h3>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentAffirmationIdx((currentAffirmationIdx + 1) % affirmations.length)}
          >
            Next Affirmation
          </Button>
        </Card>
      )}

      {/* Tab 3: Distractions */}
      {activeTab === 'distractions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthyDistractions.map((d, i) => (
            <Card key={i} glowColor="indigo" className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Smile className="w-4 h-4" />
                <span>{d.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{d.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <Card glowColor="indigo" className="space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit">Personal Recovery Journal</h3>
            <textarea
              rows={4}
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="Write your reflections, breakthroughs, or thoughts here..."
              className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <Button variant="teal" size="md" onClick={handleSaveJournal}>
              Save Journal Entry
            </Button>
          </Card>

          {/* Saved Journal Entries */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Saved Entries:</span>
            {savedJournalLogs.map(log => (
              <div key={log.id} className="glass-card p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400">{log.date}</span>
                <p className="text-xs text-slate-200 leading-relaxed">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
