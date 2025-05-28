import { Request, Response } from "express";
// import { prismaClient } from "../../prisma/db"
import { clerkClient, getAuth } from "@clerk/express";
import { prismaClient } from "../../lib/db";
import { Status } from "../../generated/prisma";

export const createWorkspace = async (req: Request, res: Response) => {
  // console.log("req.body", req.body);
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
  // console.log("userId", userId);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const memberships = await prismaClient.workspaceMember.findMany({
      where: {
        userId: userId,
      },
      select: {
        status: true,
        workspace: true,
      },
    });

    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      status: m.status,
    }));

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkspace = async (req: Request, res: Response) => {
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
    const workspace = await prismaClient.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      res.status(404).json({ error: "Workspace not found" });
      return;
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  // const { userId } = getAuth(req);

  // if (!userId) {
  //   res.status(401).json({ error: "Unauthorized" });
  //   return;
  // }

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
    // console.log("users", users?.data);

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

export const requestJoinWorkspace = async (req: Request, res: Response) => {
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
    const existingMembership = await prismaClient.workspaceMember.findFirst({
      where: {
        userId: userId,
        workspaceId: workspaceId,
      },
    });

    if (existingMembership) {
      res.status(400).json({ error: "Already a member of this workspace" });
      return;
    }

    const membership = await prismaClient.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: workspaceId,
        role: "member",
        status: Status.PENDING,
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error("Error joining workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// #TODO: authorize owner to access this endpoint
// owner can accept or reject the request
export const handleJoinWorkspaceRequest = async (
  req: Request,
  res: Response
) => {
  const { workspaceId } = req.params;
  const { membershipId } = req.query as { membershipId: string };
  const { userId } = getAuth(req);
  const { action } = req.body;
  console.log("action", action);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!membershipId) {
    res.status(400).json({ error: "Membership ID is required" });
    return;
  }

  try {
    if (action === "ACCEPT") {
      const membership = await prismaClient.workspaceMember.update({
        where: {
          id: membershipId,
        },
        data: {
          // status: action === "ACCEPT" ? Status.ACTIVE : Status.REJECTED,
          status: Status.ACTIVE,
        },
      });
      res.status(200).json(membership);
      return;
    } else if (action === "REJECT") {
      const membership = await prismaClient.workspaceMember.delete({
        where: {
          id: membershipId,
        },
      });
      res.status(200).json(membership);
      return;
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Error accepting join request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const inviteUserToWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { userId: ownerId } = getAuth(req);
  const { userId } = req.body;

  if (!ownerId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!workspaceId) {
    res.status(400).json({ error: "Workspace ID is required" });
    return;
  }

  if (!userId) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const membership = await prismaClient.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: workspaceId,
        role: "member",
        status: Status.INVITED,
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error("Error inviting user to workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeUserFromWorkspace = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { membershipId } = req.body;
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!membershipId) {
    res.status(400).json({ error: "Membership ID is required" });
    return;
  }

  try {
    const membership = await prismaClient.workspaceMember.delete({
      where: {
        id: membershipId,
      },
    });

    res.status(200).json(membership);
  } catch (error) {
    console.error("Error removing user from workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
