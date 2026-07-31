'use client';

import React from 'react';
import { FileText, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_AUDIT_LOGS } from '@/services/mockData';
import { formatDate } from '@/lib/utils';

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">ENTERPRISE AUDIT TRAIL</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">IMMUTABLE COMPLIANCE & MITIGATION ACTIVITY LOGS</p>
        </div>
        <Badge variant="cyan">SOC2 TYPE II COMPLIANT</Badge>
      </div>

      {/* Audit Logs Table Card */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/60 font-mono text-[11px] text-[#8390A5] uppercase tracking-wider">
                <th className="p-4">EVENT ID</th>
                <th className="p-4">ACTION</th>
                <th className="p-4">ACTOR</th>
                <th className="p-4">TARGET SYSTEM</th>
                <th className="p-4">IP ADDRESS</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs text-[#B8C6D8]">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-[#34F5E6] font-bold">{log.id}</td>
                  <td className="p-4 text-white font-semibold">{log.action}</td>
                  <td className="p-4">{log.actor}</td>
                  <td className="p-4 text-[#8390A5]">{log.target}</td>
                  <td className="p-4 text-[#8390A5]">{log.ipAddress}</td>
                  <td className="p-4">
                    <Badge variant={log.status === 'SUCCESS' ? 'success' : 'warning'}>{log.status}</Badge>
                  </td>
                  <td className="p-4 text-[#8390A5]">{formatDate(log.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
