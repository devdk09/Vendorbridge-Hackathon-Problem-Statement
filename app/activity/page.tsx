"use client";
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store";
import { Bell, Activity, FileText, Building2, CheckSquare, ShoppingCart, Package, Users, AlertCircle } from "lucide-react";

const entityIcon = (type: string) => {
  const icons: Record<string,React.ElementType> = {
    rfq: FileText, quotation: FileText, approval: CheckSquare,
    purchase_order: ShoppingCart, invoice: Package, vendor: Building2, user: Users
  };
  return icons[type] ?? Activity;
};

const entityColor = (type: string) => {
  const colors: Record<string,string> = {
    rfq: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    quotation: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
    approval: "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
    purchase_order: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
    invoice: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30",
    vendor: "bg-teal-100 text-teal-600 dark:bg-teal-900/30",
    user: "bg-slate-100 text-slate-600 dark:bg-slate-900/30",
  };
  return colors[type] ?? "bg-muted text-muted-foreground";
};

export default function ActivityPage() {
  const { notifications, activityLogs, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [tab, setTab] = useState<"logs" | "notifications">("logs");
  const unread = notifications.filter(n => !n.read).length;

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AppShell title="Activity Logs & Notifications" subtitle="Track all procurement activities and system alerts">
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
        {[["logs","Activity Logs"],["notifications",`Notifications${unread > 0 ? ` (${unread})` : ""}`]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${tab===v ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "logs" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {activityLogs.map((log) => {
                const Icon = entityIcon(log.entityType);
                return (
                  <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${entityColor(log.entityType)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{log.performedByName}</span>
                            {" · "}{log.entityTitle}
                          </p>
                          {log.details && <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>}
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(log.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "notifications" && (
        <div>
          {unread > 0 && (
            <div className="flex justify-end mb-3">
              <button onClick={markAllNotificationsRead}
                className="text-sm text-primary hover:underline font-medium">
                Mark all as read
              </button>
            </div>
          )}
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm
                  ${!n.read ? "bg-primary/5 border-primary/20" : "bg-card border-border opacity-70"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.read ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
