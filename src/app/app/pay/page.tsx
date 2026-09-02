"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Coin3DPreview } from "@/components/3d/Coin3DPreview";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { savePaymentRequest, getStoredPaymentRequests, PaymentRequest } from "@/lib/paymentRequests";
import { formatAddress, formatUSDC } from "@/lib/utils";
import { ethers } from "ethers";
import {
  Send,
  Download,
  Link as LinkIcon,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function PayPage() {
  const {
    address,
    isConnected,
    isWrongNetwork,
    usdcBalance,
    sendUSDC,
    switchNetwork,
    openConnectModal,
    openFaucet,
  } = useWeb3();

  const { addNotification } = useNotifications();
  const { addActivity } = useActivity();

  const [activeTab, setActiveTab] = useState<"send" | "request" | "links">("send");

  // Send Form State
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Request State
  const [reqAmount, setReqAmount] = useState("");
  const [reqMemo, setReqMemo] = useState("");

  // Payment Link State
  const [linkAmount, setLinkAmount] = useState("25");
  const [linkTitle, setLinkTitle] = useState("Consulting & Development");
  const [generatedReqId, setGeneratedReqId] = useState("req_arc_9821");
  const [linkCopied, setLinkCopied] = useState(false);

  // Saved Requests
  const [savedRequests, setSavedRequests] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    setSavedRequests(getStoredPaymentRequests());
  }, []);

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    const trimmedRecipient = recipient.trim();
    if (!trimmedRecipient || !ethers.isAddress(trimmedRecipient)) {
      setValidationError("Please enter a valid EVM recipient address (0x...).");
      return;
    }

    const sendAmt = parseFloat(amount);
    if (!sendAmt || sendAmt <= 0) {
      setValidationError("Amount must be greater than 0 USDC.");
      return;
    }

    if (sendAmt > usdcBalance) {
      setValidationError(`Insufficient USDC on Arc Testnet. You have ${usdcBalance.toFixed(2)} USDC.`);
      return;
    }

    setIsSending(true);

    try {
      const result = await sendUSDC(trimmedRecipient, sendAmt);

      if (result.success && result.hash) {
        addNotification({
          title: "USDC Payment Confirmed",
          message: `Transferred ${sendAmt.toFixed(2)} USDC to ${formatAddress(trimmedRecipient, 4)} on Arc Testnet.`,
          type: "success",
        });

        addActivity({
          category: "payments",
          title: "USDC Payment Sent",
          subtitle: `To: ${formatAddress(trimmedRecipient, 4)} ${memo ? `("${memo}")` : ""}`,
          amount: `-${sendAmt.toFixed(2)}`,
          token: "USDC",
          usdValue: sendAmt,
          recipientOrContract: trimmedRecipient,
          status: "confirmed",
          txHash: result.hash,
        });

        setAmount("");
        setMemo("");
        setRecipient("");
      } else {
        setValidationError(result.error || "Transaction was rejected or failed.");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setValidationError(e?.message || "Transaction execution failed.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreatePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `req_${Date.now()}`;
    const newReq: PaymentRequest = {
      id: newId,
      recipient: address || "0x71C94B98E2A7d1eF8459427bE48A1054C542E61F",
      amount: parseFloat(linkAmount) || 25,
      message: linkTitle || "ArcOne Hub Payment",
      createdAt: new Date().toISOString(),
      expiry: "14 days",
      status: "Pending",
    };

    savePaymentRequest(newReq);
    setGeneratedReqId(newId);
    setSavedRequests(getStoredPaymentRequests());

    addNotification({
      title: "Payment Link Created",
      message: `Created shareable link for ${formatUSDC(newReq.amount)}.`,
      type: "success",
    });
  };

  const generatedLink = typeof window !== "undefined"
    ? `${window.location.origin}/pay/${generatedReqId}`
    : `https://arcone.hub/pay/${generatedReqId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Arc Testnet (Chain #{arcTestnet.chainId})
            </div>
            <h1 className="text-3xl font-black text-white">ArcOne Pay</h1>
            <p className="text-sm text-slate-400 mt-1">
              Send and request native USDC with sub-second finality on the Arc Testnet.
            </p>
          </div>

          <button
            onClick={openFaucet}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Get Test USDC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#080D26] border border-white/[0.08] w-full sm:w-fit">
          <button
            onClick={() => setActiveTab("send")}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "send"
                ? "bg-gradient-to-r from-arc-blue to-cyan-500 text-white shadow-glow-blue"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send Real USDC</span>
          </button>

          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "request"
                ? "bg-gradient-to-r from-arc-blue to-cyan-500 text-white shadow-glow-blue"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Request USDC</span>
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "links"
                ? "bg-gradient-to-r from-arc-blue to-cyan-500 text-white shadow-glow-blue"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Payment Links</span>
          </button>
        </div>

        {/* TAB 1: SEND REAL USDC */}
        {activeTab === "send" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Card (Left 7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass">
              <form onSubmit={handleSendPayment} className="flex flex-col gap-6">
                
                {/* Real Available Balance Helper */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
                  <span className="text-slate-400">Your Arc Testnet Balance:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      {isConnected ? `${usdcBalance.toFixed(2)} USDC` : "Wallet Not Connected"}
                    </span>
                    {isConnected && usdcBalance > 0 && (
                      <button
                        type="button"
                        onClick={() => setAmount(usdcBalance.toString())}
                        className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold text-[10px] hover:bg-cyan-500/30 cursor-pointer"
                      >
                        MAX
                      </button>
                    )}
                  </div>
                </div>

                {/* Recipient Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">
                    Recipient EVM Address (0x...)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400/50 text-white text-xs sm:text-sm font-mono placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Amount (USDC)
                    </label>
                    <span className="text-[10px] font-mono text-cyan-400">Native Settlement Token</span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400/50 text-white text-xl sm:text-2xl font-black font-sans placeholder-slate-600 focus:outline-none transition-colors pr-24"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-extrabold text-cyan-300 font-mono">USDC</span>
                    </div>
                  </div>
                </div>

                {/* Memo / Note */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">
                    Payment Note / Memo (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Milestone 1 deliverable, contractor invoice"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400/50 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Error Banner */}
                {validationError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Breakdown Summary */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Network:</span>
                    <span className="font-mono text-white">{arcTestnet.name} (Chain #{arcTestnet.chainId})</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Network Fee:</span>
                    <span className="font-mono text-emerald-400 font-semibold">0.0009 USDC (Native)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Finality Guarantee:</span>
                    <span className="text-cyan-300 font-medium">Sub-second EVM confirmation</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={() => openConnectModal()}
                    className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                  >
                    <span>Connect Wallet to Send USDC</span>
                  </button>
                ) : isWrongNetwork ? (
                  <button
                    type="button"
                    onClick={() => switchNetwork()}
                    className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Switch to Arc Testnet</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSending}
                    className="glass-button w-full py-4 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-blue cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>{isSending ? "Authorizing on Arc..." : "Confirm & Send Payment"}</span>
                  </button>
                )}

              </form>
            </div>

            {/* Right Column: 3D Interactive Coin & Real Details (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* 3D Floating Coin Card */}
              <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 flex flex-col items-center text-center shadow-glass relative overflow-hidden group">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Native Gas Currency
                </div>
                <h3 className="text-lg font-bold text-white">USD Coin (USDC)</h3>
                
                <Coin3DPreview symbol="USDC" color="#0066ff" size={200} className="my-2" />
                
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Arc Testnet settles native gas directly in USDC. Transactions execute with deterministic ordering in &lt; 400ms.
                </p>
              </div>

              {/* Official Faucet Helper Card */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Official Circle Faucet</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Need testnet funds? Obtain real Arc Testnet USDC from the official Circle developer faucet.
                </p>
                <button
                  type="button"
                  onClick={openFaucet}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Circle Faucet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: REQUEST USDC */}
        {activeTab === "request" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white">Receive on Arc Testnet</h3>
                <p className="text-xs text-slate-400 mt-0.5">Share your QR code or customized payment request</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Your Connected Address</div>
                  <div className="text-xs font-mono text-cyan-300">
                    {address || "Please connect your wallet"}
                  </div>
                </div>
                {address && (
                  <button
                    onClick={() => navigator.clipboard.writeText(address)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Network:</span>
                  <span className="font-mono text-white">{arcTestnet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chain ID:</span>
                  <span className="font-mono text-cyan-300">5042002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Currency:</span>
                  <span className="font-mono text-emerald-300">Native USDC</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                <QrCode className="w-40 h-40 text-black" />
              </div>
              <div className="text-xs font-bold text-white">Arc Testnet Compatible</div>
              <p className="text-[11px] text-slate-400">
                Supports MetaMask, Rabby, Coinbase, and EVM mobile wallets.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT LINKS */}
        {activeTab === "links" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white">Create Onchain Payment Link</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate a shareable link that settles on Arc Testnet with confirmed receipts.
                </p>
              </div>

              <form onSubmit={handleCreatePaymentLink} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">Link Title / Invoice Description</label>
                  <input
                    type="text"
                    required
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">Requested Amount (USDC)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white text-lg font-bold font-sans focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="glass-button w-full py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
                >
                  Generate Shareable Link
                </button>
              </form>

              <div className="p-4 rounded-2xl bg-[#090E26] border border-cyan-400/30 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Your Active Payment URL</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-white truncate">{generatedLink}</span>
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 rounded-xl glass-button text-xs font-bold text-white flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{linkCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Payment Links History */}
            <div className="lg:col-span-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 shadow-glass flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Payment Requests</h4>
              
              <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {savedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{req.message}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        req.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-cyan-300">{formatUSDC(req.amount)}</span>
                      <Link
                        href={`/pay/${req.id}`}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>Open Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {req.txHash && (
                      <a
                        href={getExplorerTxUrl(req.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>Tx: {formatAddress(req.txHash, 4)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
