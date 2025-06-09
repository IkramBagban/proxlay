import { SUBSCRIPTION_PLANS } from "../lib/constants";
import { createSubscription } from "../services/payment";
import { Request, Response } from "express";
import { verifyRazorpaySignature } from "../lib/razorpay";

export const createSubscriptionController = async (
  req: Request,
  res: Response
) => {
  const { plan } = req.body as { plan: "basic" | "pro"; amount: string };
  console.log("Creating subscription for plan:", plan);
  const { plan_id, amount } = SUBSCRIPTION_PLANS[plan];
  console.log("Plan ID:", plan_id);
  if (!plan_id || !amount) {
    res.status(400).json({ error: "Invalid plan selected" });
    return;
  }

  try {
    const subscription = await createSubscription({
      plan_id: plan_id,
    });
    res.status(201).json({
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

export const verifyPaymentController = async (req: Request, res: Response) => {
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
  } = req.body as {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
    plan: "basic" | "pro";
  };
  console.log("Verifying payment with data:", {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    plan,
  });

  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature
  ) {
    res.status(400).json({ error: "Missing payment verification data" });
    return;
  }
  try {
    const isValidSignature = verifyRazorpaySignature({
      paymentId: razorpay_payment_id,
      subscription_id: razorpay_subscription_id,
      signature: razorpay_signature,
      plan,
    });
    if (!isValidSignature) {
      console.error("Payment verification failed for plan:", plan);
      res.status(400).json({ error: "Payment verification failed" });
      return;
    }
    console.log("Payment verification successful for plan:", plan);
    console.log("giving access to user for plan:", plan);

    // TODO: have to give user access to the plan

    res.status(200).json({
      message: "Payment verified successfully",
      plan,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
