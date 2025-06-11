import { prismaClient } from "../lib/db";

export interface CreateTrialSubscriptionParams {
  userId: string;
  planType: "TRIAL_BASIC";
}

export interface TrialSubscriptionResult {
  id: string;
  userId: string;
  planType: string;
  status: string;
  trialStartDate: Date;
  trialEndDate: Date;
  isTrialSubscription: boolean;
}

// Check if user has already used their free trial
export const hasUserUsedTrial = async (userId: string): Promise<boolean> => {
  const existingTrial = await prismaClient.subscription.findFirst({
    where: {
      userId,
      hasUsedTrial: true,
    },
  });
  
  return !!existingTrial;
};

// Check if user has an active trial
export const getUserActiveTrial = async (userId: string) => {
  const activeTrial = await prismaClient.subscription.findFirst({
    where: {
      userId,
      isTrialSubscription: true,
      status: "TRIAL_ACTIVE",
      trialEndDate: {
        gte: new Date(), // Trial end date is in the future
      },
    },
  });
  
  return activeTrial;
};

// Create a free trial subscription
export const createTrialSubscription = async ({
  userId,
  planType,
}: CreateTrialSubscriptionParams): Promise<TrialSubscriptionResult> => {
  // Check if user has already used their trial
  const hasUsedTrial = await hasUserUsedTrial(userId);
  if (hasUsedTrial) {
    throw new Error("User has already used their free trial");
  }

  // Check if user has an active trial
  const activeTrial = await getUserActiveTrial(userId);
  if (activeTrial) {
    throw new Error("User already has an active trial subscription");
  }

  const trialStartDate = new Date();
  const trialEndDate = new Date();
  trialEndDate.setDate(trialStartDate.getDate() + 7); // 7 days from now

  // Create trial subscription
  const trialSubscription = await prismaClient.subscription.create({
    data: {
      userId,
      planType,
      status: "TRIAL_ACTIVE",
      currentPeriodStart: trialStartDate,
      currentPeriodEnd: trialEndDate,
      isTrialSubscription: true,
      trialStartDate,
      trialEndDate,
      hasUsedTrial: true, // Mark that user has used their trial
    },
  });

  // Create a trial transaction record (amount = 0)
  await prismaClient.transaction.create({
    data: {
      subscriptionId: trialSubscription.id,
      amount: 0, // Free trial
      userId: userId,
      currency: "INR",
      status: "CAPTURED", // Consider trial as captured
      method: "TRIAL",
      description: "7-day free trial for Basic plan",
      isTrialTransaction: true,
    },
  });

  return {
    id: trialSubscription.id,
    userId: trialSubscription.userId,
    planType: trialSubscription.planType,
    status: trialSubscription.status,
    trialStartDate: trialSubscription.trialStartDate!,
    trialEndDate: trialSubscription.trialEndDate!,
    isTrialSubscription: trialSubscription.isTrialSubscription,
  };
};

// Check if user's trial has expired and update status
export const checkAndUpdateExpiredTrials = async () => {
  const now = new Date();
  
  const expiredTrials = await prismaClient.subscription.updateMany({
    where: {
      isTrialSubscription: true,
      status: "TRIAL_ACTIVE",
      trialEndDate: {
        lt: now, // Trial end date is in the past
      },
    },
    data: {
      status: "TRIAL_EXPIRED",
    },
  });

  console.log(`Updated ${expiredTrials.count} expired trial subscriptions`);
  return expiredTrials.count;
};

// Get user's current subscription status (including trial)
export const getUserSubscriptionStatus = async (userId: string) => {
  const subscription = await prismaClient.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["ACTIVE", "TRIAL_ACTIVE"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!subscription) {
    return {
      hasActiveSubscription: false,
      canStartTrial: !(await hasUserUsedTrial(userId)),
      subscriptionType: null,
      trialDaysLeft: 0,
    };
  }

  let trialDaysLeft = 0;
  if (subscription.isTrialSubscription && subscription.trialEndDate) {
    const now = new Date();
    const diffTime = subscription.trialEndDate.getTime() - now.getTime();
    trialDaysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  return {
    hasActiveSubscription: true,
    canStartTrial: false,
    subscriptionType: subscription.planType,
    isTrialSubscription: subscription.isTrialSubscription,
    trialDaysLeft,
    subscription,
  };
};

// Convert trial to paid subscription
export const convertTrialToPaidSubscription = async (
  userId: string,
  razorpaySubscriptionId: string,
  planType: "BASIC" | "PRO"
) => {
  // Find the active trial
  const activeTrial = await getUserActiveTrial(userId);
  if (!activeTrial) {
    throw new Error("No active trial found for user");
  }

  // Update the trial subscription to paid
  const updatedSubscription = await prismaClient.subscription.update({
    where: {
      id: activeTrial.id,
    },
    data: {
      razorpaySubscriptionId: razorpaySubscriptionId,
      planType,
      status: "ACTIVE",
      isTrialSubscription: false,
    },
  });

  return updatedSubscription;
};