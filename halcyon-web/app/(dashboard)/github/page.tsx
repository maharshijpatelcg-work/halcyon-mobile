'use client';

import React, { useState } from 'react';
import { Github, CheckCircle2, GitBranch, GitCommit, GitPullRequest, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function GithubIntegrationPage() {
  const [isConnected, setIsConnected] = useState(true);

  const handleToggle = () => {
    setIsConnected(!isConnected);
    toast.success(isConnected ? 'GitHub disconnected.' : 'GitHub OAuth connected!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(52,245,230,0.12)] pb-6">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-widest text-white">GITHUB DEPLOYMENT INTEGRATION</h1>
          <p className="font-mono text-xs text-[#8390A5] mt-1">AUTOMATED REPOSITORY COMMIT & PR CORRELATION WEBHOOKS</p>
        </div>
        <Badge variant={isConnected ? 'success' : 'outline'}>{isConnected ? 'WEBHOOK ACTIVE' : 'DISCONNECTED'}</Badge>
      </div>

      {/* Connection Card */}
      <Card glow className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Github className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-mono text-base font-bold text-white">halcyon-org / payment-gateway-api</h3>
            <p className="font-mono text-xs text-[#8390A5]">Connected via GitHub App OAuth • Main branch synced</p>
          </div>
        </div>

        <Button variant={isConnected ? 'danger' : 'primary'} onClick={handleToggle}>
          {isConnected ? 'DISCONNECT REPO' : 'CONNECT REPOSITORY'}
        </Button>
      </Card>

      {/* Sync Status & Commits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-[#34F5E6]">
            <GitBranch className="w-4 h-4" />
            <span className="font-mono text-xs font-bold text-white">ACTIVE BRANCH</span>
          </div>
          <p className="font-mono text-lg text-white font-bold">main (production)</p>
          <p className="text-xs text-[#8390A5]">Last commit synced 4 mins ago</p>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-[#34F5E6]">
            <GitCommit className="w-4 h-4" />
            <span className="font-mono text-xs font-bold text-white">RECENT COMMITS</span>
          </div>
          <p className="font-mono text-lg text-[#34F5E6] font-bold">a8b91f04</p>
          <p className="text-xs text-[#8390A5]">fix: tune connection pool max limit</p>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-[#34F5E6]">
            <GitPullRequest className="w-4 h-4" />
            <span className="font-mono text-xs font-bold text-white">PULL REQUESTS</span>
          </div>
          <p className="font-mono text-lg text-[#22F2B4] font-bold">#412 MERGED</p>
          <p className="text-xs text-[#8390A5]">Automated PR mitigation fix</p>
        </Card>
      </div>
    </div>
  );
}
