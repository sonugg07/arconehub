"use client";

import React, { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet } from "@/config/network";
import { X, Droplets, ExternalLink, ShieldCheck, Copy, Check, Sparkles } from "lucide-react";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const { address, openFaucet } = useWeb3();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#080D26] border border-cyan-400/30 p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 flex flex-col gap-6 text-white overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Official Circle Faucet</h3>
              <p className="text-xs text-slate-400">Get real Arc Testnet USDC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-3 text-xs">
          <span className="font-bold text-cyan-300">How to claim test USDC:</span>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
            <li>Copy your connected wallet address below.</li>
            <li>Click <strong>Open Circle Faucet</strong>.</li>
            <li>Select <strong>Arc Testnet</strong> in the network dropdown.</li>
            <li>Paste your address and request USDC.</li>
          </ol>
        </div>

        {/* Connected Address Field */}
        {address && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <div className="font-mono text-cyan-300 truncate max-w-[240px]">
              {address}
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            openFaucet();
            onClose();
          }}
          className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Open Circle Faucet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Official Arc Testnet (Chain ID #{arcTestnet.chainId})</span>
        </div>

      </div>
    </div>
  );
}
