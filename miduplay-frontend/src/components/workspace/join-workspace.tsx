import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { UserPlus, Building2 } from "lucide-react";
import { useWorkspace } from "@/hooks/tanstack/useWorkspace";

const JoinWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState("");
  const [workspaceInfo, setWorkspaceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();

  const { joinRequestInWorkspace } = useWorkspace({ workspaceId });
  const handleSearch = async () => {
    if (!workspaceId.trim()) {
      toast.error("Please enter a workspace ID");
      return;
    }

    setLoading(true);
    setWorkspaceInfo(null);
    setErrorMessage("");

    try {
      const token = await getToken();
      const { data } = await axiosClient.get(`/workspace/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        setWorkspaceInfo(data);
      } else {
        setErrorMessage("Workspace not found");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Workspace not found");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setJoining(true);
    try {
      await joinRequestInWorkspace.mutateAsync({ workspaceId });
      setWorkspaceInfo(null);
      setWorkspaceId("");
      setOpen(false);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage("You are already a member of this workspace");
        toast.error(error.response.data?.error || "Error sending join request");
        return;
      }
      toast.error("Error sending join request");
    } finally {
      setJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Join Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <DialogTitle>Join Workspace</DialogTitle>
              <DialogDescription>
                Enter a workspace ID to request access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceId">Workspace ID</Label>
            <div className="flex gap-2">
              <Input
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="Enter workspace ID..."
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !workspaceId.trim()}
                variant="outline"
              >
                {loading ? "..." : "Find"}
              </Button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {workspaceInfo && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">
                    {workspaceInfo.name}
                  </h4>
                  {workspaceInfo.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {workspaceInfo.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    {workspaceInfo.id}
                  </p>
                </div>
              </div>
              <Button
                onClick={onSubmit}
                disabled={joining}
                className="w-full mt-3"
              >
                {joining ? "Sending..." : "Send Join Request"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinWorkspace;
