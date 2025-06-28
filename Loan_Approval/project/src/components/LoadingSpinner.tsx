import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  variant = 'primary',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-neutral-200 border-t-neutral-600',
    white: 'border-white/20 border-t-white'
  };

  if (text) {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-3 ${variantClasses[variant]}`}></div>
        <span className={`
          text-sm font-medium animate-pulse-gentle
          ${variant === 'white' ? 'text-white' : 'text-neutral-600'}
        `}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-3 ${variantClasses[variant]}`}>
        <div className="sr-only">Loading...</div>
      </div>
    </div>
  );
};