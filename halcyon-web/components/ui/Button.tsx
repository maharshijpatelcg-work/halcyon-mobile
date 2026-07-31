'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-mono uppercase tracking-wider font-semibold rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#34F5E6] text-black hover:bg-[#20E5D5] shadow-[0_0_20px_rgba(52,245,230,0.35)] hover:shadow-[0_0_30px_rgba(52,245,230,0.5)] active:scale-[0.98]',
    secondary: 'bg-black text-white border border-[rgba(52,245,230,0.25)] hover:border-[#34F5E6] hover:text-[#34F5E6] hover:shadow-[0_0_20px_rgba(52,245,230,0.2)] active:scale-[0.98]',
    outline: 'bg-transparent text-white border border-[rgba(255,255,255,0.15)] hover:border-[rgba(52,245,230,0.4)] hover:text-[#34F5E6]',
    danger: 'bg-[#FF6478]/10 text-[#FF6478] border border-[#FF6478]/30 hover:bg-[#FF6478]/20',
    ghost: 'bg-transparent text-[#B8C6D8] hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2.5 gap-2',
    lg: 'text-sm px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
