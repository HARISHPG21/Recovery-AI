import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  AlertOctagon,
  HeartHandshake,
  BookOpen,
  CalendarCheck,
  ShieldAlert,
  Wind,
  Briefcase,
  TrendingUp,
  Settings,
} from 'lucide-react';
import { useRecovery } from '../context/RecoveryContext';

/**
 * Sidebar Component
 * 
 * Desktop lateral navigation panel displaying active route links for all 10 core features,
 * active streak counter badge, and danger-highlighted SOS emergency shortcut.
 * 
 * @component
 * @returns {React.ReactElement} Sidebar navigation component
 */
export const Sidebar: React.FC = () => {
  const { streakDays, isDark } = useRecovery();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard',           icon: LayoutDashboard },
    { path: '/coach',     label: 'AI Voice Coach',      icon: Mic, badge: 'Main' },
    { path: '/emergency', label: 'SOS Emergency',       icon: AlertOctagon, isDanger: true },
    { path: '/checkin',   label: 'Daily Check-In',      icon: CalendarCheck },
    { path: '/caregiver', label: 'Caregiver Guide',     icon: HeartHandshake },
    { path: '/safety',    label: 'Safety Analyzer',     icon: ShieldAlert },
    { path: '/education', label: 'AI Education Hub',    icon: BookOpen },
    { path: '/breathing', label: 'Breathing Exercises', icon: Wind },
    { path: '/toolkit',   label: 'Recovery Toolkit',    icon: Briefcase },
    { path: '/progress',  label: 'Progress & Analytics',icon: TrendingUp },
    { path: '/settings',  label: 'Settings',            icon: Settings },
  ];

  const baseLink = isDark
    ? 'text-slate-300 hover:text-white hover:bg-white/5'
    : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50';

  const activeLink = isDark
    ? 'bg-indigo-600/25 text-white border border-indigo-500/40 shadow-sm'
    : 'bg-indigo-100 text-indigo-700 border border-indigo-300/60 shadow-sm';

  const dangerLink = isDark
    ? 'text-rose-400 hover:bg-rose-500/10'
    : 'text-rose-500 hover:bg-rose-50';

  const activeDangerLink = isDark
    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    : 'bg-rose-100 text-rose-600 border border-rose-300/60';

  return (
    <aside
      className="w-64 glass-panel border-r hidden xl:flex flex-col justify-between py-6 px-4 shrink-0 min-h-[calc(100vh-5rem)]"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      {/* Top Menu Links */}
      <div className="space-y-1">
        <div className={`px-3 pb-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Platform Features
        </div>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? item.isDanger ? activeDangerLink : activeLink
                    : item.isDanger ? dangerLink : baseLink
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.isDanger ? 'text-rose-400' : isDark ? 'text-indigo-400' : 'text-indigo-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Streak Badge */}
      <div className="p-4 rounded-2xl glass-card border border-teal-500/30 bg-teal-950/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30 text-teal-400 font-bold text-lg">
          🔥
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Recovery Streak</span>
          <span className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {streakDays} {streakDays === 1 ? 'Day' : 'Days'} Active
          </span>
        </div>
      </div>
    </aside>
  );
};
