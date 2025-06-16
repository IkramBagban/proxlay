import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import {
  fetchMembers,
  updateMemberRoleService,
} from "@/services/member.service";

export const useMember = ({ workspaceId }: { workspaceId: string }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const queryWorkspaceMembers = useQuery({
    queryKey: ["members"],
    queryFn: async () =>
      await fetchMembers({ workspaceId, token: (await getToken()) as string }),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const updateMemberRole = useMutation({
    mutationKey: ["members", "updateRole"],
    mutationFn: async ({
      membershipId,
      role,
    }: {
      membershipId: string;
      role: string;
    }) => {
      const token: string = (await getToken()) as string;
      // Call your API to update the member's role
      return await updateMemberRoleService({
        membershipId,
        role,
        token,
        workspaceId,
      });
    },
    onSuccess: () => {
      toast.success("Member role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(`Failed to update member role: ${error.message}`);
    },
  });
  return { queryWorkspaceMembers, updateMemberRole };
};
