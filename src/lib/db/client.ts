import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { createSchema } from './bootstrap';
import * as schema from './schema';

const databaseUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:./data/site.db';
const databaseAuthToken = process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN;
const localDatabasePath = databaseUrl.startsWith('file:') ? databaseUrl.slice('file:'.length) : null;

if (localDatabasePath && localDatabasePath !== ':memory:') {
  mkdirSync(dirname(resolve(localDatabasePath)), { recursive: true });
}

export const client = createClient({
  url: databaseUrl,
  authToken: databaseAuthToken,
});

export const db = drizzle(client, { schema });

let databaseReady: Promise<void> | null = null;

async function initializeDatabase(): Promise<void> {
  await client.execute('pragma foreign_keys = ON');
  await createSchema(client);
}

export function ensureDatabase(): Promise<void> {
  databaseReady ??= initializeDatabase().catch((error: unknown) => {
    databaseReady = null;
    throw error;
  });

  return databaseReady;
}
