import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, Mic, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useRecovery } from '../context/RecoveryContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useRecovery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard',  label: 'Dashboard' },
    { path: '/coach',      label: 'AI Coach' },
    { path: '/checkin',    label: 'Check-In' },
    { path: '/caregiver',  label: 'Caregiver' },
    { path: '/education',  label: 'Education' },
    { path: '/toolkit',    label: 'Toolkit' },
    { path: '/progress',   label: 'Progress' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">

        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div
              className="w-full h-full rounded-[10px] sm:rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: isDark ? '#090D16' : '#ffffff' }}
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-xl font-extrabold tracking-tight" style={{ color: isDark ? '#fff' : '#0f172a' }}>
              Recovery<span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:inline">
              Your AI Recovery Companion
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                    : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'border-white/10 text-yellow-300 hover:bg-yellow-400/10 hover:border-yellow-400/30'
                : 'border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            {isDark
              ? <Sun  className="w-4 h-4 sm:w-5 sm:h-5" />
              : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            }
          </button>

          {/* Voice Coach */}
          <Link to="/coach" className="hidden sm:block">
            <Button variant="outline" size="sm" leftIcon={<Mic className="w-4 h-4 text-teal-400" />}>
              <span className="hidden md:inline">Voice Coach</span>
            </Button>
          </Link>

          {/* SOS */}
          <Link to="/emergency">
            <Button variant="danger" size="sm" leftIcon={<AlertCircle className="w-4 h-4" />}>
              <span className="hidden xs:inline sm:inline">SOS</span>
            </Button>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(open => !open)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden glass-panel border-t px-4 pt-3 pb-6 flex flex-col gap-2 animate-fade-in"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.14)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobile}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                  : isDark
                    ? 'text-slate-300 hover:bg-white/5'
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)' }}>
            {/* Mobile Voice Coach */}
            <Link to="/coach" onClick={closeMobile}>
              <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                isDark ? 'text-teal-300 hover:bg-teal-500/10' : 'text-teal-600 hover:bg-teal-50'
              }`}>
                <Mic className="w-4 h-4" /> Voice Coach
              </div>
            </Link>
            <Link to="/settings" onClick={closeMobile}>
              <div className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}>
                Settings & Accessibility
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
