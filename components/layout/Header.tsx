"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Bell, Moon, Sun, Settings, LogOut, ChevronDown } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { currentUser, notifications, setCurrentUser, markAllNotificationsRead } = useAppStore();
  const [dark, setDark] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const router = useRouter();
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode */}
        <button onClick={() => setDark(!dark)}
          className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors relative">
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <p className="text-sm font-semibold">Notifications</p>
                {unread > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 6).map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b last:border-0 hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/3" : ""}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                      <div>
                        <p className="text-xs font-semibold">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/activity" onClick={() => setShowNotifs(false)}
                className="block text-center text-xs text-primary py-2.5 hover:bg-muted/30 transition-colors border-t font-medium">
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
              {currentUser?.name?.charAt(0) ?? "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold leading-none">{currentUser?.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize leading-none mt-0.5">{currentUser?.role?.replace("_"," ")}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showUser && (
            <div className="absolute right-0 top-11 w-48 bg-card border rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <Link href="/settings" onClick={() => setShowUser(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <hr className="my-1" />
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
