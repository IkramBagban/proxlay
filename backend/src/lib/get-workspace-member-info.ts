import { prismaClient } from "./db";

export const getWorkspaceMemberInfo = async (
  workspaceId: string,
  userId: string
): Promise<{ response: any; isPartOfWorkspace: boolean; isOwner: boolean }> => {
  const response = await prismaClient.workspaceMember.findFirst({
    where: {
      workspaceId: workspaceId,
      userId: userId,
    },
  });

  return {
    response: response || null,
    isPartOfWorkspace: response?.status === "ACTIVE" ? true : false,
    isOwner: response?.role === "owner" ? true : false,
  };
};
