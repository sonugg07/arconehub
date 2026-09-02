"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useWeb3 } from "@/context/Web3Context";
import { useNotifications } from "@/context/NotificationContext";
import { useActivity } from "@/context/ActivityContext";
import { arcTestnet, getExplorerTxUrl } from "@/config/network";
import { formatUSDC, formatAddress } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Building2,
  Lock,
  CheckCircle2,
  Users,
  Coins,
  ShieldCheck,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  ExternalLink,
  Send,
} from "lucide-react";

interface PayrollEmployee {
  id: string;
  name: string;
  role: string;
  address: string;
  amountUSDC: number;
  selected: boolean;
  status: "idle" | "paying" | "confirmed" | "failed";
  txHash?: string;
}

export default function CompanyDashboardPage() {
  const { isConnected, isWrongNetwork, usdcBalance, sendUSDC, switchNetwork, openConnectModal, openFaucet } = useWeb3();
  const { addNotification } = useNotifications();
  const { addActivity } = useActivity();

  // Payroll Batch Roster
  const [employees, setEmployees] = useState<PayrollEmployee[]>([
    {
      id: "emp-1",
      name: "Alex Dev",
      role: "Lead Fullstack Web3 Architect",
      address: "0x71C94B98E2A7d1eF8459427bE48A1054C542E61F",
      amountUSDC: 10.0,
      selected: true,
      status: "idle",
    },
    {
      id: "emp-2",
      name: "Elena V.",
      role: "Lead 3D Brand & Product Designer",
      address: "0x4B20194801928304918203948102938401928304",
      amountUSDC: 25.0,
      selected: true,
      status: "idle",
    },
    {
      id: "emp-3",
      name: "Marcus K.",
      role: "Smart Contract Auditor",
      address: "0x8920194801928304918203948102938401928304",
      amountUSDC: 15.0,
      selected: true,
      status: "idle",
    },
  ]);

  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [payrollError, setPayrollError] = useState<string | null>(null);

  const selectedEmployees = employees.filter((e) => e.selected);
  const totalPayrollUSDC = selectedEmployees.reduce((sum, e) => sum + e.amountUSDC, 0);

  const toggleEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const handleExecutePayroll = async () => {
    setPayrollError(null);

    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }

    if (totalPayrollUSDC > usdcBalance) {
      setPayrollError(`Insufficient USDC balance on Arc Testnet. Total: ${totalPayrollUSDC} USDC, Available: ${usdcBalance.toFixed(2)} USDC.`);
      return;
    }

    setIsProcessingPayroll(true);

    // Process each employee payment on real Arc Testnet
    for (const emp of selectedEmployees) {
      setEmployees((prev) =>
        prev.map((item) => (item.id === emp.id ? { ...item, status: "paying" } : item))
      );

      const res = await sendUSDC(emp.address, emp.amountUSDC);

      if (res.success && res.hash) {
        setEmployees((prev) =>
          prev.map((item) =>
            item.id === emp.id ? { ...item, status: "confirmed", txHash: res.hash } : item
          )
        );

        addActivity({
          category: "payments",
          title: `Payroll: ${emp.name}`,
          subtitle: `Dispatched ${emp.amountUSDC} USDC to ${formatAddress(emp.address, 4)}`,
          amount: `-${emp.amountUSDC.toFixed(2)}`,
          token: "USDC",
          usdValue: emp.amountUSDC,
          recipientOrContract: emp.address,
          status: "confirmed",
          txHash: res.hash,
        });
      } else {
        setEmployees((prev) =>
          prev.map((item) => (item.id === emp.id ? { ...item, status: "failed" } : item))
        );
        setPayrollError(res.error || `Payment to ${emp.name} failed.`);
        break;
      }
    }

    setIsProcessingPayroll(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Arc Testnet Enterprise Payouts
            </div>
            <h1 className="text-3xl font-black text-white">Company Payroll & Escrow</h1>
            <p className="text-sm text-slate-400 mt-1">
              Execute batch contractor payouts and milestone releases using real native USDC on Arc Testnet.
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

        {/* Real Treasury Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl shadow-glass flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Your Arc Testnet Balance</span>
              <Coins className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-sans">
              {isConnected ? `${usdcBalance.toFixed(2)} USDC` : "0.00 USDC"}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              Real Onchain Balance
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl shadow-glass flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Selected Payout Batch</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-sans">
              {formatUSDC(totalPayrollUSDC)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {selectedEmployees.length} Contractors Selected
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl shadow-glass flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Network Settlement</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-sans">
              &lt; 400ms
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Deterministic Arc EVM
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {payrollError && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{payrollError}</span>
          </div>
        )}

        {/* Batch Payroll Selection Table */}
        <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-glass flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Batch Contractor Payroll</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select contractors to disburse USDC payments on Arc Testnet</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-300 font-bold">
                Total: {formatUSDC(totalPayrollUSDC)}
              </span>

              {!isConnected ? (
                <button
                  onClick={openConnectModal}
                  className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase cursor-pointer"
                >
                  Connect Wallet
                </button>
              ) : isWrongNetwork ? (
                <button
                  onClick={switchNetwork}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase cursor-pointer"
                >
                  Switch Network
                </button>
              ) : (
                <button
                  onClick={handleExecutePayroll}
                  disabled={isProcessingPayroll || selectedEmployees.length === 0}
                  className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 shadow-glow-blue cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isProcessingPayroll ? "Processing Onchain..." : "Disburse Payroll Now"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => toggleEmployee(emp.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  emp.selected
                    ? "bg-white/[0.04] border-cyan-400/40"
                    : "bg-white/[0.01] border-white/[0.04] opacity-60"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={emp.selected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{emp.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({emp.role})</span>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                      {formatAddress(emp.address, 6)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-sm font-black text-white font-sans">
                      {formatUSDC(emp.amountUSDC)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${
                      emp.status === "confirmed"
                        ? "text-emerald-400"
                        : emp.status === "paying"
                        ? "text-cyan-300 animate-pulse"
                        : emp.status === "failed"
                        ? "text-rose-400"
                        : "text-slate-400"
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  {emp.txHash && (
                    <a
                      href={getExplorerTxUrl(emp.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-cyan-300 text-xs flex items-center gap-1"
                      title="View on ArcScan Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
