"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { createCheckoutSession, stripe } from "./stripe";

export async function checkoutAction() {
  await createCheckoutSession(null);
}

export async function openCustomerPortal() {
  const user = await getUser();
  if (!user || !user.stripeCustomerId) {
    throw new Error("User not found or not subscribed");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
  });

  redirect(portalSession.url);
}
