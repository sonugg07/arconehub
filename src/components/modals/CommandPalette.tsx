"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/context/Web3Context";
import {
  Search,
  Send,
  ArrowLeftRight,
  Rocket,
  Briefcase,
  Building2,
  Wallet,
  Activity,
  Droplets,
  Settings,
  Home,
  X,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFaucet: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenFaucet }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "home",
      title: "Dashboard Home",
      category: "Navigation",
      icon: Home,
      action: () => router.push("/app"),
    },
    {
      id: "pay",
      title: "Pay & Request USDC",
      category: "Financial",
      icon: Send,
      action: () => router.push("/app/pay"),
    },
    {
      id: "swap",
      title: "Swap Tokens (DEX)",
      category: "Financial",
      icon: ArrowLeftRight,
      action: () => router.push("/app/swap"),
    },
    {
      id: "launch",
      title: "Launch Onchain Token",
      category: "Deploy",
      icon: Rocket,
      action: () => router.push("/app/launch"),
    },
    {
      id: "jobs",
      title: "Browse Jobs & Bounties",
      category: "Work",
      icon: Briefcase,
      action: () => router.push("/app/jobs"),
    },
    {
      id: "company",
      title: "Company & Payroll Dashboard",
      category: "Enterprise",
      icon: Building2,
      action: () => router.push("/app/company"),
    },
    {
      id: "wallet",
      title: "Wallet & Smart Vault",
      category: "Account",
      icon: Wallet,
      action: () => router.push("/app/wallet"),
    },
    {
      id: "activity",
      title: "Activity & Transaction Ledger",
      category: "History",
      icon: Activity,
      action: () => router.push("/app/activity"),
    },
    {
      id: "faucet",
      title: "Claim 1,000 Testnet USDC (Faucet)",
      category: "Tools",
      icon: Droplets,
      action: () => {
        onClose();
        onOpenFaucet();
      },
    },
    {
      id: "settings",
      title: "Settings & Preferences",
      category: "Account",
      icon: Settings,
      action: () => router.push("/app/settings"),
    },
  ];

  const filtered = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#080D26] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col text-white animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching actions found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full p-3 rounded-2xl hover:bg-white/[0.06] flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-cyan-300 group-hover:bg-arc-blue/20 group-hover:border-arc-blue/40 transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">
                    ↵ Jump
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.06] bg-[#050713] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ArcOne Instant Command</span>
          </div>
          <span>Press ↵ to select</span>
        </div>

      </div>
    </div>
  );
}
