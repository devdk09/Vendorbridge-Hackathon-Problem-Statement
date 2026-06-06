"use client";
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useAppStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/data";
import { Plus, MessageSquare, Star, TrendingDown, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { Quotation, QuotationItem } from "@/types";

export default function QuotationsPage() {
  const { quotations, rfqs, vendors, addQuotation, updateQuotation, addApproval, currentUser } = useAppStore();
  const [tab, setTab] = useState<"list" | "compare">("list");
  const [compareRFQ, setCompareRFQ] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Quotation>>({ rfqId: "", vendorId: "", items: [], deliveryTimeline: 14, deliveryUnit: "days", notes: "" });

  const compareQuotations = quotations.filter(q => q.rfqId === compareRFQ);
  const rfqForCompare = rfqs.find(r => r.id === compareRFQ);
  const minPrice = compareQuotations.length ? Math.min(...compareQuotations.map(q => q.totalAmount)) : 0;
  const minDelivery = compareQuotations.length ? Math.min(...compareQuotations.map(q => q.deliveryTimeline)) : 0;

  const openSubmitQuotation = (rfqId: string) => {
    const rfq = rfqs.find(r => r.id === rfqId);
    if (!rfq) return;
    const items: QuotationItem[] = rfq.items.map(item => ({ rfqItemId: item.id, product: item.product, quantity: item.quantity, unit: item.unit, unitPrice: 0, totalPrice: 0 }));
    setForm({ rfqId, vendorId: vendors[0]?.id, items, deliveryTimeline: 14, deliveryUnit: "days", notes: "" });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.rfqId || !form.vendorId) return;
    const vendor = vendors.find(v => v.id === form.vendorId);
    const rfq = rfqs.find(r => r.id === form.rfqId);
    const total = form.items?.reduce((s, i) => s + i.totalPrice, 0) ?? 0;
    const qNum = `QT-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, "0")}`;
    const newQ: Quotation = {
      ...form as Quotation,
      id: `q${Date.now()}`,
      quotationNumber: qNum,
      vendorName: vendor?.company ?? "",
      rfqTitle: rfq?.title ?? "",
      status: "submitted",
      totalAmount: total,
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addQuotation(newQ);
    setShowModal(false);
  };

  const handleAccept = (q: Quotation) => {
    updateQuotation(q.id, { status: "accepted" });
    // Create approval
    addApproval({
      id: `ap${Date.now()}`,
      quotationId: q.id,
      rfqTitle: q.rfqTitle,
      vendorName: q.vendorName,
      totalAmount: q.totalAmount,
      status: "pending",
      requestedBy: currentUser?.name ?? "User",
      requestedAt: new Date().toISOString(),
      steps: [
        { id: `s${Date.now()}a`, approverName: currentUser?.name ?? "User", approverRole: "Procurement Officer", status: "approved", remarks: "Quotation accepted", actionAt: new Date().toISOString() },
        { id: `s${Date.now()}b`, approverName: "Manager", approverRole: "Manager", status: "pending" }
      ],
      currentStep: 1,
      updatedAt: new Date().toISOString(),
    });
  };

  const statusMap: Record<string, string> = { submitted: "active", under_review: "pending", accepted: "approved", rejected: "rejected" };

  return (
    <AppShell title="Quotations" subtitle="Review and compare vendor quotations">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex rounded-lg border overflow-hidden">
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "list" ? "bg-primary text-white" : "hover:bg-muted"}`} onClick={() => setTab("list")}>Quotation List</button>
          <button className={`px-4 py-2 text-sm font-medium transition-colors ${tab === "compare" ? "bg-primary text-white" : "hover:bg-muted"}`} onClick={() => setTab("compare")}>Compare</button>
        </div>
        {tab === "compare" && (
          <Select value={compareRFQ} onValueChange={setCompareRFQ}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Select RFQ to compare" /></SelectTrigger>
            <SelectContent>
              {rfqs.filter(r => r.status !== "draft").map(r => <SelectItem key={r.id} value={r.id}>{r.rfqNumber} - {r.title}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <div className="ml-auto">
          <Button onClick={() => openSubmitQuotation(rfqs.find(r => r.status === "published")?.id ?? "")} className="gap-2"><Plus className="w-4 h-4" />Submit Quotation</Button>
        </div>
      </div>

      {tab === "list" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation #</TableHead>
                <TableHead>RFQ</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map(q => (
                <TableRow key={q.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-medium">{q.quotationNumber}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{q.rfqTitle}</p>
                  </TableCell>
                  <TableCell className="text-sm">{q.vendorName}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(q.totalAmount)}</TableCell>
                  <TableCell className="text-sm">{q.deliveryTimeline} {q.deliveryUnit}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(q.validUntil)}</TableCell>
                  <TableCell><Badge variant={statusMap[q.status] as any} className="capitalize">{q.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {q.status === "submitted" && (
                        <>
                          <Button size="sm" variant="success" className="gap-1 text-xs h-7" onClick={() => handleAccept(q)}>
                            <CheckCircle2 className="w-3 h-3" />Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-white text-xs h-7" onClick={() => updateQuotation(q.id, { status: "rejected" })}>
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        compareRFQ && compareQuotations.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-400">Comparing {compareQuotations.length} quotations for <strong>{rfqForCompare?.title}</strong></span>
            </div>
            {/* Comparison Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground w-40">Criteria</th>
                      {compareQuotations.map(q => (
                        <th key={q.id} className="px-4 py-3 text-center">
                          <div>
                            <p className="font-bold text-foreground">{q.vendorName}</p>
                            <p className="text-xs text-muted-foreground font-normal">{q.quotationNumber}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground font-medium">Total Amount</td>
                      {compareQuotations.map(q => (
                        <td key={q.id} className="px-4 py-3 text-center">
                          <span className={`font-bold text-base ${q.totalAmount === minPrice ? "text-emerald-600" : "text-foreground"}`}>
                            {formatCurrency(q.totalAmount)}
                          </span>
                          {q.totalAmount === minPrice && <div className="text-[10px] text-emerald-600 font-medium mt-0.5">✓ Lowest Price</div>}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground font-medium">Delivery Timeline</td>
                      {compareQuotations.map(q => (
                        <td key={q.id} className="px-4 py-3 text-center">
                          <span className={`font-semibold ${q.deliveryTimeline === minDelivery ? "text-blue-600" : "text-foreground"}`}>
                            {q.deliveryTimeline} {q.deliveryUnit}
                          </span>
                          {q.deliveryTimeline === minDelivery && <div className="text-[10px] text-blue-600 font-medium mt-0.5">✓ Fastest</div>}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground font-medium">Valid Until</td>
                      {compareQuotations.map(q => <td key={q.id} className="px-4 py-3 text-center text-sm">{formatDate(q.validUntil)}</td>)}
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground font-medium">Status</td>
                      {compareQuotations.map(q => <td key={q.id} className="px-4 py-3 text-center"><Badge variant={statusMap[q.status] as any} className="capitalize text-xs">{q.status}</Badge></td>)}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground font-medium">Notes</td>
                      {compareQuotations.map(q => <td key={q.id} className="px-4 py-3 text-center text-xs text-muted-foreground">{q.notes || "—"}</td>)}
                    </tr>
                    {/* Item breakdown */}
                    {rfqForCompare?.items.map(item => (
                      <tr key={item.id} className="bg-blue-50/30 dark:bg-blue-900/10">
                        <td className="px-4 py-3 text-xs text-muted-foreground pl-8">↳ {item.product}</td>
                        {compareQuotations.map(q => {
                          const qi = q.items.find(i => i.rfqItemId === item.id);
                          const allPrices = compareQuotations.map(cq => cq.items.find(i => i.rfqItemId === item.id)?.unitPrice ?? 0);
                          const itemMin = Math.min(...allPrices);
                          return (
                            <td key={q.id} className="px-4 py-3 text-center text-xs">
                              {qi ? <span className={qi.unitPrice === itemMin ? "text-emerald-600 font-bold" : ""}>{formatCurrency(qi.unitPrice)}/{item.unit}</span> : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td className="px-4 py-3 font-semibold">Action</td>
                      {compareQuotations.map(q => (
                        <td key={q.id} className="px-4 py-3 text-center">
                          {q.status === "submitted" ? (
                            <Button size="sm" variant="success" className="text-xs h-7" onClick={() => handleAccept(q)}>Accept</Button>
                          ) : <Badge variant={statusMap[q.status] as any} className="text-xs capitalize">{q.status}</Badge>}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{compareRFQ ? "No quotations for this RFQ" : "Select an RFQ to compare quotations"}</p>
          </div>
        )
      )}

      {/* Submit Quotation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Submit Quotation</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">RFQ</label>
              <Select value={form.rfqId} onValueChange={v => {
                const rfq = rfqs.find(r => r.id === v);
                const items = rfq?.items.map(i => ({ rfqItemId: i.id, product: i.product, quantity: i.quantity, unit: i.unit, unitPrice: 0, totalPrice: 0 })) ?? [];
                setForm(f => ({ ...f, rfqId: v, items }));
              }}>
                <SelectTrigger><SelectValue placeholder="Select RFQ" /></SelectTrigger>
                <SelectContent>{rfqs.filter(r => r.status === "published").map(r => <SelectItem key={r.id} value={r.id}>{r.rfqNumber} - {r.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Vendor</label>
              <Select value={form.vendorId} onValueChange={v => setForm(f => ({ ...f, vendorId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>{vendors.filter(v => v.status === "active").map(v => <SelectItem key={v.id} value={v.id}>{v.company}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {/* Items */}
            {form.items && form.items.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Item Pricing</label>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg items-center">
                      <div>
                        <p className="text-xs font-medium">{item.product}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <Input type="number" placeholder="Unit Price (₹)" value={item.unitPrice || ""} onChange={e => {
                        const price = Number(e.target.value);
                        setForm(f => ({ ...f, items: f.items?.map((i, k) => k === idx ? { ...i, unitPrice: price, totalPrice: price * i.quantity } : i) }));
                      }} />
                      <div className="text-sm font-semibold text-right">{formatCurrency(item.unitPrice * item.quantity)}</div>
                    </div>
                  ))}
                  <div className="text-right font-bold text-base pt-1">Total: {formatCurrency(form.items.reduce((s, i) => s + i.totalPrice, 0))}</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Delivery Timeline" type="number" value={form.deliveryTimeline ?? 14} onChange={e => setForm(f => ({ ...f, deliveryTimeline: Number(e.target.value) }))} />
              <div>
                <label className="text-sm font-medium mb-1.5 block">Unit</label>
                <Select value={form.deliveryUnit ?? "days"} onValueChange={v => setForm(f => ({ ...f, deliveryUnit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="days">Days</SelectItem><SelectItem value="weeks">Weeks</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Textarea label="Notes / Terms" value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Warranty, terms, conditions..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Quotation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
