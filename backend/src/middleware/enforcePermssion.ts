import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/db";
import { rbac } from "../lib/rbac/rbac";
import { getAuth } from "@clerk/express";
import { Permissions, Roles } from "../lib/rbac/permissions";

export const enforcePermission = (requiredPermission: Permissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);

      const membershipId =
        req.body?.membershipId ||
        req.query?.membershipId ||
        req.params?.membershipId;

      let role: string | null = null;

      if (membershipId) {
        const member = await prismaClient.workspaceMember.findUnique({
          where: { id: membershipId },
          select: { role: true },
        });

        if (!member) {
          res.status(404).json({ error: "Membership not found." });
          return;
        }

        role = member.role;
      } else {
        // fllback to workspaceId + userId
        const workspaceId = req.params.workspaceId;

        if (!workspaceId || !userId) {
          res.status(400).json({ error: "Missing workspace or user ID." });
          return;
        }

        const member = await prismaClient.workspaceMember.findFirst({
          where: {
            workspaceId,
            userId,
          },
          select: { role: true },
        });

        if (!member) {
          res.status(404).json({ error: "Workspace membership not found." });
          return;
        }

        role = member.role;
      }

      console.log(`Role detected: ${role}`);
      console.log(`Required permission: ${requiredPermission}`);

      if (!rbac.hasPermission(role as Roles, requiredPermission)) {
        res.status(403).json({
          error: "Forbidden: You do not have the required permissions.",
        });
        return;
      }

      next();
    } catch (err) {
      console.error("RBAC Middleware Error:", err);
      res.status(500).json({ error: "Internal server error." });
      return;
    }
  };
};
