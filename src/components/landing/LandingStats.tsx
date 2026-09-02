"use client";

import React from "react";

export function LandingStats() {
  const stats = [
    { label: "Simulated Volume", value: "$48.5M+", sub: "Across all modules" },
    { label: "Total Transactions", value: "142,800+", sub: "Verified on Arc Testnet" },
    { label: "Avg Block Finality", value: "390ms", sub: "Sub-second deterministic" },
    { label: "Average Gas Fee", value: "< $0.001", sub: "Paid directly in USDC" },
  ];

  return (
    <div className="relative py-12 border-y border-white/[0.08] bg-[#070A1E]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                {st.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mt-1">
                {st.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {st.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
