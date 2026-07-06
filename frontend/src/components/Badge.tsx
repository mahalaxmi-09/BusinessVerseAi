import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'gray';
  size?: 'xs' | 'sm';
  outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'xs',
  outline = true
}) => {
  const getVariantStyles = () => {
    if (outline) {
      switch (variant) {
        case 'purple': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        case 'cyan': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
        case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'amber': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'rose': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        case 'gray': return 'bg-gray-500/10 text-text-muted border border-border-glass';
      }
    } else {
      switch (variant) {
        case 'purple': return 'bg-purple-600 text-text-white';
        case 'cyan': return 'bg-cyan-600 text-text-white';
        case 'emerald': return 'bg-emerald-600 text-text-white';
        case 'amber': return 'bg-amber-600 text-text-white';
        case 'rose': return 'bg-rose-600 text-text-white';
        case 'gray': return 'bg-gray-800 text-text-white';
      }
    }
  };

  const sizeStyles = size === 'xs' ? 'text-[8px] px-1.5 py-0.25 font-extrabold uppercase tracking-wider rounded' : 'text-[10px] px-2 py-0.5 font-bold rounded-full';

  return (
    <span className={`inline-flex items-center justify-center font-sans ${getVariantStyles()} ${sizeStyles}`}>
      {children}
    </span>
  );
};
