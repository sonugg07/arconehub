"use client";

import React from "react";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { formatAddress } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export function TransactionModal() {
  const { activeTx, closeTxModal } = useWeb3();

  if (!activeTx || !activeTx.isOpen) return null;

  const isConfirmed = activeTx.status === "CONFIRMED";
  const isFailed = activeTx.status === "FAILED";
  const isRejected = activeTx.status === "REJECTED";
  const isPending =
    activeTx.status === "PREPARING" ||
    activeTx.status === "AWAITING_WALLET" ||
    activeTx.status === "SUBMITTED" ||
    activeTx.status === "CONFIRMING";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#080D26] border border-white/[0.12] p-6 sm:p-7 shadow-2xl flex flex-col gap-6 text-white overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Background Radial Glow */}
        <div
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isConfirmed
              ? "bg-emerald-500/20"
              : isFailed || isRejected
              ? "bg-rose-500/20"
              : "bg-cyan-500/20"
          }`}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              {arcTestnet.name} Execution
            </span>
          </div>

          {!isPending && (
            <button
              onClick={closeTxModal}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* State Icon & Main Title */}
        <div className="flex flex-col items-center text-center gap-3 py-2">
          {isPending && (
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          )}

          {isConfirmed && (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          )}

          {(isFailed || isRejected) && (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <XCircle className="w-9 h-9" />
            </div>
          )}

          <div>
            <h3 className="text-xl font-black text-white">
              {isConfirmed
                ? "Payment Confirmed!"
                : isFailed
                ? "Transaction Failed"
                : isRejected
                ? "Transaction Rejected"
                : activeTx.status === "AWAITING_WALLET"
                ? "Waiting for Signature..."
                : "Waiting for Confirmation..."}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isConfirmed
                ? "Your Arc Testnet transaction has been confirmed onchain."
                : isFailed
                ? activeTx.error || "Execution reverted on Arc Testnet."
                : isRejected
                ? "Signature request was rejected in your wallet."
                : activeTx.status === "AWAITING_WALLET"
                ? "Please approve the transaction prompt in your connected wallet."
                : "Submitting to Arc Testnet mempool for sub-second finality..."}
            </p>
          </div>
        </div>

        {/* Real Transaction Receipt Card */}
        <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-2.5 text-xs">
          {activeTx.amount && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Amount:</span>
              <span className="font-mono font-bold text-white text-sm">{activeTx.amount}</span>
            </div>
          )}

          {activeTx.recipient && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Recipient:</span>
              <span className="font-mono text-cyan-300">{formatAddress(activeTx.recipient, 6)}</span>
            </div>
          )}

          {activeTx.blockNumber && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Block Height:</span>
              <span className="font-mono text-emerald-300">#{activeTx.blockNumber}</span>
            </div>
          )}

          {activeTx.gasUsed && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Gas Used:</span>
              <span className="font-mono text-slate-300">{activeTx.gasUsed} units</span>
            </div>
          )}

          {activeTx.hash && (
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <span className="text-slate-400">Transaction Hash:</span>
              <a
                href={getExplorerTxUrl(activeTx.hash)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{formatAddress(activeTx.hash, 5)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {activeTx.hash && (
            <a
              href={getExplorerTxUrl(activeTx.hash)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View on Arc Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {!isPending && (
            <button
              onClick={closeTxModal}
              className="flex-1 glass-button py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
            >
              Done
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
