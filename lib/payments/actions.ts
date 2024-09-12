'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { createCheckoutSession, stripe } from './stripe';
import Stripe from 'stripe';

export async function checkoutAction(formData: FormData) {
  const user = await getUser();
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ user, priceId });
}

export async function openCustomerPortal() {
  const user = await getUser();
  if (!user || !user.stripeCustomerId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const products = await stripe.products.list({ active: true, limit: 1 });
    if (products.data.length === 0) {
      throw new Error('No active products found in Stripe');
    }

    const product = products.data[0];
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error('No active prices found for the product');
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription',
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
      },
    });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });

  redirect(portalSession.url);
}
