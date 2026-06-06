"use client";
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/data";
import { CheckCircle2, XCircle, Clock, User, ChevronRight, AlertCircle, FileText } from "lucide-react";
import type { Approval } from "@/types";

export default function ApprovalsPage() {
  const { approvals, updateApproval, addPurchaseOrder, purchaseOrders, quotations, currentUser } = useAppStore();
  const [selected, setSelected] = useState<Approval | null>(null);
  const [remarks, setRemarks] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = approvals.filter(a => filter === "all" || a.status === filter);

  const handleAction = () => {
    if (!selected || !action) return;
    const newStatus = action === "approve" ? "approved" : "rejected";
    const updatedSteps = selected.steps.map((s, i) =>
      i === selected.currentStep ? { ...s, status: newStatus as "pending" | "approved" | "rejected", remarks, actionAt: new Date().toISOString() } : s
    );
    const allApproved = action === "approve" && selected.currentStep === selected.steps.length - 1;
    updateApproval(selected.id, {
      status: allApproved ? "approved" : action === "reject" ? "rejected" : "pending",
      steps: updatedSteps,
      currentStep: allApproved ? selected.currentStep : selected.currentStep + (action === "approve" ? 1 : 0),
      updatedAt: new Date().toISOString()
    });
    if (allApproved) {
      const quotation = quotations.find(q => q.id === selected.quotationId);
      if (quotation) {
        const poNum = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, "0")}`;
        addPurchaseOrder({
          id: `po${Date.now()}`, poNumber: poNum, quotationId: quotation.id,
          rfqId: quotation.rfqId, vendorId: quotation.vendorId, vendorName: quotation.vendorName,
          vendorEmail: "", vendorAddress: "", vendorGST: "", status: "draft",
          items: quotation.items.map(i => ({
            product: i.product, description: "", quantity: i.quantity, unit: i.unit,
            unitPrice: i.unitPrice, totalPrice: i.totalPrice, taxRate: 18,
            cgst: i.totalPrice * 0.09, sgst: i.totalPrice * 0.09, igst: 0, itemTotal: i.totalPrice * 1.18
          })),
          subtotal: quotation.totalAmount, totalCGST: quotation.totalAmount * 0.09,
          totalSGST: quotation.totalAmount * 0.09, totalIGST: 0,
          totalTax: quotation.totalAmount * 0.18, grandTotal: quotation.totalAmount * 1.18,
          deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
          billingAddress: "VendorBridge HQ, Ahmedabad - 380015",
          shippingAddress: "VendorBridge HQ, Ahmedabad - 380015",
          createdBy: currentUser?.name ?? "System", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        });
      }
    }
    setSelected(null);
    setRemarks("");
    setAction(null);
  };

  const statusColor = (s: string) => s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending";

  return (
    <AppShell title="Approval Workflow" subtitle="Review and process procurement approvals">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize
              ${filter === f ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"}`}>
            {f} {f !== "all" && `(${approvals.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(approval => (
          <Card key={approval.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{approval.rfqTitle}</h3>
                    <Badge variant={statusColor(approval.status)}>{approval.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Vendor: <span className="font-medium text-foreground">{approval.vendorName}</span>
                    {" · "} Amount: <span className="font-bold text-foreground">{formatCurrency(approval.totalAmount)}</span>
                    {" · "} Requested by: {approval.requestedBy}
                  </p>

                  {/* Steps */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {approval.steps.map((step, i) => (
                      <React.Fragment key={step.id}>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
                          ${step.status === "approved" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
                            step.status === "rejected" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" :
                            "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"}`}>
                          {step.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> :
                           step.status === "rejected" ? <XCircle className="w-3 h-3" /> :
                           <Clock className="w-3 h-3" />}
                          <User className="w-3 h-3" />
                          {step.approverName} ({step.approverRole})
                        </div>
                        {i < approval.steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  {approval.status === "pending" && (
                    <>
                      <button onClick={() => { setSelected(approval); setAction("approve"); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => { setSelected(approval); setAction("reject"); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/40">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {approval.status !== "pending" && (
                    <button onClick={() => setSelected(approval)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border hover:bg-muted text-sm font-medium transition-colors">
                      <FileText className="w-4 h-4" /> View Details
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No approvals found for this filter.</p>
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selected && !!action} onOpenChange={() => { setSelected(null); setAction(null); setRemarks(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {action === "approve" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
              {action === "approve" ? "Approve" : "Reject"} Quotation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selected && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{selected.rfqTitle}</p>
                <p className="text-muted-foreground">{selected.vendorName} · {formatCurrency(selected.totalAmount)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium block mb-1.5">Remarks {action === "reject" && <span className="text-red-500">*</span>}</label>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add your remarks or justification..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelected(null); setAction(null); setRemarks(""); }}>Cancel</Button>
            <Button onClick={handleAction}
              className={action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}>
              Confirm {action === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selected && !action} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">RFQ</p><p className="font-medium">{selected.rfqTitle}</p></div>
                <div><p className="text-muted-foreground">Vendor</p><p className="font-medium">{selected.vendorName}</p></div>
                <div><p className="text-muted-foreground">Amount</p><p className="font-bold">{formatCurrency(selected.totalAmount)}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge variant={statusColor(selected.status)}>{selected.status}</Badge></div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Approval Timeline</p>
                {selected.steps.map(step => (
                  <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    {step.status === "approved" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> :
                     step.status === "rejected" ? <XCircle className="w-4 h-4 text-red-500 mt-0.5" /> :
                     <Clock className="w-4 h-4 text-amber-500 mt-0.5" />}
                    <div>
                      <p className="text-sm font-medium">{step.approverName} <span className="text-muted-foreground font-normal">({step.approverRole})</span></p>
                      {step.remarks && <p className="text-xs text-muted-foreground mt-0.5">"{step.remarks}"</p>}
                      {step.actionAt && <p className="text-xs text-muted-foreground">{formatDate(step.actionAt)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
