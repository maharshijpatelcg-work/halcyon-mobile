import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ children, className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-[rgba(52,245,230,0.18)] bg-[rgba(8,12,30,0.65)] backdrop-blur-md p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-200',
        glow && 'hover:border-[rgba(52,245,230,0.45)] hover:shadow-[0_0_30px_rgba(52,245,230,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
