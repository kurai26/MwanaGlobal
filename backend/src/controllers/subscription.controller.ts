import { Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' as any });

const PRICE_IDS: Record<string, string> = {
  SILVER: process.env.STRIPE_PRICE_SILVER!,
  GOLD: process.env.STRIPE_PRICE_GOLD!,
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { tier } = req.body as { tier: 'SILVER' | 'GOLD' };
    const priceId = PRICE_IDS[tier];
    if (!priceId) return res.status(400).json({ success: false, message: 'Invalid tier' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      metadata: { userId: user.id, tier },
      success_url: `${process.env.FRONTEND_URL}/dashboard/upgrade?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/upgrade?cancelled=true`,
    });

    res.json({ success: true, data: { url: session.url } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleWebhook = async (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, tier } = session.metadata ?? {};
    if (userId && tier) {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: tier as any,
          subscriptionExpiry: expiry,
        },
      });
    }
  }

  // customer.subscription.deleted: storing Stripe customerId on user is a Phase 2 task
  // invoice.payment_failed: grace period downgrade is a Phase 2 task

  res.json({ received: true });
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { subscriptionTier: 'BRONZE', subscriptionExpiry: null },
    });
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
