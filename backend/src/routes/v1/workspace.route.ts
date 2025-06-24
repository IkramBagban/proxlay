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
  assignRoleToUser,
} from "../../controllers/v1/workspace.controller";
import { checkOwner } from "../../middleware/check-owner";
import { getAuth } from "@clerk/express";
import { getWorkspaceMemberInfo } from "../../lib/get-workspace-member-info";
import { enforcePlanLimit } from "../../middleware/enforePlanLimit";
import { FeatureUsagePermissions } from "../../lib/plans";

router.post(
  "/create",
  enforcePlanLimit(FeatureUsagePermissions.CAN_CREATE_WORKSPACE),
  createWorkspace
);
router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspace);
router.get("/members/:workspaceId", getWorkspaceMembers);
router.post(
  "/request-join/:workspaceId",
  enforcePlanLimit(
    FeatureUsagePermissions.CAN_ADD_USER,
    "The workspace is already full  ."
  ),
  requestJoinWorkspace
);

router.get("/check-role/:workspaceId", async (req: Request, res) => {
  console.log("check-role route called");
  const { userId } = getAuth(req);
  const { workspaceId } = req.params;
  const { isOwner, isPartOfWorkspace } = await getWorkspaceMemberInfo(
    workspaceId,
    userId!
  );
  res.status(200).json({
    message: "Role check successful",
    isOwner,
    isPartOfWorkspace,
  });
});

// owner only routes
// in this route i have to pass membershipId as a query parameter
router.post(
  "/handle-join-request/:workspaceId",
  checkOwner,
  (req, res, next) => {
    if (req.body?.action === "ACCEPT") {
      enforcePlanLimit(FeatureUsagePermissions.CAN_ADD_USER)(req, res, next);
    } else next();
  },
  handleJoinWorkspaceRequest
);
router.post(
  "/invite/:workspaceId",
  checkOwner,
  (req, res, next) => {
    enforcePlanLimit(
      FeatureUsagePermissions.CAN_ADD_USER,
      "The workspace is already full. Cannot invite more members."
    )(req, res, next);
  },
  inviteUserToWorkspace
);
router.post("/remove-user/:workspaceId", checkOwner, removeUserFromWorkspace);

router.post("/assign-role/:workspaceId", checkOwner, assignRoleToUser);

export default router;
