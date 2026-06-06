"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Package } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const addUser = useAppStore((s) => s.addUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin"|"procurement_officer"|"manager"|"vendor">("vendor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const payload = { name, email, role };
    const res = addUser(payload);
    if (!res.success) {
      setError(res.message || "Could not register user");
      setLoading(false);
      return;
    }
    setCurrentUser(res.user || null);
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative items-stretch">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742502-ec7c0e9f7d9b?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-teal-900/75" />
        <div className="relative z-10 w-full p-16 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">VendorBridge</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-4">Procurement &amp;\nVendor\nManagement ERP</h1>
            <p className="text-lg text-white/80 max-w-xl">Centralize vendors, RFQs, quotations, approvals, purchase orders, invoices, email delivery, and procurement audit trails in one operating workspace.</p>
          </div>
        </div>
      </div>

      {/* Right Auth Card */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Signup</h3>
                  <p className="text-sm text-muted-foreground">Create an account</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push('/login')} className="px-3 py-1 rounded-md text-sm">Login</button>
                  <button className="px-3 py-1 rounded-md text-sm bg-slate-100">Signup</button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full h-11 px-3 rounded-lg border bg-background text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@company.com" className="w-full h-11 px-3 rounded-lg border bg-background text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Password</label>
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="" className="w-full h-11 px-3 rounded-lg border bg-background text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Role</label>
                  <select value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as typeof role)} className="w-full h-11 px-3 rounded-lg border bg-background text-sm">
                    <option value="vendor">Vendor</option>
                    <option value="procurement_officer">Procurement Officer</option>
                    <option value="manager">Manager / Approver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</div>}

                <div className="flex items-center gap-2">
                  <button type="submit" disabled={loading} className="h-11 px-4 bg-teal-600 text-white rounded-lg font-semibold">{loading ? "Creating..." : "Create account"}</button>
                  <button type="button" onClick={() => router.push('/login')} className="h-11 px-4 border rounded-lg">Back to login</button>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <button type="button" onClick={() => router.push('/login')} className="font-semibold text-primary hover:underline">Log in</button></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
