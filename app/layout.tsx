import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { OrderProvider } from "@/context/order-context";
import { InventoryProvider } from "@/context/inventory-context";
import { UserProvider } from "@/context/user-context";

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
  description:
    "A full-stack restaurant management app for inventory, orders, and menu updates.",
    icons: {
      icon:"/favicon.ico",
      apple: "/favicon.ico",
      shortcut: "/favicon.ico", 
    },
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
        <UserProvider>
          <InventoryProvider>
            <OrderProvider>{children}</OrderProvider>
          </InventoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
