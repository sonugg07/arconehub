"use client";

import React from "react";
import Link from "next/link";
import {
  Pay3DVisual,
  Swap3DVisual,
  Launch3DVisual,
  Jobs3DVisual,
  Company3DVisual,
  Wallet3DVisual,
} from "@/components/3d/Feature3DVisuals";
import { ArrowUpRight, Send, ArrowLeftRight, Rocket, Briefcase, Building2, Wallet } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      id: "pay",
      title: "Pay",
      tagline: "Instant USDC Settlements",
      description: "Send and request USDC with simple onchain payments, dynamic QR codes, and zero-fee payment links.",
      items: ["Direct Send & Request", "Instant Payment Links", "Native USDC Gas Settlement"],
      icon: Send,
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      borderColor: "group-hover:border-cyan-400/40",
      glowColor: "group-hover:shadow-glow-cyan",
      visual: <Pay3DVisual />,
      href: "/app/pay",
    },
    {
      id: "swap",
      title: "Swap",
      tagline: "High-Speed Onchain DEX",
      description: "Swap supported assets through a clean onchain trading experience with sub-second execution and minimal slippage.",
      items: ["Automated Market Maker", "Custom Slippage Controls", "Deep Aggregated Liquidity"],
      icon: ArrowLeftRight,
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      borderColor: "group-hover:border-purple-400/40",
      glowColor: "group-hover:shadow-glow-violet",
      visual: <Swap3DVisual />,
      href: "/app/swap",
    },
    {
      id: "launch",
      title: "Launch",
      tagline: "Custom Token Deployer",
      description: "Create, configure, and launch your own onchain token with automated bonding curves and real-time 3D previews.",
      items: ["ERC-20 Token Factory", "Dynamic 3D Coin Generation", "Bonding Curve Liquidity"],
      icon: Rocket,
      gradient: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
      borderColor: "group-hover:border-fuchsia-400/40",
      glowColor: "group-hover:shadow-glow-violet",
      visual: <Launch3DVisual />,
      href: "/app/launch",
    },
    {
      id: "jobs",
      title: "Jobs",
      tagline: "Talent & Smart Escrow",
      description: "Find work, hire verified talent, and get paid in USDC with automated smart contract milestone protections.",
      items: ["Verified Web3 Opportunities", "Milestone-based Payouts", "100% Escrow Guarantee"],
      icon: Briefcase,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "group-hover:border-emerald-400/40",
      glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.45)]",
      visual: <Jobs3DVisual />,
      href: "/app/jobs",
    },
    {
      id: "company",
      title: "Company",
      tagline: "Enterprise Treasury & Payroll",
      description: "Manage global teams, contractors, invoices, streamed payroll, and multi-signature escrow from a unified suite.",
      items: ["Real-time Streamed Payroll", "Milestone Escrow Manager", "Multi-Seat Corporate Vault"],
      icon: Building2,
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      borderColor: "group-hover:border-amber-400/40",
      glowColor: "group-hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.45)]",
      visual: <Company3DVisual />,
      href: "/app/company",
    },
    {
      id: "wallet",
      title: "Wallet",
      tagline: "Multi-Asset Smart Vault",
      description: "Manage your USDC, governance tokens, and onchain activity with gasless approvals and comprehensive telemetry.",
      items: ["Multi-Asset Portfolio", "1-Click Testnet Faucet", "Onchain Activity Ledger"],
      icon: Wallet,
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      borderColor: "group-hover:border-blue-400/40",
      glowColor: "group-hover:shadow-glow-blue",
      visual: <Wallet3DVisual />,
      href: "/app/wallet",
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arc-blue/10 border border-arc-blue/20 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">
            Unified Ecosystem Infrastructure
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5">
            Everything you need. <br />
            <span className="text-gradient-arc">One unified hub.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Engineered from the ground up to replace fragmented crypto tools with one high-performance, fintech-grade interface.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className={`group relative rounded-3xl bg-gradient-to-b from-[#0B1028]/90 to-[#060919]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${feat.borderColor} ${feat.glowColor} shadow-glass`}
              >
                {/* Background Ambient Glow */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${feat.gradient} rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity`} />

                <div>
                  {/* Top Bar with Icon & Action Link */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner">
                      <IconComponent className="w-5 h-5 text-cyan-300" />
                    </div>
                    <Link
                      href={feat.href}
                      className="text-xs font-semibold text-slate-400 group-hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08]"
                    >
                      <span>Open {feat.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 3D Visualizer Canvas */}
                  <div className="my-2 rounded-2xl bg-[#040614]/50 border border-white/[0.04] overflow-hidden">
                    {feat.visual}
                  </div>

                  {/* Title & Tagline */}
                  <div className="mt-4">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      {feat.tagline}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">
                      {feat.description}
                    </p>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                  {feat.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
