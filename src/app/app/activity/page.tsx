"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useActivity, ActivityCategory, ActivityItem } from "@/context/ActivityContext";
import { formatAddress, formatUSDC } from "@/lib/utils";
import { getExplorerTxUrl } from "@/config/network";
import {
  Activity,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Lock,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";

export default function ActivityPage() {
  const {
    filter,
    setFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredActivities,
    exportCSV,
  } = useActivity();

  const [selectedTx, setSelectedTx] = useState<ActivityItem | null>(null);

  const categories: { label: string; value: ActivityCategory }[] = [
    { label: "All Activity", value: "all" },
    { label: "Payments", value: "payments" },
    { label: "Swaps", value: "swaps" },
    { label: "Tokens", value: "tokens" },
    { label: "Jobs", value: "jobs" },
    { label: "Escrow", value: "escrow" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Onchain Records
            </div>
            <h1 className="text-3xl font-black text-white">Activity Ledger</h1>
            <p className="text-sm text-slate-400 mt-1">
              Complete chronological ledger of payments, DEX swaps, token deployments, and milestone escrow events.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tx hash, recipient address, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#080D26]/90 border border-white/[0.08] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 transition-colors shadow-glass font-mono"
            />
          </div>

          {/* Category Tabs & Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filter === cat.value
                      ? "bg-arc-blue text-white shadow-glow-blue"
                      : "bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.04]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080D26] border border-white/[0.08] text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="escrowed">Escrowed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

          </div>

        </div>

        {/* Transactions List */}
        <div className="rounded-3xl bg-[#080D26]/90 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-7 shadow-glass flex flex-col gap-3">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Activity className="w-12 h-12 stroke-1 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No transactions found</h3>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filters.</p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => setSelectedTx(act)}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                    {act.category === "escrow" ? (
                      <Lock className="w-5 h-5 text-amber-400" />
                    ) : act.amount.startsWith("+") ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-arc-electric" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="group-hover:text-cyan-300 transition-colors">{act.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        act.status === "confirmed"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : act.status === "escrowed"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                          : "bg-blue-500/15 text-blue-300"
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{act.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <div className={`text-xs font-black font-mono ${act.amount.startsWith("+") ? "text-emerald-400" : "text-white"}`}>
                      {act.amount} {act.token}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{act.timestamp}</div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Transaction Detail Receipt Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#080D26] border border-white/[0.12] p-6 shadow-2xl flex flex-col gap-5 text-white">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-arc-blue/20 text-cyan-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Transaction Receipt</h3>
                    <span className="text-[10px] text-slate-400">Arc Testnet Verified</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#040614] border border-white/[0.06] flex flex-col gap-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className="font-bold text-white">{selectedTx.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount / Volume:</span>
                  <span className="font-mono font-bold text-cyan-300">{selectedTx.amount} {selectedTx.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-semibold uppercase">{selectedTx.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Block Height:</span>
                  <span className="font-mono text-white">#{selectedTx.blockNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Fee:</span>
                  <span className="font-mono text-slate-300">{selectedTx.fee}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.04] pt-2">
                  <span className="text-slate-400">Transaction Hash:</span>
                  <span className="font-mono text-slate-300">{formatAddress(selectedTx.txHash, 6)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-bold text-slate-300"
                >
                  Close
                </button>
                <a
                  href={getExplorerTxUrl(selectedTx.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 glass-button py-3 rounded-xl text-xs font-bold text-white uppercase text-center flex items-center justify-center gap-1.5"
                >
                  <span>View on ArcScan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
