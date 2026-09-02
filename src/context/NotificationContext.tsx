"use client";

import React, { createContext, useContext, useState } from "react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  link?: string;
  txHash?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addNotification: (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Payment Received",
    message: "You received 450.00 USDC from 0x82f...391a for Smart Contract Audit Milestone #1.",
    type: "success",
    timestamp: "10 mins ago",
    read: false,
    txHash: "0x39a1b92040...a991f",
  },
  {
    id: "notif-2",
    title: "Escrow Funded",
    message: "Aura Capital deposited 3,000.00 USDC into Escrow for 'Fullstack Web3 UI Lead'.",
    type: "info",
    timestamp: "45 mins ago",
    read: false,
    txHash: "0x17b3c489...e304",
  },
  {
    id: "notif-3",
    title: "Token Deployed Successfully",
    message: "Your token $NOVA was deployed to Arc Testnet at 0x889...a42.",
    type: "success",
    timestamp: "2 hours ago",
    read: true,
    txHash: "0x8890cf23...a421",
  },
  {
    id: "notif-4",
    title: "Arc Testnet Gas Update",
    message: "Network gas fees optimized to 0.0008 USDC per tx. EVM finality: 390ms.",
    type: "info",
    timestamp: "5 hours ago",
    read: true,
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
