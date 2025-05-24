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

const WorkspacePage = () => {
  const [meta, setMeta] = React.useState<{ name: string }>({ name: "" });
  const [open, setOpen] = React.useState(false);

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

  return (
    <div className="p-6 space-y-6">
      <section className=" ">
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
        {(workspaces || []).map((ws) => (
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
