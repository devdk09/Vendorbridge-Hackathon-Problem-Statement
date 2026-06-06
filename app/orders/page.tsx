"use client";
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useAppStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/data";
import { Package, FileText, Printer, Mail, Download, Plus, Eye, CheckCircle2, Send } from "lucide-react";
import type { PurchaseOrder, Invoice } from "@/types";

export default function OrdersPage() {
  const { purchaseOrders, invoices, addInvoice, updatePurchaseOrder, updateInvoice } = useAppStore();
  const [tab, setTab] = useState<"po" | "invoices">("po");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [emailSent, setEmailSent] = useState<string | null>(null);

  const generateInvoice = (po: PurchaseOrder) => {
    const existing = invoices.find(i => i.poId === po.id);
    if (existing) { setSelectedInvoice(existing); return; }
    const invNum = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
    const newInv: Invoice = {
      id: `inv${Date.now()}`, invoiceNumber: invNum, poId: po.id, poNumber: po.poNumber,
      vendorId: po.vendorId, vendorName: po.vendorName, vendorEmail: po.vendorEmail,
      status: "draft", items: po.items, subtotal: po.subtotal, totalTax: po.totalTax,
      grandTotal: po.grandTotal, issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };
    addInvoice(newInv);
    setSelectedInvoice(newInv);
  };

  const handleSendEmail = (inv: Invoice) => {
    updateInvoice(inv.id, { status: "sent" });
    setEmailSent(inv.invoiceNumber);
    setTimeout(() => setEmailSent(null), 3000);
  };

  const handlePrint = () => window.print();

  const statusBadge = (s: string) => {
    const m: Record<string,string> = { draft:"draft", approved:"approved", sent:"sent", delivered:"approved", cancelled:"rejected", paid:"paid", overdue:"rejected", pending:"pending" };
    return (m[s] ?? "draft") as any;
  };

  return (
    <AppShell title="Purchase Orders & Invoices" subtitle="Manage POs and generate invoices">
      {emailSent && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> Invoice {emailSent} has been sent via email successfully!
        </div>
      )}

      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
        {[["po","Purchase Orders"],["invoices","Invoices"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v as any)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${tab===v ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "po" && (
        <div className="space-y-4">
          {purchaseOrders.map(po => (
            <Card key={po.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{po.poNumber}</h3>
                        <Badge variant={statusBadge(po.status)}>{po.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{po.vendorName}</p>
                      <p className="text-xs text-muted-foreground">Created: {formatDate(po.createdAt)} · Delivery: {formatDate(po.deliveryDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-lg font-bold">{formatCurrency(po.grandTotal)}</p>
                      <p className="text-xs text-muted-foreground">{po.items.length} items · Tax: {formatCurrency(po.totalTax)}</p>
                    </div>
                    <button onClick={() => setSelectedPO(po)}
                      className="p-2 rounded-lg border hover:bg-muted transition-colors" title="View PO">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => generateInvoice(po)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                      <FileText className="w-4 h-4" />
                      {invoices.find(i => i.poId === po.id) ? "View Invoice" : "Generate Invoice"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-4">
          {invoices.map(inv => (
            <Card key={inv.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{inv.invoiceNumber}</h3>
                        <Badge variant={statusBadge(inv.status)}>{inv.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{inv.vendorName} · {inv.poNumber}</p>
                      <p className="text-xs text-muted-foreground">Issued: {formatDate(inv.issueDate)} · Due: {formatDate(inv.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className="text-lg font-bold">{formatCurrency(inv.grandTotal)}</p>
                    </div>
                    <button onClick={() => setSelectedInvoice(inv)} className="p-2 rounded-lg border hover:bg-muted" title="View"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleSendEmail(inv)} className="p-2 rounded-lg border hover:bg-muted" title="Send Email"><Mail className="w-4 h-4" /></button>
                    {inv.status !== "paid" && (
                      <button onClick={() => updateInvoice(inv.id, { status: "paid", paidAt: new Date().toISOString() })}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PO Detail Dialog */}
      <Dialog open={!!selectedPO} onOpenChange={() => setSelectedPO(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" /> Purchase Order — {selectedPO?.poNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="font-semibold mb-1">Vendor Details</p>
                  <p>{selectedPO.vendorName}</p>
                  <p className="text-muted-foreground">{selectedPO.vendorAddress}</p>
                  <p className="text-muted-foreground">GST: {selectedPO.vendorGST || "N/A"}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="font-semibold mb-1">Delivery</p>
                  <p>Date: {formatDate(selectedPO.deliveryDate)}</p>
                  <p className="text-muted-foreground text-xs">{selectedPO.shippingAddress}</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPO.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell><p className="font-medium">{item.product}</p><p className="text-xs text-muted-foreground">{item.description}</p></TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.cgst)}</TableCell>
                      <TableCell>{formatCurrency(item.sgst)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(item.itemTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="text-sm space-y-1 min-w-[200px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(selectedPO.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CGST</span><span>{formatCurrency(selectedPO.totalCGST)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SGST</span><span>{formatCurrency(selectedPO.totalSGST)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold text-base"><span>Grand Total</span><span>{formatCurrency(selectedPO.grandTotal)}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-1" />Print</Button>
            <Button onClick={() => selectedPO && generateInvoice(selectedPO)}><FileText className="w-4 h-4 mr-1" />Generate Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Invoice — {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-2xl">INVOICE</p>
                  <p className="text-muted-foreground">{selectedInvoice.invoiceNumber}</p>
                </div>
                <Badge variant={statusBadge(selectedInvoice.status)} className="text-sm px-3 py-1">{selectedInvoice.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="font-semibold mb-1">Bill To</p><p>{selectedInvoice.vendorName}</p><p className="text-muted-foreground">{selectedInvoice.vendorEmail}</p></div>
                <div><p className="font-semibold mb-1">Dates</p>
                  <p>Issue: {formatDate(selectedInvoice.issueDate)}</p>
                  <p>Due: {formatDate(selectedInvoice.dueDate)}</p>
                  {selectedInvoice.paidAt && <p className="text-emerald-600">Paid: {formatDate(selectedInvoice.paidAt)}</p>}
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell><p className="font-medium">{item.product}</p></TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{item.taxRate}%</TableCell>
                      <TableCell className="font-bold">{formatCurrency(item.itemTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <div className="text-sm space-y-1 min-w-[220px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(selectedInvoice.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Tax</span><span>{formatCurrency(selectedInvoice.totalTax)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>Total Due</span><span className="text-primary">{formatCurrency(selectedInvoice.grandTotal)}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-1" />Print</Button>
            <Button variant="outline" onClick={() => selectedInvoice && handleSendEmail(selectedInvoice)}>
              <Mail className="w-4 h-4 mr-1" />Send via Email
            </Button>
            {selectedInvoice?.status !== "paid" && (
              <Button onClick={() => { selectedInvoice && updateInvoice(selectedInvoice.id, { status: "paid", paidAt: new Date().toISOString() }); setSelectedInvoice(null); }}
                className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
