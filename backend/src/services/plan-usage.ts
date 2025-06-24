import { prismaClient } from "../lib/db";
import { IPlans } from "../lib/plans";

export const createplanUsage = async (
  planType: IPlans,
  userId: string,
  subscriptionId: string
) => {
  const response = await prismaClient.planUsage.create({
    data: {
      planType: planType,
      ownerId: userId,
      subscriptionId: subscriptionId,
    },
  });
  return response;
};
