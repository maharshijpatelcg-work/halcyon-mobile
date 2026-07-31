'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setUser({
        uid: 'usr-new-operator',
        email: email || 'engineer@halcyon.ai',
        displayName: name || 'NEW SRE OPERATOR',
        photoURL: null,
        emailVerified: true,
        providerId: 'password',
      });
      setIsLoading(false);
      toast.success('Workspace cluster deployed! Welcome to Halcyon.');
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#34F5E6]/10 blur-[150px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 border-[rgba(52,245,230,0.3)] shadow-[0_0_40px_rgba(52,245,230,0.15)]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#34F5E6]/10 border border-[#34F5E6]/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(52,245,230,0.3)]">
            <Zap className="w-6 h-6 text-[#34F5E6]" />
          </div>
          <h2 className="font-mono text-xl font-bold text-white tracking-widest">CREATE WORKSPACE</h2>
          <p className="font-mono text-xs text-[#34F5E6] mt-1 tracking-wider">DEPLOY INTELLIGENT MEMORY CLUSTER</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="FULL NAME"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="WORK EMAIL"
            type="email"
            placeholder="engineer@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="PASSWORD"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            <UserPlus className="w-4 h-4 mr-1" /> REGISTER & SETUP CLUSTER
          </Button>
        </form>

        <p className="text-center font-mono text-xs text-[#8390A5] mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-[#34F5E6] hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
