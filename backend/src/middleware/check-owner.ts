import { getAuth } from "@clerk/express";
import { prismaClient } from "../lib/db";

const checkIfUserIsOwner = async (
  workspaceId: string,
  userId: string
): Promise<boolean> => {
  const response = await prismaClient.workspace.findFirst({
    where: {
      id: workspaceId,
      owner_id: userId,
    },
  });

  console.log("response", response);

  return response ? true : false;
};
export const checkOwner = async (req: any, res: any, next: any) => {
  console.log("checkOwner middleware called");
  const workspaceId = req.params.workspaceId;
  const { userId } = getAuth(req);

  if (!workspaceId || !userId) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  const isOwner = await checkIfUserIsOwner(workspaceId, userId);
  console.log("isOwner", isOwner);

  if (!isOwner) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not the owner of this workspace" });
  }

  next();
};
