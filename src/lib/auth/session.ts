import { createHash, randomBytes } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { and, eq, gt, lt } from 'drizzle-orm';
import { db, ensureDatabase } from '../db/client';
import { adminSessions } from '../db/schema';

const sessionDays = 7;

export type AdminSession = {
  idHash: string;
  expiresAt: Date;
};

export function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? 'endlevel_admin_session';
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function isLocalUrl(url: URL): boolean {
  return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
}

export function shouldUseSecureCookie(url: URL): boolean {
  return !isLocalUrl(url);
}

export function readSessionToken(cookies: AstroCookies): string | null {
  return cookies.get(getSessionCookieName())?.value ?? null;
}

export async function validateSessionToken(token: string | null): Promise<AdminSession | null> {
  if (!token) {
    return null;
  }

  await ensureDatabase();

  const idHash = hashToken(token);
  const now = new Date();
  const row = await db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.id, idHash), gt(adminSessions.expiresAt, now)))
    .get();

  return row ? { idHash: row.id, expiresAt: row.expiresAt } : null;
}

export async function createAdminSession(cookies: AstroCookies, requestUrl: URL): Promise<AdminSession> {
  await ensureDatabase();

  const token = randomBytes(32).toString('base64url');
  const idHash = hashToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionDays * 24 * 60 * 60 * 1000);

  await db.insert(adminSessions)
    .values({
      id: idHash,
      createdAt: now,
      expiresAt,
    })
    .run();

  cookies.set(getSessionCookieName(), token, {
    expires: expiresAt,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: shouldUseSecureCookie(requestUrl),
  });

  return { idHash, expiresAt };
}

export async function destroyAdminSession(cookies: AstroCookies): Promise<void> {
  const token = readSessionToken(cookies);

  if (token) {
    await ensureDatabase();
    await db.delete(adminSessions).where(eq(adminSessions.id, hashToken(token))).run();
  }

  cookies.delete(getSessionCookieName(), { path: '/' });
}

export async function pruneExpiredSessions(): Promise<void> {
  await ensureDatabase();

  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date())).run();
}
