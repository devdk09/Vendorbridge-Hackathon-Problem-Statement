import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VendorBridge - Procurement & Vendor Management ERP",
  description: "Streamline your procurement operations with VendorBridge ERP",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
