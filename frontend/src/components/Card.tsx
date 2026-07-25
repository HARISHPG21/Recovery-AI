import React from 'react';
import { motion } from 'framer-motion';

/**
 * Interface props for the Card component.
 */
export interface CardProps {
  /** Node contents of the card container */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Whether hover animations and borders are enabled */
  hoverEffect?: boolean;
  /** Ambient glow accent color */
  glowColor?: 'indigo' | 'teal' | 'rose' | 'amber';
  /** Optional click event callback */
  onClick?: () => void;
}

/**
 * Card Component
 * 
 * Reusable glassmorphism card container with subtle ambient glow highlights,
 * framer-motion entry animations, and responsive interactive hover states.
 * 
 * @component
 * @param {CardProps} props - Component properties
 * @returns {React.ReactElement} Animated glass card element
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'indigo',
  onClick,
}) => {
  const glowMap = {
    indigo: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
    teal: 'hover:border-teal-500/40 hover:shadow-teal-500/10',
    rose: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? `glass-card-hover ${glowMap[glowColor]}` : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
