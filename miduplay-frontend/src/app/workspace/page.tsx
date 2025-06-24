import React, { useEffect } from "react";
import {
  PlusCircle,
  FolderKanban,
  Users,
  Mail,
  Check,
  X,
  Calendar,
  Building2,
  Settings,
  Crown,
  UserPlus,
  Bell,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate, NavLink, useNavigate } from "react-router";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";
import toast from "react-hot-toast";
import { useFetch } from "@/hooks/useFetch";
import JoinWorkspace from "@/components/workspace/join-workspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isAxiosError } from "axios";
import { useWorkspace } from "@/hooks/tanstack/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";


const WorkspacePage = () => {
  const [meta, setMeta] = React.useState<{ name: string }>({ name: "" });
  const [open, setOpen] = React.useState(false);
  const [openInvite, setOpenInvite] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const { getToken, isSignedIn } = useAuth();
  console.log("isSignedIn", isSignedIn);
  const { queryWorkspaces, createWorkspace, handleInvitationRequest } =
    useWorkspace({
      workspaceId: "",
    });
  const { data: workspaces } = queryWorkspaces;


  const metaChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const workspaceCreateHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = meta.name.trim();

    if (!name) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      const response = await createWorkspace.mutateAsync({ name });
      console.log("Workspace created:", response);
    } catch (error) {
      console.error("Workspace creation failed:", error);
      // toast.error("Failed to create workspace");
    }

    setMeta({ name: "" });
    setOpen(false);
  };

  const openInviteDialog = () => {
    setOpenInvite(true);
  };

  const closeInviteDialog = () => {
    setOpenInvite(false);
  };

  const handleWorkspaceInvitationAction = async (
    action: "ACCEPT" | "DECLINE",
    membershipId: string,
    workspaceId: string
  ) => {
    const token = await getToken();
    if (!token) {
      toast.error("You are not authorized to do this action");
      return;
    }
    try {
      await handleInvitationRequest.mutateAsync(
        {
          action,
          membershipId,
          workspaceId,
        },
        {
          onSuccess: (response) => {
            console.log("Invitation handled successfully:", response);
            toast.success(
              `You ${action === "ACCEPT" ? "joined" : "declined"} the workspace`
            );
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
          },
        }
      );
      closeInviteDialog();
    } catch (error) {
      console.log("error", error);
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "Failed to handle invitation request"
        );
        return;
      }
      toast.error("failed");
    }
  };

  const { data: invites, loading } = useFetch("/invites", true);

  const filteredWorkspaces = (workspaces || []).filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWorkspaces = filteredWorkspaces.filter(
    (ws: { status: string }) => ws.status === "ACTIVE"
  );
  const pendingWorkspaces = filteredWorkspaces.filter(
    (ws: { status: string }) => ws.status !== "ACTIVE"
  );

  console.log('invites', invites)
  return (
    <div className=" h-[100%] bg-gray-50 ">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Workspaces
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your collaborative spaces
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <Button
                onClick={openInviteDialog}
                variant="outline"
                className="relative flex-shrink-0"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Invites</span>
                <span className="xs:hidden">Invite</span>
                {invites && invites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {invites.length}
                  </Badge>
                )}
              </Button>

              <div className="flex-shrink-0">
                <CreateWorkspace
                  meta={meta}
                  onMetaChange={metaChangeHandler}
                  onWorkspaceCreate={workspaceCreateHandler}
                  open={open}
                  setOpen={setOpen}
                />
              </div>

              <div className="flex-shrink-0 ml-2">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <JoinWorkspace />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Workspaces Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Active ({activeWorkspaces.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingWorkspaces.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeWorkspaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No active workspaces
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first workspace to get started
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {activeWorkspaces.map((ws: { id: string; name: string }) => (
                  <NavLink key={ws.id} to={`/workspace/${ws.id}`}>
                    {viewMode === "grid" ? (
                      <Card className="group cursor-pointer border-0">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3">
                              <FolderKanban className="w-6 h-6 text-white" />
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 border-green-200"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {ws.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>Team workspace</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>Created recently</span>
                            </div> */}
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-mono">
                                  {ws.id}
                                  {/* ID: {ws.id.slice(0, 8)}... */}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="hover:shadow-md transition-all cursor-pointer my-2">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {ws.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">
                                ID: {ws.id}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs hidden sm:inline-flex"
                              >
                                Active
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs sm:hidden px-1"
                              >
                                ✓
                              </Badge>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {pendingWorkspaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No pending workspaces
                </h3>
                <p className="text-gray-600">
                  All your workspaces are active and ready to use
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingWorkspaces.map((ws) => (
                  <Card key={ws.id} className="bg-amber-50/50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {ws.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Status: {ws.status}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {ws.id}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700"
                        >
                          {ws.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Invites Dialog */}
      <Dialog open={openInvite} onOpenChange={closeInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <DialogTitle className="text-xl">
                Workspace Invitations
              </DialogTitle>
            </div>
            <DialogDescription>
              Review and manage your pending workspace invitations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  Loading invitations...
                </div>
              </div>
            ) : invites?.length > 0 ? (
              invites?.map((invite) => (
                <Card
                  key={invite?.workspace.id}
                  className="border border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {invite.workspace?.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          You've been invited to join this workspace
                        </p>
                        <div className="text-xs text-gray-400 font-mono mb-4">
                          ID: {invite.workspace.id}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleWorkspaceInvitationAction(
                                "DECLINE",
                                invite.id,
                                invite.workspace.id
                              )
                            }
                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              handleWorkspaceInvitationAction(
                                "ACCEPT",
                                invite.id,
                                invite.workspace.id
                              );
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  No invitations
                </h4>
                <p className="text-sm text-gray-500">
                  You don't have any pending workspace invitations.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspacePage;
