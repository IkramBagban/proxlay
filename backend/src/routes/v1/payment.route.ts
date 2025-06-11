import express from "express";
import {
  createSubscriptionController,
  createTrialSubscriptionController,
  getSubscriptionStatusController,
  razorpayWebhookHandler,
  verifyPaymentController,
} from "../../controllers/v1/payment.controller";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// this would be BASE_URL/api/v1/payments/create-subscription
router.post(
  "/create-subscription",
  requireAuth(),
  createSubscriptionController
);
router.post("/verify", requireAuth(), verifyPaymentController);
router.post("/razorpay/webhook",  razorpayWebhookHandler);


router.post('/start-trial', requireAuth(), createTrialSubscriptionController);
router.get('/subscription-status/:userId', requireAuth(), getSubscriptionStatusController);
export default router;
