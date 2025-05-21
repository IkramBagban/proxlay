import express, { Request } from "express";

const router = express.Router();

import { createWorkspace, getWorkspaces, getWorkspaceMembers } from "../../controllers/v1/workspace.controller";
import { requireAuth } from "@clerk/express";

router.post("/create", createWorkspace);
router.get("/", getWorkspaces);

router.get("/members/:workspaceId", getWorkspaceMembers);

export default router;
    