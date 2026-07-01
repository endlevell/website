import { defineMiddleware } from 'astro:middleware';
import { pruneExpiredSessions, readSessionToken, validateSessionToken } from './lib/auth/session';

function wantsHtml(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

function withAdminHeaders(response: Response): Response {
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';

  if ((!isAdminPage && !isAdminApi) || isLoginPage || isLoginApi) {
    const response = await next();
    return isAdminPage || isAdminApi ? withAdminHeaders(response) : response;
  }

  await pruneExpiredSessions();
  const session = await validateSessionToken(readSessionToken(context.cookies));

  if (!session) {
    context.cookies.delete(process.env.SESSION_COOKIE_NAME ?? 'endlevel_admin_session', { path: '/' });

    if (wantsHtml(pathname)) {
      return withAdminHeaders(context.redirect('/admin/login', 303));
    }

    return withAdminHeaders(new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    }));
  }

  context.locals.adminSession = session;
  return withAdminHeaders(await next());
});
