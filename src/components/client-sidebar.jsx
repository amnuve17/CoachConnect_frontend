import * as React from "react"
import { ChevronRight } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Workouts",
      url: "/dashboard/client/workouts",
    },
    {
      title: "Profile",
      url: "/dashboard/client/client-profile"
    },
    {
      title: "Comunicazioni",
      items: [
        {
          title: "Messaggi",
          url: "#",
        },
        {
          title: "Notifiche",
          url: "#",
        },
      ],
    },
  ],
}

export function ClientSideBar({ ...props }) {
  const navigate = useNavigate();

  // Funzione logout
  function handleLogout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-4">
          <img className="size-20" src="/coachconnect_logo.webp" />
          CoachConnect
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
            {item.items ? (
                <Collapsible title={item.title} defaultOpen className="group/collapsible">
                    <SidebarGroupLabel
                        asChild
                        className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                    <CollapsibleTrigger>
                        {item.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item.items.map((subItem) => (
                                <SidebarMenuItem key={subItem.title}>
                                    <SidebarMenuButton asChild isActive={subItem.isActive}>
                                        <a href={subItem.url}>{subItem.title}</a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
                </Collapsible>
            ) : (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                            <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
            </SidebarGroup>
        ))}
        </SidebarContent>
      <SidebarRail />
      <div className="p-2 w-full">
        <Button
          className="w-full"
          variant="destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </Sidebar>
  );
}