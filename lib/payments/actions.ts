'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';

export async function checkoutAction(formData: FormData) {
  const user = await getUser();
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ user, priceId });
}

export async function customerPortalAction() {
  const user = await getUser();
  if (!user) {
    redirect('/pricing');
  }

  const portalSession = await createCustomerPortalSession(user);
  redirect(portalSession.url);
}
