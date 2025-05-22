import React, { useEffect } from "react";
import { PlusCircle, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { useAuth } from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";
import toast from "react-hot-toast";
import { useFetch } from "@/hooks/useFetch";

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

    const newWorkspace = {
      name: meta.name.trim(),
    };

    if (!newWorkspace.name) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      const token = await getToken();

      const response = await axiosClient.post(
        "/workspace/create",
        newWorkspace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Workspace created successfully");
      // setWorkspaces((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Workspace creation failed:", error);
      toast.error("Failed to create workspace");
    }

    setMeta({ name: "" });
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workspaces</h1>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(workspaces || []).map((ws) => (
          <NavLink key={ws.id} to={`/workspace/${ws.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{ws.name}</CardTitle>
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">ID: {ws.id}</p>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
