import Stripe from "stripe";
import { redirect } from "next/navigation";
import { User } from "../db/schema";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession(user: User | null) {
  if (!user) {
    redirect("/sign-up?redirect=checkout");
  }

  const priceId = "price_1PxIepERuunbUnvUzuSLJWsY";
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
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
