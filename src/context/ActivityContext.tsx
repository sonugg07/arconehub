"use client";

import React, { createContext, useContext, useState } from "react";
import { generateTxHash } from "@/lib/utils";

export type ActivityCategory = "all" | "payments" | "swaps" | "tokens" | "jobs" | "escrow";
export type ActivityStatus = "confirmed" | "pending" | "failed" | "escrowed";

export interface ActivityItem {
  id: string;
  category: "payments" | "swaps" | "tokens" | "jobs" | "escrow";
  title: string;
  subtitle: string;
  amount: string;
  token: string;
  usdValue: number;
  recipientOrContract?: string;
  status: ActivityStatus;
  timestamp: string;
  txHash: string;
  blockNumber: number;
  fee: string;
}

export type AddActivityInput = Omit<ActivityItem, "id" | "blockNumber" | "timestamp" | "fee" | "txHash"> & {
  txHash?: string;
  blockNumber?: number;
  timestamp?: string;
  fee?: string;
};

interface ActivityContextType {
  activities: ActivityItem[];
  addActivity: (activity: AddActivityInput) => void;
  filter: ActivityCategory;
  setFilter: (f: ActivityCategory) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredActivities: ActivityItem[];
  exportCSV: () => void;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "tx-001",
    category: "payments",
    title: "Payment Received",
    subtitle: "From: 0x82f9...391a (Invoice #104)",
    amount: "+450.00",
    token: "USDC",
    usdValue: 450.0,
    recipientOrContract: "0x82f9b814a029c91823901bce492a8391a",
    status: "confirmed",
    timestamp: "12 mins ago",
    txHash: "0x9812a4b8109ca810239401928374910283019283019283019283019283019283",
    blockNumber: 59969180,
    fee: "0.0009 USDC",
  },
  {
    id: "tx-002",
    category: "payments",
    title: "USDC Direct Payment",
    subtitle: "To: 0x4B20...8304 (Design Milestone)",
    amount: "-25.00",
    token: "USDC",
    usdValue: 25.0,
    recipientOrContract: "0x4B20194801928304918203948102938401928304",
    status: "confirmed",
    timestamp: "1 hour ago",
    txHash: "0x7812903849102938401928301928301928301928301928301928301928301928",
    blockNumber: 59968940,
    fee: "0.0009 USDC",
  },
  {
    id: "tx-003",
    category: "escrow",
    title: "Milestone Escrow Funded",
    subtitle: "Fullstack Web3 UI Lead (Milestone 1)",
    amount: "-1,500.00",
    token: "USDC",
    usdValue: 1500.0,
    recipientOrContract: "0x8920194801928304918203948102938401928304",
    status: "escrowed",
    timestamp: "2 hours ago",
    txHash: "0x6192830192830192830192830192830192830192830192830192830192830192",
    blockNumber: 59968710,
    fee: "0.0015 USDC",
  },
];

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [filter, setFilter] = useState<ActivityCategory>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const addActivity = (item: AddActivityInput) => {
    const newActivity: ActivityItem = {
      ...item,
      id: `tx-${Date.now()}`,
      txHash: item.txHash || generateTxHash(),
      blockNumber: item.blockNumber || 59969223,
      timestamp: item.timestamp || "Just now",
      fee: item.fee || "0.0009 USDC",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const filteredActivities = activities.filter((act) => {
    if (filter !== "all" && act.category !== filter) return false;
    if (statusFilter !== "all" && act.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.subtitle.toLowerCase().includes(q) ||
        act.txHash.toLowerCase().includes(q) ||
        (act.recipientOrContract && act.recipientOrContract.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ["ID", "Category", "Title", "Amount", "Token", "Status", "Timestamp", "TxHash", "Fee"];
    const rows = filteredActivities.map((a) => [
      a.id,
      a.category,
      `"${a.title.replace(/"/g, '""')}"`,
      a.amount,
      a.token,
      a.status,
      a.timestamp,
      a.txHash,
      a.fee,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `arcone-activity-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        filter,
        setFilter,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        filteredActivities,
        exportCSV,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
