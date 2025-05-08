import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { OrderProvider } from "@/context/order-context";
import Inventory from "./restaurant/inventory/page";
import { InventoryProvider } from "@/context/inventory-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jasglynn Bar Management System",
  description: "A full-stack restaurant management app for inventory, orders, and menu updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InventoryProvider>
            <OrderProvider>
              {children}
              </OrderProvider>
          </InventoryProvider>  
      </body>
    </html>
  );
}
