"use client";

import React from "react";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/lib/utils";
import { X, CheckCircle2, ShieldCheck, Zap, ExternalLink } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { isConnected, isConnecting, address, walletName, connectWallet, disconnectWallet, networkName } = useWeb3();

  if (!isOpen) return null;

  const walletOptions = [
    {
      id: "arc-instant",
      name: "Arc Instant Devnet Wallet",
      tag: "Recommended (Testnet)",
      iconBg: "from-blue-600 to-cyan-500",
      description: "Zero seed phrase required. Generates an instant Arc Testnet key pair.",
    },
    {
      id: "metamask",
      name: "MetaMask",
      tag: "Popular",
      iconBg: "from-orange-500 to-amber-600",
      description: "Connect via browser extension or mobile wallet.",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      tag: "Smart Wallet",
      iconBg: "from-blue-700 to-indigo-800",
      description: "Native passkey and EVM smart wallet support.",
    },
    {
      id: "phantom",
      name: "Phantom",
      tag: "Multi-Chain",
      iconBg: "from-purple-600 to-indigo-700",
      description: "Supports EVM & Solana multi-chain assets.",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      tag: "QR Code",
      iconBg: "from-blue-500 to-purple-600",
      description: "Scan with Rainbow, Trust, Zerion, or 300+ wallets.",
    },
  ];

  const handleSelect = async (name: string) => {
    await connectWallet(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#080D26] border border-white/[0.12] p-6 shadow-2xl shadow-arc-blue/20 flex flex-col gap-6 text-white overflow-hidden">
        
        {/* Top Glow Ambient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-arc-blue/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Connect to ArcOne Hub</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select your preferred Web3 wallet</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected State View */}
        {isConnected && address ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{walletName || "Connected Wallet"}</div>
                  <div className="text-xs font-mono text-emerald-300">{formatAddress(address, 6)}</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {networkName}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  disconnectWallet();
                }}
                className="flex-1 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={onClose}
                className="flex-1 glass-button py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          /* Wallet Options List */
          <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {walletOptions.map((opt) => (
              <button
                key={opt.id}
                disabled={isConnecting}
                onClick={() => handleSelect(opt.name)}
                className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-cyan-400/40 text-left flex items-center justify-between gap-3 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.iconBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{opt.name}</span>
                      {opt.tag && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-arc-blue/20 text-cyan-300 border border-arc-blue/30">
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      {opt.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Security Footer */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Arc Testnet EVM Secured
          </span>
          <a
            href="https://docs.arcone.hub"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
