'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
// import { useRouter } from "next/router";
// import { useRouter } from "next/router";
// import { VersionSwitcher } from "./version-switcher";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Analytics",
          url: "/dashboard",
           isActive: false,
        },
      ],
    },
    {
      title: "Finance",
      url: "#",
      items: [
        {
          title: "Financial History",
          url: "/finance",
          isActive: false
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: false,
        },
      ],
    },
    {
      title: "Assets",
      url: "#",
      items: [
        {
          title: "Venue",
          url: "",
           isActive: false,
        },
        {
          title: "Shops",
          url: "#",
          isActive: false,
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      items: [
        {
          title: "Bookings",
          url: "#",
          isActive: false,
        },
        {
          title: "Reports",
          url: "#",
          isActive: false
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      items: [
        {
          title: "Full Menu",
          url: "#",
          isActive: false,
        },
        {
          title: "Stock Levels",
          url: "#",
          isActive: false,
        },
        {
          title: "Reports",
          url: "#",
          isActive: false,
        },
      ],
    },
    {
      title: "Staff",
      url: "#",
      items: [
        {
          title: "Staff Management",
          url: "/userManagement",
          isActive: false,
        },
        {
          title: "Roles &  Permissions",
          url: "#",
          isActive: false,
        },
      ],
    },
  ],
};


const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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
        {/* <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]}  /> */}
      </SidebarHeader>
      <SidebarContent className="">
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                    asChild 
                    // isActive={item.isActive}
                    isActive={activeItem === item.url} // Dynamically set isActive
                      onClick={() => handleItemClick(item.url)}
                    >
                      <a href={item.url}>{item.title}</a>
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

export default AppSidebar;
