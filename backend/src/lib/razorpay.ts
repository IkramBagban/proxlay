import crypto from "crypto";

export const verifyRazorpaySignature = ({
  paymentId,
  subscription_id,
  signature,
  plan,
}: {
  paymentId: string;
  subscription_id: string;
  signature: string;
  plan: "basic" | "pro";
}): boolean => {

  console.log("Verifying Razorpay signature:", {
    paymentId,
    subscription_id,
    signature,
    plan,
  });

  if (!paymentId || !subscription_id || !signature) {
    console.error("Missing required parameters for signature verification");
    return false;
  }
  
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!RAZORPAY_KEY_SECRET) throw new Error("Missing Razorpay secret");

  const body = `${paymentId}|${subscription_id}`;
  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  console.log("Verifying Razorpay Signature:", {
    body,
    generatedSignature,
    providedSignature: signature,
    isVerified: generatedSignature === signature,
  });

  return generatedSignature === signature;
};
