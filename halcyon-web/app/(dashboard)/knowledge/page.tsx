'use client';

import React, { useState } from 'react';
import { Brain, Search, Terminal, Copy, Bookmark, CheckCircle2, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useIncidentStore } from '@/store/useIncidentStore';
import { toast } from 'sonner';

export default function KnowledgeBasePage() {
  const { memoryFixes } = useIncidentStore();
  const [search, setSearch] = useState('');

  const filteredFixes = memoryFixes.filter((fix) =>
    fix.title.toLowerCase().includes(search.toLowerCase()) ||
    fix.service.toLowerCase().includes(search.toLowerCase()) ||
    fix.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('Runbook command copied!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">INSTITUTIONAL KNOWLEDGE BASE</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">SEMANTIC AI VECTOR RETRIEVAL ENGINE FOR PROVEN RUNBOOKS</p>
        </div>
        <Badge variant="cyan">98.4% VECTOR RECALL PRECISE</Badge>
      </div>

      {/* Semantic Search Bar */}
      <Card className="p-6">
        <Input
          placeholder="Ask AI memory (e.g. 'How to fix PostgreSQL connection pool exhaustion during traffic spike?')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-[#34F5E6]" />}
        />
      </Card>

      {/* Memory Fixes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFixes.map((fix) => (
          <Card key={fix.id} glow className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{fix.id}</Badge>
                <span className="font-mono text-xs text-[#22F2B4] font-bold">{fix.confidenceScore}% CONFIDENCE</span>
              </div>
              <h3 className="font-sans text-base font-bold text-white">{fix.title}</h3>
              <p className="text-xs text-[#B8C6D8]">{fix.explanation}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {fix.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#8390A5]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="p-3 rounded-lg bg-black/80 border border-[#34F5E6]/30 font-mono text-xs text-[#34F5E6] flex items-center justify-between">
                <code className="truncate max-w-[80%]">{fix.fixCommand}</code>
                <button onClick={() => handleCopy(fix.fixCommand)} className="text-[#8390A5] hover:text-[#34F5E6]">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-[#8390A5]">
                <span>Applied {fix.timesApplied} times successfully</span>
                <span>By {fix.author}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
