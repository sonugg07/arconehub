"use client";

import React from "react";
import Link from "next/link";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet } from "@/config/network";
import {
  Rocket,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowDownUp,
  CreditCard,
  Briefcase,
} from "lucide-react";

export function LaunchAppCTA() {
  const { isConnected, openConnectModal } = useWeb3();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0B1033] via-[#080D26] to-[#040614] border border-white/[0.12] p-8 sm:p-12 lg:p-16 shadow-2xl">
        
        {/* Glowing Orbs in Background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-arc-blue/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-arc-violet/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Arc Testnet v1.0 Ready (Chain #{arcTestnet.chainId})</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Step Into the Future of <br />
            <span className="text-gradient-arc">Onchain Super-Apps.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Deploy ERC-20 tokens, swap with sub-second finality, send instant USDC payments, and secure high-value work with onchain escrows.
          </p>

          {/* Primary Action */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-12">
            <Link
              href="/app"
              className="glass-button w-full sm:w-auto px-10 py-4 rounded-2xl text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-3 shadow-glow-blue group cursor-pointer"
            >
              <span>Launch ArcOne App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/app/launch"
              className="glass-button-secondary w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-fuchsia-400" />
              <span>Deploy Token</span>
            </Link>
          </div>

          {/* Quick Hub Portals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full border-t border-white/[0.08] pt-8">
            <Link
              href="/app/pay"
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Instant Pay</span>
              <span className="text-[10px] text-slate-400">Native USDC Transfer</span>
            </Link>

            <Link
              href="/app/swap"
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-purple-400/40 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
            >
              <ArrowDownUp className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">DEX Swap</span>
              <span className="text-[10px] text-slate-400">Universal Buy / Sell</span>
            </Link>

            <Link
              href="/app/launch"
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-fuchsia-400/40 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-fuchsia-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Launchpad</span>
              <span className="text-[10px] text-slate-400">ERC-20 Token Factory</span>
            </Link>

            <Link
              href="/app/jobs"
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-emerald-400/40 transition-all flex flex-col items-center gap-2 text-center group cursor-pointer"
            >
              <Briefcase className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Escrow Jobs</span>
              <span className="text-[10px] text-slate-400">100% Protected Work</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
