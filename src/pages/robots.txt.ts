import type { APIContext } from 'astro';
import { siteConfig } from '../lib/config/site';

export const prerender = true;

export function GET(_context: APIContext) {
  return new Response(
    `User-agent: *
Disallow: /admin
Disallow: /api

Sitemap: ${new URL('/sitemap-index.xml', siteConfig.siteUrl).href}
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
}
