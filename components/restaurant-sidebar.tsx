'use client'
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    
    {
      title: "Orders",
      url: "#",
      items: [
        {
            title: "Quick Order",
            url: "/restaurant",
          },
        {
          title: "Table orders",
          url: "/restaurant/table-orders",
        },
        {
          title: "Orders",
          url: "/restaurant/orders",
          isActive: true,
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      items: [
        {
          title: "Inventory stocks",
          url: "/restaurant/inventory",
        },
        // {
        //   title: "Stock Levels",
        //   url: "#",
        // },
        // {
        //   title: "Reports",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Assets",
      url: "#",
      items: [
        {
          title: "Table Reservations",
          url: "",
        },
        {
          title: "End of Day",
          url: "#",
          isActive: true,
        },
      ],
    },
    // {
    //   title: "Operations",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Bookings",
    //       url: "#",
    //     },
    //     {
    //       title: "Reports",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Inventory",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Full Menu",
    //       url: "#",
    //     },
    //     {
    //       title: "Stock Levels",
    //       url: "#",
    //     },
    //     {
    //       title: "Reports",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Staff",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Staff Management",
    //       url: "/userManagement",
    //     },
    //     {
    //       title: "Roles &  Permissions",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};


const RestaurantSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
   const pathname = usePathname()
    const [activeItem, setActiveItem] = useState<string | null>(null);
    // Sync active item with current route on page load or navigation
      useEffect(() => {
        setActiveItem(pathname); // Set initial active item based on current route
      }, [pathname]);
    
      // Handle click to set the active item
      const handleItemClick = (url: string) => {
        setActiveItem(url);
      };
      
  return (
    <Sidebar {...props}>
      <SidebarHeader>
       <div className="flex justify-start items-center">
          <Image src="/logo.jpg" alt="logo" width={50} height={50} className="" />
          <span className="ml-2 font-bold text-2xl capitalize">jasglynn</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild 
                       isActive={activeItem === item.url} // Dynamically set isActive
                      onClick={() => handleItemClick(item.url)}
                    >
                      <a href={item.url} className=" font-semibold">{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default RestaurantSidebar;
