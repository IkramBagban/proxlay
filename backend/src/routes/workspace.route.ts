import express, { Request } from "express";

const router = express.Router();

import { createWorkspace } from "../controllers/workspace.controller";

router.post("/create", createWorkspace);

export default router;
    