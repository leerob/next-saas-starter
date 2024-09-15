import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users } from './schema';

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  await db.insert(users).values([
    {
      email: 'test@test.com',
      // admin123
      passwordHash:
        '$2a$10$7JNtY2uXCS.QoyoH8i.mRu1g4sUtK5ausmU.5MjBVRCm.hVflCw0y',
    },
  ]);

  console.log('Initial user created.');

  await createStripeProducts();
}

seed().catch(console.error);
