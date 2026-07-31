'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Brain, 
  Zap, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_METRICS, MOCK_INCIDENTS } from '@/services/mockData';
import { formatCurrency } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const TIMELINE_DATA = [
  { time: '08:00', incidents: 1, latency: 38, mttr: 12 },
  { time: '09:00', incidents: 2, latency: 45, mttr: 10 },
  { time: '10:00', incidents: 4, latency: 82, mttr: 14 },
  { time: '11:00', incidents: 2, latency: 51, mttr: 8 },
  { time: '12:00', incidents: 3, latency: 42, mttr: 6 },
  { time: '13:00', incidents: 1, latency: 39, mttr: 5 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">OPERATOR CONTROL DASHBOARD</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">REAL-TIME INCIDENT MEMORY & AUTONOMOUS RESOLUTION VECTOR</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/incidents">
            <Button variant="secondary">
              <ShieldAlert className="w-4 h-4 mr-1" /> VIEW INCIDENT FEED
            </Button>
          </Link>
          <Link href="/knowledge">
            <Button variant="primary">
              <Brain className="w-4 h-4 mr-1" /> MEMORY SEARCH
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glow className="space-y-2">
          <div className="flex items-center justify-between text-[#8390A5]">
            <span className="font-mono text-xs uppercase tracking-wider">ACTIVE INCIDENTS</span>
            <ShieldAlert className="w-4 h-4 text-[#FF6478]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">{MOCK_METRICS.activeIncidents}</span>
            <span className="text-xs font-mono text-[#FF6478] flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> CRITICAL
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">3 services requiring mitigation</p>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between text-[#8390A5]">
            <span className="font-mono text-xs uppercase tracking-wider">AI CONFIDENCE SCORE</span>
            <Brain className="w-4 h-4 text-[#34F5E6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#34F5E6]">{MOCK_METRICS.aiConfidenceScore}%</span>
            <span className="text-xs font-mono text-[#22F2B4]">OPTIMAL</span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">94.2% historical match precision</p>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between text-[#8390A5]">
            <span className="font-mono text-xs uppercase tracking-wider">AVG SYSTEM LATENCY</span>
            <Clock className="w-4 h-4 text-[#78D7FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">{MOCK_METRICS.averageLatencyMs}ms</span>
            <span className="text-xs font-mono text-[#22F2B4]">-14% vs avg</span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">99.98% cluster uptime</p>
        </Card>

        <Card glow className="space-y-2">
          <div className="flex items-center justify-between text-[#8390A5]">
            <span className="font-mono text-xs uppercase tracking-wider">TOTAL COST SAVED</span>
            <DollarSign className="w-4 h-4 text-[#22F2B4]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#22F2B4]">
              {formatCurrency(MOCK_METRICS.totalCostSavedUSD)}
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">Downtime MTTR prevention value</p>
        </Card>
      </div>

      {/* Interactive Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono text-sm font-bold text-white tracking-wider">INCIDENT METRICS & LATENCY TIMELINE</h2>
              <p className="font-mono text-xs text-[#8390A5] mt-0.5">Real-time incident frequency vs cluster response latency (ms)</p>
            </div>
            <Badge variant="cyan">LIVE RECHARTS INTEGRATION</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_DATA}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34F5E6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34F5E6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#8390A5" fontSize={11} tickLine={false} />
                <YAxis stroke="#8390A5" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#080C1E', borderColor: 'rgba(52,245,230,0.3)', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#34F5E6" fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* System Health Gauge */}
        <Card className="space-y-6">
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">SYSTEM HEALTH MATRIX</h2>
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[#8390A5]">CLUSTER HEALTH</span>
              <span className="text-[#22F2B4] font-bold">HEALTHY (99.98%)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[#8390A5]">AI MEMORY ENGINE</span>
              <span className="text-[#34F5E6] font-bold">SYNCHRONIZED</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[#8390A5]">GITHUB WEBHOOKS</span>
              <span className="text-[#22F2B4] font-bold">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/10">
              <span className="text-[#8390A5]">OPENAI VECTOR MODEL</span>
              <span className="text-[#34F5E6] font-bold">gpt-4o-mini ACTIVE</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Incidents Overview */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">LIVE CRITICAL INCIDENTS</h2>
          <Link href="/incidents" className="text-xs font-mono text-[#34F5E6] hover:underline flex items-center">
            View All Feed <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-white/10">
          {MOCK_INCIDENTS.map((inc) => (
            <div key={inc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={inc.severity === 'CRITICAL' ? 'critical' : 'warning'}>{inc.severity}</Badge>
                  <span className="font-mono text-xs text-[#34F5E6] font-semibold">{inc.id}</span>
                  <span className="font-mono text-xs text-[#8390A5]">• {inc.service}</span>
                </div>
                <h3 className="font-sans text-sm font-bold text-white">{inc.title}</h3>
                <p className="text-xs text-[#8390A5] line-clamp-1">{inc.summary}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-mono text-xs text-[#34F5E6] font-bold">{inc.memoryMatchPercentage}% MATCH</p>
                  <p className="font-mono text-[10px] text-[#8390A5]">Fix: {inc.matchedFixId}</p>
                </div>
                <Link href={`/incidents/${inc.id}`}>
                  <Button variant="secondary" size="sm">
                    INSPECT FIX
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
