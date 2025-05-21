import React from "react";
import { PlusCircle, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { useAuth } from "@clerk/clerk-react";
import axiosClient from "@/lib/axios-client";
import toast from "react-hot-toast";

interface Workspace {
  id: string;
  name: string;
  email: string;
  owner_id: string;
}

const initialWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Ikram’s YouTube",
    email: "ikram@gmail.com",
    owner_id: "1",
  },
  {
    id: "2",
    name: "Amuzic Workspace",
    email: "amuzic@gmail.com",
    owner_id: "2",
  },
];

const WorkspacePage = () => {
  const [meta, setMeta] = React.useState<{ name: string }>({ name: "" });
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initialWorkspaces);
  const [open, setOpen] = React.useState(false);

  const { getToken } = useAuth();

  const metaChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const workspaceCreateHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const newWorkspace: Workspace = {
      id: (workspaces.length + 1).toString(),
      name: meta.name.trim(),
      email: "", // Add email if needed
      owner_id: Math.random().toString(36).substring(2, 15),
    };

    if (!newWorkspace.name) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      const token = await getToken();

      const response = await axiosClient.post("/workspace/create", newWorkspace, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Workspace created successfully");
      setWorkspaces((prev) => [...prev, response.data]);
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
        {workspaces.map((ws) => (
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
