// import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import RestaurantSidebar from "@/components/restaurant-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      < RestaurantSidebar />
      <div className="border w-full">
        <div className="border-b flex items-center space-x-4">
          <SidebarTrigger />
          <Header />
        </div>
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}
