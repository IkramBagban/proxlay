import express, { Request } from "express";

const router = express.Router();

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceMembers,
  requestJoinWorkspace,
  handleJoinWorkspaceRequest,
  inviteUserToWorkspace,
  removeUserFromWorkspace,
  getWorkspace,
} from "../../controllers/v1/workspace.controller";
import { checkOwner } from "../../middleware/check-owner";

router.post("/create", createWorkspace);
router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);
router.get("/members/:workspaceId", getWorkspaceMembers);
router.post("/request-join/:workspaceId", requestJoinWorkspace);

// owner only routes
router.post("/handle-join-request/:membershipId", checkOwner, handleJoinWorkspaceRequest);
router.post("/invite/:workspaceId", checkOwner, inviteUserToWorkspace);
router.post("/remove-user/:workspaceId", checkOwner, removeUserFromWorkspace);

export default router;
