import express from 'express';
import { createSubscriptionController } from '../../controllers/payment.controller';

const router = express.Router();

// this would be BASE_URL/api/v1/payments/create-subscription
router.post('/create-subscription', createSubscriptionController);

export default router;