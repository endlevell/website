import { siteConfig } from '../config/site';
import type { Post } from '../db/types';

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.name,
      alternateName: siteConfig.githubName,
      url: siteConfig.siteUrl,
      email: siteConfig.email,
      sameAs: [siteConfig.githubUrl],
    },
  };
}

export function blogPostJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
  };
}
