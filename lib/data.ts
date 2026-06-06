import type {
  User, Vendor, RFQ, Quotation, Approval, PurchaseOrder, Invoice, ActivityLog, Notification, DashboardStats
} from "@/types";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Arjun Sharma", email: "admin@vendorbridge.com", role: "admin", department: "Administration", createdAt: "2024-01-10" },
  { id: "u2", name: "Priya Nair", email: "officer@vendorbridge.com", role: "procurement_officer", department: "Procurement", createdAt: "2024-01-12" },
  { id: "u3", name: "Rahul Mehta", email: "manager@vendorbridge.com", role: "manager", department: "Operations", createdAt: "2024-01-15" },
  { id: "u4", name: "Anita Patel", email: "vendor@acmecorp.com", role: "vendor", createdAt: "2024-02-01" },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: "v1", name: "Rajesh Kumar", company: "TechSupply India Pvt Ltd", email: "rajesh@techsupply.in", phone: "+91-9876543210", gstNumber: "27AABCT1332L1ZF", category: "IT Equipment", address: "Plot 14, MIDC, Andheri East", city: "Mumbai", state: "Maharashtra", pincode: "400093", status: "active", rating: 4.8, totalOrders: 42, createdAt: "2024-01-20", contactPerson: "Rajesh Kumar" },
  { id: "v2", name: "Sunita Desai", company: "OfficeMax Solutions", email: "sunita@officemax.in", phone: "+91-9087654321", gstNumber: "24AABCO1234L1ZG", category: "Office Supplies", address: "B-201, Odhav Industrial Estate", city: "Ahmedabad", state: "Gujarat", pincode: "382415", status: "active", rating: 4.5, totalOrders: 28, createdAt: "2024-01-22", contactPerson: "Sunita Desai" },
  { id: "v3", name: "Mohan Verma", company: "CleanTech Facilities", email: "mohan@cleantech.in", phone: "+91-8765432109", gstNumber: "07AABCC5678L1ZH", category: "Facility Management", address: "C-45, Okhla Industrial Area", city: "New Delhi", state: "Delhi", pincode: "110020", status: "active", rating: 4.2, totalOrders: 15, createdAt: "2024-02-05", contactPerson: "Mohan Verma" },
  { id: "v4", name: "Kavita Joshi", company: "PrintMaster Services", email: "kavita@printmaster.in", phone: "+91-7654321098", gstNumber: "29AABCP9876L1ZI", category: "Printing & Stationery", address: "12, Electronic City Phase 2", city: "Bengaluru", state: "Karnataka", pincode: "560100", status: "inactive", rating: 3.9, totalOrders: 8, createdAt: "2024-02-10", contactPerson: "Kavita Joshi" },
  { id: "v5", name: "Vikram Singh", company: "NetConnect ISP", email: "vikram@netconnect.in", phone: "+91-6543210987", gstNumber: "06AABCN4321L1ZJ", category: "IT Services", address: "T-22, Cyber Hub", city: "Gurugram", state: "Haryana", pincode: "122002", status: "active", rating: 4.6, totalOrders: 31, createdAt: "2024-02-15", contactPerson: "Vikram Singh" },
  { id: "v6", name: "Pooja Sharma", company: "FurniWorld Commercial", email: "pooja@furniworld.in", phone: "+91-9123456789", gstNumber: "33AABCF7654L1ZK", category: "Furniture", address: "45, T Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017", status: "active", rating: 4.3, totalOrders: 19, createdAt: "2024-03-01", contactPerson: "Pooja Sharma" },
];

export const MOCK_RFQS: RFQ[] = [
  { id: "rfq1", rfqNumber: "RFQ-2024-001", title: "Laptop Procurement Q1 2024", description: "Procurement of high-performance laptops for the development team with minimum 16GB RAM and i7 processor.", status: "published", deadline: "2024-12-30", createdBy: "u2", createdByName: "Priya Nair", assignedVendors: ["v1", "v5"], items: [ { id: "item1", product: "Laptop 16GB i7", description: "Business laptop, 16GB RAM, Intel i7, 512GB SSD", quantity: 15, unit: "units", estimatedPrice: 75000 }, { id: "item2", product: "Laptop Bag", description: "Branded laptop bag 15.6 inch", quantity: 15, unit: "units", estimatedPrice: 1500 } ], createdAt: "2024-11-01", updatedAt: "2024-11-15" },
  { id: "rfq2", rfqNumber: "RFQ-2024-002", title: "Office Stationery Annual Supply", description: "Annual procurement of office stationery items including paper, pens, folders, and general supplies.", status: "published", deadline: "2024-12-15", createdBy: "u2", createdByName: "Priya Nair", assignedVendors: ["v2", "v4"], items: [ { id: "item3", product: "A4 Paper", description: "A4 size 75 GSM paper, 500 sheets per ream", quantity: 200, unit: "reams", estimatedPrice: 320 }, { id: "item4", product: "Ball Point Pens", description: "Blue/Black/Red ballpoint pens, box of 12", quantity: 50, unit: "boxes", estimatedPrice: 120 } ], createdAt: "2024-11-05", updatedAt: "2024-11-18" },
  { id: "rfq3", rfqNumber: "RFQ-2024-003", title: "Network Infrastructure Upgrade", description: "Upgrade of office network infrastructure including switches, routers, and CAT6 cabling.", status: "closed", deadline: "2024-11-30", createdBy: "u2", createdByName: "Priya Nair", assignedVendors: ["v1", "v5"], items: [ { id: "item5", product: "Managed Switch 24-port", description: "Layer 2 managed switch, 24 port Gigabit", quantity: 4, unit: "units", estimatedPrice: 25000 } ], createdAt: "2024-10-15", updatedAt: "2024-11-30" },
  { id: "rfq4", rfqNumber: "RFQ-2024-004", title: "Office Furniture Procurement", description: "New furniture for the expanded office space including desks, chairs, and storage units.", status: "draft", deadline: "2025-01-15", createdBy: "u2", createdByName: "Priya Nair", assignedVendors: ["v6"], items: [ { id: "item6", product: "Executive Desk", description: "L-shaped executive desk with storage", quantity: 10, unit: "units", estimatedPrice: 18000 }, { id: "item7", product: "Ergonomic Chair", description: "High-back ergonomic office chair", quantity: 25, unit: "units", estimatedPrice: 8500 } ], createdAt: "2024-11-20", updatedAt: "2024-11-20" },
];

export const MOCK_QUOTATIONS: Quotation[] = [
  { id: "q1", quotationNumber: "QT-2024-001", rfqId: "rfq1", rfqTitle: "Laptop Procurement Q1 2024", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", status: "accepted", items: [ { rfqItemId: "item1", product: "Laptop 16GB i7", quantity: 15, unitPrice: 72000, totalPrice: 1080000, unit: "units" }, { rfqItemId: "item2", product: "Laptop Bag", quantity: 15, unitPrice: 1400, totalPrice: 21000, unit: "units" } ], totalAmount: 1101000, deliveryTimeline: 14, deliveryUnit: "days", notes: "Includes 3-year onsite warranty", validUntil: "2024-12-15", submittedAt: "2024-11-10", updatedAt: "2024-11-10" },
  { id: "q2", quotationNumber: "QT-2024-002", rfqId: "rfq1", rfqTitle: "Laptop Procurement Q1 2024", vendorId: "v5", vendorName: "NetConnect ISP", status: "rejected", items: [ { rfqItemId: "item1", product: "Laptop 16GB i7", quantity: 15, unitPrice: 78000, totalPrice: 1170000, unit: "units" }, { rfqItemId: "item2", product: "Laptop Bag", quantity: 15, unitPrice: 1600, totalPrice: 24000, unit: "units" } ], totalAmount: 1194000, deliveryTimeline: 21, deliveryUnit: "days", notes: "Standard 1-year warranty", validUntil: "2024-12-20", submittedAt: "2024-11-12", updatedAt: "2024-11-12" },
  { id: "q3", quotationNumber: "QT-2024-003", rfqId: "rfq2", rfqTitle: "Office Stationery Annual Supply", vendorId: "v2", vendorName: "OfficeMax Solutions", status: "submitted", items: [ { rfqItemId: "item3", product: "A4 Paper", quantity: 200, unitPrice: 310, totalPrice: 62000, unit: "reams" }, { rfqItemId: "item4", product: "Ball Point Pens", quantity: 50, unitPrice: 110, totalPrice: 5500, unit: "boxes" } ], totalAmount: 67500, deliveryTimeline: 7, deliveryUnit: "days", notes: "Free delivery above ₹50,000", validUntil: "2024-12-25", submittedAt: "2024-11-15", updatedAt: "2024-11-15" },
  { id: "q4", quotationNumber: "QT-2024-004", rfqId: "rfq3", rfqTitle: "Network Infrastructure Upgrade", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", status: "accepted", items: [ { rfqItemId: "item5", product: "Managed Switch 24-port", quantity: 4, unitPrice: 23500, totalPrice: 94000, unit: "units" } ], totalAmount: 94000, deliveryTimeline: 10, deliveryUnit: "days", notes: "Installation support included", validUntil: "2024-12-01", submittedAt: "2024-10-25", updatedAt: "2024-10-25" },
];

export const MOCK_APPROVALS: Approval[] = [
  { id: "ap1", quotationId: "q1", rfqTitle: "Laptop Procurement Q1 2024", vendorName: "TechSupply India Pvt Ltd", totalAmount: 1101000, status: "approved", requestedBy: "Priya Nair", requestedAt: "2024-11-11", steps: [ { id: "s1", approverName: "Priya Nair", approverRole: "Procurement Officer", status: "approved", remarks: "Best price and delivery timeline", actionAt: "2024-11-11" }, { id: "s2", approverName: "Rahul Mehta", approverRole: "Manager", status: "approved", remarks: "Approved. Proceed with PO.", actionAt: "2024-11-13" } ], currentStep: 2, updatedAt: "2024-11-13" },
  { id: "ap2", quotationId: "q3", rfqTitle: "Office Stationery Annual Supply", vendorName: "OfficeMax Solutions", totalAmount: 67500, status: "pending", requestedBy: "Priya Nair", requestedAt: "2024-11-16", steps: [ { id: "s3", approverName: "Priya Nair", approverRole: "Procurement Officer", status: "approved", remarks: "Competitive pricing", actionAt: "2024-11-16" }, { id: "s4", approverName: "Rahul Mehta", approverRole: "Manager", status: "pending" } ], currentStep: 1, updatedAt: "2024-11-16" },
  { id: "ap3", quotationId: "q4", rfqTitle: "Network Infrastructure Upgrade", vendorName: "TechSupply India Pvt Ltd", totalAmount: 94000, status: "approved", requestedBy: "Priya Nair", requestedAt: "2024-10-26", steps: [ { id: "s5", approverName: "Priya Nair", approverRole: "Procurement Officer", status: "approved", actionAt: "2024-10-26" }, { id: "s6", approverName: "Rahul Mehta", approverRole: "Manager", status: "approved", remarks: "Approved", actionAt: "2024-10-28" } ], currentStep: 2, updatedAt: "2024-10-28" },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "po1", poNumber: "PO-2024-001", quotationId: "q1", rfqId: "rfq1", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", vendorEmail: "rajesh@techsupply.in", vendorAddress: "Plot 14, MIDC, Andheri East, Mumbai - 400093", vendorGST: "27AABCT1332L1ZF", status: "sent", items: [ { product: "Laptop 16GB i7", description: "Business laptop, 16GB RAM, Intel i7, 512GB SSD", quantity: 15, unit: "units", unitPrice: 72000, totalPrice: 1080000, taxRate: 18, cgst: 97200, sgst: 97200, igst: 0, itemTotal: 1274400 }, { product: "Laptop Bag", description: "Branded laptop bag 15.6 inch", quantity: 15, unit: "units", unitPrice: 1400, totalPrice: 21000, taxRate: 12, cgst: 1260, sgst: 1260, igst: 0, itemTotal: 23520 } ], subtotal: 1101000, totalCGST: 98460, totalSGST: 98460, totalIGST: 0, totalTax: 196920, grandTotal: 1297920, deliveryDate: "2024-12-10", billingAddress: "VendorBridge HQ, 5th Floor, Cyber One, Ahmedabad - 380015", shippingAddress: "VendorBridge HQ, 5th Floor, Cyber One, Ahmedabad - 380015", terms: "Payment within 30 days of delivery. Goods to be delivered in original packaging.", createdBy: "Priya Nair", createdAt: "2024-11-14", updatedAt: "2024-11-14" },
  { id: "po2", poNumber: "PO-2024-002", quotationId: "q4", rfqId: "rfq3", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", vendorEmail: "rajesh@techsupply.in", vendorAddress: "Plot 14, MIDC, Andheri East, Mumbai - 400093", vendorGST: "27AABCT1332L1ZF", status: "delivered", items: [ { product: "Managed Switch 24-port", description: "Layer 2 managed switch, 24 port Gigabit", quantity: 4, unit: "units", unitPrice: 23500, totalPrice: 94000, taxRate: 18, cgst: 8460, sgst: 8460, igst: 0, itemTotal: 110920 } ], subtotal: 94000, totalCGST: 8460, totalSGST: 8460, totalIGST: 0, totalTax: 16920, grandTotal: 110920, deliveryDate: "2024-11-10", billingAddress: "VendorBridge HQ, 5th Floor, Cyber One, Ahmedabad - 380015", shippingAddress: "VendorBridge HQ, 5th Floor, Cyber One, Ahmedabad - 380015", createdBy: "Priya Nair", createdAt: "2024-10-29", updatedAt: "2024-11-10" },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv1", invoiceNumber: "INV-2024-001", poId: "po2", poNumber: "PO-2024-002", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", vendorEmail: "rajesh@techsupply.in", status: "paid", items: [ { product: "Managed Switch 24-port", description: "Layer 2 managed switch, 24 port Gigabit", quantity: 4, unit: "units", unitPrice: 23500, totalPrice: 94000, taxRate: 18, cgst: 8460, sgst: 8460, igst: 0, itemTotal: 110920 } ], subtotal: 94000, totalTax: 16920, grandTotal: 110920, dueDate: "2024-12-10", issueDate: "2024-11-11", paidAt: "2024-11-25", createdAt: "2024-11-11" },
  { id: "inv2", invoiceNumber: "INV-2024-002", poId: "po1", poNumber: "PO-2024-001", vendorId: "v1", vendorName: "TechSupply India Pvt Ltd", vendorEmail: "rajesh@techsupply.in", status: "sent", items: [ { product: "Laptop 16GB i7", description: "Business laptop, 16GB RAM, Intel i7, 512GB SSD", quantity: 15, unit: "units", unitPrice: 72000, totalPrice: 1080000, taxRate: 18, cgst: 97200, sgst: 97200, igst: 0, itemTotal: 1274400 }, { product: "Laptop Bag", description: "Branded laptop bag 15.6 inch", quantity: 15, unit: "units", unitPrice: 1400, totalPrice: 21000, taxRate: 12, cgst: 1260, sgst: 1260, igst: 0, itemTotal: 23520 } ], subtotal: 1101000, totalTax: 196920, grandTotal: 1297920, dueDate: "2025-01-14", issueDate: "2024-12-14", createdAt: "2024-12-14" },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: "log1", action: "Invoice Paid", entityType: "invoice", entityId: "inv1", entityTitle: "INV-2024-001", performedBy: "u1", performedByName: "Arjun Sharma", details: "Invoice marked as paid. Amount: ₹1,10,920", timestamp: "2024-11-25T10:30:00Z" },
  { id: "log2", action: "PO Sent to Vendor", entityType: "purchase_order", entityId: "po1", entityTitle: "PO-2024-001", performedBy: "u2", performedByName: "Priya Nair", details: "PO sent to TechSupply India Pvt Ltd via email", timestamp: "2024-11-14T14:00:00Z" },
  { id: "log3", action: "Approval Granted", entityType: "approval", entityId: "ap1", entityTitle: "Laptop Procurement Q1 2024", performedBy: "u3", performedByName: "Rahul Mehta", details: "Quotation approved. Proceeding with PO generation.", timestamp: "2024-11-13T11:15:00Z" },
  { id: "log4", action: "Quotation Submitted", entityType: "quotation", entityId: "q3", entityTitle: "QT-2024-003", performedBy: "u4", performedByName: "Anita Patel", details: "Quotation submitted for Office Stationery Annual Supply", timestamp: "2024-11-15T09:00:00Z" },
  { id: "log5", action: "RFQ Created", entityType: "rfq", entityId: "rfq4", entityTitle: "Office Furniture Procurement", performedBy: "u2", performedByName: "Priya Nair", details: "New RFQ created and saved as draft", timestamp: "2024-11-20T16:45:00Z" },
  { id: "log6", action: "Vendor Added", entityType: "vendor", entityId: "v6", entityTitle: "FurniWorld Commercial", performedBy: "u1", performedByName: "Arjun Sharma", details: "New vendor registered in the system", timestamp: "2024-03-01T10:00:00Z" },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "approval", title: "Pending Approval", message: "Office Stationery Annual Supply quotation awaiting your approval", read: false, createdAt: "2024-11-16T09:00:00Z", link: "/approvals" },
  { id: "n2", type: "rfq", title: "New RFQ Assigned", message: "You have been assigned to RFQ: Laptop Procurement Q1 2024", read: false, createdAt: "2024-11-01T10:00:00Z", link: "/rfq" },
  { id: "n3", type: "invoice", title: "Invoice Overdue", message: "Invoice INV-2024-003 is now overdue", read: true, createdAt: "2024-11-20T08:00:00Z", link: "/orders" },
  { id: "n4", type: "po", title: "PO Delivered", message: "Purchase Order PO-2024-002 has been marked as delivered", read: true, createdAt: "2024-11-10T14:00:00Z", link: "/orders" },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  pendingApprovals: 1,
  activeRFQs: 2,
  totalVendors: 5,
  monthlySpend: 1408840,
  recentPOs: MOCK_PURCHASE_ORDERS,
  recentInvoices: MOCK_INVOICES,
  spendTrend: [
    { month: "Jun", amount: 450000 },
    { month: "Jul", amount: 380000 },
    { month: "Aug", amount: 620000 },
    { month: "Sep", amount: 290000 },
    { month: "Oct", amount: 110920 },
    { month: "Nov", amount: 1297920 },
  ],
  vendorPerformance: [
    { name: "TechSupply India", orders: 42, rating: 4.8 },
    { name: "OfficeMax Solutions", orders: 28, rating: 4.5 },
    { name: "NetConnect ISP", orders: 31, rating: 4.6 },
    { name: "FurniWorld", orders: 19, rating: 4.3 },
    { name: "CleanTech", orders: 15, rating: 4.2 },
  ],
};

export const VENDOR_CATEGORIES = [
  "IT Equipment", "IT Services", "Office Supplies", "Printing & Stationery",
  "Facility Management", "Furniture", "Transportation", "Catering",
  "Security Services", "Maintenance", "Consulting", "Other"
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
