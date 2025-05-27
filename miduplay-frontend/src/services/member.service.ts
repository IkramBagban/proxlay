import axiosClient, { fetchData } from "@/lib/axios-client";

export const fetchMembers = async ({
  workspaceId,
  token
}: {
  workspaceId: string;
  token: string;
}) => {
   const members = await fetchData(`/workspace/members/${workspaceId}`, token);
  console.log('members', members);
  return members;
};

