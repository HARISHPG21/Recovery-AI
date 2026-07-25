import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

/**
 * Interface props for the Button component.
 */
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Button text or inner elements */
  children: React.ReactNode;
  /** Color variant style */
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'teal';
  /** Button size padding and typography scale */
  size?: 'sm' | 'md' | 'lg';
  /** Shows an animated loading spinner when true */
  isLoading?: boolean;
  /** Optional icon element displayed to the left of label */
  leftIcon?: React.ReactNode;
  /** Optional icon element displayed to the right of label */
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * 
 * Accessible, animated interactive button with Framer Motion tactile feedback,
 * loading state spinner, icon slots, and theme-compliant color variants.
 * 
 * @component
 * @param {ButtonProps} props - Component properties
 * @returns {React.ReactElement} Motion button element
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30',
    teal: 'bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/25 border border-teal-400/30',
    danger: 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white shadow-lg shadow-rose-500/30 border border-rose-400/30 animate-pulse-slow',
    secondary: 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700/60 backdrop-blur-md',
    outline: 'bg-transparent border border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10 text-slate-200',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  );
};
