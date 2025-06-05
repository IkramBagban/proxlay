import Razorpay from "razorpay";
import { config } from "dotenv";
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createSubscription = async ({ plan_id }: { plan_id: string }) => {
  const createSubscriptionResponse = await instance.subscriptions.create({
    plan_id: plan_id,
    customer_notify: 1, // Notify customer via email
    total_count: 12, // Number of months for the subscription
    notes: {
      note_key: "value",
    },
  });

  console.log("Subscription created:", createSubscriptionResponse);
  return createSubscriptionResponse;
};

export const getSubscription = async (subscriptionId: string) => {
  const subscription = await instance.subscriptions.fetch(subscriptionId);
  console.log("Fetched subscription:", subscription);
  return subscription;
};
