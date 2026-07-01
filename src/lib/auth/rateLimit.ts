type LoginAttempt = {
  failed: number;
  blockedUntil: number;
};

const attempts = new Map<string, LoginAttempt>();
const maxFreeFailures = 5;

export function getClientAddress(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

export function isLoginBlocked(key: string): boolean {
  const entry = attempts.get(key);
  return Boolean(entry && entry.blockedUntil > Date.now());
}

export function getLoginRetrySeconds(key: string): number {
  const entry = attempts.get(key);
  return entry ? Math.max(1, Math.ceil((entry.blockedUntil - Date.now()) / 1000)) : 0;
}

export function recordLoginFailure(key: string): void {
  const current = attempts.get(key) ?? { failed: 0, blockedUntil: 0 };
  const failed = current.failed + 1;
  const extraFailures = Math.max(0, failed - maxFreeFailures);
  const blockedMs = extraFailures === 0 ? 0 : Math.min(15 * 60_000, 2 ** extraFailures * 1000);

  attempts.set(key, {
    failed,
    blockedUntil: blockedMs > 0 ? Date.now() + blockedMs : 0,
  });
}

export function resetLoginFailures(key: string): void {
  attempts.delete(key);
}
