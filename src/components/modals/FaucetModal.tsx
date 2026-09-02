"use client";

import React, { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet } from "@/config/network";
import { X, Droplets, ExternalLink, ShieldCheck, Copy, Check, Sparkles, Coins } from "lucide-react";

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAsset?: "USDC" | "EURC" | "cirBTC";
}

export function FaucetModal({ isOpen, onClose, initialAsset = "USDC" }: FaucetModalProps) {
  const { address, openFaucet } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<"USDC" | "EURC" | "cirBTC">(initialAsset);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const faucetAssets = [
    {
      symbol: "USDC",
      name: "USD Coin",
      desc: "Native Gas Token",
      color: "#0066ff",
      faucetUrl: "https://faucet.circle.com/",
    },
    {
      symbol: "EURC",
      name: "Euro Coin",
      desc: "Euro Stablecoin",
      color: "#0052FF",
      faucetUrl: "https://faucet.circle.com/",
    },
    {
      symbol: "cirBTC",
      name: "Circle Bitcoin",
      desc: "Wrapped Bitcoin",
      color: "#F7931A",
      faucetUrl: "https://faucet.circle.com/",
    },
  ];

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
              <p className="text-xs text-slate-400">Claim testnet USDC, EURC & cirBTC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Asset Selector Tabs */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Faucet Asset:</span>
          <div className="grid grid-cols-3 gap-2">
            {faucetAssets.map((asset) => (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => setSelectedAsset(asset.symbol as "USDC" | "EURC" | "cirBTC")}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  selectedAsset === asset.symbol
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-glow-blue"
                    : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-xs font-bold text-white">${asset.symbol}</span>
                </div>
                <span className="text-[10px] text-slate-400">{asset.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-2.5 text-xs">
          <span className="font-bold text-cyan-300">How to claim ${selectedAsset} on Arc Testnet:</span>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
            <li>Copy your connected wallet address below.</li>
            <li>Click <strong>Open Circle Faucet</strong>.</li>
            <li>Select <strong>Arc Testnet</strong> & asset <strong>{selectedAsset}</strong>.</li>
            <li>Paste your address and request tokens.</li>
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
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            handleCopy();
            onClose();
          }}
          className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer text-center"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Claim ${selectedAsset} on Circle Faucet</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Arc Testnet (Chain ID #{arcTestnet.chainId}) • Circle Faucet</span>
        </div>

      </div>
    </div>
  );
}
