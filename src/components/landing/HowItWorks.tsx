"use client";

import React from "react";
import { Wallet, Layers, Zap, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect",
      description: "Connect your Web3 wallet or spin up an instant Arc Testnet session key in seconds.",
      icon: Wallet,
      tag: "Zero Setup",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      num: "02",
      title: "Choose",
      description: "Select your financial action: send USDC, swap tokens, launch an asset, or accept a milestone job.",
      icon: Layers,
      tag: "All-in-One",
      gradient: "from-purple-600 to-indigo-500",
    },
    {
      num: "03",
      title: "Move",
      description: "Execute with sub-second EVM finality, minimal gas, and cryptographic transaction verification.",
      icon: Zap,
      tag: "Sub-second Settlement",
      gradient: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arc-violet/10 border border-arc-violet/30 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-4">
            Seamless Onboarding
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Three simple steps to unlock the full power of onchain financial freedom.
          </p>
        </div>

        {/* 3 Step Horizontal Layout with Connecting Beam Lines */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          {/* Animated Connecting Beam SVG for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] -translate-y-12 pointer-events-none z-0">
            <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 opacity-30 relative overflow-hidden">
              <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent animate-beam" />
            </div>
          </div>

          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.num}
                className="relative z-10 rounded-3xl bg-gradient-to-b from-[#0D1333]/90 to-[#070A1E]/90 border border-white/[0.08] backdrop-blur-xl p-8 flex flex-col items-start transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-1.5 shadow-glass group"
              >
                {/* Step Number & Tag */}
                <div className="w-full flex items-center justify-between mb-8">
                  <span className="text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-700">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-cyan-300">
                    {step.tag}
                  </span>
                </div>

                {/* Step Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} p-0.5 mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full bg-[#070A1E] rounded-[14px] flex items-center justify-center text-white">
                    <IconComp className="w-6 h-6 text-cyan-200" />
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-2xl font-extrabold text-white mb-3 flex items-center gap-2">
                  <span>{step.title}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
