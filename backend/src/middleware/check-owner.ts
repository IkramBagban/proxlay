import { getAuth } from "@clerk/express";
import { prismaClient } from "../lib/db";
import { getWorkspaceMemberInfo } from "../lib/get-workspace-member-info";

export const checkOwner = async (req: any, res: any, next: any) => {
  const workspaceId = req.params.workspaceId;
  const { userId } = getAuth(req);

  try {
    if (!workspaceId || !userId) {
      return res
        .status(400)
        .json({ error: "Invalid request parameters", isOwner: false });
    }

    const { isOwner } = await getWorkspaceMemberInfo(workspaceId, userId!);

    if (!isOwner) {
      return res.status(403).json({
        error: "Forbidden: You are not the owner of this workspace",
        isOwner,
      });
    }
    next();
  } catch (error) {
    console.error("Error in checkOwner middleware:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", isOwner: false });
  }
};

export const shouldPartOfWorkspace = async (req: any, res: any, next: any) => {
  const workspaceId = req.params.workspaceId;
  const { userId } = getAuth(req);
  const { isPartOfWorkspace } = await getWorkspaceMemberInfo(
    workspaceId,
    userId!
  );
  if (!isPartOfWorkspace) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not a member of this workspace" });
  }

  next();
};
