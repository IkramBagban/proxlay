import { planUsageStatus } from "../../generated/prisma";
import { prismaClient } from "../db";

export enum IPlans {
  BASIC = "BASIC",
  PRO = "PRO",
}

export const limits: Record<
  IPlans,
  {
    maxWorkspace: number;
    maxUserPerWorkspace: number;
    maxVideoUploads: number;
    maxStorage: number;
  }
> = {
  [IPlans.BASIC]: {
    maxWorkspace: 1,
    maxUserPerWorkspace: 5,
    maxVideoUploads: 20,
    maxStorage: 50, //GB
  },
  [IPlans.PRO]: {
    maxWorkspace: 3,
    maxUserPerWorkspace: 10,
    maxVideoUploads: 75,
    maxStorage: 250, //GB
  },
};

const Plans: Record<
  IPlans,
  {
    name: string;
    price: number;
    limit: (typeof limits)[IPlans];
  }
> = {
  [IPlans.BASIC]: {
    name: "Basic",
    limit: limits[IPlans.BASIC],
    price: 5,
  },
  [IPlans.PRO]: {
    name: "Pro",
    limit: limits[IPlans.PRO],
    price: 10,
  },
};

export enum FeatureUsagePermissions {
  CAN_CREATE_WORKSPACE = "can_create_workspace",
  CAN_UPLOAD_VIDEO = "can_upload_video",
  CAN_ADD_USER = "can_add_user",
}

export class Plan {
  canCreateWorkspace(planType: IPlans, currentWorkspaceCount: number): boolean {
    console.log({
      planType,
      currentWorkspaceCount,
      canCreate: currentWorkspaceCount < Plans[planType].limit.maxWorkspace,
    });
    return currentWorkspaceCount < Plans[planType].limit.maxWorkspace;
  }

  canUploadVideo(
    planType: IPlans,
    currentVideoUploads: number,
    currentStorageUsed: number
  ): boolean {
    const { maxVideoUploads, maxStorage } = Plans[planType].limit;
    return (
      currentVideoUploads < maxVideoUploads && currentStorageUsed < maxStorage
    );
  }

  canAddUserToWorkspace(
    planType: IPlans,
    currentWorkspaceUserCount: number
  ): boolean {
    return (
      currentWorkspaceUserCount < Plans[planType].limit.maxUserPerWorkspace
    );
  }

  async updateWorkspaceCount(ownerId: string) {
    try {
      const response = await prismaClient.planUsage.updateMany({
        // this should be only 'update' but since there is no unique constraint in schema i am using updateMany hear. there can be many ownerId with same status that's why we can't use 'update' here. we have to use updateMany untill we use uniqueConstraint
        where: {
          ownerId: ownerId,
          status: planUsageStatus.ACTIVE,
        },
        data: {
          totalWorkspaces: {
            increment: 1,
          },
        },
      });
    } catch (error: unknown) {
      console.log("Error updating totalWorkspaces:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed incrementing totalWorkspaces count");
    }
  }
}
export const plan = new Plan();
export default Plan;
