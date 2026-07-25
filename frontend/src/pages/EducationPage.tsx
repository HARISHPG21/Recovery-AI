import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import { EducationArticle } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useRecovery } from '../context/RecoveryContext';

export const EducationPage: React.FC = () => {
  const { showToast } = useRecovery();
  const [query, setQuery] = useState('');
  const [article, setArticle] = useState<EducationArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Withdrawal Symptoms',
    'Relapse Prevention',
    'Coping Techniques',
    'Therapy Options',
    'Family Support'
  ];

  const handleSearch = async (searchTopic?: string) => {
    const topicToSearch = searchTopic || query;
    if (!topicToSearch.trim() || isLoading) return;

    setIsLoading(true);
    showToast(`Querying Gemini Recovery Knowledge Base for '${topicToSearch}'...`, 'info');

    try {
      const res = await apiService.searchEducation(topicToSearch);
      setArticle(res);
      showToast('Education topic loaded', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch education details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>Feature 4: AI Recovery Education Hub</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white font-outfit">Interactive Education Hub</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Explore evidence-based recovery science, neurological healing insights, and actionable coping mechanisms powered by Gemini.
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(cat);
              handleSearch(cat);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 border border-slate-700/60 text-slate-200 hover:text-white hover:border-teal-500/50 hover:bg-teal-500/10 transition-all"
          >
            📚 {cat}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="glass-card p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Ask anything (e.g. How does neuroplasticity help recovery?)..."
          className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-400 focus:outline-none"
        />
        <Button
          variant="teal"
          size="md"
          onClick={() => handleSearch()}
          isLoading={isLoading}
        >
          Search AI
        </Button>
      </div>

      {/* Article Output View */}
      {article && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Article Header Card */}
          <Card glowColor="teal" className="space-y-4 bg-slate-900/80 border border-teal-500/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Topic: {article.topic}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Evidence-Based Recovery Guide</span>
            </div>

            <div className="text-slate-200 text-sm leading-relaxed space-y-3 whitespace-pre-line font-normal">
              {article.overview}
            </div>
          </Card>

          {/* Key Takeaways & Actionable Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <Card glowColor="indigo" className="space-y-3">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Key Neurological Takeaways
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {article.key_takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Actionable Strategies */}
            <Card glowColor="teal" className="space-y-3">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Actionable Coping Strategies
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                {article.actionable_strategies.map((strat, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    <span>{strat}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* When to Seek Clinical Help */}
          <Card glowColor="rose" className="bg-rose-950/20 border-rose-500/30 space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              When to Seek Professional Medical Care
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {article.when_to_seek_help}
            </p>
          </Card>

          {/* Related Topics */}
          {article.related_topics && article.related_topics.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Related Education Topics:
              </span>
              <div className="flex flex-wrap gap-2">
                {article.related_topics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(t);
                      handleSearch(t);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs bg-slate-900/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-indigo-400 transition-all flex items-center gap-1.5"
                  >
                    <span>{t}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
