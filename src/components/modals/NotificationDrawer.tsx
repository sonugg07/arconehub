"use client";

import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { X, CheckCheck, Trash2, Bell, CheckCircle2, Info, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";

export function NotificationDrawer() {
  const { notifications, unreadCount, isOpen, setIsOpen, markAsRead, markAllAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-[#070A1E] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-arc-blue text-[10px] font-bold text-white">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Real onchain activity alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">
                <Bell className="w-6 h-6 stroke-1" />
              </div>
              <div className="text-sm font-bold text-white">No notifications yet</div>
              <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                Live alerts for your real <strong>Swaps</strong>, <strong>Payments</strong>, <strong>Token Launches</strong>, and <strong>Escrows</strong> will appear here automatically when executed.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? "bg-white/[0.02] border-white/[0.04] opacity-75 hover:opacity-100"
                    : "bg-[#0E1538] border-arc-blue/30 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs bg-[#050713]">
            <button
              onClick={markAllAsRead}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear all</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
