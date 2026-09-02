"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Send,
  ArrowLeftRight,
  Briefcase,
  Wallet,
  Plus,
  Rocket,
  Building2,
  X,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [fabOpen, setFabOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/app", icon: LayoutDashboard },
    { label: "Pay", href: "/app/pay", icon: Send },
    { label: "Swap", href: "/app/swap", icon: ArrowLeftRight },
    { label: "Jobs", href: "/app/jobs", icon: Briefcase },
    { label: "Wallet", href: "/app/wallet", icon: Wallet },
  ];

  return (
    <>
      {/* Quick Action FAB Speed Dial Backdrop & Modal */}
      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-150 flex flex-col justify-end p-6 pb-28"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-3xl bg-[#090E26] border border-white/[0.12] p-5 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-1">
              Quick Actions
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/app/pay"
                onClick={() => setFabOpen(false)}
                className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Send USDC</div>
                  <div className="text-[10px] text-slate-400">Direct onchain</div>
                </div>
              </Link>

              <Link
                href="/app/swap"
                onClick={() => setFabOpen(false)}
                className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">DEX Swap</div>
                  <div className="text-[10px] text-slate-400">Instant route</div>
                </div>
              </Link>

              <Link
                href="/app/launch"
                onClick={() => setFabOpen(false)}
                className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Launch Token</div>
                  <div className="text-[10px] text-slate-400">Deploy ERC-20</div>
                </div>
              </Link>

              <Link
                href="/app/company"
                onClick={() => setFabOpen(false)}
                className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Company</div>
                  <div className="text-[10px] text-slate-400">Payroll & Escrow</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Glass Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#060919]/90 backdrop-blur-2xl border-t border-white/[0.08] px-4 py-2.5 flex items-center justify-between shadow-2xl">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Center FAB Button */}
        <div className="relative -top-5">
          <button
            onClick={() => setFabOpen(!fabOpen)}
            className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-white shadow-glow-blue transition-transform active:scale-95"
          >
            {fabOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </button>
        </div>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive ? "text-cyan-300" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
