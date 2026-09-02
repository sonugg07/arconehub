"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

const NOTIFICATIONS_STORAGE_KEY = "arcone_notifications_v2";

function getStoredNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading stored notifications:", err);
  }
  return [];
}

function saveStoredNotifications(notifs: AppNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (err) {
    console.error("Error saving notifications:", err);
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load persistent real notifications on client mount
  useEffect(() => {
    const stored = getStoredNotifications();
    setNotifications(stored);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: `Today at ${timeStr}`,
      read: false,
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      saveStoredNotifications(updated);
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveStoredNotifications(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveStoredNotifications(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    saveStoredNotifications([]);
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
