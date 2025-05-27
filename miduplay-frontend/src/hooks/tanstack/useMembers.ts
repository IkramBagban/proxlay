import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { fetchMembers } from "@/services/member.service";

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

  return { queryWorkspaceMembers };
};
