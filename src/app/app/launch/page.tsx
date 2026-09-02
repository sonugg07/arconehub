"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Coin3DPreview } from "@/components/3d/Coin3DPreview";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { arcTestnet, getExplorerAddressUrl, getExplorerTxUrl } from "@/config/network";
import { deployRealERC20Token } from "@/lib/blockchain";
import { saveDeployedToken } from "@/lib/tokenRegistry";
import { formatNumber, formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Rocket,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Coins,
  Copy,
  Check,
  AlertCircle,
  FileCode,
  Zap,
} from "lucide-react";

export default function LaunchTokenPage() {
  const { address, isConnected, isWrongNetwork, usdcBalance, switchNetwork, openConnectModal, openFaucet, refreshBalance } = useWeb3();
  const { addNotification } = useNotifications();
  const { addActivity } = useActivity();

  // Form State
  const [tokenName, setTokenName] = useState("Nexus Protocol");
  const [symbol, setSymbol] = useState("NEXUS");
  const [description, setDescription] = useState("Decentralized cross-chain settlement asset powered by Arc & USDC.");
  const [totalSupply, setTotalSupply] = useState("10000000");
  const [decimals, setDecimals] = useState("18");
  const [themeColor, setThemeColor] = useState("#8b5cf6");

  // Deployment State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContract, setDeployedContract] = useState<{
    address: string;
    txHash: string;
    name: string;
    symbol: string;
    supply: string;
  } | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeployError(null);

    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    const trimmedName = tokenName.trim();
    const trimmedSymbol = symbol.trim().toUpperCase();
    const parsedSupply = parseFloat(totalSupply);
    const parsedDecimals = parseInt(decimals, 10);

    if (!trimmedName || !trimmedSymbol) {
      setDeployError("Please provide a valid token name and symbol.");
      return;
    }

    if (!parsedSupply || parsedSupply <= 0) {
      setDeployError("Total supply must be greater than zero.");
      return;
    }

    setIsDeploying(true);

    try {
      const result = await deployRealERC20Token({
        name: trimmedName,
        symbol: trimmedSymbol,
        decimals: parsedDecimals || 18,
        totalSupply: parsedSupply,
      });

      setDeployedContract({
        address: result.contractAddress,
        txHash: result.txHash,
        name: trimmedName,
        symbol: trimmedSymbol,
        supply: totalSupply,
      });

      // Save deployed token to shared registry so it appears in Swap immediately
      saveDeployedToken({
        address: result.contractAddress,
        name: trimmedName,
        symbol: trimmedSymbol,
        decimals: parsedDecimals || 18,
        totalSupply: parsedSupply,
        priceUSDC: 0.1, // Initial launch price on Arc
        creator: address || undefined,
        txHash: result.txHash,
        createdAt: new Date().toISOString(),
        color: themeColor,
      });

      addNotification({
        title: "Token Deployed on Arc Testnet!",
        message: `Successfully minted ${formatNumber(parsedSupply)} $${trimmedSymbol} at ${formatAddress(result.contractAddress, 4)}.`,
        type: "success",
      });

      addActivity({
        category: "tokens",
        title: `Token Deployed: $${trimmedSymbol}`,
        subtitle: `Created ${formatNumber(parsedSupply)} ${trimmedName} on Arc`,
        amount: formatNumber(parsedSupply),
        token: trimmedSymbol,
        usdValue: 0,
        recipientOrContract: result.contractAddress,
        status: "confirmed",
        txHash: result.txHash,
      });

      await refreshBalance();

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#8B5CF6", "#0066FF", "#00D2FF", "#10B981"],
        });
      } catch {}
    } catch (err: unknown) {
      const e = err as { message?: string; code?: number | string };
      console.error("Token deployment error:", err);
      if (e?.code === 4001 || e?.code === "ACTION_REJECTED") {
        setDeployError("Deployment rejected by user in wallet.");
      } else {
        setDeployError(e?.message || "Failed to deploy token on Arc Testnet.");
      }
    } finally {
      setIsDeploying(false);
    }
  };

  const copyAddress = () => {
    if (deployedContract?.address) {
      navigator.clipboard.writeText(deployedContract.address);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Arc Testnet Factory (Chain #{arcTestnet.chainId})</span>
            </div>
            <h1 className="text-3xl font-black text-white">Token Launchpad</h1>
            <p className="text-sm text-slate-400 mt-1">
              Deploy audited, standard ERC-20 smart contracts directly to the Arc Testnet.
            </p>
          </div>

          <button
            onClick={openFaucet}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Coins className="w-4 h-4 text-cyan-400" />
            <span>Get Test USDC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real Live Deployment Notification Card if Deployed */}
        {deployedContract && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#081B1F] to-emerald-950/60 border border-emerald-500/40 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Token Deployed Successfully!</h3>
                  <p className="text-xs text-emerald-300">
                    Your ERC-20 contract is live on Arc Testnet.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                LIVE ONCHAIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-300">Contract Address:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-300 font-bold">{formatAddress(deployedContract.address, 6)}</span>
                  <button
                    onClick={copyAddress}
                    className="p-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white cursor-pointer"
                  >
                    {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-300">Initial Supply:</span>
                <span className="font-mono text-white font-bold">{formatNumber(parseFloat(deployedContract.supply))} ${deployedContract.symbol}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getExplorerAddressUrl(deployedContract.address)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <span>View Contract on ArcScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {deployedContract.txHash && (
                <a
                  href={getExplorerTxUrl(deployedContract.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>Deployment Tx Hash</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <Link
                href={`/app/swap?token=${deployedContract.symbol}`}
                className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-glow-blue"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Trade ${deployedContract.symbol} on Swap</span>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Card (Left 7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#080D26]/95 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-fuchsia-400" />
                <span>Token Specifications</span>
              </h3>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Arc EVM Ready
              </span>
            </div>

            <form onSubmit={handleDeploy} className="flex flex-col gap-5">
              {/* Token Name & Symbol Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Token Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Protocol"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-fuchsia-400/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Token Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NEXUS"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:border-fuchsia-400/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Description / Project Utility</label>
                <textarea
                  rows={2}
                  placeholder="What does your token do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none focus:border-fuchsia-400/50 resize-none"
                />
              </div>

              {/* Total Supply & Decimals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Total Supply</label>
                  <input
                    type="number"
                    required
                    placeholder="10000000"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm font-mono focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Decimals</label>
                  <input
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Visual Color Accent */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300">Emblem Theme Gradient</label>
                <div className="flex items-center gap-3">
                  {[
                    { color: "#8b5cf6", name: "Violet" },
                    { color: "#0066ff", name: "Electric Blue" },
                    { color: "#06b6d4", name: "Cyan" },
                    { color: "#ec4899", name: "Pink" },
                    { color: "#10b981", name: "Emerald" },
                    { color: "#f59e0b", name: "Amber" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setThemeColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-8 h-8 rounded-xl transition-transform cursor-pointer ${
                        themeColor === c.color ? "scale-115 ring-2 ring-white shadow-lg" : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Error Notice */}
              {deployError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{deployError}</span>
                </div>
              )}

              {/* Action Button */}
              {!isConnected ? (
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <span>Connect Wallet to Deploy</span>
                </button>
              ) : isWrongNetwork ? (
                <button
                  type="button"
                  onClick={switchNetwork}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Switch to Arc Testnet</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isDeploying}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-fuchsia-200" />
                  <span>{isDeploying ? "Deploying on Arc Testnet..." : `Deploy $${symbol || "TOKEN"} on Arc Testnet`}</span>
                </button>
              )}

            </form>

          </div>

          {/* Right Column: Real-Time 3D Coin Preview Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Live 3D Card */}
            <div className="rounded-3xl bg-[#080D26]/95 border border-white/[0.08] backdrop-blur-xl p-6 flex flex-col items-center text-center shadow-glass relative overflow-hidden">
              <div className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 mb-1">
                Real-Time 3D Coin Preview
              </div>
              <h3 className="text-xl font-bold text-white">{tokenName || "Your Token"}</h3>
              <span className="text-xs font-mono text-cyan-300 font-semibold">${symbol || "SYMBOL"}</span>

              <Coin3DPreview
                symbol={symbol || "TOKEN"}
                color={themeColor}
                size={220}
                className="my-3"
              />

              <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06] text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Total Supply</span>
                  <span className="font-mono font-bold text-white">{formatNumber(parseFloat(totalSupply) || 0)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Decimals</span>
                  <span className="font-mono text-white">{decimals}</span>
                </div>
              </div>
            </div>

            {/* Contract Architecture Card */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2.5 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audited OpenZeppelin Standard</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Standardized Solidity bytecode is directly deployed to Arc Testnet. 100% of the initial supply is minted to your connected wallet address upon creation.
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
