import { Calendar, FolderKanban, Home, Inbox, PersonStanding, PersonStandingIcon, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Outlet, useParams } from "react-router";
// Menu items.
function AppSidebar({ workspaceId }: { workspaceId: string }) {
  const items = [
    {
      title: "Dashboard",
      url: `/workspace/${workspaceId}/dashboard`,
      icon: Home,
    },
    {
      title: "Members",
      url: `/workspace/${workspaceId}/members`,
      icon: PersonStanding,
    },
    {
      title: "Calendar",
      url: `/workspace/${workspaceId}/calendar`,
      icon: Calendar,
    },
    {
      title: "Inbox",
      url: `/workspace/${workspaceId}/inbox`,
      icon: Inbox,
    },
    {
      title: "Settings",
      url: `/workspace/${workspaceId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

// export default AppSidebar;


const SidebarWrapper = () => {
  const { workspaceId } = useParams();
  return (
    <SidebarProvider className="flex h-screen">
      <AppSidebar workspaceId={workspaceId!} />
      <SidebarTrigger />    
        <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
      {/* <main className="flex-1 p-6 bg-gray-100">{children}</main> */}
    </SidebarProvider>
  );
};

export default SidebarWrapper;