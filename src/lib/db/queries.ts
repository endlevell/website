import { asc, desc, eq, ne } from 'drizzle-orm';
import { db } from './client';
import { posts, projects, type PostRow, type ProjectRow } from './schema';
import type { Post, Project, TagCount } from './types';

function parseStringList(value: string): string[] {
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
}

function mapProject(row: ProjectRow): Project {
  return {
    ...row,
    techTagsList: parseStringList(row.techTags),
  };
}

function mapPost(row: PostRow): Post {
  return {
    ...row,
    tagList: parseStringList(row.tags),
  };
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(asc(projects.sortOrder), desc(projects.updatedAt))
    .limit(limit)
    .all();

  return rows.map(mapProject);
}

export async function getProjects(): Promise<Project[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(ne(projects.status, 'archived'))
    .orderBy(asc(projects.sortOrder), desc(projects.updatedAt))
    .all();

  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const row = await db.select().from(projects).where(eq(projects.slug, slug)).get();
  return row ? mapProject(row) : null;
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const query = db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt), desc(posts.updatedAt));

  const rows = typeof limit === 'number' ? await query.limit(limit).all() : await query.all();
  return rows.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await db.select().from(posts).where(eq(posts.slug, slug)).get();
  return row && row.published ? mapPost(row) : null;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const rows = await getPublishedPosts();
  return rows.filter((post) => post.tagList.includes(tag));
}

export async function getAllTags(): Promise<TagCount[]> {
  const counts = new Map<string, number>();

  for (const post of await getPublishedPosts()) {
    for (const tag of post.tagList) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}
