'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setUser({
        uid: 'usr-engineer-01',
        email: email || 'engineer@halcyon.ai',
        displayName: 'HALCYON OPERATOR',
        photoURL: null,
        emailVerified: true,
        providerId: 'password',
      });
      setIsLoading(false);
      toast.success('Authenticated successfully. Redirecting to Dashboard...');
      router.push('/dashboard');
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        uid: 'usr-google-01',
        email: 'engineer@company.com',
        displayName: 'GOOGLE SRE OPERATOR',
        photoURL: null,
        emailVerified: true,
        providerId: 'google.com',
      });
      setIsLoading(false);
      toast.success('Signed in with Google!');
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
          <h2 className="font-mono text-xl font-bold text-white tracking-widest">WELCOME BACK</h2>
          <p className="font-mono text-xs text-[#34F5E6] mt-1 tracking-wider">ACCESS YOUR HALCYON DASHBOARD</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="EMAIL ADDRESS"
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

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-mono text-[#34F5E6] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            <LogIn className="w-4 h-4 mr-1" /> LOGIN & CONNECT
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[10px] text-[#8390A5]">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Button onClick={handleGoogleSignIn} variant="secondary" size="lg" className="w-full" isLoading={isLoading}>
          CONTINUE WITH GOOGLE
        </Button>

        <p className="text-center font-mono text-xs text-[#8390A5] mt-6">
          First time using Halcyon?{' '}
          <Link href="/register" className="text-[#34F5E6] hover:underline font-semibold">
            Create Workspace
          </Link>
        </p>
      </Card>
    </div>
  );
}
