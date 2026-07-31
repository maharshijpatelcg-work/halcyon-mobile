'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  ShieldAlert, 
  Brain, 
  FileText, 
  BarChart3, 
  Github, 
  Settings, 
  User, 
  Bell, 
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Incident Feed', href: '/incidents', icon: ShieldAlert },
  { name: 'Knowledge Base', href: '/knowledge', icon: Brain },
  { name: 'Audit Trail', href: '/audit', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'GitHub Integration', href: '/github', icon: Github },
  { name: 'Alert Center', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-64 border-r border-[rgba(52,245,230,0.18)] bg-black flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-[rgba(52,245,230,0.12)]">
          <div className="w-9 h-9 rounded-lg bg-[#34F5E6]/10 border border-[#34F5E6]/40 flex items-center justify-center shadow-[0_0_15px_rgba(52,245,230,0.3)]">
            <Zap className="w-5 h-5 text-[#34F5E6]" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold text-white tracking-widest">HALCYON</h1>
            <p className="text-[10px] font-mono text-[#34F5E6] tracking-wider">AI INCIDENT MEMORY</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-mono text-xs tracking-wider font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#34F5E6]/10 text-[#34F5E6] border border-[#34F5E6]/30 shadow-[0_0_15px_rgba(52,245,230,0.15)]'
                    : 'text-[#8390A5] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#34F5E6]' : 'text-[#8390A5]')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[rgba(52,245,230,0.12)]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-mono text-xs text-[#FF6478] hover:bg-[#FF6478]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>DISCONNECT</span>
        </button>
      </div>
    </aside>
  );
}
