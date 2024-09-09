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
