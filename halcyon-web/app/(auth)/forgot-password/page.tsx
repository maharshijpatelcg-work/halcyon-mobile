'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Password reset link sent to your inbox.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#34F5E6]/10 blur-[150px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10 border-[rgba(52,245,230,0.3)] shadow-[0_0_40px_rgba(52,245,230,0.15)]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#34F5E6]/10 border border-[#34F5E6]/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(52,245,230,0.3)]">
            <Zap className="w-6 h-6 text-[#34F5E6]" />
          </div>
          <h2 className="font-mono text-xl font-bold text-white tracking-widest">RESET PASSWORD</h2>
          <p className="font-mono text-xs text-[#34F5E6] mt-1 tracking-wider">RECOVER WORKSPACE ACCESS</p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-[#22F2B4]/10 border border-[#22F2B4]/30 text-[#22F2B4] font-mono text-xs">
              Password reset link dispatched to <br />
              <span className="font-bold">{email}</span>
            </div>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full mt-4">
                <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO SIGN IN
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="REGISTERED EMAIL"
              type="email"
              placeholder="engineer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              <Send className="w-4 h-4 mr-1" /> SEND RESET LINK
            </Button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center text-xs font-mono text-[#8390A5] hover:text-[#34F5E6]">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
