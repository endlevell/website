import type { Client } from '@libsql/client';

const statements = [
  // Phase 1 uses direct bootstrap SQL so build/runtime never depend on a pre-run migration step.
  `create table if not exists projects (
      id integer primary key autoincrement,
      slug text not null unique,
      title text not null,
      summary text not null,
      body text not null,
      tech_tags text not null,
      repo_url text,
      live_url text,
      cover_image text,
      featured integer not null default 0,
      sort_order integer not null default 0,
      status text not null default 'active',
      created_at integer not null,
      updated_at integer not null
    )`,

  `create table if not exists posts (
      id integer primary key autoincrement,
      slug text not null unique,
      title text not null,
      excerpt text not null,
      body text not null,
      cover_image text,
      tags text not null,
      published integer not null default 0,
      published_at integer,
      created_at integer not null,
      updated_at integer not null
    )`,

  `create table if not exists admin_sessions (
      id text primary key,
      created_at integer not null,
      expires_at integer not null
    )`,

  'create index if not exists projects_status_sort_idx on projects(status, sort_order)',
  'create index if not exists projects_featured_idx on projects(featured, sort_order)',
  'create index if not exists posts_published_at_idx on posts(published, published_at)',
];

export async function createSchema(client: Client): Promise<void> {
  for (const statement of statements) {
    await client.execute(statement);
  }
}
