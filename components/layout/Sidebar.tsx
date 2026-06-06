"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  LayoutDashboard, FileText, MessageSquare, GitBranch,
  ShoppingCart, BarChart3, Settings, ChevronLeft, ChevronRight,
  Package, Building2, CheckSquare
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendors", label: "Vendors", icon: Building2 },
  { href: "/rfq", label: "RFQ Management", icon: FileText },
  { href: "/quotations", label: "Quotations", icon: MessageSquare },
  { href: "/approvals", label: "Approvals", icon: CheckSquare, badge: "approvals" },
  { href: "/orders", label: "PO & Invoices", icon: ShoppingCart },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/activity", label: "Activity Logs", icon: GitBranch },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { currentUser, approvals } = useAppStore();
  const pendingApprovals = approvals.filter(a => a.status === "pending").length;

  return (
    <aside className={cn(
      "relative flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out flex-shrink-0",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary flex-shrink-0">
          <Package className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold text-white leading-none">VendorBridge</h1>
            <p className="text-xs text-sidebar-foreground/50 mt-0.5">ERP Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "sidebar-item relative",
                isActive && "bg-primary text-white",
                !isActive && "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.badge === "approvals" && !collapsed && (
                <span suppressHydrationWarning className={cn(
                  "ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold",
                  pendingApprovals === 0 && "opacity-0"
                )}>
                  {pendingApprovals}
                </span>
              )}
              {item.badge === "approvals" && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {currentUser?.name?.charAt(0) ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p suppressHydrationWarning className="text-sm font-semibold text-white truncate">{currentUser?.name ?? "User"}</p>
              <p suppressHydrationWarning className="text-xs text-sidebar-foreground/60 capitalize truncate">{currentUser?.role?.replace("_", " ") ?? "Admin"}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
              {currentUser?.name?.charAt(0) ?? "A"}
            </div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-sidebar-foreground hover:bg-primary hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
