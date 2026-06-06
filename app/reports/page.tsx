"use client";
import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store";
import { formatCurrency } from "@/lib/data";
import { TrendingUp, Star, Package, DollarSign, Users } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function ReportsPage() {
  const { vendors, rfqs, purchaseOrders, invoices } = useAppStore();

  const categoryData = vendors.reduce((acc, v) => {
    const existing = acc.find(a => a.name === v.category);
    if (existing) existing.count++;
    else acc.push({ name: v.category, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]);

  const statusData = [
    { name: "Active RFQs", value: rfqs.filter(r => r.status === "published").length },
    { name: "Draft RFQs", value: rfqs.filter(r => r.status === "draft").length },
    { name: "Closed RFQs", value: rfqs.filter(r => r.status === "closed").length },
  ];

  const totalSpend = purchaseOrders.reduce((s, po) => s + po.grandTotal, 0);
  const paidInvoices = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.grandTotal, 0);
  const pendingAmount = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.grandTotal, 0);

  const vendorPerformance = vendors
    .map((v) => ({ name: v.company, orders: v.totalOrders, rating: v.rating }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  const spendTrend = (() => {
    const map = new Map<string, number>();
    purchaseOrders.forEach((po) => {
      const month = new Date(po.createdAt).toLocaleString("en-IN", { month: "short", year: "numeric" });
      map.set(month, (map.get(month) ?? 0) + po.grandTotal);
    });
    return Array.from(map.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, amount]) => ({ month, amount }));
  })();

  const radarData = vendorPerformance.slice(0, 4).map(v => ({
    name: v.name.split(" ")[0],
    Rating: v.rating * 20,
    Orders: Math.min(v.orders * 2, 100),
    Delivery: 75 + Math.random() * 20,
  }));

  return (
    <AppShell title="Reports & Analytics" subtitle="Procurement insights and performance metrics">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Procurement Spend", value: formatCurrency(totalSpend), icon: DollarSign, color: "bg-blue-500" },
          { label: "Paid Invoices", value: formatCurrency(paidInvoices), icon: TrendingUp, color: "bg-emerald-500" },
          { label: "Pending Payments", value: formatCurrency(pendingAmount), icon: Package, color: "bg-amber-500" },
          { label: "Active Vendors", value: String(vendors.filter(v => v.status === "active").length), icon: Users, color: "bg-purple-500" },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Monthly Spend */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Monthly Procurement Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), "Spend"]} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Performance */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Vendor Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                <Radar name="Rating" dataKey="Rating" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Orders" dataKey="Orders" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Vendor Orders Bar */}
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle className="text-sm font-semibold">Orders by Vendor</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RFQ Status Pie */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">RFQ Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Vendor Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  {["Vendor", "Category", "Orders", "Rating", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendors.map(v => (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{v.company}</p>
                      <p className="text-xs text-muted-foreground">{v.contactPerson}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                    <td className="px-4 py-3 font-semibold">{v.totalOrders}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{v.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${v.status === "active" ? "badge-active" : "badge-inactive"}`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
