'use client';

import React from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[rgba(52,245,230,0.12)] pb-6">
        <h1 className="font-mono text-2xl font-bold tracking-widest text-white">OPERATOR PROFILE</h1>
        <p className="font-mono text-xs text-[#8390A5] mt-1">USER ACCOUNT, AUTHENTICATION ROLES & SECURITY</p>
      </div>

      <Card glow className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#34F5E6] bg-[#34F5E6]/10 flex items-center justify-center text-[#34F5E6] font-mono text-xl font-bold">
            {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'HE'}
          </div>
          <div>
            <h2 className="font-sans text-xl font-bold text-white">{user?.displayName || 'PRINCIPAL SRE ENGINEER'}</h2>
            <p className="font-mono text-xs text-[#8390A5]">{user?.email || 'sre@halcyon.ai'}</p>
            <div className="mt-2">
              <Badge variant="cyan">PRINCIPAL OPERATOR ROLE</Badge>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10 font-mono text-xs pt-4">
          <div className="py-3 flex justify-between">
            <span className="text-[#8390A5]">AUTHENTICATION PROVIDER</span>
            <span className="text-white font-bold">{user?.providerId || 'google.com'}</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-[#8390A5]">FIREBASE UID</span>
            <span className="text-[#34F5E6]">{user?.uid || 'usr-halcyon-engineer-01'}</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-[#8390A5]">MFA SECURITY STATUS</span>
            <span className="text-[#22F2B4] font-bold">HARDWARE KEY VERIFIED</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
