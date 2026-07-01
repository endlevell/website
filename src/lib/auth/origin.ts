export function hasSameOrigin(request: Request): boolean {
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return true;
  }

  const origin = request.headers.get('origin');

  if (!origin) {
    return false;
  }

  const allowedOrigins = new Set([new URL(request.url).origin]);
  const siteUrl = process.env.SITE_URL;

  if (siteUrl) {
    allowedOrigins.add(new URL(siteUrl).origin);
  }

  return allowedOrigins.has(origin);
}
