import { getAuth } from "@clerk/express";
import { prismaClient } from "../lib/db";
import Plan, { FeatureUsagePermissions, IPlans, limits } from "../lib/plans";

interface CurrentUsageStatsReturnType {
  totalVideoUploads: number;
  totalWorkspaces: number;
  totalStorageUsed: number;
  subscriptionId: string | null;
  planType: IPlans | null;
}
const getCurrentUsageStats = async (
  workspaceId: string
): Promise<CurrentUsageStatsReturnType> => {
  try {
    const { owner_id } = (await prismaClient.workspace.findUnique({
      where: { id: workspaceId },
      select: { owner_id: true },
    })) as { owner_id: string | null };

    if (!owner_id) {
      throw new Error("Workspace not found");
    }

    const response = (await prismaClient.planUsage.findFirst({
      where: {
        ownerId: owner_id as string,
        status: "ACTIVE",
      },
      select: {
        totalVideoUploads: true,
        totalWorkspaces: true,
        totalStorageUsed: true,
        planType: true,
      },
    })) as CurrentUsageStatsReturnType;

    return (
      response || {
        totalVideoUploads: 0,
        totalWorkspaces: 0,
        totalStorageUsed: 0,
        subscriptionId: null,
        planType: null,
      }
    );
  } catch (error) {
    console.error("Error fetching current usage stats:", error);
    throw new Error("Failed to fetch current usage stats");
  }
};

export const enforcePlanLimit = (
  featurePermission: FeatureUsagePermissions
) => {
  return async (req: any, res: any, next: any) => {
    console.log("Enforcing plan limit for feature:", featurePermission);

    try {
      const { userId } = getAuth(req);
      const plan = new Plan();

      if (featurePermission === FeatureUsagePermissions.CAN_CREATE_WORKSPACE) {
        const response = (await prismaClient.planUsage.findFirst({
          where: {
            ownerId: userId as string,
            status: "ACTIVE",
          },
          select: {
            totalVideoUploads: true,
            totalWorkspaces: true,
            totalStorageUsed: true,
            planType: true,
          },
        })) as CurrentUsageStatsReturnType;

        if (!response) {
          res.status(403).json({
            error: "No active plan found for the user.",
          });
          return;
        }
        console.log("Plan response:", response);

        const canCreate = plan.canCreateWorkspace(
          response?.planType!,
          response?.totalWorkspaces!
        );
        if (!canCreate) {
          res.status(403).json({
            error:
              "Limit reached: You cannot create more workspaces with your current plan.",
          });
          return;
        }
        next();
        return;
      }
      const workspaceId = req.params.workspaceId || req.body.workspaceId;

      if (!workspaceId) {
        res.status(400).json({ error: "Workspace ID is required." });
        return;
      }

      const currentUsage = await getCurrentUsageStats(workspaceId);

      const {
        totalStorageUsed,
        totalVideoUploads,
        totalWorkspaces,
        subscriptionId,
        planType,
      } = currentUsage;

      if (!planType) {
        res.status(400).json({ error: "Plan type not found." });
        return;
      }

      switch (featurePermission) {
        case FeatureUsagePermissions.CAN_UPLOAD_VIDEO:
          const canUpload = plan.canUploadVideo(
            planType,
            totalVideoUploads,
            totalStorageUsed
          );
          if (!canUpload) {
            res.status(403).json({
              error:
                "Limit reached: You cannot upload more videos with your current plan.",
            });
            return;
          }

          break;
        case FeatureUsagePermissions.CAN_ADD_USER:
          const totalWorkspaceUserCount =
            await prismaClient.workspaceMember.count({
              where: {
                workspaceId: workspaceId,
                status: "ACTIVE",
              },
            });

          const canAddUser = plan.canAddUserToWorkspace(
            planType,
            totalWorkspaceUserCount
          );
          if (!canAddUser) {
            res.status(403).json({
              error:
                "Limit reached: You cannot add more users with your current plan.",
            });
            return;
          }
          break;
        default:
          res.status(400).json({ error: "Invalid feature permission." });
          return;
      }

      next();
    } catch (error) {
      console.error("Error enforcing plan limits:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
