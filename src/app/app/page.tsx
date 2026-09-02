"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BalanceAura3D } from "@/components/3d/BalanceAura3D";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { formatAddress, formatUSDC } from "@/lib/utils";
import {
  Send,
  ArrowLeftRight,
  Rocket,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Coins,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function DashboardHome() {
  const {
    address,
    isConnected,
    isWrongNetwork,
    networkName,
    blockNumber,
    usdcBalance,
    totalBalanceUSD,
    isBalanceLoading,
    refreshBalance,
    openFaucet,
    openConnectModal,
    switchNetwork,
  } = useWeb3();

  const { activities } = useActivity();
  const [activeTimeframe, setActiveTimeframe] = useState<"24H" | "7D" | "30D" | "ALL">("7D");

  const quickActions = [
    { label: "Pay", href: "/app/pay", icon: Send, color: "from-blue-600 to-cyan-500", desc: "Send & Request USDC", status: "LIVE" },
    { label: "Swap", href: "/app/swap", icon: ArrowLeftRight, color: "from-purple-600 to-indigo-600", desc: "DEX AMM Pools", status: "SOON" },
    { label: "Launch", href: "/app/launch", icon: Rocket, color: "from-fuchsia-600 to-pink-600", desc: "Token Factory", status: "SOON" },
    { label: "Jobs", href: "/app/jobs", icon: Briefcase, color: "from-emerald-600 to-teal-500", desc: "Escrow Work & Bounties", status: "LIVE" },
  ];

  const recentTransactions = activities.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Top Header / Greeting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{networkName} (Chain #{arcTestnet.chainId})</span>
            </div>
            <h1 className="text-3xl font-black text-white">Welcome to ArcOne Hub</h1>
            <p className="text-sm text-slate-400 mt-1">
              One unified portal for real Arc Testnet payments, payroll, escrow, and token infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => refreshBalance()}
              disabled={isBalanceLoading}
              className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh onchain balance"
            >
              <RefreshCw className={`w-4 h-4 ${isBalanceLoading ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            <button
              onClick={openFaucet}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Get Test USDC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Hero Balance & Portfolio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Portfolio Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-[#080D26]/95 via-[#06091D]/95 to-[#040614]/95 border border-white/[0.1] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            
            <BalanceAura3D />

            <div className="relative z-10 flex flex-col gap-6">
              {/* Top Row: Label & Timeframe Selector */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Real Arc Testnet USDC Holdings
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-sans flex items-baseline gap-2">
                    <span>{isConnected ? formatUSDC(usdcBalance) : "$0.00"}</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">USDC</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {(["24H", "7D", "30D", "ALL"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeTimeframe === tf
                          ? "bg-arc-blue text-white shadow-glow-blue"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connected Address Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
                <div className="flex items-center gap-2 font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{address ? formatAddress(address, 6) : "Wallet Disconnected"}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span>Block: #{blockNumber.toLocaleString()}</span>
                  <span>•</span>
                  <span>USDC Native Gas</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isConnected ? (
                  <button
                    onClick={openConnectModal}
                    className="glass-button px-6 py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-glow-blue cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-cyan-200" />
                    <span>Connect Wallet</span>
                  </button>
                ) : isWrongNetwork ? (
                  <button
                    onClick={switchNetwork}
                    className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Switch to Arc Testnet</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/app/pay"
                      className="glass-button px-6 py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-glow-blue"
                    >
                      <Send className="w-4 h-4 text-cyan-200" />
                      <span>Send Real USDC</span>
                    </Link>

                    <Link
                      href="/app/wallet"
                      className="glass-button-secondary px-5 py-3.5 rounded-2xl text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2"
                    >
                      <Coins className="w-4 h-4 text-cyan-400" />
                      <span>Smart Vault</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Quick Actions Grid (4 Cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="p-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] hover:border-cyan-400/40 backdrop-blur-xl shadow-glass flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      action.status === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}>
                      {action.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>

        {/* Live Network & Explorer Telemetry Banner */}
        <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Arc Testnet Connection</h4>
              <p className="text-xs text-slate-400">
                Connected to official Arc RPC at <code className="text-cyan-300">{arcTestnet.rpcUrl}</code>
              </p>
            </div>
          </div>

          <a
            href={arcTestnet.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Open ArcScan Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Recent Activity Timeline */}
        <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live transactions on Arc Testnet</p>
            </div>

            <Link
              href="/app/activity"
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                    {tx.category === "escrow" ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : tx.amount.startsWith("+") ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{tx.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{tx.subtitle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-black font-mono ${tx.amount.startsWith("+") ? "text-emerald-400" : "text-white"}`}>
                    {tx.amount} {tx.token}
                  </div>
                  <a
                    href={getExplorerTxUrl(tx.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 font-mono hover:underline flex items-center justify-end gap-1"
                  >
                    <span>{formatAddress(tx.txHash, 3)}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
