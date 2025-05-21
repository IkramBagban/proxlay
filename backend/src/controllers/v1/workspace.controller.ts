import { Request, Response } from "express";
// import { prismaClient } from "../../prisma/db"
import { clerkClient, getAuth } from "@clerk/express";
import { prismaClient } from "../../lib/db";
import { Status } from "../../generated/prisma";

export const createWorkspace = async (req: Request, res: Response) => {
  console.log("req.body", req.body);
  const { name } = req.body;
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const workspace = await prismaClient.$transaction(async (prisma) => {
      const existingWorkspace = await prisma.workspace.findFirst({
        where: {
          name,
          owner_id: userId,
        },
      });

      if (existingWorkspace) {
        res.status(400).json({ error: "Workspace already exists" });
        return;
      }
  
    const workspace = await prismaClient.workspace.create({
      data: {
        name,
        owner_id: userId,
      },
    });
    const workspaceMember = await prismaClient.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: workspace.id,
        role: "owner",
        status: Status.ACTIVE,
      },
    });  
      });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  console.log("userId", userId);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const workspaces = await prismaClient.workspace.findMany({
      where: {
        owner_id: userId,
      },
    });

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!workspaceId) {
    res.status(400).json({ error: "Workspace ID is required" });
    return;
  }

  try {
    const members = await prismaClient.workspaceMember.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });

    const userIds = members.map((m) => m.userId);

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });
    console.log("users", users?.data);

    const userMap = new Map(
      // @ts-ignore
      (users?.data || [])?.map((user) => [
        user.id,
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses?.[0]?.emailAddress,
          imageUrl: user.imageUrl,
        },
      ])
    );

    const enrichedMembers = members.map((member) => ({
      ...member,
      user: userMap.get(member.userId),
    }));

    res.status(200).json(enrichedMembers);
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
