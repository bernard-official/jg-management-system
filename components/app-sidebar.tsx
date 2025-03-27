import React from "react";
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
import { VersionSwitcher } from "./version-switcher";

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
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
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
        },
        {
          title: "Shops",
          url: "#",
          isActive: true,
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
        },
        {
          title: "Reports",
          url: "#",
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
        },
        {
          title: "Stock Levels",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
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
        },
        {
          title: "Roles &  Permissions",
          url: "#",
        },
      ],
    },
  ],
};


const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span className="font-bold capitalize">jasglynn</span>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]}  />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
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
