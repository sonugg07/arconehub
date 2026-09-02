"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { formatAddress, formatUSDC } from "@/lib/utils";
import { arcTestnet } from "@/config/network";
import {
  Search,
  Zap,
  Bell,
  ChevronDown,
  ExternalLink,
  Wallet,
  LogOut,
  Send,
  RefreshCw,
} from "lucide-react";

interface TopHeaderProps {
  onOpenFaucet?: () => void;
  onOpenConnectModal?: () => void;
}

export function TopHeader({ onOpenFaucet, onOpenConnectModal }: TopHeaderProps) {
  const {
    isConnected,
    address,
    usdcBalance,
    networkName,
    isWrongNetwork,
    openConnectModal,
    openFaucet,
    disconnectWallet,
  } = useWeb3();

  const { unreadCount, setIsOpen: setNotifOpen } = useNotifications();
  const [walletDropdown, setWalletDropdown] = useState(false);

  const handleConnect = () => {
    if (onOpenConnectModal) onOpenConnectModal();
    else openConnectModal();
  };

  const handleFaucet = () => {
    if (onOpenFaucet) onOpenFaucet();
    else openFaucet();
  };

  return (
    <header className="h-16 lg:h-20 bg-[#060919]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      
      {/* Left: Mobile Brand & Search Trigger */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <ArcOneLogo size="sm" iconOnly={true} href="/app" />
        </div>

        {/* Universal Search Bar / Cmd+K Button */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all text-xs w-48 sm:w-72 cursor-pointer"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="truncate">Search or type command...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Tools, Faucet, Notifications, Wallet */}
      <div className="flex items-center gap-3">
        
        {/* Testnet Faucet Button */}
        <button
          onClick={handleFaucet}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all shadow-sm group cursor-pointer"
        >
          <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Get Test USDC</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </button>

        {/* Quick Send Button */}
        <Link
          href="/app/pay"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-arc-blue/20 hover:bg-arc-blue/30 border border-arc-blue/40 text-cyan-200 text-xs font-bold transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Pay</span>
        </Link>

        {/* Notification Bell */}
        <button
          onClick={() => setNotifOpen(true)}
          className="relative p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-arc-blue text-[10px] font-black text-white flex items-center justify-center border-2 border-[#060919]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Connected Wallet Pill */}
        {isConnected && address ? (
          <div className="relative">
            <button
              onClick={() => setWalletDropdown(!walletDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-arc-blue flex items-center justify-center text-white font-bold text-[10px]">
                $
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-white leading-tight">
                  {formatUSDC(usdcBalance, false)}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 leading-tight">
                  {formatAddress(address, 3)}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {walletDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-[#090E26] border border-white/[0.12] p-4 shadow-2xl flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="text-xs font-bold text-white">Active Account</div>
                    <div className="text-[11px] font-mono text-cyan-300">{formatAddress(address, 6)}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    isWrongNetwork
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {isWrongNetwork ? "Wrong Net" : "Arc Testnet"}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Arc Testnet USDC:</span>
                    <span className="font-bold text-white font-mono">{formatUSDC(usdcBalance)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Network:</span>
                    <span className="font-bold text-cyan-300">Chain #{arcTestnet.chainId}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setWalletDropdown(false);
                      openConnectModal();
                    }}
                    className="p-2 rounded-xl hover:bg-white/[0.05] text-xs font-medium text-cyan-300 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Wallet / Account</span>
                  </button>
                  <Link
                    href="/app/wallet"
                    onClick={() => setWalletDropdown(false)}
                    className="p-2 rounded-xl hover:bg-white/[0.05] text-xs font-medium text-slate-300 flex items-center gap-2"
                  >
                    <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Full Smart Vault</span>
                  </Link>
                  <button
                    onClick={() => {
                      setWalletDropdown(false);
                      disconnectWallet();
                    }}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-xs font-medium text-rose-300 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="glass-button px-4 py-2 rounded-xl text-xs font-bold text-white uppercase cursor-pointer"
          >
            Connect Wallet
          </button>
        )}

      </div>
    </header>
  );
}
