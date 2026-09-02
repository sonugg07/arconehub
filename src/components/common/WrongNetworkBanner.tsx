"use client";

import React from "react";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet } from "@/config/network";
import { AlertTriangle, ArrowRight, Zap, RefreshCw } from "lucide-react";

export function WrongNetworkBanner() {
  const { isConnected, isWrongNetwork, chainId, switchNetwork } = useWeb3();

  if (!isConnected || !isWrongNetwork) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-600/90 via-rose-600/90 to-amber-600/90 text-white px-4 py-3 border-b border-amber-400/40 shadow-lg relative z-40 animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-100">Wrong Network Detected</span>
            <span className="mx-2 text-white/60">|</span>
            <span className="text-amber-50">
              Your wallet is connected to Chain #{chainId}. Please switch to <strong>{arcTestnet.name}</strong> (Chain #{arcTestnet.chainId}) to execute real onchain transactions.
            </span>
          </div>
        </div>

        <button
          onClick={() => switchNetwork()}
          className="px-4 py-2 rounded-xl bg-white text-rose-900 hover:bg-amber-100 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch to Arc Testnet</span>
        </button>
      </div>
    </div>
  );
}
