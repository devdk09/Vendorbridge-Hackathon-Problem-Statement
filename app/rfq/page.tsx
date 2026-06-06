"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store";
import { formatDate } from "@/lib/data";
import { Plus, Search, FileText, Calendar, Users, Edit, Trash2, Package } from "lucide-react";
import type { RFQ, RFQItem, RFQStatus } from "@/types";

const emptyItem = (): RFQItem => ({ id: Date.now().toString(), product: "", description: "", quantity: 1, unit: "units" });

function RFQPageContent() {
  const searchParams = useSearchParams();
  const { rfqs, vendors, addRFQ, updateRFQ, currentUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(() => searchParams?.get("action") === "new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RFQ>>({ title: "", description: "", deadline: "", assignedVendors: [], items: [emptyItem()] });

  const filtered = rfqs.filter(r => {
    const matchSearch = search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.rfqNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setForm({ title: "", description: "", deadline: "", assignedVendors: [], items: [emptyItem()], status: "draft" });
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (r: RFQ) => { setForm(r); setEditingId(r.id); setShowModal(true); };

  const handleSubmit = (publish = false) => {
    if (!form.title) return;
    const status = publish ? "published" : "draft";
    if (editingId) {
      updateRFQ(editingId, { ...form, status });
    } else {
      const rfqNum = `RFQ-${new Date().getFullYear()}-${String(rfqs.length + 1).padStart(3, "0")}`;
      addRFQ({ ...form, id: `rfq${Date.now()}`, rfqNumber: rfqNum, status, createdBy: currentUser?.id ?? "u2", createdByName: currentUser?.name ?? "User", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as RFQ);
    }
    setShowModal(false);
  };

  const updateItem = (idx: number, field: keyof RFQItem, value: string | number) => {
    setForm(f => ({ ...f, items: f.items?.map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
  };
  const addItem = () => setForm(f => ({ ...f, items: [...(f.items ?? []), emptyItem()] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items?.filter((_, i) => i !== idx) }));
  const toggleVendor = (id: string) => setForm(f => ({ ...f, assignedVendors: f.assignedVendors?.includes(id) ? f.assignedVendors.filter(v => v !== id) : [...(f.assignedVendors ?? []), id] }));

  const statusColors: Record<RFQStatus, "draft" | "active" | "inactive" | "rejected"> = {
    draft: "draft",
    published: "active",
    closed: "inactive",
    cancelled: "rejected"
  };

  return (
    <AppShell title="RFQ Management" subtitle="Create and manage Request for Quotations">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex gap-3">
          <Input placeholder="Search RFQs..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />Create RFQ</Button>
      </div>

      {/* RFQ Cards */}
      <div className="space-y-3">
        {filtered.map(rfq => (
          <Card key={rfq.id} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-muted-foreground">{rfq.rfqNumber}</span>
                        <Badge variant={statusColors[rfq.status]} className="text-xs capitalize">{rfq.status}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{rfq.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{rfq.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(rfq)}><Edit className="w-3.5 h-3.5" /></Button>
                      {rfq.status === "draft" && (
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateRFQ(rfq.id, { status: "published" })}>Publish</Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: <span className="font-medium text-foreground">{formatDate(rfq.deadline)}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span>{rfq.assignedVendors.length} vendor{rfq.assignedVendors.length !== 1 ? "s" : ""} assigned</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Package className="w-3.5 h-3.5" />
                      <span>{rfq.items.length} item{rfq.items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">By {rfq.createdByName} · {formatDate(rfq.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No RFQs found</p>
            <p className="text-sm mt-1">Create your first RFQ to get started</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit RFQ" : "Create New RFQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input label="RFQ Title *" value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Office Laptop Procurement Q1 2025" />
            <Textarea label="Description" value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Describe what you need..." />
            <Input label="Deadline *" type="date" value={form.deadline ?? ""} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Items *</label>
                <Button variant="outline" size="sm" onClick={addItem} className="gap-1 text-xs"><Plus className="w-3 h-3" />Add Item</Button>
              </div>
              <div className="space-y-2">
                {form.items?.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/30 rounded-lg">
                    <div className="col-span-4"><Input placeholder="Product name" value={item.product} onChange={e => updateItem(idx, "product", e.target.value)} /></div>
                    <div className="col-span-3"><Input placeholder="Description" value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} /></div>
                    <div className="col-span-2"><Input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, "quantity", Number(e.target.value))} /></div>
                    <div className="col-span-2"><Input placeholder="Unit" value={item.unit} onChange={e => updateItem(idx, "unit", e.target.value)} /></div>
                    <div className="col-span-1">
                      {(form.items?.length ?? 0) > 1 && (
                        <Button variant="ghost" size="icon-sm" onClick={() => removeItem(idx)} className="text-destructive hover:bg-destructive hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assign Vendors */}
            <div>
              <label className="text-sm font-medium mb-2 block">Assign Vendors</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                {vendors.filter(v => v.status === "active").map(v => (
                  <label key={v.id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${form.assignedVendors?.includes(v.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <input type="checkbox" className="accent-primary" checked={form.assignedVendors?.includes(v.id)} onChange={() => toggleVendor(v.id)} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{v.company}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.category}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="secondary" onClick={() => handleSubmit(false)}>Save Draft</Button>
            <Button onClick={() => handleSubmit(true)}>Publish RFQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default function RFQPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-muted-foreground">Loading...</div></div>}>
      <RFQPageContent />
    </Suspense>
  );
}
