'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-mono uppercase tracking-wider text-[#8390A5]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-[#8390A5] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-black/60 border border-[rgba(52,245,230,0.2)] rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-[#4A5568] font-sans transition-all duration-200 focus:outline-none focus:border-[#34F5E6] focus:ring-1 focus:ring-[#34F5E6]',
            icon && 'pl-10',
            error && 'border-[#FF6478] focus:border-[#FF6478] focus:ring-[#FF6478]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#FF6478] font-mono">{error}</p>}
    </div>
  );
}
