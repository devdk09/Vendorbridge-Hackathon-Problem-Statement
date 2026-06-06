"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { Package, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();
  const users = useAppStore(state => state.users);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await new Promise(r => setTimeout(r, 800));
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Please register if you do not have an account.");
    }
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
          <div className="flex gap-3 mt-8">
            <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">RFQ</button>
            <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">Quotes</button>
            <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">Approval</button>
            <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">PO</button>
            <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">Invoice</button>
          </div>
        </div>
      </div>

      {/* Right Auth Card */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]" style={{backgroundColor: 'rgba(250,250,252,1)'}}>
        <div className="w-full max-w-2xl grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Login</h3>
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-md text-sm bg-slate-100">Login</button>
                  <button onClick={() => router.push('/register')} className="px-3 py-1 rounded-md text-sm">Signup</button>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" className="w-full h-11 px-3 rounded-lg border bg-background text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="" className="w-full h-11 px-3 pr-10 rounded-lg border bg-background text-sm" required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Role</label>
                  <select className="w-full h-11 px-3 rounded-lg border bg-background text-sm">
                    <option>Procurement Officer</option>
                    <option>Manager / Approver</option>
                    <option>Admin</option>
                    <option>Vendor</option>
                  </select>
                </div>

                {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</div>}

                <button type="submit" className="w-full h-11 bg-teal-600 text-white rounded-lg font-semibold">Sign in</button>
                <div className="mt-3 text-sm text-muted-foreground">Access is verified by the backend before opening the ERP workspace.</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
