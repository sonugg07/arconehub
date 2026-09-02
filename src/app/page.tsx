"use client";

import React, { useState } from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ArcEcosystemSection } from "@/components/landing/ArcEcosystemSection";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LaunchAppCTA } from "@/components/landing/LaunchAppCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ConnectWalletModal } from "@/components/modals/ConnectWalletModal";

export default function LandingPage() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#050713] text-white selection:bg-arc-blue/30 selection:text-white">
      {/* Dynamic Background */}
      <HeroBackground />

      {/* Floating Glass Navbar */}
      <LandingNavbar onOpenConnectModal={() => setConnectModalOpen(true)} />

      {/* Hero Section */}
      <LandingHero onOpenConnectModal={() => setConnectModalOpen(true)} />

      {/* Live Stats Strip */}
      <LandingStats />

      {/* 6 3D Feature Cards */}
      <FeatureSection />

      {/* How It Works (3 Steps) */}
      <HowItWorks />

      {/* Arc Ecosystem & 3D Network Spotlight */}
      <ArcEcosystemSection />

      {/* FAQ */}
      <LandingFAQ />

      {/* Direct Launch App Call to Action Section */}
      <LaunchAppCTA />

      {/* Footer */}
      <LandingFooter />

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />
    </main>
  );
}
