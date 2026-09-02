"use client";

import React from "react";
import Link from "next/link";
import { HeroOrbCanvas } from "@/components/3d/HeroOrbCanvas";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";

interface LandingHeroProps {
  onOpenConnectModal: () => void;
}

export function LandingHero({ onOpenConnectModal }: LandingHeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Top Ecosystem Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-arc-blue/10 border border-arc-blue/30 backdrop-blur-md mb-6 animate-pulse-glow">
              <span className="w-2 h-2 rounded-full bg-arc-electric shadow-[0_0_8px_#00D2FF]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Built for the Arc Ecosystem & USDC
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono">
                v1.0 Live
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.08] mb-4">
              One Hub. <br />
              <span className="text-gradient-arc">Everything Onchain.</span>
            </h1>

            {/* Second Line Tagline */}
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-arc-electric via-arc-violet to-cyan-300 mb-6 tracking-wide">
              Pay. Swap. Launch. Work.
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 font-normal">
              A unified onchain super-app for instant payments, frictionless swaps, custom token launches, and escrow-protected Web3 work — powered by the speed of <strong className="text-white font-semibold">Arc</strong> and the stability of <strong className="text-cyan-300 font-semibold">USDC</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                href="/app"
                className="glass-button w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-3 shadow-glow-blue group"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                className="glass-button-secondary w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-arc-electric" />
                <span>Explore Hub</span>
              </a>
            </div>

            {/* Trust Badges & Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] w-full max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1">
                  <span>&lt;400</span>
                  <span className="text-sm font-normal text-cyan-400">ms</span>
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">EVM Finality</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1">
                  <span>$0.001</span>
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Native USDC Gas</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 inline" />
                  <span>100%</span>
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Escrow Secured</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Visual with Layered HUD */}
          <div className="lg:col-span-6 xl:col-span-5 relative w-full flex items-center justify-center">
            <HeroOrbCanvas />
          </div>

        </div>
      </div>
    </section>
  );
}
