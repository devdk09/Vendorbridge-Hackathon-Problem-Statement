import { create } from "zustand";
import type { User, Vendor, RFQ, Quotation, Approval, PurchaseOrder, Invoice, Notification, ActivityLog } from "@/types";
import { MOCK_USERS, MOCK_VENDORS, MOCK_RFQS, MOCK_QUOTATIONS, MOCK_APPROVALS, MOCK_PURCHASE_ORDERS, MOCK_INVOICES, MOCK_NOTIFICATIONS, MOCK_ACTIVITY_LOGS } from "@/lib/data";

const isClient = typeof window !== "undefined";

const saveState = <T>(key: string, value: T[]) => {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore localStorage errors
  }
};

const loadState = <T>(key: string, fallback: T[], uniqueKey: (item: T) => string): T[] => {
  if (!isClient) {
    const map = new Map<string, T>();
    fallback.forEach(item => map.set(uniqueKey(item), item));
    return Array.from(map.values());
  }

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as T[];
      const map = new Map<string, T>();
      fallback.forEach(item => map.set(uniqueKey(item), item));
      parsed.forEach(item => map.set(uniqueKey(item), item));
      return Array.from(map.values());
    }
  } catch {
    // ignore and fall back to mock
  }

  const map = new Map<string, T>();
  fallback.forEach(item => map.set(uniqueKey(item), item));
  return Array.from(map.values());
};

const loadObject = <T>(key: string): T | null => {
  if (!isClient) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Data
  users: User[];
  vendors: Vendor[];
  rfqs: RFQ[];
  quotations: Quotation[];
  approvals: Approval[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  addUser: (user: Omit<User, "id" | "createdAt">) => { success: boolean; message?: string; user?: User };

  // Vendor actions
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, data: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // RFQ actions
  addRFQ: (rfq: RFQ) => void;
  updateRFQ: (id: string, data: Partial<RFQ>) => void;

  // Quotation actions
  addQuotation: (quotation: Quotation) => void;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;

  // Approval actions
  addApproval: (approval: Approval) => void;
  updateApproval: (id: string, data: Partial<Approval>) => void;

  // PO actions
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => void;

  // Invoice actions
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addActivityLog: (log: ActivityLog) => void;
}

const persistedUsers = loadState<User>("vendorbridge_users", MOCK_USERS, (u) => u.email.toLowerCase());
const persistedVendors = loadState<Vendor>("vendorbridge_vendors", MOCK_VENDORS, (item) => item.id);
const persistedRFQs = loadState<RFQ>("vendorbridge_rfqs", MOCK_RFQS, (item) => item.id);
const persistedQuotations = loadState<Quotation>("vendorbridge_quotations", MOCK_QUOTATIONS, (item) => item.id);
const persistedApprovals = loadState<Approval>("vendorbridge_approvals", MOCK_APPROVALS, (item) => item.id);
const persistedPurchaseOrders = loadState<PurchaseOrder>("vendorbridge_purchase_orders", MOCK_PURCHASE_ORDERS, (item) => item.id);
const persistedInvoices = loadState<Invoice>("vendorbridge_invoices", MOCK_INVOICES, (item) => item.id);
const persistedNotifications = loadState<Notification>("vendorbridge_notifications", MOCK_NOTIFICATIONS, (item) => item.id);
const persistedActivityLogs = loadState<ActivityLog>("vendorbridge_activity_logs", MOCK_ACTIVITY_LOGS, (item) => item.id);
const persistedCurrentUser = loadObject<User>("vendorbridge_current_user");

export const useAppStore = create<AppState>((set) => ({
  currentUser: persistedCurrentUser,
  setCurrentUser: (user) => {
    if (isClient) {
      if (user) {
        localStorage.setItem("vendorbridge_current_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("vendorbridge_current_user");
      }
    }
    set({ currentUser: user });
  },

  users: persistedUsers,
  vendors: persistedVendors,
  rfqs: persistedRFQs,
  quotations: persistedQuotations,
  approvals: persistedApprovals,
  purchaseOrders: persistedPurchaseOrders,
  invoices: persistedInvoices,
  notifications: persistedNotifications,
  activityLogs: persistedActivityLogs,

  addVendor: (vendor) => set((s) => {
    const vendors = [vendor, ...s.vendors];
    saveState("vendorbridge_vendors", vendors);
    return { vendors };
  }),
  updateVendor: (id, data) => set((s) => {
    const vendors = s.vendors.map((v) => v.id === id ? { ...v, ...data } : v);
    saveState("vendorbridge_vendors", vendors);
    return { vendors };
  }),
  deleteVendor: (id) => set((s) => {
    const vendors = s.vendors.filter((v) => v.id !== id);
    saveState("vendorbridge_vendors", vendors);
    return { vendors };
  }),

  addRFQ: (rfq) => set((s) => {
    const rfqs = [rfq, ...s.rfqs];
    saveState("vendorbridge_rfqs", rfqs);
    return { rfqs };
  }),
  updateRFQ: (id, data) => set((s) => {
    const rfqs = s.rfqs.map((r) => r.id === id ? { ...r, ...data } : r);
    saveState("vendorbridge_rfqs", rfqs);
    return { rfqs };
  }),

  addQuotation: (quotation) => set((s) => {
    const quotations = [quotation, ...s.quotations];
    saveState("vendorbridge_quotations", quotations);
    return { quotations };
  }),
  updateQuotation: (id, data) => set((s) => {
    const quotations = s.quotations.map((q) => q.id === id ? { ...q, ...data } : q);
    saveState("vendorbridge_quotations", quotations);
    return { quotations };
  }),

  addApproval: (approval) => set((s) => {
    const approvals = [approval, ...s.approvals];
    saveState("vendorbridge_approvals", approvals);
    return { approvals };
  }),
  updateApproval: (id, data) => set((s) => {
    const approvals = s.approvals.map((a) => a.id === id ? { ...a, ...data } : a);
    saveState("vendorbridge_approvals", approvals);
    return { approvals };
  }),

  addPurchaseOrder: (po) => set((s) => {
    const purchaseOrders = [po, ...s.purchaseOrders];
    saveState("vendorbridge_purchase_orders", purchaseOrders);
    return { purchaseOrders };
  }),
  updatePurchaseOrder: (id, data) => set((s) => {
    const purchaseOrders = s.purchaseOrders.map((p) => p.id === id ? { ...p, ...data } : p);
    saveState("vendorbridge_purchase_orders", purchaseOrders);
    return { purchaseOrders };
  }),

  addInvoice: (invoice) => set((s) => {
    const invoices = [invoice, ...s.invoices];
    saveState("vendorbridge_invoices", invoices);
    return { invoices };
  }),
  updateInvoice: (id, data) => set((s) => {
    const invoices = s.invoices.map((i) => i.id === id ? { ...i, ...data } : i);
    saveState("vendorbridge_invoices", invoices);
    return { invoices };
  }),

  markNotificationRead: (id) => set((s) => {
    const notifications = s.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
    saveState("vendorbridge_notifications", notifications);
    return { notifications };
  }),
  markAllNotificationsRead: () => set((s) => {
    const notifications = s.notifications.map((n) => ({ ...n, read: true }));
    saveState("vendorbridge_notifications", notifications);
    return { notifications };
  }),

  addActivityLog: (log) => set((s) => {
    const activityLogs = [log, ...s.activityLogs];
    saveState("vendorbridge_activity_logs", activityLogs);
    return { activityLogs };
  }),

  addUser: (user) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      department: user.department,
      createdAt: new Date().toISOString(),
    };

    let result = { success: true, user: newUser } as { success: boolean; message?: string; user?: User };

    set((s) => {
      const exists = s.users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) {
        result = { success: false, message: "A user with this email already exists." };
        return {} as Partial<AppState>;
      }
      const users = [newUser, ...s.users];
      saveState("vendorbridge_users", users);
      return { users } as Partial<AppState>;
    });

    return result;
  },
}));
