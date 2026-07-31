'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 border-b border-[rgba(52,245,230,0.18)] bg-black/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      {/* System Status Banner */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34F5E6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34F5E6]"></span>
          </span>
          <span className="font-mono text-xs text-white font-semibold tracking-wider">CLUSTER: PROD-US-EAST</span>
        </div>
        <Badge variant="cyan">AI MEMORY ACTIVE</Badge>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#8390A5] hover:text-[#34F5E6] hover:border-[#34F5E6]/40 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6478] rounded-full"></span>
        </Link>

        <div className="h-4 w-px bg-white/10"></div>

        <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full border border-[#34F5E6]/40 bg-[#34F5E6]/10 flex items-center justify-center text-[#34F5E6] font-mono text-xs font-bold">
            {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'HE'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-mono text-white font-semibold truncate max-w-[140px]">
              {user?.displayName || 'OPERATOR'}
            </p>
            <p className="text-[10px] font-mono text-[#8390A5] truncate max-w-[140px]">
              {user?.email || 'sre@halcyon.ai'}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
