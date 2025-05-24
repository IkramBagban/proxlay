import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axios-client";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const JoinWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState("");
  const [workspaceInfo, setWorkspaceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { getToken } = useAuth();

  const handleSearch = async () => {
    if (!workspaceId) return toast.error("Please enter a workspace CUID");
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
        setErrorMessage("Workspace not found.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Workspace not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      const token = await getToken();
      await axiosClient.post(
        `/workspace/request-join/${workspaceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Join request sent!");
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage("You are already a member of this workspace.");
        toast.error(error.response.data?.error || "Error sending join request.");
        return;
      } 
        toast.error("Error sending join request.");
      
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-sm bg-white">
      <h3 className="text-xl font-semibold">Join Workspace</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Enter Workspace ID"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Find"}
        </Button>
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      {workspaceInfo && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h4 className="text-lg font-semibold">{workspaceInfo.name}</h4>
          <p className="text-sm text-muted-foreground">{workspaceInfo.description}</p>
          <Button onClick={handleJoinRequest} className="mt-3">
            Send Join Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default JoinWorkspace;
