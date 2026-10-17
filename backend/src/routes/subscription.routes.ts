import { Router } from 'express';
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createCheckout, handleWebhook, cancelSubscription } from '../controllers/subscription.controller';

const router = Router();

// Webhook must use raw body — mounted before global json middleware via app.ts
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.post('/create-checkout', express.json(), authenticate, createCheckout);
router.post('/cancel', express.json(), authenticate, cancelSubscription);

export default router;
