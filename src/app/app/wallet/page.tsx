"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Wallet3DVisual } from "@/components/3d/Feature3DVisuals";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet, getExplorerAddressUrl } from "@/config/network";
import { formatAddress, formatUSDC } from "@/lib/utils";
import {
  Wallet,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Droplets,
  Send,
  ShieldCheck,
  Zap,
  Key,
  Lock,
  LogOut,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function WalletPage() {
  const {
    address,
    isConnected,
    isWrongNetwork,
    networkName,
    usdcBalance,
    totalBalanceUSD,
    isBalanceLoading,
    refreshBalance,
    switchNetwork,
    openFaucet,
    openConnectModal,
    disconnectWallet,
  } = useWeb3();

  const [copied, setCopied] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Arc Testnet (Chain #{arcTestnet.chainId})
            </div>
            <h1 className="text-3xl font-black text-white">Smart Vault & Wallet</h1>
            <p className="text-sm text-slate-400 mt-1">
              Live deterministic telemetry for your connected Arc Testnet key and native USDC holdings.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
              className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Get Test USDC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Vault Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-gradient-to-br from-[#0B1238] via-[#070A20] to-[#040612] border border-white/[0.1] p-6 sm:p-8 shadow-2xl overflow-hidden relative">
          
          {/* Left Column: Balance & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-arc-blue/20 border border-arc-blue/40 text-xs font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{networkName}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400">Real Arc Testnet USDC Balance</span>
              <div className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight mt-0.5 flex items-baseline gap-2">
                <span>{isConnected ? formatUSDC(usdcBalance) : "$0.00"}</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">USDC</span>
              </div>
            </div>

            {/* Address Row */}
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs w-full max-w-md">
              <Key className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
              <span className="font-mono text-slate-300 truncate">
                {address || "Wallet not connected"}
              </span>
              {address && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors shrink-0 ml-auto cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isConnected ? (
                <button
                  onClick={() => openConnectModal()}
                  className="glass-button px-5 py-3 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              ) : isWrongNetwork ? (
                <button
                  onClick={() => switchNetwork()}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Switch to Arc Testnet</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsReceiveModalOpen(true)}
                    className="glass-button px-5 py-3 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 shadow-glow-blue cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-cyan-200" />
                    <span>Receive / Deposit</span>
                  </button>

                  <Link
                    href="/app/pay"
                    className="glass-button-secondary px-5 py-3 rounded-2xl text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Send USDC</span>
                  </Link>

                  <a
                    href={getExplorerAddressUrl(address || "")}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                    title="View on ArcScan Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Column: 3D Vault Graphic */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <Wallet3DVisual />
          </div>

        </div>

        {/* Real Network Specifications Table */}
        <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Arc Testnet Specification</h3>
              <p className="text-xs text-slate-400 mt-0.5">Official EVM parameters and contract endpoints</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
              <span className="text-slate-400">Network Name</span>
              <span className="text-sm font-bold text-white">{arcTestnet.name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
              <span className="text-slate-400">Chain ID</span>
              <span className="text-sm font-mono font-bold text-cyan-300">{arcTestnet.chainId} ({arcTestnet.chainIdHex})</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
              <span className="text-slate-400">Native Gas & Currency</span>
              <span className="text-sm font-bold text-emerald-300">USDC (6/18 decimals)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1">
              <span className="text-slate-400">Official RPC Endpoint</span>
              <span className="text-xs font-mono text-slate-200 truncate">{arcTestnet.rpcUrl}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1 sm:col-span-2">
              <span className="text-slate-400">Official Block Explorer</span>
              <a
                href={arcTestnet.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1.5"
              >
                <span>{arcTestnet.explorerUrl}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Receive / Deposit QR Modal */}
        {isReceiveModalOpen && address && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-sm rounded-3xl bg-[#080D26] border border-cyan-400/30 p-6 shadow-2xl flex flex-col items-center text-center gap-5 text-white">
              <div className="w-full flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Receive on Arc Testnet</h3>
                <button
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-lg">
                <QrCode className="w-44 h-44 text-black" />
              </div>

              <div>
                <div className="text-xs font-bold text-white mb-1">Your Arc Address</div>
                <div className="text-xs font-mono text-cyan-300 bg-white/[0.04] px-3 py-2 rounded-xl border border-white/[0.06] break-all">
                  {address}
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="glass-button w-full py-3 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Address Copied!" : "Copy Address"}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
