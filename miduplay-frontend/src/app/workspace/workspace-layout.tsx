// components/workspace/workspace-layout.tsx
import React, { useEffect } from "react";
import { Outlet, useParams, NavLink, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  Video,
  Settings,
  Youtube,
  Upload,
  BarChart3,
  ChevronLeft,
} from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Fetch workspace details
  const { data: workspace } = useFetch(`/workspace/${workspaceId}`, true);

    useEffect(() => {
      if (isSignedIn === false) {
        toast.error("You are not signed in, please sign in");
        navigate("/");
      }
    }, [isSignedIn, navigate]);

  const sidebarItems = [
    {
      title: "Dashboard",
      href: `/workspace/${workspaceId}`,
      icon: Home,
      exact: true,
    },
    {
      title: "Members",
      href: `/workspace/${workspaceId}/members`,
      icon: Users,
    },
    {
      title: "Videos",
      href: `/workspace/${workspaceId}/videos`,
      icon: Video,
    },
    // {
    //   title: "Platforms",
    //   href: `/workspace/${workspaceId}/platforms`,
    //   icon: Settings,
    //   children: [
    //     {
    //       title: "YouTube Upload",
    //       href: `/workspace/${workspaceId}/youtube/upload`,
    //       icon: Upload,
    //     },
    //   ],
    // },
    // {
    //   title: "Analytics",
    //   href: `/workspace/${workspaceId}/analytics`,
    //   icon: BarChart3,
    // },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {workspace?.name || "Workspace"}
                </h2>
                <p className="text-xs text-gray-500 font-mono">
                  {workspaceId}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  !sidebarOpen && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="truncate">{item.title}</span>
                  )}
                </NavLink>

                {/* Sub-items */}
                {item.children && sidebarOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                          isActive(child.href)
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <child.icon className="h-3 w-3 mr-3 flex-shrink-0" />
                        <span className="truncate">{child.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Back to Workspaces */}
        <div className="p-3 border-t border-gray-200">
          <NavLink
            to="/workspace"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-3 flex-shrink-0" />
            {sidebarOpen && <span>All Workspaces</span>}
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {workspace?.name || "Workspace"}
              </h1>
              <p className="text-sm text-gray-500">
                Manage your workspace content and settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {workspaceId}
              </Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkspaceLayout;