import { count, desc, eq } from 'drizzle-orm';
import { db, ensureDatabase } from '../db/client';
import { posts, projects, type PostRow, type ProjectRow } from '../db/schema';
import type { PostFormValues } from '../validation/post';
import type { ProjectFormValues } from '../validation/project';

export async function getAdminCounts() {
  await ensureDatabase();

  const projectCount = (await db.select({ value: count() }).from(projects).get())?.value ?? 0;
  const postCount = (await db.select({ value: count() }).from(posts).get())?.value ?? 0;
  const publishedPostCount =
    (await db.select({ value: count() }).from(posts).where(eq(posts.published, true)).get())?.value ?? 0;

  return { projectCount, postCount, publishedPostCount };
}

export async function getAdminProjects(): Promise<ProjectRow[]> {
  await ensureDatabase();

  return db.select().from(projects).orderBy(desc(projects.updatedAt)).all();
}

export async function getAdminProject(id: number): Promise<ProjectRow | null> {
  await ensureDatabase();

  return (await db.select().from(projects).where(eq(projects.id, id)).get()) ?? null;
}

export async function createProject(values: ProjectFormValues): Promise<void> {
  await ensureDatabase();

  const now = new Date();

  await db.insert(projects)
    .values({
      ...values,
      techTags: JSON.stringify(values.techTags),
      createdAt: now,
      updatedAt: now,
    })
    .run();
}

export async function updateProject(id: number, values: ProjectFormValues): Promise<void> {
  await ensureDatabase();

  await db.update(projects)
    .set({
      ...values,
      techTags: JSON.stringify(values.techTags),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .run();
}

export async function deleteProject(id: number): Promise<void> {
  await ensureDatabase();

  await db.delete(projects).where(eq(projects.id, id)).run();
}

export async function getAdminPosts(): Promise<PostRow[]> {
  await ensureDatabase();

  return db.select().from(posts).orderBy(desc(posts.updatedAt)).all();
}

export async function getAdminPost(id: number): Promise<PostRow | null> {
  await ensureDatabase();

  return (await db.select().from(posts).where(eq(posts.id, id)).get()) ?? null;
}

export async function createPost(values: PostFormValues): Promise<void> {
  await ensureDatabase();

  const now = new Date();

  await db.insert(posts)
    .values({
      ...values,
      tags: JSON.stringify(values.tags),
      publishedAt: values.published ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .run();
}

export async function updatePost(id: number, values: PostFormValues, existing: PostRow): Promise<void> {
  await ensureDatabase();

  const now = new Date();

  await db.update(posts)
    .set({
      ...values,
      tags: JSON.stringify(values.tags),
      publishedAt: values.published ? existing.publishedAt ?? now : null,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .run();
}

export async function deletePost(id: number): Promise<void> {
  await ensureDatabase();

  await db.delete(posts).where(eq(posts.id, id)).run();
}
