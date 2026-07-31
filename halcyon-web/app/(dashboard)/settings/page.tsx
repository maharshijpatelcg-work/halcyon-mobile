'use client';

import React, { useState } from 'react';
import { Settings, Key, Shield, Bell, HardDrive, Save } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('halcyon_live_sk_9918237192837192837');
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);

  const handleSave = () => {
    toast.success('Workspace settings updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[rgba(52,245,230,0.12)] pb-6">
        <h1 className="font-mono text-2xl font-bold tracking-widest text-white">WORKSPACE SETTINGS</h1>
        <p className="font-mono text-xs text-[#8390A5] mt-1">SECURITY, API KEYS, NOTIFICATIONS & AUTOMATION POLICIES</p>
      </div>

      {/* Security & API Keys */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-[#34F5E6]">
          <Key className="w-5 h-5" />
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">HALCYON API KEY</h2>
        </div>
        <Input
          label="PRODUCTION API KEY"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-[#8390A5]">Use this API key in your CI/CD pipelines and Kubernetes webhook controllers.</p>
      </Card>

      {/* Automation Policy */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-[#34F5E6]">
          <Shield className="w-5 h-5" />
          <h2 className="font-mono text-sm font-bold text-white tracking-wider">AUTONOMOUS MITIGATION POLICY</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/60 border border-white/10">
          <div>
            <p className="font-mono text-xs text-white font-bold">AUTOMATED RUNBOOK EXECUTION</p>
            <p className="text-xs text-[#8390A5]">Execute &gt;95% confidence fix vectors automatically without manual SRE approval.</p>
          </div>
          <button
            onClick={() => setAutoFixEnabled(!autoFixEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${autoFixEnabled ? 'bg-[#34F5E6]' : 'bg-white/20'}`}
          >
            <span className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${autoFixEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </Card>

      <Button variant="primary" size="lg" onClick={handleSave}>
        <Save className="w-4 h-4 mr-1" /> SAVE CHANGES
      </Button>
    </div>
  );
}
