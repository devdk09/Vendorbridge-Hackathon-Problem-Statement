# VendorBridge — Procurement & Vendor Management ERP

A full-featured ERP platform built with Next.js 15, TypeScript, Tailwind CSS, and Zustand.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Deployment Link: https://vendorbridge-hackathon-problem-stat-eta.vercel.app/login
Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vendorbridge.com | demo123 |
| Procurement Officer | officer@vendorbridge.com | demo123 |
| Manager / Approver | manager@vendorbridge.com | demo123 |
| Vendor | vendor@acmecorp.com | demo123 |

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + custom design system
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

## 🗂️ Project Structure

```
app/
  login/          — Authentication
  dashboard/      — Overview & analytics
  vendors/        — Vendor management (CRUD)
  rfq/            — RFQ creation & management
  quotations/     — Quotation submission & comparison
  approvals/      — Multi-step approval workflow
  orders/         — Purchase Orders & Invoice generation
  reports/        — Analytics & reports
  activity/       — Activity logs & notifications
  settings/       — User settings & role switching

components/
  layout/         — AppShell, Sidebar, Header
  ui/             — Badge, Button, Card, Dialog, Input, Select, Table, Textarea

lib/
  data.ts         — Mock data & utilities
  utils.ts        — Helper functions

store/
  index.ts        — Zustand global state

types/
  index.ts        — TypeScript type definitions
```

## ✅ Implemented Features

- ✅ Role-based login (Admin, Officer, Manager, Vendor)
- ✅ Dashboard with charts and KPIs
- ✅ Vendor management (add/edit/delete, search/filter)
- ✅ RFQ creation and management
- ✅ Quotation submission and side-by-side comparison
- ✅ Multi-step approval workflow (approve/reject with remarks)
- ✅ Purchase Order generation with GST tax breakdown (CGST/SGST/IGST)
- ✅ Invoice generation from POs
- ✅ Invoice print / mark as paid / send via email
- ✅ Activity logs with entity tracking
- ✅ Notification center with unread badge
- ✅ Dark mode toggle
- ✅ Responsive layout (mobile + desktop)
- ✅ Reports & analytics with multiple chart types

## 🚀 Deploy on Vercel

```bash
vercel deploy
```
