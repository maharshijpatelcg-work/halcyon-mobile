'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Brain, Activity, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Cyan Glow Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#34F5E6]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#34F5E6]/10 border border-[#34F5E6]/40 flex items-center justify-center shadow-[0_0_20px_rgba(52,245,230,0.35)]">
            <Zap className="w-5 h-5 text-[#34F5E6]" />
          </div>
          <span className="font-mono font-bold text-lg tracking-widest">HALCYON</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">SIGN IN</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary">ENTER DASHBOARD →</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#34F5E6]/10 border border-[#34F5E6]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#34F5E6] animate-pulse" />
            <span className="font-mono text-xs text-[#34F5E6] tracking-wider uppercase">AI INCIDENT MEMORY PLATFORM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-sans font-extrabold tracking-tight leading-tight mb-6">
            Incident memory, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34F5E6] to-[#78D7FF] text-cyan-glow">
              calmed.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#B8C6D8] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Instantly resolve system alerts by tapping into an active, self-learning institutional memory of past fixes. Zero context switching, automated MTTR reduction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="primary">
                ENTER DASHBOARD <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                DEPLOY WORKSPACE
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glow className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#34F5E6]/10 border border-[#34F5E6]/30 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#34F5E6]" />
            </div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wider">INTELLIGENT DETECTION</h3>
            <p className="text-xs text-[#8390A5] leading-relaxed">
              AI-powered pattern recognition across your entire incident logs, stack traces, and pod health diagnostics.
            </p>
          </Card>

          <Card glow className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#34F5E6]/10 border border-[#34F5E6]/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#34F5E6]" />
            </div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wider">MEMORY CORRELATION</h3>
            <p className="text-xs text-[#8390A5] leading-relaxed">
              Self-learning memory vector engine that connects live production alerts directly to proven past fixes.
            </p>
          </Card>

          <Card glow className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#34F5E6]/10 border border-[#34F5E6]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#34F5E6]" />
            </div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wider">RAPID MITIGATION</h3>
            <p className="text-xs text-[#8390A5] leading-relaxed">
              Reduce MTTR from hours to seconds with automated runbook execution and instant root-cause analysis.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(52,245,230,0.18)] py-8 text-center text-xs font-mono text-[#8390A5]">
        © 2026 HALCYON INCIDENT INTELLIGENCE PLATFORM. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
