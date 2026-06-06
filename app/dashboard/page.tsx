"use client";
import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { formatCurrency } from "@/lib/data";
import {
  TrendingUp, TrendingDown, Package, Building2, FileText, CheckSquare,
  ShoppingCart, Plus, ArrowRight, DollarSign, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: {
  title: string; value: string; icon: React.ElementType; trend?: "up" | "down"; trendValue?: string; color: string;
}) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue} vs last month
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { rfqs, approvals, purchaseOrders, invoices, vendors } = useAppStore();
  const pendingApprovals = approvals.filter(a => a.status === "pending").length;
  const activeRFQs = rfqs.filter(r => r.status === "published").length;

  const monthlySpend = purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);
  const spendTrend = (() => {
    const map = new Map<string, number>();
    purchaseOrders.forEach((po) => {
      const date = new Date(po.createdAt);
      const label = date.toLocaleString("en-IN", { month: "short", year: "numeric" });
      map.set(label, (map.get(label) ?? 0) + po.grandTotal);
    });
    return Array.from(map.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([month, amount]) => ({ month, amount }));
  })();

  const vendorPerformance = vendors
    .map((v) => ({ name: v.company, orders: v.totalOrders, rating: v.rating }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      draft: "draft", published: "active", closed: "inactive",
      approved: "approved", rejected: "rejected", pending: "pending",
      sent: "sent", paid: "paid", delivered: "approved"
    };
    return (map[status] ?? "draft") as "draft" | "active" | "inactive" | "approved" | "rejected" | "pending" | "sent" | "paid";
  };

  return (
    <AppShell title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Monthly Spend" value={formatCurrency(monthlySpend)} icon={DollarSign} trend="up" trendValue="+12.5%" color="bg-blue-500" />
        <StatCard title="Active Vendors" value={String(vendors.filter(v => v.status === "active").length)} icon={Building2} trend="up" trendValue="+2" color="bg-emerald-500" />
        <StatCard title="Pending Approvals" value={String(pendingApprovals)} icon={AlertCircle} color="bg-amber-500" />
        <StatCard title="Active RFQs" value={String(activeRFQs)} icon={FileText} trend="up" trendValue="+1" color="bg-purple-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Spend Trend */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Procurement Spend Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), "Spend"]} />
                <Area type="monotone" dataKey="amount" stroke="hsl(221 83% 53%)" strokeWidth={2.5} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vendorPerformance} layout="vertical" barSize={8}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip formatter={(v: number) => [v, "Orders"]} />
                <Bar dataKey="orders" fill="hsl(221 83% 53%)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { href: "/rfq?action=new", label: "Create RFQ", icon: Plus, color: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400" },
          { href: "/vendors?action=new", label: "Add Vendor", icon: Building2, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400" },
          { href: "/approvals", label: "View Approvals", icon: CheckSquare, color: "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400" },
          { href: "/orders", label: "View Orders", icon: ShoppingCart, color: "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400" },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <div className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${action.color}`}>
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-semibold">{action.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent POs */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Purchase Orders</CardTitle>
            <Link href="/orders"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {purchaseOrders.slice(0, 3).map(po => (
                <div key={po.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">{po.vendorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(po.grandTotal)}</p>
                    <Badge variant={statusBadge(po.status)} className="text-[10px] mt-0.5">{po.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <Link href="/orders?tab=invoices"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="w-3 h-3" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {invoices.slice(0, 3).map(inv => (
                <div key={inv.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">{inv.vendorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(inv.grandTotal)}</p>
                    <Badge variant={statusBadge(inv.status)} className="text-[10px] mt-0.5">{inv.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
