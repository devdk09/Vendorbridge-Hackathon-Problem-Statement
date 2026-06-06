"use client";
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { User, Shield, Bell, Moon, Sun, Check } from "lucide-react";

export default function SettingsPage() {
  const { currentUser, setCurrentUser, users } = useAppStore();
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSwitchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" />Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Full Name</label>
                <Input defaultValue={currentUser?.name} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Email</label>
                <Input defaultValue={currentUser?.email} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Department</label>
                <Input defaultValue={currentUser?.department} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Role</label>
                <Input value={currentUser?.role?.replace("_", " ")} readOnly className="capitalize opacity-70" />
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2">
              {saved ? <><Check className="w-4 h-4" />Saved!</> : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" />Switch User</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Switch between registered users to preview different roles.</p>
            <div className="space-y-2">
              {users.map(u => (
                <button key={u.id} onClick={() => handleSwitchUser(u.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all hover:bg-muted/50
                    ${currentUser?.id === u.id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{u.role.replace("_", " ")}</p>
                    </div>
                  </div>
                  {currentUser?.id === u.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
