import express, { Request } from "express";

const router = express.Router();

import { createWorkspace, getWorkspaces, getWorkspaceMembers, requestJoinWorkspace, handleJoinWorkspaceRequest, inviteUserToWorkspace, handleWorkspaceInvitationRequest, removeUserFromWorkspace, getWorkspace } from "../../controllers/v1/workspace.controller";

router.post("/create", createWorkspace);
router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);

router.get("/members/:workspaceId", getWorkspaceMembers);

router.post("/request-join/:workspaceId", requestJoinWorkspace);

router.post("/handle-join-request/:membershipId", handleJoinWorkspaceRequest);

router.post("/invite/:workspaceId", inviteUserToWorkspace);

// user will accept or decline the invitation
router.post("/handle-invitation-request/:workspaceId", handleWorkspaceInvitationRequest);

router.post("/remove-user/:workspaceId", removeUserFromWorkspace);
export default router;
