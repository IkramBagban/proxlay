import React from "react";
import { PlusCircle, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { useAuth } from "@clerk/clerk-react";
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
import { isAxiosError } from "axios";

const WorkspacePage = () => {
  const [meta, setMeta] = React.useState<{ name: string }>({ name: "" });
  const [open, setOpen] = React.useState(false);
  const [openInvite, setOpenInvite] = React.useState(false);

  const { getToken } = useAuth();
  const { data: workspaces } = useFetch("/workspace", true);

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
      const token = await getToken();
      await axiosClient.post(
        "/workspace/create",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Workspace created successfully");
    } catch (error) {
      console.error("Workspace creation failed:", error);
      toast.error("Failed to create workspace");
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
    membershipId: string
  ) => {
    const token = await getToken();
    if (!token) {
      toast.error("You are not authorized to do this action");
      return;
    }
    try {
      const response = await axiosClient.post(
        `/handle-invitation-request/${membershipId}`,
        {
          action,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      closeInviteDialog();
      if (response.status === 200) {
        toast.success(`You joined ${response.data.workspace?.name}`);
      }
    } catch (error) {
      console.log("error", error);
      if(isAxiosError(error)) {

        toast.error(
          error.response?.data?.error || "Failed to handle invitation request"
        );
        return;
      }
      toast.error("failed")
    }
  };

  const { data: invites, loading } = useFetch("/invites", true);
  console.log("Invites:", invites);
  return (
    <div className="p-6 space-y-6">
      <Button
        className="cursor-pointer"
        variant="secondary"
        onClick={openInviteDialog}
      >
        Invites
      </Button>
      <Dialog open={openInvite} onOpenChange={closeInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Invites</DialogTitle>
            <DialogDescription>
              Here you can manage your workspace invites.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {loading ? (
              <p>Loading invites...</p>
            ) : invites?.length > 0 ? (
              invites.map((invite) => (
                <div
                  key={invite?.workspace.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex flex-col ">
                    <span>{invite.workspace?.name}</span>
                    <div className="text-[grey]">{invite.workspace.id}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() =>
                        handleWorkspaceInvitationAction("DECLINE", invite.id)
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="default"
                      onClick={() => {
                        handleWorkspaceInvitationAction("ACCEPT", invite.id);
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No invites found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="mt-3">
        <JoinWorkspace />
      </section>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Workspaces</h1>
        <div className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
          <CreateWorkspace
            meta={meta}
            onMetaChange={metaChangeHandler}
            onWorkspaceCreate={workspaceCreateHandler}
            open={open}
            setOpen={setOpen}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(workspaces || [])?.map((ws) => (
          <div key={ws.id}>
            {ws.status === "ACTIVE" ? (
              <NavLink to={`/workspace/${ws.id}`}>
                <Card className="hover:shadow-lg hover:ring-1 hover:ring-primary transition-all cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg font-semibold">
                      {ws.name}
                    </CardTitle>
                    <FolderKanban className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">ID: {ws.id}</p>
                  </CardContent>
                </Card>
              </NavLink>
            ) : (
              <Card className="h-full bg-muted/50 border border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">{ws.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Status: {ws.status}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {ws.id}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default WorkspacePage;
