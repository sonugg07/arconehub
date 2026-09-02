"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet } from "@/config/network";
import { formatAddress, formatUSDC } from "@/lib/utils";
import {
  Send,
  ArrowDownUp,
  Rocket,
  Briefcase,
  Building2,
  Wallet,
  Activity,
  Zap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpRight,
  Cpu,
  Globe,
} from "lucide-react";

export default function LaunchAppGatewayPage() {
  const { address, isConnected, isWrongNetwork, usdcBalance, openConnectModal, openFaucet, switchNetwork } = useWeb3();

  const apps = [
    {
      id: "pay",
      title: "ArcOne Pay",
      tagline: "Instant USDC P2P & Invoicing",
      description: "Send, receive, and request native USDC with sub-second finality and shareable dynamic payment links.",
      href: "/app/pay",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Send,
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      accentGlow: "from-cyan-500/20 to-arc-blue/20",
      actionText: "Launch Pay",
      stats: "< 400ms Settlement",
    },
    {
      id: "swap",
      title: "ArcOne Swap",
      tagline: "High-Throughput DEX AMM",
      description: "Trade native USDC, EURC, cirBTC, and community-launched tokens with zero-slippage liquidity pools.",
      href: "/app/swap",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: ArrowDownUp,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      accentGlow: "from-purple-500/20 to-fuchsia-500/20",
      actionText: "Launch Swap",
      stats: "Constant Product AMM",
    },
    {
      id: "launch",
      title: "Token Launchpad",
      tagline: "1-Click ERC-20 Factory",
      description: "Deploy audited, standard OpenZeppelin smart contracts directly to Arc Testnet with real-time 3D coin rendering.",
      href: "/app/launch",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Rocket,
      iconColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
      accentGlow: "from-fuchsia-500/20 to-rose-500/20",
      actionText: "Launch Token Factory",
      stats: "Auto DEX Sync",
    },
    {
      id: "jobs",
      title: "Jobs & Escrow",
      tagline: "Decentralized Talent & Bounties",
      description: "Post bounties, hire Web3 engineers, and lock milestone funds into trustless onchain escrow smart contracts.",
      href: "/app/jobs",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Briefcase,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      accentGlow: "from-amber-500/20 to-orange-500/20",
      actionText: "Launch Jobs & Escrow",
      stats: "Smart Contract Escrow",
    },
    {
      id: "company",
      title: "Company Suite",
      tagline: "Streaming Payroll & Multi-Sig",
      description: "Schedule continuous token salary streaming, multi-signature treasury management, and organizational burn analytics.",
      href: "/app/company",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Building2,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      accentGlow: "from-blue-500/20 to-indigo-500/20",
      actionText: "Launch Company Suite",
      stats: "Continuous Payroll",
    },
    {
      id: "wallet",
      title: "Smart Vault",
      tagline: "Deterministic Multi-Asset Vault",
      description: "Comprehensive telemetry of connected keys, USDC, EURC, cirBTC, and custom Arc ecosystem assets.",
      href: "/app/wallet",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Wallet,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      accentGlow: "from-emerald-500/20 to-teal-500/20",
      actionText: "Launch Smart Vault",
      stats: "Circle Multi-Asset",
    },
    {
      id: "activity",
      title: "Activity Ledger",
      tagline: "Verifiable Onchain Receipts",
      description: "Complete chronological history of payments, swaps, token deployments, and milestone escrow events on Arc.",
      href: "/app/activity",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: Activity,
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      accentGlow: "from-cyan-500/20 to-blue-500/20",
      actionText: "Launch Activity Ledger",
      stats: "Permanent Records",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040612] text-white flex flex-col justify-between selection:bg-arc-blue/30 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Shaders */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-arc-blue/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-white/[0.08] bg-[#060919]/80 backdrop-blur-xl px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30">
        <ArcOneLogo size="md" showTagline={true} taglineText="SUPER-APP" href="/" />

        <div className="flex items-center gap-3">
          <button
            onClick={openFaucet}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Circle Faucet</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </button>

          {!isConnected ? (
            <button
              onClick={openConnectModal}
              className="glass-button px-5 py-2.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-glow-blue"
            >
              <Wallet className="w-3.5 h-3.5 text-cyan-200" />
              <span>Connect Wallet</span>
            </button>
          ) : isWrongNetwork ? (
            <button
              onClick={switchNetwork}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <span>Switch to Arc Testnet</span>
            </button>
          ) : (
            <Link
              href="/app"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-white transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{formatUSDC(usdcBalance, true)}</span>
              <span className="font-mono text-cyan-300 text-[11px]">({formatAddress(address || "", 3)})</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Gateway Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12 z-10 w-full flex-1">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-arc-blue/20 via-purple-500/20 to-cyan-500/20 border border-white/[0.12] text-xs font-bold text-cyan-300 shadow-glass">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ArcOne Ecosystem Hub & Gateway</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
              Arc Testnet #{arcTestnet.chainId}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Launch Any App on <span className="gradient-text">ArcOne Hub</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Choose any onchain application below to start sending instant USDC payments, swapping tokens on high-speed AMM pools, deploying smart contracts, or managing escrow payrolls.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/app"
              className="glass-button px-6 py-3 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-glow-blue"
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>Open Unified Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={openFaucet}
              className="px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-cyan-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Claim Testnet USDC / EURC / cirBTC</span>
            </button>
          </div>
        </div>

        {/* 7 Interactive App Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                className="group relative rounded-3xl bg-[#080D26]/90 border border-white/[0.08] hover:border-cyan-400/40 backdrop-blur-xl p-7 shadow-glass flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              >
                {/* Hover Ambient Glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${app.accentGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="flex flex-col gap-4 relative z-10">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-md ${app.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {app.title}
                    </h3>
                    <span className="text-xs font-semibold text-cyan-400 block mt-0.5">
                      {app.tagline}
                    </span>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action & Stats */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 relative z-10">
                  <span className="text-[10px] font-mono text-slate-400">
                    {app.stats}
                  </span>

                  <Link
                    href={app.href}
                    className="px-4 py-2.5 rounded-xl bg-arc-blue/20 group-hover:bg-arc-blue hover:scale-105 border border-arc-blue/40 text-xs font-bold text-cyan-200 group-hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{app.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arc Testnet Network Telemetry Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1238] via-[#070A20] to-[#0B1238] border border-white/[0.1] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>Arc Testnet Engine Online</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sub-second EVM consensus with predictable native USDC gas optimization.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={arcTestnet.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>ArcScan Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <Link
              href="/app"
              className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-glow-blue"
            >
              <span>Enter Super-App</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#040612] py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ArcOneLogo size="sm" iconOnly={true} />
          <span>ArcOne Hub © 2026 • Powered by Arc Network</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/app/pay" className="hover:text-white transition-colors">Pay</Link>
          <Link href="/app/swap" className="hover:text-white transition-colors">Swap</Link>
          <Link href="/app/launch" className="hover:text-white transition-colors">Launchpad</Link>
          <Link href="/app/jobs" className="hover:text-white transition-colors">Jobs</Link>
          <Link href="/app/wallet" className="hover:text-white transition-colors">Vault</Link>
        </div>
      </footer>

    </div>
  );
}
