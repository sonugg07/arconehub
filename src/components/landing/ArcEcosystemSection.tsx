"use client";

import React from "react";
import Link from "next/link";
import { ArcNetwork3D } from "@/components/3d/ArcNetwork3D";
import { CheckCircle2, Zap, ArrowUpRight, Cpu, Coins, Lock } from "lucide-react";

export function ArcEcosystemSection() {
  const arcMetrics = [
    {
      title: "USDC Native Gas",
      desc: "No volatile gas tokens required. Pay network fees in predictable USDC fractions.",
      icon: Coins,
    },
    {
      title: "Sub-Second EVM Finality",
      desc: "Transactions confirm and finalize in under 400ms with deterministic ordering.",
      icon: Zap,
    },
    {
      title: "Full EVM Compatibility",
      desc: "Deploy standard Solidity contracts with existing developer tooling and libraries.",
      icon: Cpu,
    },
    {
      title: "Cryptographic Escrow",
      desc: "Zero-knowledge and multi-sig escrow guarantees for cross-border contractor payouts.",
      icon: Lock,
    },
  ];

  return (
    <section id="ecosystem" className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[#060919] via-[#080D26] to-[#060919]">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-arc-blue/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: 3D Network Visualization */}
          <div className="lg:col-span-6 relative order-2 lg:order-1 flex items-center justify-center">
            <div className="w-full relative rounded-3xl bg-[#040614]/70 border border-white/[0.08] shadow-glass p-2">
              <ArcNetwork3D />
              
              {/* Overlay Stat Pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#080D24]/90 backdrop-blur-xl border border-cyan-400/20 shadow-glass flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <div>
                    <div className="text-xs font-bold text-white">Arc Testnet Node Mesh</div>
                    <div className="text-[10px] text-slate-400">38 Active Validators • 100% Uptime</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300">420ms AVG</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Highlights */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-4">
              Next-Gen Infrastructure
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Built for the <br />
              <span className="text-gradient-arc">Arc Ecosystem</span>
            </h2>

            <div className="text-xl sm:text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
              <span className="text-arc-electric">Fast.</span>
              <span className="text-arc-violet">Stablecoin-native.</span>
              <span className="text-emerald-400">Onchain.</span>
            </div>

            <p className="text-base text-slate-300 mb-8 leading-relaxed">
              ArcOne Hub is purpose-built to harness the ultra-low latency and stablecoin-first architecture of the Arc Network. By anchoring all operations to native USDC, payments, swaps, and contractor payroll happen without slippage or volatile gas friction.
            </p>

            {/* Metric Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              {arcMetrics.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/app"
              className="glass-button px-6 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Arc Features</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
