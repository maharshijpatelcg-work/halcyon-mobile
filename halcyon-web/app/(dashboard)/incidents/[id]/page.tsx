'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Brain, Terminal, Copy, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useIncidentStore } from '@/store/useIncidentStore';
import { formatDate, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { incidents, resolveIncident } = useIncidentStore();

  const incident = incidents.find((i) => i.id === params.id) || incidents[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-xs font-mono text-[#8390A5] hover:text-[#34F5E6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO INCIDENT FEED
        </button>

        <div className="flex items-center gap-3">
          {incident.status !== 'RESOLVED' && (
            <Button variant="secondary" onClick={() => resolveIncident(incident.id)}>
              <CheckCircle className="w-4 h-4 mr-1" /> MARK RESOLVED
            </Button>
          )}
          <Button variant="primary" onClick={() => handleCopy(incident.aiSuggestedFix)}>
            <Copy className="w-4 h-4 mr-1" /> COPY FIX COMMAND
          </Button>
        </div>
      </div>

      {/* Incident Header Info */}
      <Card glow className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={incident.severity === 'CRITICAL' ? 'critical' : 'warning'}>{incident.severity}</Badge>
              <span className="font-mono text-sm font-bold text-[#34F5E6]">{incident.id}</span>
              <span className="font-mono text-xs text-[#8390A5]">• {incident.service}</span>
            </div>
            <h1 className="text-xl font-bold font-sans text-white">{incident.title}</h1>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs border-l border-white/10 pl-6">
            <div>
              <p className="text-[#8390A5]">MATCH CONFIDENCE</p>
              <p className="text-lg font-bold text-[#34F5E6]">{incident.memoryMatchPercentage}%</p>
            </div>
            <div>
              <p className="text-[#8390A5]">EST. SAVED</p>
              <p className="text-lg font-bold text-[#22F2B4]">{formatCurrency(incident.costSavedUSD)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Root Cause & Suggested Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4 border-[#34F5E6]/40 shadow-[0_0_25px_rgba(52,245,230,0.15)]">
          <div className="flex items-center gap-2 text-[#34F5E6]">
            <Brain className="w-5 h-5" />
            <h2 className="font-mono text-sm font-bold tracking-wider text-white">AI ROOT CAUSE DIAGNOSIS</h2>
          </div>
          <p className="text-sm text-[#B8C6D8] leading-relaxed font-sans">{incident.rootCause}</p>
          <div className="p-4 rounded-lg bg-black/60 border border-white/10 space-y-2">
            <span className="font-mono text-[10px] text-[#8390A5] uppercase tracking-wider">CORRELATED MEMORY FIX ID</span>
            <p className="font-mono text-xs text-[#34F5E6] font-bold">{incident.matchedFixId} (100% vector alignment)</p>
          </div>
        </Card>

        <Card className="space-y-4 border-[#34F5E6]/40 shadow-[0_0_25px_rgba(52,245,230,0.15)]">
          <div className="flex items-center gap-2 text-[#34F5E6]">
            <Terminal className="w-5 h-5" />
            <h2 className="font-mono text-sm font-bold tracking-wider text-white">PROPOSED MITIGATION VECTOR</h2>
          </div>
          <div className="p-4 rounded-lg bg-black/80 border border-[#34F5E6]/40 font-mono text-xs text-[#34F5E6]">
            <code>{incident.aiSuggestedFix}</code>
          </div>
          <p className="text-xs text-[#8390A5] leading-relaxed font-sans">
            Executing this vector will automatically adjust JVM memory boundaries and scale replica sets to mitigate heap exhaustion.
          </p>
        </Card>
      </div>

      {/* Real-time Incident Logs Terminal */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#34F5E6]" />
            <h2 className="font-mono text-sm font-bold text-white tracking-wider">LIVE CLUSTER LOGS & STACK TRACE</h2>
          </div>
          <Badge variant="cyan">LOG STREAMING ACTIVE</Badge>
        </div>

        <div className="p-4 rounded-lg bg-black border border-white/10 font-mono text-xs space-y-2 text-[#B8C6D8] max-h-72 overflow-y-auto">
          {incident.logs.map((log, idx) => (
            <div key={idx} className="hover:bg-white/5 p-1 rounded transition-colors">
              {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
