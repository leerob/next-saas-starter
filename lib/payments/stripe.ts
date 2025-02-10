import Stripe from "stripe";
import { redirect } from "next/navigation";
import { User } from "@/lib/db/schema";
import { getUser, updateUserSubscription } from "@/lib/db/queries";
import { getCartItems } from "@/lib/db/queries/cart";
import {
  createOrder,
  createOrderItems,
  updateOrderStatus,
} from "@/lib/db/queries/orders";
import type { Cart, CartItem, Product } from "@/lib/db/schema";
import { calculateOrderAmount } from "@/lib/utils";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function createCustomerPortalSession(user: User) {
  if (!user.stripeCustomerId || !user.stripeProductId) {
    throw new Error("User has no active subscription");
  }

  const product = await stripe.products.retrieve(user.stripeProductId);
  if (!product.active) {
    throw new Error("User's product is not active in Stripe");
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
  });

  if (!prices.data.length) {
    throw new Error("No active prices found for the user's product");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: process.env.NEXT_PUBLIC_APP_URL,
  });

  return session;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const user = await getUser(customerId);
      if (!user) {
        console.error("User not found for Stripe customer:", customerId);
        return;
      }

      if (event.type === "customer.subscription.deleted") {
        await updateUserSubscription(user.id, {
          stripeSubscriptionId: null,
          stripeProductId: null,
          planName: null,
          subscriptionStatus: "inactive",
        });
      } else {
        await updateUserSubscription(user.id, {
          stripeSubscriptionId: subscription.id,
          stripeProductId: subscription.items.data[0]?.price.product as string,
          planName: subscription.items.data[0]?.price.nickname || null,
          subscriptionStatus: subscription.status,
        });
      }
      break;
  }
}

export async function createCheckoutSession({
  user,
  priceId,
}: {
  user: User;
  priceId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: user.stripeCustomerId || undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    subscription_data: {
      metadata: {
        userId: user.id.toString(),
      },
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session;
}

export async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const orderId = Number(session.metadata?.orderId);
  if (!orderId) {
    throw new Error("No order ID found in session metadata.");
  }

  await updateOrderStatus(orderId, "paid", session.payment_intent as string);
}

export async function handlePaymentFailure(session: Stripe.Checkout.Session) {
  const orderId = Number(session.metadata?.orderId);
  if (!orderId) {
    throw new Error("No order ID found in session metadata.");
  }

  await updateOrderStatus(orderId, "failed");
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
    type: "recurring",
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === "string" ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days,
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price?.id,
  }));
}
