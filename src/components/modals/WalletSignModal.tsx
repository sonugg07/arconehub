"use client";

import React, { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/lib/utils";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  FileCode,
  Key,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
} from "lucide-react";

export function WalletSignModal() {
  const { pendingSignature, closeSignatureModal, address, walletName, networkName } = useWeb3();
  const [showHexData, setShowHexData] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  if (!pendingSignature || !pendingSignature.isOpen) return null;

  const handleConfirm = async () => {
    setIsSigning(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsSigning(false);
    pendingSignature.onConfirm();
  };

  const handleReject = () => {
    pendingSignature.onReject();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090E2A] border border-cyan-400/40 p-6 shadow-2xl shadow-cyan-500/20 flex flex-col gap-5 text-white overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Wallet Identity Header (like MetaMask popup) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-arc-blue flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Key className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{walletName || "MetaMask"} Signature Request</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-300">
                {address ? formatAddress(address, 5) : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-arc-blue/20 text-cyan-300 border border-arc-blue/30 font-mono">
              {networkName}
            </span>
            <button
              onClick={handleReject}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Origin / Website Badge */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Origin:</span>
          </span>
          <span className="font-mono text-white font-semibold">https://arcone.hub</span>
        </div>

        {/* Main Action Specification */}
        <div className="p-4 rounded-2xl bg-[#050718] border border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              {pendingSignature.type}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Simulation: Success
            </span>
          </div>

          <h3 className="text-lg font-black text-white font-sans">
            {pendingSignature.title}
          </h3>

          {pendingSignature.amount && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Value:</span>
              <span className="text-base font-mono font-black text-cyan-300">
                {pendingSignature.amount}
              </span>
            </div>
          )}

          {/* Details list */}
          {pendingSignature.details && pendingSignature.details.length > 0 && (
            <div className="flex flex-col gap-1.5 text-xs text-slate-300 border-t border-white/[0.04] pt-2">
              {pendingSignature.details.map((d, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-400">{d.label}:</span>
                  <span className="font-mono text-[11px] text-white truncate max-w-[200px]">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Gas Fee */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.04]">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Est. Gas Fee (USDC):</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {pendingSignature.gasFee || "0.0009 USDC"}
            </span>
          </div>
        </div>

        {/* Collapsible Hex / Payload Data */}
        <div>
          <button
            type="button"
            onClick={() => setShowHexData(!showHexData)}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{showHexData ? "Hide Hex Calldata" : "View Raw Transaction Calldata"}</span>
            {showHexData ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHexData && (
            <div className="mt-2 p-3 rounded-xl bg-[#030510] border border-white/[0.06] text-[10px] font-mono text-cyan-300 break-all max-h-24 overflow-y-auto">
              0xa9059cbb00000000000000000000000071c94b98e2a7d1ef8459427be48a1054c542e61f0000000000000000000000000000000000000000000000000000000005f5e100
            </div>
          )}
        </div>

        {/* Action Buttons: Reject vs Sign & Confirm */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleReject}
            className="py-3.5 rounded-2xl bg-white/[0.05] hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/[0.1] text-xs font-bold text-slate-300 hover:text-rose-200 transition-colors uppercase tracking-wider"
          >
            Reject
          </button>

          <button
            type="button"
            disabled={isSigning}
            onClick={handleConfirm}
            className="glass-button py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-200" />
            <span>{isSigning ? "Signing..." : "Sign & Confirm"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
