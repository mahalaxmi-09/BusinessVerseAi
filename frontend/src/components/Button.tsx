import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

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
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-text-white border border-transparent shadow-lg shadow-purple-900/20 focus:ring-purple-500/50';
      case 'secondary':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-text-white border border-transparent shadow-lg shadow-cyan-900/20 focus:ring-cyan-500/50';
      case 'outline':
        return 'bg-transparent hover:bg-gray-900/50 text-text-white border border-border-glass focus:ring-purple-500/50';
      case 'glass':
        return 'glass-panel hover:bg-gray-800/40 text-text-white border border-border-glass focus:ring-purple-500/50';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-text-white border border-transparent shadow-lg shadow-rose-900/20 focus:ring-rose-500/50';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-[11px] rounded-lg';
      case 'md':
        return 'px-5 py-2.5 text-xs rounded-xl';
      case 'lg':
        return 'px-7 py-3.5 text-sm rounded-2xl';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </button>
  );
};
