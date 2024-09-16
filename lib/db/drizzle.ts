import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create a single client instance
const globalForPostgres = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

export const client =
  globalForPostgres.postgresClient ||
  postgres(process.env.POSTGRES_URL, { max: 1 });

// In development, preserve the client across hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

export const db = drizzle(client, { schema });
