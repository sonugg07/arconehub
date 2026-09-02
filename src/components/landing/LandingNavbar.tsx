"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/lib/utils";
import { ArrowUpRight, Menu, X, Wallet, Sparkles, Activity } from "lucide-react";

interface LandingNavbarProps {
  onOpenConnectModal?: () => void;
}

export function LandingNavbar({ onOpenConnectModal }: LandingNavbarProps) {
  const { isConnected, address, networkName, openConnectModal } = useWeb3();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnectClick = () => {
    if (onOpenConnectModal) onOpenConnectModal();
    else openConnectModal();
  };

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Jobs", href: "#jobs" },
    { label: "Launch", href: "#launch" },
    { label: "Arc Ecosystem", href: "#ecosystem" },
    { label: "Docs", href: "https://docs.arcone.hub", external: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060919]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-glass py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <ArcOneLogo size="md" showTagline={false} />
          
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-arc-blue/10 border border-arc-blue/25 text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold">{networkName}</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all flex items-center gap-1"
            >
              {link.label}
              {link.external && <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isConnected && address ? (
            <button
              onClick={handleConnectClick}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {formatAddress(address)}
            </button>
          ) : (
            <button
              onClick={handleConnectClick}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-cyan-400" />
              Connect Wallet
            </button>
          )}

          <Link
            href="/app"
            className="glass-button px-5 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 group"
          >
            <span>Launch App</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/app"
            className="glass-button px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase"
          >
            App
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-4 pb-6 bg-[#070B1D]/95 backdrop-blur-2xl border-b border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-slate-400 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Network
            </span>
            <span className="text-xs font-semibold text-cyan-300">{networkName}</span>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/[0.05] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleConnectClick();
              }}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4 text-cyan-400" />
              {isConnected && address ? formatAddress(address) : "Connect Wallet"}
            </button>
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="glass-button w-full py-2.5 rounded-xl text-xs font-bold text-white uppercase text-center"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
