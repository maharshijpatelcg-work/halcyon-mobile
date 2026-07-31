'use client';

import React from 'react';
import { BarChart3, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const RESOLUTION_TIME_DATA = [
  { month: 'Jan', mttr: 42, saved: 85000 },
  { month: 'Feb', mttr: 35, saved: 92000 },
  { month: 'Mar', mttr: 28, saved: 110000 },
  { month: 'Apr', mttr: 19, saved: 125000 },
  { month: 'May', mttr: 12, saved: 138000 },
  { month: 'Jun', mttr: 8, saved: 148500 },
];

const SEVERITY_BREAKDOWN = [
  { name: 'Critical', value: 15, color: '#FF6478' },
  { name: 'High', value: 35, color: '#FFB648' },
  { name: 'Medium', value: 40, color: '#78D7FF' },
  { name: 'Low', value: 10, color: '#22F2B4' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">INCIDENT & COST SAVINGS ANALYTICS</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">HISTORICAL MTTR REDUCTION & DOWNTIME COST AVOIDANCE</p>
        </div>
        <Badge variant="cyan">MTTR REDUCED BY 81%</Badge>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glow className="space-y-2">
          <span className="font-mono text-xs text-[#8390A5]">MEAN TIME TO RESOLVE (MTTR)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#34F5E6]">8 mins</span>
            <span className="text-xs font-mono text-[#22F2B4]">-81% YTD</span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">Down from 42 mins in Jan</p>
        </Card>

        <Card glow className="space-y-2">
          <span className="font-mono text-xs text-[#8390A5]">TOTAL SAVINGS PREVENTED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#22F2B4]">{formatCurrency(148500)}</span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">Estimated SLA penalty avoidance</p>
        </Card>

        <Card glow className="space-y-2">
          <span className="font-mono text-xs text-[#8390A5]">AUTOMATED MITIGATION RATE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#78D7FF]">94.2%</span>
          </div>
          <p className="text-[11px] font-mono text-[#8390A5]">Direct runbook auto-execution</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-6">
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">MTTR REDUCTION TREND (MINUTES)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOLUTION_TIME_DATA}>
                <XAxis dataKey="month" stroke="#8390A5" fontSize={11} tickLine={false} />
                <YAxis stroke="#8390A5" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#080C1E', borderColor: 'rgba(52,245,230,0.3)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="mttr" fill="#34F5E6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-6">
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">INCIDENT SEVERITY BREAKDOWN</h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SEVERITY_BREAKDOWN} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {SEVERITY_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#080C1E', borderColor: 'rgba(52,245,230,0.3)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
