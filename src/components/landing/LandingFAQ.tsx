"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is ArcOne Hub?",
      a: "ArcOne Hub is a unified Web3 financial super-app engineered specifically for the Arc ecosystem. It combines USDC payments, token swaps, token creation, escrow-secured jobs, and streamed payroll into one sleek, high-performance interface.",
    },
    {
      q: "Why is ArcOne Hub powered by USDC and Arc?",
      a: "Arc provides sub-second EVM finality (<400ms) with predictable gas settled natively in USDC. This eliminates volatile gas spikes, failed transactions, and the need to hold multiple gas tokens for everyday financial operations.",
    },
    {
      q: "How does the Escrow and Work protocol function?",
      a: "When a company creates a job, the budget is locked in an audited smart contract escrow. Milestone payments are released directly to the contractor's wallet upon verified deliverable approval or streamed continuously on a per-second basis.",
    },
    {
      q: "Can I create and launch custom tokens on ArcOne Hub?",
      a: "Yes! The Launch module allows anyone to configure ERC-20 token parameters (name, symbol, supply, liquidity, tokenomics) with an interactive 3D coin preview and deploy directly to the Arc Testnet.",
    },
    {
      q: "How do I claim testnet funds to try the dashboard?",
      a: "Click on the 'Claim 1,000 USDC' Testnet Faucet button inside the app navigation bar or wallet page. You can instantly test payments, swaps, and token launches with zero real-world cost.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arc-blue/10 border border-arc-blue/20 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Got Questions? We’ve Got Answers.
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090D24]/80 border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                >
                  <span className="text-base sm:text-lg font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
