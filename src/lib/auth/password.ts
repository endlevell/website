import { hash, verify } from '@node-rs/argon2';

const argonOptions = {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
};

function getAdminPasswordHash(): string | undefined {
  const value = process.env.ADMIN_PASSWORD_HASH || import.meta.env.ADMIN_PASSWORD_HASH;
  return value?.replaceAll('\\$', '$');
}

export function hasAdminPasswordHash(): boolean {
  return Boolean(getAdminPasswordHash());
}

export async function hashAdminPassword(password: string): Promise<string> {
  return hash(password, argonOptions);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expectedHash = getAdminPasswordHash();

  if (!expectedHash) {
    return false;
  }

  try {
    return verify(expectedHash, password, argonOptions);
  } catch {
    return false;
  }
}
