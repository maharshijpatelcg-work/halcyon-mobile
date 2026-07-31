import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'critical' | 'warning' | 'success' | 'outline' | 'slate';
  className?: string;
}

export function Badge({ children, variant = 'cyan', className }: BadgeProps) {
  const styles = {
    cyan: 'bg-[#34F5E6]/10 text-[#34F5E6] border border-[#34F5E6]/30',
    critical: 'bg-[#FF6478]/10 text-[#FF6478] border border-[#FF6478]/30',
    warning: 'bg-[#FFB648]/10 text-[#FFB648] border border-[#FFB648]/30',
    success: 'bg-[#22F2B4]/10 text-[#22F2B4] border border-[#22F2B4]/30',
    outline: 'bg-transparent text-white border border-white/20',
    slate: 'bg-white/5 text-[#B8C6D8] border border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
