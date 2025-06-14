import { SUBSCRIPTION_PLANS } from "../../lib/constants";
import {
  createSubscription,
  getPayment,
  getSubscription,
} from "../../services/payment";
import { Request, Response } from "express";
import { verifyRazorpaySignature } from "../../lib/razorpay";
import Razorpay from "razorpay";
import { prismaClient } from "../../lib/db";
import { SubscriptionStatus, TransactionStatus } from "../../generated/prisma";
import { getAuth } from "@clerk/express";

import {
  createTrialSubscription,
  hasUserUsedTrial,
  getUserSubscriptionStatus,
  convertTrialToPaidSubscription,
} from "../../services/trial";
import {
  handleSubscriptionActivated,
  handleSubscriptionCharged,
} from "../../services/webhook";
import { Subscriptions } from "razorpay/dist/types/subscriptions";

export const createSubscriptionController = async (
  req: Request,
  res: Response
) => {
  const { plan } = req.body as { plan: "basic" | "pro"; amount: string };
  // console.log("Creating subscription for plan:", plan);
  const { plan_id, amount } = SUBSCRIPTION_PLANS[plan];
  // console.log("Plan ID:", plan_id);

  const { userId } = await getAuth(req);
  if (!plan_id || !amount) {
    res.status(400).json({ error: "Invalid plan selected" });
    return;
  }

  try {
    const subscription = await createSubscription({
      plan_id: plan_id,
      userId: userId!,
    });
    // console.log("Subscription created:", subscription);

    if (!subscription || !subscription.id) {
      res.status(500).json({ error: "Failed to create subscription" });
      return;
    }

    const subscriptionRecord = await prismaClient.subscription.create({
      data: {
        razorpaySubscriptionId: subscription.id,
        planType: plan.toUpperCase() as "BASIC" | "PRO",
        status: SubscriptionStatus.CREATED,
        userId: userId!,
        currentPeriodStart: new Date(subscription.current_start!),
        currentPeriodEnd: new Date(subscription.current_end!),
      },
    });
    // console.log("Subscription record created in database:", subscriptionRecord);

    res.status(201).json({
      ...subscription,
      key: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      plan: plan.toUpperCase(),
    });
    return;
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
    return;
  }
};
export const createTrialSubscriptionController = async (
  req: Request,
  res: Response
) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    // Check if user has already used their trial
    const hasUsedTrial = await hasUserUsedTrial(userId);
    if (hasUsedTrial) {
      res.status(400).json({
        error: "You have already used your free trial",
        code: "TRIAL_ALREADY_USED",
      });
      return;
    }

    // Get current subscription status
    const subscriptionStatus = await getUserSubscriptionStatus(userId);
    if (subscriptionStatus.hasActiveSubscription) {
      res.status(400).json({
        error: "You already have an active subscription",
        code: "ACTIVE_SUBSCRIPTION_EXISTS",
      });
      return;
    }

    // Create trial subscription
    const trialSubscription = await createTrialSubscription({
      userId,
      planType: "TRIAL_BASIC",
    });

    res.status(201).json({
      success: true,
      message: "Free trial activated successfully",
      subscription: trialSubscription,
      trialDaysRemaining: 7,
    });
    return;
  } catch (error) {
    console.error("Error creating trial subscription:", error);
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to create trial subscription",
    });
    return;
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
    // userId,
    isUpgradeFromTrial,
  } = req.body as {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
    plan: "basic" | "pro";
    // userId: string;
    isUpgradeFromTrial?: boolean;
  };

  const { userId } = await getAuth(req);
  console.log("Verifying payment with data:", {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
    userId,
    isUpgradeFromTrial,
  });

  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature ||
    !userId
  ) {
    res.status(400).json({ error: "Missing payment verification data" });
    return;
  }

  const planDetails = SUBSCRIPTION_PLANS[plan];
  if (!planDetails) {
    res.status(400).json({ error: "Invalid plan selected" });
    return;
  }

  const existingSubscription = await prismaClient.subscription.findFirst({
    where: {
      razorpaySubscriptionId: razorpay_subscription_id,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (existingSubscription) {
    console.log("Subscription already active, skipping verification");
    res.status(200).json({
      success: true,
      message:
        "Subscription already active. if you are upgrading, please contact support.",
      activePlan: existingSubscription.planType,
      plan,
    });
    return;
  }

  try {
    const isValidSignature = verifyRazorpaySignature({
      paymentId: razorpay_payment_id,
      subscription_id: razorpay_subscription_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      console.error("Payment verification failed for plan:", plan);
      res.status(400).json({ error: "Payment verification failed" });
      return;
    }

    const subscription: Subscriptions.RazorpaySubscription =
      await getSubscription(razorpay_subscription_id);
    const payment = await getPayment(razorpay_payment_id);
    console.log("Fetched subscription details:", subscription);
    if (!subscription) {
      console.error("Subscription not found for ID:", razorpay_subscription_id);
      res.status(404).json({ error: "Subscription not found" });
      return;
    }

    console.log("Payment verification successful for plan:", plan);

    // If upgrading from trial, convert the trial subscription
    if (isUpgradeFromTrial) {
      try {
        const planType = plan.toUpperCase() as "BASIC" | "PRO";
        await convertTrialToPaidSubscription(
          userId,
          razorpay_subscription_id,
          planType
        );
        console.log("Successfully converted trial to paid subscription");
      } catch (error) {
        console.error("Error converting trial to paid subscription:", error);
        // Continue with normal flow if conversion fails
        res.status(500).json({
          error: "Failed to convert trial to paid subscription",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      await prismaClient.$transaction(async (tx) => {
        const subscriptionRecord = await tx.subscription.update({
          where: {
            razorpaySubscriptionId: razorpay_subscription_id,
          },
          data: {
            status: SubscriptionStatus.ACTIVE,
            planType: plan.toUpperCase() as "BASIC" | "PRO",
            userId: userId,
            currentPeriodStart: new Date(subscription.current_start!),
            currentPeriodEnd: new Date(subscription.current_end!),
          },
        });
        await tx.transaction.create({
          data: {
            razorpayPaymentId: razorpay_payment_id,
            subscriptionId: subscriptionRecord.id, // subscription table id

            userId: userId,
            amount: (payment.amount as number) / 100, // convrt to actual amount
            currency: payment.currency,
            status: (payment.status).toUpperCase() as TransactionStatus,
            method: payment.method,
            description: `Payment for ${plan} plan and user ID ${userId}`,
          },
        });
      });
    }

    console.log("Giving access to user for plan:", plan);

    // TODO: Update user access in your system here

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      plan,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      isUpgradeFromTrial,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

export const razorpayWebhookHandler = async (req: any, res: any) => {
  console.log("***** Received Razorpay webhook event *****");
  const signature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  console.log("Received webhook with signature:", {
    event: req.body.event,
    body: JSON.stringify(req.body, null, 2),
  });
  if (!signature) {
    console.error("Signature is missing in the request headers");
    return res.status(400).send("Signature is missing");
  }
  if (!webhookSecret) {
    console.error("Webhook secret is not configured");
    return res.status(500).send({ error: "Webhook secret is not configured" });
  }

  const isValidSignature = Razorpay.validateWebhookSignature(
    JSON.stringify(req.body),
    signature,
    webhookSecret
  );

  if (!isValidSignature) {
    console.error("Invalid signature for webhook event");
    return res.status(400).send({ error: "Invalid signature" });
  }

  // Handle the event
  const event = req.body.event;
  const { subscription, payment } = req.body.payload;

  switch (event) {
    case "subscription.activated":
      await handleSubscriptionActivated(
        subscription.entity,
        payment.entity,
        res
      );
      break;
    case "subscription.charged":
      await handleSubscriptionCharged(subscription.entity, payment.entity, res);
      break;
  }
  res.status(200).send("Webhook received");
  console.log(
    "--------------------------- Webhook event processed successfully ---------------------------"
  );
};

export const getSubscriptionStatusController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const subscriptionStatus = await getUserSubscriptionStatus(userId);
    res.status(200).json(subscriptionStatus);
  } catch (error) {
    console.error("Error getting subscription status:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
};
