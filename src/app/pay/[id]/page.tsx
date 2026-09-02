"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArcOneLogo } from "@/components/brand/ArcOneLogo";
import { useWeb3 } from "@/context/Web3Context";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { getPaymentRequestById, markPaymentRequestPaid, PaymentRequest } from "@/lib/paymentRequests";
import { formatAddress, formatUSDC } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  Wallet,
  Clock,
  ArrowRight,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function PaymentLinkPage() {
  const params = useParams();
  const requestId = (params?.id as string) || "req_arc_9821";

  const { isConnected, address, usdcBalance, isWrongNetwork, connectWallet, switchNetwork, sendUSDC, openConnectModal } = useWeb3();

  const [reqData, setReqData] = useState<PaymentRequest | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const data = getPaymentRequestById(requestId);
    if (data) {
      setReqData(data);
      if (data.status === "Paid" && data.txHash) {
        setPaymentSuccess(true);
        setTxHash(data.txHash);
      }
    } else {
      // Fallback dynamic request
      setReqData({
        id: requestId,
        recipient: "0x71C94B98E2A7d1eF8459427bE48A1054C542E61F",
        amount: 25.0,
        message: "ArcOne Hub Payment Link",
        createdAt: new Date().toISOString(),
        expiry: "7 days",
        status: "Pending",
      });
    }
  }, [requestId]);

  const handlePay = async () => {
    if (!reqData) return;
    setErrorMessage(null);

    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    if (usdcBalance < reqData.amount) {
      setErrorMessage(`Insufficient USDC on Arc Testnet. You have ${usdcBalance.toFixed(2)} USDC.`);
      return;
    }

    setIsPaying(true);

    try {
      const result = await sendUSDC(reqData.recipient, reqData.amount);

      if (result.success && result.hash) {
        markPaymentRequestPaid(reqData.id, result.hash);
        setPaymentSuccess(true);
        setTxHash(result.hash);
        setReqData((prev) => (prev ? { ...prev, status: "Paid", txHash: result.hash } : null));

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#0066FF", "#7928CA", "#00D2FF", "#10B981"],
          });
        } catch {}
      } else {
        setErrorMessage(result.error || "Transaction failed or was rejected.");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMessage(e?.message || "Payment execution failed.");
    } finally {
      setIsPaying(false);
    }
  };

  if (!reqData) {
    return (
      <div className="min-h-screen bg-[#050713] flex items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="text-sm text-slate-400">Loading payment request...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050713] text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-arc-blue/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto w-full z-10">
        <ArcOneLogo size="md" showTagline={true} taglineText="SECURE PAY" href="/" />
        <Link
          href="/app"
          className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]"
        >
          Open Super-App
        </Link>
      </header>

      {/* Main Payment Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md rounded-3xl bg-[#080D26]/95 border border-white/[0.12] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-arc-blue/20 border border-arc-blue/40 text-[11px] font-bold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{arcTestnet.name} Native USDC</span>
            </div>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              reqData.status === "Paid" || paymentSuccess
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}>
              {paymentSuccess || reqData.status === "Paid" ? "PAID" : "PENDING"}
            </span>
          </div>

          {/* Amount Display */}
          <div className="flex flex-col items-center text-center py-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Payment Request
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white font-sans tracking-tight">
              {formatUSDC(reqData.amount)}
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              &ldquo;{reqData.message}&rdquo;
            </p>
          </div>

          {/* Recipient & Network Details */}
          <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Recipient Address:</span>
              <span className="font-mono text-cyan-300 font-bold">{formatAddress(reqData.recipient, 6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Network:</span>
              <span className="font-mono text-white">{arcTestnet.name} (#{arcTestnet.chainId})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Est. Gas Fee:</span>
              <span className="font-mono text-emerald-400 font-semibold">0.0009 USDC</span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success State View */}
          {paymentSuccess && txHash ? (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span className="text-sm font-bold text-white">Payment Confirmed Onchain!</span>
                <span className="text-xs text-slate-300">Transaction verified on Arc Testnet</span>
              </div>

              <a
                href={getExplorerTxUrl(txHash)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View on ArcScan Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/app"
                className="w-full glass-button py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            /* Action Button */
            <div className="flex flex-col gap-3">
              {!isConnected ? (
                <button
                  type="button"
                  onClick={() => connectWallet()}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-cyan-200" />
                  <span>Connect Wallet to Pay</span>
                </button>
              ) : isWrongNetwork ? (
                <button
                  type="button"
                  onClick={() => switchNetwork()}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Switch to Arc Testnet</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPaying}
                  onClick={handlePay}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-cyan-200" />
                  <span>{isPaying ? "Authorizing on Arc..." : `Pay ${formatUSDC(reqData.amount)} Now`}</span>
                </button>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Your Balance: {isConnected ? `${usdcBalance.toFixed(2)} USDC` : "—"}</span>
                <a
                  href={arcTestnet.faucetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Get Test USDC</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Security Guarantee Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct onchain transfer via Arc Testnet. Zero custodial escrow.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500">
        ArcOne Hub • Arc Testnet Chain ID #{arcTestnet.chainId}
      </footer>

    </div>
  );
}
