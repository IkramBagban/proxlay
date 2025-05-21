import express, { Request } from "express";

const router = express.Router();

import { createWorkspace, getWorkspaces } from "../../controllers/v1/workspace.controller";

router.post("/create", createWorkspace);
router.get("/", getWorkspaces);

export default router;
    