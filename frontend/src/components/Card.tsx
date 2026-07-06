import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  glowColor?: 'purple' | 'cyan' | 'emerald' | 'rose' | 'none';
  className?: string;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = true,
  glowColor = 'none',
  className = '',
  animate = true,
  ...props
}) => {
  const getGlowStyle = () => {
    switch (glowColor) {
      case 'purple':
        return 'group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]';
      case 'cyan':
        return 'group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]';
      case 'emerald':
        return 'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]';
      case 'rose':
        return 'group-hover:border-rose-500/30 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]';
      default:
        return '';
    }
  };

  const classes = `group relative rounded-3xl glass-card overflow-hidden transition-all duration-300 ${
    hoverLift ? 'hover:-translate-y-1' : ''
  } ${getGlowStyle()} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={classes}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
