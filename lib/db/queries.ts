import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users } from './schema';

export async function getUserById(id: number) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateUserSubscription(
  userId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
  }
) {
  await db
    .update(users)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}
