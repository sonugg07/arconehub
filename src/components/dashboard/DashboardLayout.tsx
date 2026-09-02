"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MobileNav } from "./MobileNav";
import { FaucetModal } from "@/components/modals/FaucetModal";
import { ConnectWalletModal } from "@/components/modals/ConnectWalletModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [faucetOpen, setFaucetOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050713] text-white">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12">
        <TopHeader
          onOpenFaucet={() => setFaucetOpen(true)}
          onOpenConnectModal={() => setConnectOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals */}
      <FaucetModal isOpen={faucetOpen} onClose={() => setFaucetOpen(false)} />
      <ConnectWalletModal isOpen={connectOpen} onClose={() => setConnectOpen(false)} />
    </div>
  );
}
