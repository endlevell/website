import type { APIRoute } from 'astro';
import { hasSameOrigin } from '../../../lib/auth/origin';
import { hasAdminPasswordHash, verifyAdminPassword } from '../../../lib/auth/password';
import {
  getClientAddress,
  getLoginRetrySeconds,
  isLoginBlocked,
  recordLoginFailure,
  resetLoginFailures,
} from '../../../lib/auth/rateLimit';
import { createAdminSession } from '../../../lib/auth/session';
import { redirect303 } from '../../../lib/admin/http';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) {
    return redirect303('/admin/login?error=origin');
  }

  const clientKey = getClientAddress(request);

  if (!hasAdminPasswordHash()) {
    return redirect303('/admin/login?error=config');
  }

  if (isLoginBlocked(clientKey)) {
    return redirect303(`/admin/login?error=rate&retry=${getLoginRetrySeconds(clientKey)}`);
  }

  const formData = await request.formData();
  const password = formData.get('password');

  if (typeof password !== 'string' || !(await verifyAdminPassword(password))) {
    recordLoginFailure(clientKey);
    return redirect303('/admin/login?error=invalid');
  }

  resetLoginFailures(clientKey);
  await createAdminSession(cookies, new URL(request.url));
  return redirect303('/admin');
};
