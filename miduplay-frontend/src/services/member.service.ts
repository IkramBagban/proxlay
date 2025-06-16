import axiosClient, { fetchData } from "@/lib/axios-client";

export const fetchMembers = async ({
  workspaceId,
  token,
}: {
  workspaceId: string;
  token: string;
}) => {
  const members = await fetchData(`/workspace/members/${workspaceId}`, token);
  console.log("members", members);
  return members;
};

export const updateMemberRoleService = async ({
  membershipId,
  role,
  token,
  workspaceId,
}: {
  membershipId: string;
  role: string;
  token: string;
  workspaceId: string;
}) => {
  const response = await axiosClient.post(
    `/workspace/assign-role/${workspaceId}`,
    { membershipId, role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
