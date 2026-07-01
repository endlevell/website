import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://endlevel.dev';
const databaseUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:./data/site.db';
const databaseAuthToken = process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN;

function filePathFromDatabaseUrl(url) {
  if (!url.startsWith('file:')) {
    return null;
  }

  const value = url.slice('file:'.length);
  return value.startsWith('/') ? value : fileURLToPath(new URL(value, import.meta.url));
}

async function getDynamicSitemapPages() {
  const localPath = filePathFromDatabaseUrl(databaseUrl);

  if (localPath && !existsSync(localPath)) {
    return [];
  }

  try {
    const client = createClient({
      url: databaseUrl,
      authToken: databaseAuthToken,
    });
    try {
      const projectRows = await client.execute("select slug from projects where status != 'archived'");
      const postRows = await client.execute('select slug from posts where published = 1');

      return [
        ...projectRows.rows.map((row) => new URL(`/projects/${row.slug}`, site).href),
        ...postRows.rows.map((row) => new URL(`/blog/${row.slug}`, site).href),
      ];
    } finally {
      client.close();
    }
  } catch {
    return [];
  }
}

const dynamicSitemapPages = await getDynamicSitemapPages();

export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/api'),
      customPages: dynamicSitemapPages,
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Iosevka',
      cssVariable: '--font-mono',
      fallbacks: ['monospace'],
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
  ],
  security: {
    checkOrigin: true,
  },
  vite: {
    ssr: {
      external: ['@node-rs/argon2'],
    },
  },
});
