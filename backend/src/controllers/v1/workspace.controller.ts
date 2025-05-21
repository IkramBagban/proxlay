import { Request, Response } from "express";
// import { prismaClient } from "../../prisma/db"
import { getAuth } from "@clerk/express";
import { prismaClient } from "../../lib/db";

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
    const workspace = await prismaClient.workspace.create({
      data: {
        name,
        owner_id: userId,
      },
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

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