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
import { VENDOR_CATEGORIES } from "@/lib/data";
import { Plus, Search, Edit, Trash2, Star, Phone, Mail, Building2, MapPin } from "lucide-react";
import type { Vendor, VendorStatus } from "@/types";

const emptyVendor: Partial<Vendor> = {
  name: "", company: "", email: "", phone: "", gstNumber: "",
  category: "", address: "", city: "", state: "", pincode: "",
  status: "active", contactPerson: ""
};

function VendorsPageContent() {
  const searchParams = useSearchParams();
  const { vendors, addVendor, updateVendor, deleteVendor } = useAppStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(() => searchParams?.get("action") === "new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Vendor>>(emptyVendor);

  const filtered = vendors.filter(v => {
    const matchSearch = search === "" || v.name.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || v.category === categoryFilter;
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const openAdd = () => { setForm(emptyVendor); setEditingId(null); setShowModal(true); };
  const openEdit = (v: Vendor) => { setForm(v); setEditingId(v.id); setShowModal(true); };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    if (editingId) {
      updateVendor(editingId, form);
    } else {
      addVendor({ ...form, id: `v${Date.now()}`, rating: 4.0, totalOrders: 0, createdAt: new Date().toISOString() } as Vendor);
    }
    setShowModal(false);
    setForm(emptyVendor);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <AppShell title="Vendor Management" subtitle={`${filtered.length} vendors found`}>
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex gap-3">
          <Input placeholder="Search vendors..." icon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {VENDOR_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />Add Vendor</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Vendors", value: vendors.length, color: "text-blue-600" },
          { label: "Active", value: vendors.filter(v => v.status === "active").length, color: "text-emerald-600" },
          { label: "Inactive", value: vendors.filter(v => v.status === "inactive").length, color: "text-red-500" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(vendor => (
          <Card key={vendor.id} className="group hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {vendor.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground leading-tight">{vendor.company}</h3>
                    <p className="text-xs text-muted-foreground">{vendor.contactPerson}</p>
                  </div>
                </div>
                <Badge variant={vendor.status as "active" | "inactive" | "pending"} className="text-xs capitalize">
                  {vendor.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" /><span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span>{vendor.city}, {vendor.state}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <StarRating rating={vendor.rating} />
                  <span className="text-xs text-muted-foreground">{vendor.totalOrders} orders</span>
                </div>
                <span className="text-xs px-2 py-0.5 bg-secondary rounded-full font-medium">{vendor.category}</span>
              </div>

              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={() => openEdit(vendor)}>
                  <Edit className="w-3 h-3" />Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => deleteVendor(vendor.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No vendors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <Input label="Contact Person *" value={form.name ?? ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            <Input label="Company Name *" value={form.company ?? ""} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" />
            <Input label="Email *" type="email" value={form.email ?? ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.com" />
            <Input label="Phone" value={form.phone ?? ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91-XXXXXXXXXX" />
            <Input label="GST Number" value={form.gstNumber ?? ""} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} placeholder="GSTIN" />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <Select value={form.category ?? ""} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{VENDOR_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Textarea label="Address" value={form.address ?? ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" rows={2} />
            </div>
            <Input label="City" value={form.city ?? ""} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            <Input label="State" value={form.state ?? ""} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            <Input label="Pincode" value={form.pincode ?? ""} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <Select value={form.status ?? "active"} onValueChange={v => setForm(f => ({ ...f, status: v as VendorStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingId ? "Update" : "Add"} Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-muted-foreground">Loading...</div></div>}>
      <VendorsPageContent />
    </Suspense>
  );
}
