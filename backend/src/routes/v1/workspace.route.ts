import express, { Request } from "express";

const router = express.Router();

import { createWorkspace } from "../../controllers/v1/workspace.controller";

router.post("/create", createWorkspace);

export default router;
    