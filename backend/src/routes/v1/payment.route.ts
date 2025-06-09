import express from 'express';
import { createSubscriptionController, verifyPaymentController } from '../../controllers/payment.controller';

const router = express.Router();

// this would be BASE_URL/api/v1/payments/create-subscription
router.post('/create-subscription', createSubscriptionController);
router.post("/verify", verifyPaymentController);
export default router;