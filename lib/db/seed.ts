import { db } from './drizzle';
import { users } from './schema';

async function seed() {
  await db.insert(users).values([
    {
      username: 'test',
      // admin123
      passwordHash:
        '$2a$10$7JNtY2uXCS.QoyoH8i.mRu1g4sUtK5ausmU.5MjBVRCm.hVflCw0y',
    },
  ]);
}

seed().catch(console.error);
