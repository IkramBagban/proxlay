import axiosClient from "@/lib/axios-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import {
  createWorkspaceAPI,
  fetchWorkspaces,
  handleInvitationRequestAPI,
  handleInvite,
  handleJoinRequestAPI,
  joinRequestInWorkspaceAPI,
  removeUserFromWorkspaceAPI,
  type HandleInvitationPayload,
  type HandleInvitePayload,
  type JoinRequestParams,
  type removeUserFromWorkspacePayload,
} from "@/services/workspace.service";
import { isAxiosError } from "axios";

export const useWorkspace = ({ workspaceId }: { workspaceId?: string }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const queryWorkspaces = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchWorkspaces((await getToken()) as string),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const createWorkspace = useMutation({
    mutationFn: async (payload: { name: string }) =>
      createWorkspaceAPI(payload, (await getToken()) as string),

    onSuccess: (data) => {
      console.log("on workspace create success:", data);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace created successfully!");
    },
    onError: (error: string) => {
      console.error("on workspace create error:", error);
      if (isAxiosError(error)) {
        toast.error(
          error?.response?.data?.error || "Failed to create workspace."
        );
      } else {
        toast.error("Failed to create workspace.");
      }
    },
  });

  const joinRequestInWorkspace = useMutation({
    mutationFn: async (payload: { workspaceId: string }) => {
      return await joinRequestInWorkspaceAPI({
        workspaceId: payload.workspaceId,
        token: (await getToken()) as string,
      });
    },
    onSuccess: (data) => {
      console.log("Join request successful:", data);
      toast.success("Join request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },

    onError: (error: string) => {
      console.error("Join request failed:", error);
    },
  });

  const handleJoinRequest = useMutation({
    mutationFn: async (payload: JoinRequestParams) =>
      await handleJoinRequestAPI(payload, (await getToken()) as string),
    onSuccess: (data) => {
      console.log("Join request successful:", data);
      toast.success("Join request handled successfully!");

      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
    onError: (error: string) => {
      console.error("Join request failed:", error);
    },
  });

  const inviteUserToWorkspace = useMutation({
    mutationFn: async (payload: HandleInvitePayload) =>
      handleInvite(payload, (await getToken()) as string)
  });

  const handleInvitationRequest = useMutation({
    mutationFn: async (payload: HandleInvitationPayload) =>
      await handleInvitationRequestAPI(payload, (await getToken()) as string)
  });

  const removeUserFromWorkspace = useMutation({
    mutationFn: async (payload: removeUserFromWorkspacePayload) =>
      removeUserFromWorkspaceAPI(payload, (await getToken()) as string),
    onError: (error: string) => {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.error || "Failed to remove user");
      }
    },
  });

  return {
    queryWorkspaces,
    createWorkspace,
    joinRequestInWorkspace,
    handleJoinRequest,
    inviteUserToWorkspace,
    handleInvitationRequest,
    removeUserFromWorkspace,
  };
};
