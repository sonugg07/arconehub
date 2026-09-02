"use client";

import React, { useState, useEffect } from "react";
import { Web3Provider, useWeb3 } from "@/context/Web3Context";
import { NotificationProvider } from "@/context/NotificationContext";
import { JobsEscrowProvider } from "@/context/JobsEscrowContext";
import { ActivityProvider } from "@/context/ActivityContext";
import { TransactionModal } from "@/components/modals/TransactionModal";
import { FaucetModal } from "@/components/modals/FaucetModal";
import { NotificationDrawer } from "@/components/modals/NotificationDrawer";
import { CommandPalette } from "@/components/modals/CommandPalette";
import { ConnectWalletModal } from "@/components/modals/ConnectWalletModal";
import { WalletSignModal } from "@/components/modals/WalletSignModal";
import { WrongNetworkBanner } from "@/components/common/WrongNetworkBanner";

function GlobalModalsContainer() {
  const { isConnectModalOpen, closeConnectModal, isFaucetModalOpen, closeFaucet, openFaucet } = useWeb3();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <WrongNetworkBanner />
      <TransactionModal />
      <WalletSignModal />
      <NotificationDrawer />
      <ConnectWalletModal isOpen={isConnectModalOpen} onClose={closeConnectModal} />
      <FaucetModal isOpen={isFaucetModalOpen} onClose={closeFaucet} />
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenFaucet={() => openFaucet()}
      />
    </>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <NotificationProvider>
        <JobsEscrowProvider>
          <ActivityProvider>
            <GlobalModalsContainer />
            {children}
          </ActivityProvider>
        </JobsEscrowProvider>
      </NotificationProvider>
    </Web3Provider>
  );
}
