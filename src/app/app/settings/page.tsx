"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { arcTestnet } from "@/config/network";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/userProfile";
import { formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Settings,
  User,
  Cpu,
  Bell,
  CheckCircle2,
  Save,
  ShieldCheck,
  Zap,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const { address, isConnected, networkName, isWrongNetwork, switchNetwork, openConnectModal } = useWeb3();
  const { addNotification } = useNotifications();

  // Profile Form State
  const [displayName, setDisplayName] = useState("");
  const [arcDomain, setArcDomain] = useState("");
  const [bio, setBio] = useState("");

  // Network Settings
  const [rpcUrl, setRpcUrl] = useState(arcTestnet.rpcUrl);
  const [chainId, setChainId] = useState(arcTestnet.chainId.toString());

  // Notifications
  const [notifTx, setNotifTx] = useState(true);
  const [notifEscrow, setNotifEscrow] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Saved banner
  const [saved, setSaved] = useState(false);

  // Load saved profile on mount or when connected address changes
  useEffect(() => {
    const profile = getUserProfile(address);
    setDisplayName(profile.displayName);
    setArcDomain(profile.arcDomain);
    setBio(profile.bio);
    setRpcUrl(profile.rpcUrl || arcTestnet.rpcUrl);
    setChainId(profile.chainId || arcTestnet.chainId.toString());
    setNotifTx(profile.notifTx ?? true);
    setNotifEscrow(profile.notifEscrow ?? true);
    setNotifMarketing(profile.notifMarketing ?? false);
  }, [address]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: UserProfile = {
      displayName: displayName.trim() || (address ? `Arc Member #${address.slice(2, 6)}` : "Arc Member"),
      arcDomain: arcDomain.trim() || (address ? `${address.slice(2, 8).toLowerCase()}.arcone.hub` : "user.arcone.hub"),
      bio: bio.trim(),
      rpcUrl: rpcUrl.trim() || arcTestnet.rpcUrl,
      chainId: chainId.trim() || arcTestnet.chainId.toString(),
      notifTx,
      notifEscrow,
      notifMarketing,
    };

    saveUserProfile(address, updatedProfile);
    setSaved(true);

    addNotification({
      title: "Profile & Preferences Saved",
      message: `Identity updated for ${address ? formatAddress(address, 4) : "your session"}.`,
      type: "success",
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#0066FF", "#00D2FF", "#10B981"],
      });
    } catch {}

    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Identity & Network Preferences</span>
            </div>
            <h1 className="text-3xl font-black text-white">Settings & Preferences</h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure your permanent onchain identity, RPC endpoints, and notification preferences.
            </p>
          </div>

          {isConnected && address && (
            <div className="px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-cyan-300 flex items-center gap-2 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{formatAddress(address, 6)}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Profile Section */}
          <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Onchain Profile & Identity</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                Persistent Storage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Satoshi Nakamoto"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Arc Domain Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex.arcone.hub"
                  value={arcDomain}
                  onChange={(e) => setArcDomain(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Bio</label>
              <textarea
                rows={2}
                placeholder="Tell the community about your onchain projects..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-400/50 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Network & RPC Configuration */}
          <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col gap-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Network & RPC Endpoints</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Active RPC URL</label>
                <input
                  type="text"
                  value={rpcUrl}
                  onChange={(e) => setRpcUrl(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Chain ID</label>
                <input
                  type="text"
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-cyan-300 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-400">Default Gas Token:</span>
              <span className="font-mono font-bold text-cyan-300">Native USDC (Circle Permitted)</span>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass flex flex-col gap-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Notification Channels</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div>
                  <div className="font-bold text-white">Payment & Swap Confirmations</div>
                  <div className="text-[11px] text-slate-400">Receive toasts when onchain transactions finalize</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifTx}
                  onChange={(e) => setNotifTx(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div>
                  <div className="font-bold text-white">Escrow & Milestone Updates</div>
                  <div className="text-[11px] text-slate-400">Get notified when escrow is funded or released</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEscrow}
                  onChange={(e) => setNotifEscrow(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {saved ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>All changes saved permanently to your profile!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Settings are preserved per wallet address</span>
              </span>
            )}

            <button
              type="submit"
              className="glass-button w-full sm:w-auto px-7 py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}
