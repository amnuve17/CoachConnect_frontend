import * as React from "react"
import { ChevronRight } from "lucide-react"
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
      title: "Clienti",
      items: [
        {
          title: "Crea Cliente",
          url: "/dashboard/trainer/crea-cliente",
        },
        {
          title: "Gestisci Clienti",
          url: "/dashboard/trainer/gestisci-clienti",
        },
      ],
    },
    {
      title: "Schede",
      items: [
        {
          title: "Crea Scheda",
          url: "/dashboard/trainer/crea-scheda",
        },
        {
          title: "Gestisci Schede",
          url: "/dashboard/trainer/gestisci-schede",
        },
      ],
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

export function AppSidebar({ ...props }) {
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
          <img className="size-20" src="/coachconnect_logo.webp" alt="" />
          CoachConnect
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
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
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
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