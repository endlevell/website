import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '../lib/config/site';
import { getPublishedPosts } from '../lib/db/queries';
import { renderMarkdown } from '../lib/markdown/render';

export const prerender = false;

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${siteConfig.name} journal`,
    description: siteConfig.description,
    site: context.site ?? new URL(siteConfig.siteUrl),
    items: await Promise.all(
      posts.map(async (post) => ({
        title: post.title,
        description: post.excerpt,
        pubDate: post.publishedAt ?? post.createdAt,
        link: `/blog/${post.slug}`,
        content: await renderMarkdown(post.body),
      })),
    ),
  });
}
