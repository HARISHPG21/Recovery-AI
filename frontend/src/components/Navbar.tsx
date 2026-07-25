import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, Mic, Menu, X, Sparkles, HeartHandshake } from 'lucide-react';
import { Button } from './Button';
import { useRecovery } from '../context/RecoveryContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { preferences } = useRecovery();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/coach', label: 'AI Voice Coach' },
    { path: '/checkin', label: 'Daily Check-In' },
    { path: '/caregiver', label: 'Caregiver Guide' },
    { path: '/education', label: 'Education' },
    { path: '/toolkit', label: 'Toolkit' },
    { path: '/progress', label: 'Progress' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-outfit">
                Recovery<span className="text-indigo-400">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                GenAI v1.0
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Your AI Recovery Companion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Voice Coach Button */}
          <Link to="/coach">
            <Button variant="outline" size="sm" leftIcon={<Mic className="w-4 h-4 text-teal-400" />}>
              <span className="hidden sm:inline">Voice Coach</span>
            </Button>
          </Link>

          {/* SOS Emergency Button */}
          <Link to="/emergency">
            <Button variant="danger" size="sm" leftIcon={<AlertCircle className="w-4 h-4" />}>
              <span>SOS Emergency</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
              <div className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white">
                Settings & Accessibility
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
