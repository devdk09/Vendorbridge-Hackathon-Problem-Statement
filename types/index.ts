// ---- ENUMS ----
export type UserRole = "admin" | "procurement_officer" | "manager" | "vendor";
export type VendorStatus = "active" | "inactive" | "pending";
export type RFQStatus = "draft" | "published" | "closed" | "cancelled";
export type QuotationStatus = "submitted" | "under_review" | "accepted" | "rejected";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type POStatus = "draft" | "approved" | "sent" | "delivered" | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

// ---- USER ----
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
}

// ---- VENDOR ----
export interface Vendor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  gstNumber: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: VendorStatus;
  rating: number;
  totalOrders: number;
  createdAt: string;
  contactPerson: string;
}

// ---- RFQ ----
export interface RFQItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  status: RFQStatus;
  deadline: string;
  createdBy: string;
  createdByName: string;
  assignedVendors: string[];
  items: RFQItem[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// ---- QUOTATION ----
export interface QuotationItem {
  rfqItemId: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  rfqId: string;
  rfqTitle: string;
  vendorId: string;
  vendorName: string;
  status: QuotationStatus;
  items: QuotationItem[];
  totalAmount: number;
  deliveryTimeline: number;
  deliveryUnit: string;
  notes?: string;
  validUntil: string;
  submittedAt: string;
  updatedAt: string;
}

// ---- APPROVAL ----
export interface ApprovalStep {
  id: string;
  approverName: string;
  approverRole: string;
  status: ApprovalStatus;
  remarks?: string;
  actionAt?: string;
}

export interface Approval {
  id: string;
  quotationId: string;
  rfqTitle: string;
  vendorName: string;
  totalAmount: number;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: string;
  steps: ApprovalStep[];
  currentStep: number;
  updatedAt: string;
}

// ---- PURCHASE ORDER ----
export interface POItem {
  product: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  itemTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quotationId: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorAddress: string;
  vendorGST: string;
  status: POStatus;
  items: POItem[];
  subtotal: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  grandTotal: number;
  deliveryDate: string;
  billingAddress: string;
  shippingAddress: string;
  terms?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---- INVOICE ----
export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  status: InvoiceStatus;
  items: POItem[];
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  dueDate: string;
  issueDate: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

// ---- ACTIVITY LOG ----
export interface ActivityLog {
  id: string;
  action: string;
  entityType: "rfq" | "quotation" | "approval" | "purchase_order" | "invoice" | "vendor" | "user";
  entityId: string;
  entityTitle: string;
  performedBy: string;
  performedByName: string;
  details?: string;
  timestamp: string;
}

// ---- DASHBOARD STATS ----
export interface DashboardStats {
  pendingApprovals: number;
  activeRFQs: number;
  totalVendors: number;
  monthlySpend: number;
  recentPOs: PurchaseOrder[];
  recentInvoices: Invoice[];
  spendTrend: { month: string; amount: number }[];
  vendorPerformance: { name: string; orders: number; rating: number }[];
}

// ---- NOTIFICATIONS ----
export interface Notification {
  id: string;
  type: "rfq" | "approval" | "quotation" | "invoice" | "po";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
