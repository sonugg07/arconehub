"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Swap3DVisual } from "@/components/3d/Feature3DVisuals";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { executeRealArcSwap } from "@/lib/blockchain";
import { getStoredTokens, DeployedToken } from "@/lib/tokenRegistry";
import { fetchAccurateTokenBalance, saveLocalTokenBalance, getLocalTokenBalances, addLocalUSDCDelta } from "@/lib/userBalances";
import { formatNumber, formatUSDC, formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  ArrowDownUp,
  Settings,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  AlertCircle,
  Coins,
  ChevronDown,
  Search,
  X,
  Wallet,
} from "lucide-react";

function SwapPageContent() {
  const searchParams = useSearchParams();
  const requestedSymbol = searchParams.get("token");

  const { address, isConnected, isWrongNetwork, usdcBalance, switchNetwork, openConnectModal, openFaucet, refreshBalance } = useWeb3();
  const { addNotification } = useNotifications();
  const { addActivity } = useActivity();

  // Dynamic Token Registry
  const [availableTokens, setAvailableTokens] = useState<DeployedToken[]>([]);
  const [payToken, setPayToken] = useState<DeployedToken | null>(null);
  const [receiveToken, setReceiveToken] = useState<DeployedToken | null>(null);

  // Accurate Live Token Balances Map
  const [tokenBalancesMap, setTokenBalancesMap] = useState<Record<string, number>>({});
  const [payTokenBalance, setPayTokenBalance] = useState<number>(0);
  const [receiveTokenBalance, setReceiveTokenBalance] = useState<number>(0);
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);

  // Form State
  const [payAmount, setPayAmount] = useState<string>("1");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Modal Selector State
  const [selectorModalOpen, setSelectorModalOpen] = useState<"pay" | "receive" | null>(null);
  const [tokenSearch, setTokenSearch] = useState<string>("");

  // Swap Execution State
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<{
    txHash: string;
    payAmount: number;
    paySymbol: string;
    receiveAmount: number;
    receiveSymbol: string;
  } | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Load tokens and initialize defaults
  useEffect(() => {
    const tokens = getStoredTokens();
    setAvailableTokens(tokens);

    const usdc = tokens.find((t) => t.symbol === "USDC") || tokens[0];
    let initialOther = tokens.find((t) => t.symbol === "ARCX") || tokens[1] || tokens[0];

    if (requestedSymbol) {
      const match = tokens.find((t) => t.symbol.toUpperCase() === requestedSymbol.toUpperCase());
      if (match) {
        initialOther = match;
      }
    }

    setPayToken(usdc);
    setReceiveToken(initialOther);
  }, [requestedSymbol]);

  // Fetch real onchain balances for ALL available tokens
  const fetchAllTokenBalances = useCallback(async () => {
    if (!address || !isConnected) {
      setTokenBalancesMap({});
      setPayTokenBalance(0);
      setReceiveTokenBalance(0);
      return;
    }

    const tokens = getStoredTokens();
    const newBalances: Record<string, number> = {};

    for (const t of tokens) {
      const b = await fetchAccurateTokenBalance(t, address, usdcBalance);
      newBalances[t.symbol.toUpperCase()] = b;
    }

    setTokenBalancesMap(newBalances);

    if (payToken) {
      setPayTokenBalance(newBalances[payToken.symbol.toUpperCase()] ?? 0);
    }
    if (receiveToken) {
      setReceiveTokenBalance(newBalances[receiveToken.symbol.toUpperCase()] ?? 0);
    }
  }, [address, isConnected, payToken, receiveToken, usdcBalance]);

  useEffect(() => {
    fetchAllTokenBalances();
  }, [fetchAllTokenBalances]);

  if (!payToken || !receiveToken) {
    return null;
  }

  // Calculate Exchange Rate Dynamically
  const parsedPay = parseFloat(payAmount) || 0;
  const payPrice = payToken.priceUSDC || 1.0;
  const receivePrice = receiveToken.priceUSDC || 1.0;
  const rate = payPrice / receivePrice;
  const estimatedReceive = parsedPay * rate;

  const handleFlipTokens = () => {
    const temp = payToken;
    setPayToken(receiveToken);
    setReceiveToken(temp);
    setSelectedPercent(null);
    setSwapResult(null);
    setSwapError(null);
  };

  const handleSelectToken = (token: DeployedToken) => {
    if (selectorModalOpen === "pay") {
      if (token.symbol === receiveToken.symbol) {
        setReceiveToken(payToken);
      }
      setPayToken(token);
    } else if (selectorModalOpen === "receive") {
      if (token.symbol === payToken.symbol) {
        setPayToken(receiveToken);
      }
      setReceiveToken(token);
    }
    setSelectedPercent(null);
    setSelectorModalOpen(null);
    setTokenSearch("");
  };

  // Percentage Quick Select Handler (25%, 50%, 75%, 100% / MAX)
  const handlePercentClick = (percent: number) => {
    setSelectedPercent(percent);
    const maxVal = payTokenBalance;

    if (maxVal <= 0) {
      setPayAmount("0");
      return;
    }

    let calculated = (maxVal * percent) / 100;
    if (calculated < 0.0001 && calculated > 0) {
      setPayAmount(calculated.toString());
    } else {
      const formatted = parseFloat(calculated.toFixed(4)).toString();
      setPayAmount(formatted);
    }
  };

  const handleSwap = async () => {
    setSwapError(null);

    if (!isConnected || !address) {
      openConnectModal();
      return;
    }

    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    if (parsedPay <= 0) {
      setSwapError("Amount must be greater than zero.");
      return;
    }

    if (parsedPay > payTokenBalance) {
      setSwapError(`Insufficient ${payToken.symbol} balance. You have ${formatNumber(payTokenBalance, 2)} ${payToken.symbol}.`);
      return;
    }

    setIsSwapping(true);

    try {
      const result = await executeRealArcSwap({
        paySymbol: payToken.symbol,
        receiveSymbol: receiveToken.symbol,
        payAmount: parsedPay,
        receiveAmount: estimatedReceive,
        payTokenAddress: payToken.address,
        receiveTokenAddress: receiveToken.address,
      });

      // Update local accurate balances
      if (payToken.symbol === "USDC") {
        // Bought custom token with USDC
        if (receiveToken.symbol !== "USDC") {
          const newRecBal = receiveTokenBalance + result.receivedAmount;
          saveLocalTokenBalance(address, receiveToken.symbol, newRecBal);
        }
      } else if (receiveToken.symbol === "USDC") {
        // Sold custom token for USDC -> decrease token balance, credit received USDC!
        const newPayBal = Math.max(0, payTokenBalance - parsedPay);
        saveLocalTokenBalance(address, payToken.symbol, newPayBal);
        addLocalUSDCDelta(address, result.receivedAmount);
      } else {
        // Custom token -> Custom token
        const newPayBal = Math.max(0, payTokenBalance - parsedPay);
        saveLocalTokenBalance(address, payToken.symbol, newPayBal);
        const newRecBal = receiveTokenBalance + result.receivedAmount;
        saveLocalTokenBalance(address, receiveToken.symbol, newRecBal);
      }

      setSwapResult({
        txHash: result.txHash,
        payAmount: parsedPay,
        paySymbol: payToken.symbol,
        receiveAmount: result.receivedAmount,
        receiveSymbol: receiveToken.symbol,
      });

      addNotification({
        title: "Swap Executed on Arc Testnet!",
        message: `Swapped ${parsedPay} ${payToken.symbol} for ${result.receivedAmount.toFixed(2)} ${receiveToken.symbol}.`,
        type: "success",
      });

      addActivity({
        category: "swaps",
        title: `Swap: ${payToken.symbol} → ${receiveToken.symbol}`,
        subtitle: `Traded ${parsedPay} ${payToken.symbol} for ${result.receivedAmount.toFixed(2)} ${receiveToken.symbol}`,
        amount: `-${parsedPay.toFixed(2)}`,
        token: payToken.symbol,
        usdValue: parsedPay * payPrice,
        recipientOrContract: receiveToken.address,
        status: "confirmed",
        txHash: result.txHash,
      });

      await refreshBalance();
      await fetchAllTokenBalances();

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7928CA", "#0066FF", "#00D2FF", "#10B981"],
        });
      } catch {}
    } catch (err: unknown) {
      const e = err as { message?: string; code?: number | string };
      console.error("Swap transaction error:", err);
      if (e?.code === 4001 || e?.code === "ACTION_REJECTED") {
        setSwapError("Swap rejected by user in wallet.");
      } else {
        setSwapError(e?.message || "Failed to execute swap on Arc Testnet.");
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const filteredTokens = availableTokens.filter(
    (t) =>
      t.name.toLowerCase().includes(tokenSearch.toLowerCase()) ||
      t.symbol.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Arc Testnet AMM DEX (Chain #{arcTestnet.chainId})</span>
            </div>
            <h1 className="text-3xl font-black text-white">ArcOne Swap</h1>
            <p className="text-sm text-slate-400 mt-1">
              Buy and sell native USDC and any launched Arc tokens with real-time balance tracking.
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

        {/* Swap Success Banner */}
        {swapResult && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0A1133] to-purple-950/60 border border-purple-500/40 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Swap Confirmed Onchain!</h3>
                  <p className="text-xs text-purple-200">
                    Received <strong>{swapResult.receiveAmount.toFixed(2)} ${swapResult.receiveSymbol}</strong> on Arc Testnet.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                CONFIRMED
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={getExplorerTxUrl(swapResult.txHash)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <span>View on ArcScan Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Swap Card (Left 7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#080D26]/95 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 shadow-glass relative">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Swap Interface</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                  {payToken.symbol} ↔ {receiveToken.symbol}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Slippage Settings Drawer */}
            {showSettings && (
              <div className="p-3.5 mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold text-slate-300">Slippage Tolerance</span>
                <div className="flex items-center gap-2">
                  {[0.1, 0.5, 1.0].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlippage(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        slippage === s
                          ? "bg-purple-500 text-white shadow-md"
                          : "bg-white/[0.05] text-slate-400 hover:text-white"
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto">
                    Default 0.5%
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              
              {/* YOU PAY PANEL */}
              <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">You Pay</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Wallet className="w-3 h-3 text-slate-400" />
                    <span>
                      Bal:{" "}
                      <strong className="text-white font-mono">
                        {isConnected ? formatNumber(payTokenBalance, 2) : "0.00"} {payToken.symbol}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="0.0"
                    value={payAmount}
                    onChange={(e) => {
                      setPayAmount(e.target.value);
                      setSelectedPercent(null);
                    }}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white font-sans focus:outline-none placeholder-slate-600"
                  />

                  {/* Token Selector Button */}
                  <button
                    type="button"
                    onClick={() => setSelectorModalOpen("pay")}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-white flex items-center gap-2 shrink-0 cursor-pointer transition-colors shadow-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: payToken.color || "#0066ff" }}
                    />
                    <span>{payToken.symbol}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Percentage Quick-Select Buttons (25%, 50%, 75%, 100%) */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] gap-1.5">
                  <div className="text-[11px] text-slate-400">
                    ≈ ${formatNumber(parsedPay * payPrice, 2)} USD
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[
                      { label: "25%", val: 25 },
                      { label: "50%", val: 50 },
                      { label: "75%", val: 75 },
                      { label: "MAX", val: 100 },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handlePercentClick(btn.val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          selectedPercent === btn.val
                            ? "bg-purple-500 text-white shadow-sm ring-1 ring-purple-300"
                            : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FLIP BUTTON */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={handleFlipTokens}
                  className="w-10 h-10 rounded-2xl bg-[#080D26] hover:bg-[#101740] border border-white/[0.12] hover:border-purple-400/50 flex items-center justify-center text-purple-400 shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Flip Pay and Receive"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
              </div>

              {/* YOU RECEIVE PANEL */}
              <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">You Receive (Estimated)</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Wallet className="w-3 h-3 text-slate-400" />
                    <span>
                      Bal:{" "}
                      <strong className="text-slate-300 font-mono">
                        {isConnected ? formatNumber(receiveTokenBalance, 2) : "0.00"} {receiveToken.symbol}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="w-full text-2xl sm:text-3xl font-black text-purple-300 font-sans truncate">
                    {formatNumber(estimatedReceive, 2)}
                  </div>

                  {/* Token Selector Button */}
                  <button
                    type="button"
                    onClick={() => setSelectorModalOpen("receive")}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-white flex items-center gap-2 shrink-0 cursor-pointer transition-colors shadow-sm"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: receiveToken.color || "#8b5cf6" }}
                    />
                    <span>{receiveToken.symbol}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>1 {payToken.symbol} ≈ {rate.toFixed(4)} {receiveToken.symbol}</span>
                  <span>Arc Constant Product AMM</span>
                </div>
              </div>

              {/* ROUTE BREAKDOWN */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Network:</span>
                  <span className="font-mono text-white">{arcTestnet.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Contract:</span>
                  <span className="font-mono text-cyan-300">{formatAddress(receiveToken.address, 4)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Arc Settlement Speed:</span>
                  <span className="text-cyan-300 font-medium">&lt; 400ms finality</span>
                </div>
              </div>

              {/* Error Notice */}
              {swapError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{swapError}</span>
                </div>
              )}

              {/* ACTION BUTTON */}
              {!isConnected ? (
                <button
                  type="button"
                  onClick={openConnectModal}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <span>Connect Wallet to Swap</span>
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
                  type="button"
                  disabled={isSwapping}
                  onClick={handleSwap}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>{isSwapping ? "Executing Swap on Arc..." : `Swap ${payAmount} ${payToken.symbol} to ${receiveToken.symbol}`}</span>
                </button>
              )}

            </div>
          </div>

          {/* Right Column: 3D Visual & Launched Tokens Quick Trade List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 3D Orbiting Visual Card */}
            <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 flex flex-col items-center text-center shadow-glass relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                AMM Liquidity Pool
              </div>
              <h3 className="text-lg font-bold text-white">{payToken.symbol} / {receiveToken.symbol} Pool</h3>

              <Swap3DVisual />

              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Connects high-throughput liquidity pools directly to the Arc L1 consensus layer.
              </p>
            </div>

            {/* Launched Tokens Quick Switch Directory */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Launched Token Pairs ({availableTokens.length})</span>
                </h4>
                <span className="text-[10px] text-cyan-300 font-mono">Real Arc Testnet</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {availableTokens.map((t) => {
                  const bal = tokenBalancesMap[t.symbol.toUpperCase()] ?? 0;
                  return (
                    <button
                      key={t.address}
                      type="button"
                      onClick={() => {
                        if (payToken.symbol === t.symbol) {
                          setPayToken(t);
                        } else {
                          setReceiveToken(t);
                        }
                        setSelectedPercent(null);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                        receiveToken.symbol === t.symbol || payToken.symbol === t.symbol
                          ? "bg-purple-500/20 border-purple-400/40 text-white"
                          : "bg-white/[0.02] border-white/[0.04] text-slate-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: t.color || "#8b5cf6" }}
                        />
                        <div className="text-left">
                          <span className="font-bold block">${t.symbol}</span>
                          <span className="text-[10px] text-slate-400">{t.name}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          {isConnected ? `${formatNumber(bal, 2)} ${t.symbol}` : `0.00 ${t.symbol}`}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">
                          ${t.priceUSDC} USDC
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Token Selector Drawer */}
        {selectorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-sm rounded-3xl bg-[#080D26] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  Select {selectorModalOpen === "pay" ? "Pay" : "Receive"} Token
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectorModalOpen(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search token name, symbol or address..."
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-purple-400/50 font-mono"
                />
              </div>

              {/* Token List with Live Real-Time Balances */}
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredTokens.map((token) => {
                  const bal = tokenBalancesMap[token.symbol.toUpperCase()] ?? 0;
                  return (
                    <button
                      key={token.address}
                      type="button"
                      onClick={() => handleSelectToken(token)}
                      className="w-full p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-purple-400/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: token.color || "#8b5cf6" }}
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            ${token.symbol}
                          </div>
                          <div className="text-[10px] text-slate-400">{token.name}</div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <div className="text-xs font-mono font-bold text-white">
                          {isConnected ? `${formatNumber(bal, 2)} ${token.symbol}` : `0.00 ${token.symbol}`}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-300">
                          ${token.priceUSDC} USDC
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default function SwapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050713]" />}>
      <SwapPageContent />
    </Suspense>
  );
}
