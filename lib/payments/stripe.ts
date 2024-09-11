import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, User } from '@/lib/db/schema';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function createCheckoutSession(user: User | null) {
  if (!user) {
    redirect('/sign-up?redirect=checkout');
  }

  const priceId = 'price_1PxIepERuunbUnvUzuSLJWsY';
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: user.stripeCustomerId || undefined,
    client_reference_id: user.username,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
    },
  });

  redirect(session.url!);
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (user.length === 0) {
    console.error('User not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await db
      .update(users)
      .set({
        stripeSubscriptionId: subscriptionId,
        stripeProductId: plan.product?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user[0].id));
  } else if (status === 'canceled' || status === 'unpaid') {
    await db
      .update(users)
      .set({
        stripeSubscriptionId: null,
        stripeProductId: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user[0].id));
  }
}
