"use client";

import React from "react";
import Link from "next/link";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { ArrowUpRight, Github, Twitter, Disc as Discord, Shield, Activity } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative pt-16 pb-12 border-t border-white/[0.08] bg-[#040612] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <ArcOneLogo size="md" showTagline={true} taglineText="ONE HUB. EVERYTHING ONCHAIN." />
            <p className="text-slate-400 text-sm max-w-sm mt-2 leading-relaxed">
              The unified financial super-app designed for the Arc ecosystem. Pay, swap, launch tokens, and hire talent with sub-second USDC settlement.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-bold uppercase tracking-wider text-[11px] mb-1">Products</span>
            <Link href="/app/pay" className="hover:text-cyan-300 transition-colors">ArcOne Pay</Link>
            <Link href="/app/swap" className="hover:text-cyan-300 transition-colors">ArcOne Swap (DEX)</Link>
            <Link href="/app/launch" className="hover:text-cyan-300 transition-colors">Token Launchpad</Link>
            <Link href="/app/jobs" className="hover:text-cyan-300 transition-colors">Jobs & Escrow</Link>
            <Link href="/app/company" className="hover:text-cyan-300 transition-colors">Company Suite</Link>
            <Link href="/app/wallet" className="hover:text-cyan-300 transition-colors">Smart Vault</Link>
          </div>

          {/* Col 3: Ecosystem */}
          <div className="flex flex-col gap-2.5">
            <span className="text-white font-bold uppercase tracking-wider text-[11px] mb-1">Ecosystem</span>
            <a href="#ecosystem" className="hover:text-cyan-300 transition-colors">Arc Testnet Node</a>
            <a href="#ecosystem" className="hover:text-cyan-300 transition-colors">USDC Settlement</a>
            <a href="https://docs.arcone.hub" target="_blank" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span>Developer SDKs</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="https://docs.arcone.hub" target="_blank" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span>Smart Contracts</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="https://docs.arcone.hub" target="_blank" className="hover:text-cyan-300 transition-colors">Security Audits</a>
          </div>

          {/* Col 4: Status & Network */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-bold uppercase tracking-wider text-[11px]">Network Status</span>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Arc Testnet
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">Operational</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-white/[0.04] pt-1.5">
                <span>EVM TPS</span>
                <span className="font-mono text-white">2,850/s</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © {new Date().getFullYear()} ArcOne Hub. All rights reserved. One Hub. Everything Onchain.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Brand Assets</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
