"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/lib/utils";
import {
  LayoutDashboard,
  Send,
  ArrowLeftRight,
  Rocket,
  Briefcase,
  Building2,
  Wallet,
  Activity,
  Settings,
  Copy,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected, address, networkName, blockNumber, pingMs, openConnectModal } = useWeb3();
  const [copied, setCopied] = React.useState(false);

  const navItems = [
    { label: "Home", href: "/app", icon: LayoutDashboard },
    { label: "Pay", href: "/app/pay", icon: Send },
    { label: "Swap", href: "/app/swap", icon: ArrowLeftRight },
    { label: "Launch", href: "/app/launch", icon: Rocket },
    { label: "Jobs", href: "/app/jobs", icon: Briefcase },
    { label: "Company", href: "/app/company", icon: Building2 },
    { label: "Wallet", href: "/app/wallet", icon: Wallet },
    { label: "Activity", href: "/app/activity", icon: Activity },
    { label: "Settings", href: "/app/settings", icon: Settings },
  ];

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-[#060919]/90 backdrop-blur-2xl border-r border-white/[0.08] p-5 select-none z-30">
      
      {/* Top Brand Logo */}
      <div className="flex flex-col gap-6">
        <div className="px-2 pt-2">
          <ArcOneLogo size="md" showTagline={true} taglineText="SUPER-APP" href="/app" />
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-arc-blue/20 to-arc-violet/20 text-white border border-cyan-400/30 shadow-glow-blue"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-gradient-to-tr from-cyan-400 to-arc-blue text-white shadow-md"
                      : "bg-white/[0.03] group-hover:bg-white/[0.08] text-slate-400 group-hover:text-cyan-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D2FF]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Network & Wallet Section */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.08]">
        
        {/* Network Status Badge */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              {networkName}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            #{blockNumber.toLocaleString()}
          </span>
        </div>

        {/* Mini Wallet Address Card */}
        {isConnected && address ? (
          <div className="p-3 rounded-2xl bg-[#090E26] border border-white/[0.08] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">Connected Key</span>
              <span className="text-[10px] font-mono text-cyan-400">{pingMs}ms</span>
            </div>

            <div className="flex items-center justify-between bg-white/[0.02] p-1.5 rounded-xl border border-white/[0.04]">
              <span className="text-xs font-mono font-bold text-white">
                {formatAddress(address, 4)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  title="Copy address"
                  className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`https://explorer.testnet.arc.network/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on explorer"
                  className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {copied && (
              <span className="text-[10px] text-emerald-400 text-center font-semibold">
                Address copied!
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={openConnectModal}
            className="w-full py-2.5 rounded-xl glass-button text-center text-xs font-bold text-white cursor-pointer"
          >
            Connect Wallet
          </button>
        )}

      </div>
    </aside>
  );
}
