'use client';

import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'CRITICAL ALERT: OOMKilled in payment-gateway-api',
    time: '5 mins ago',
    type: 'critical',
    message: 'Memory consumption reached 98% threshold. Automated fix vector generated.',
  },
  {
    id: 2,
    title: 'FIX APPLIED: PostgreSQL Connection Pool Reset',
    time: '18 mins ago',
    type: 'success',
    message: 'Stale idle transactions killed successfully. Latency returned to 42ms.',
  },
  {
    id: 3,
    title: 'SYSTEM UPDATE: Memory Vector Model Synced',
    time: '1 hour ago',
    type: 'info',
    message: 'Model gpt-4o-mini re-indexed 42 historical incident runbooks.',
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-[rgba(52,245,230,0.12)] pb-6">
        <h1 className="font-mono text-2xl font-bold tracking-widest text-white">ALERT CENTER & NOTIFICATIONS</h1>
        <p className="font-mono text-xs text-[#8390A5] mt-1">REAL-TIME CLUSTER ALERTS & AUTOMATED ACTION LOGS</p>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((n) => (
          <Card key={n.id} glow className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
              {n.type === 'critical' ? (
                <ShieldAlert className="w-5 h-5 text-[#FF6478]" />
              ) : n.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-[#22F2B4]" />
              ) : (
                <Info className="w-5 h-5 text-[#78D7FF]" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white">{n.title}</h3>
                <span className="font-mono text-[10px] text-[#8390A5]">{n.time}</span>
              </div>
              <p className="text-xs text-[#B8C6D8]">{n.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
