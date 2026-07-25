import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecovery } from '../context/RecoveryContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

/**
 * ToastContainer Component
 * 
 * Floating toast notification display container supporting info, success,
 * warning, and error status types with Framer Motion slide-in animations.
 * 
 * @component
 * @returns {React.ReactElement} Floating notification container element
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRecovery();

  const iconMap = {
    info: <Info className="w-5 h-5 text-indigo-400" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
  };

  const borderMap = {
    info: 'border-indigo-500/30 bg-indigo-950/40',
    success: 'border-emerald-500/30 bg-emerald-950/40',
    warning: 'border-amber-500/30 bg-amber-950/40',
    error: 'border-rose-500/30 bg-rose-950/40',
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notification Messages"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl shadow-xl text-slate-100 ${borderMap[toast.type]}`}
          >
            <div className="flex items-center gap-3">
              {iconMap[toast.type]}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
