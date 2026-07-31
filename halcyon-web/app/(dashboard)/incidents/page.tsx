'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ShieldAlert, CheckCircle, Terminal, Copy, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useIncidentStore } from '@/store/useIncidentStore';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function IncidentFeedPage() {
  const { incidents, searchQuery, setSearchQuery, selectedSeverityFilter, setSeverityFilter, resolveIncident } = useIncidentStore();
  const [selectedLogs, setSelectedLogs] = useState<string[] | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || inc.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverityFilter === 'ALL' || inc.severity === selectedSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleCopyFix = (fixCommand: string) => {
    navigator.clipboard.writeText(fixCommand);
    toast.success('Fix command copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">INCIDENT FEED & INTELLIGENCE</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">LIVE ALERTS, MEMORY CORRELATION & AUTOMATED FIX VECTORS</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by incident title, service name, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto font-mono text-xs overflow-x-auto pb-2 md:pb-0">
          <span className="text-[#8390A5] flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" /> SEVERITY:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                selectedSeverityFilter === sev
                  ? 'bg-[#34F5E6]/10 text-[#34F5E6] border-[#34F5E6]/40 font-bold'
                  : 'bg-black/40 text-[#8390A5] border-white/10 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </Card>

      {/* Incidents Feed */}
      <div className="space-y-4">
        {filteredIncidents.map((inc) => (
          <Card key={inc.id} glow className="p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={inc.severity === 'CRITICAL' ? 'critical' : 'warning'}>{inc.severity}</Badge>
                  <span className="font-mono text-xs text-[#34F5E6] font-bold">{inc.id}</span>
                  <span className="font-mono text-xs text-[#8390A5]">• {inc.service}</span>
                  <span className="font-mono text-[11px] text-[#8390A5]">{formatDate(inc.timestamp)}</span>
                </div>
                <h3 className="font-sans text-base font-bold text-white">{inc.title}</h3>
                <p className="text-xs text-[#B8C6D8]">{inc.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                {inc.status === 'RESOLVED' ? (
                  <Badge variant="success">RESOLVED</Badge>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => resolveIncident(inc.id)}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> MARK RESOLVED
                  </Button>
                )}
                <Link href={`/incidents/${inc.id}`}>
                  <Button variant="primary" size="sm">
                    AI ANALYSIS <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Suggested Fix Vector */}
            <div className="p-3.5 rounded-lg bg-black/60 border border-[rgba(52,245,230,0.25)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-mono text-xs text-[#34F5E6] overflow-x-auto">
                <Terminal className="w-4 h-4 shrink-0 text-[#34F5E6]" />
                <code className="text-[#34F5E6] font-bold">{inc.aiSuggestedFix}</code>
              </div>
              <button
                onClick={() => handleCopyFix(inc.aiSuggestedFix)}
                className="text-[#8390A5] hover:text-[#34F5E6] transition-colors p-1"
                title="Copy Command"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
