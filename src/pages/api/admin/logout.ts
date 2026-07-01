import type { APIRoute } from 'astro';
import { hasSameOrigin } from '../../../lib/auth/origin';
import { redirect303 } from '../../../lib/admin/http';
import { destroyAdminSession } from '../../../lib/auth/session';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!hasSameOrigin(request)) {
    return new Response('origin rejected', { status: 403 });
  }

  await destroyAdminSession(cookies);
  return redirect303('/admin/login');
};
