import { SUBSCRIPTION_PLANS } from "../lib/constants";
import { createSubscription } from "../services/payment";
import { Request, Response } from "express";

export const createSubscriptionController = async (
  req: Request,
  res: Response
) => {
  const { plan } = req.body as { plan: "basic" | "pro" };
  console.log("Creating subscription for plan:", plan);
  const planId = SUBSCRIPTION_PLANS[plan]?.plan_id;
  console.log("Plan ID:", planId);
  if (!planId) {
    res.status(400).json({ error: "Invalid plan selected" });
    return;
  }

  try {
    const subscription = await createSubscription({
      plan_id: planId,
    });
    res
      .status(201)
      .json({
        ...subscription,
        key: process.env.RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
      });
    return;
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
    return;
  }
};
