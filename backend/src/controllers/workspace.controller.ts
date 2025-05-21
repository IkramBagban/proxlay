import { Request, Response } from "express";
// import { prismaClient } from "../../prisma/db"
import { getAuth } from "@clerk/express";
import { prismaClient } from "../lib/db";

export const createWorkspace = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const auth = getAuth(req);
  const userId = auth.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!name || !description) {
    res.status(400).json({ error: "Name and description are required" });
    return;
  }

  try {
    const workspace = await prismaClient.workspace.create({
      data: {
        name,
        owner: userId,
        email: "krishjain1712@gmail.com",
      },
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
