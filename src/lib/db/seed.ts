import { db, ensureDatabase } from './client';
import { posts, projects } from './schema';

const now = new Date();
const earlier = (daysAgo: number) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

const projectSeeds = [
  {
    slug: 'arch-workstation-notes',
    title: 'Arch Workstation Notes',
    summary: 'A living setup log for a fast, recoverable Linux workstation.',
    body: `# Arch Workstation Notes

This project tracks the moving parts of my daily Linux setup: package choices, service tweaks, shell config, and the recovery notes I wish I had before breaking things.

The goal is boring reliability. If a machine fails, the notes should be clear enough to rebuild without guessing.

\`\`\`bash
pacman -Syu
systemctl --user status pipewire
\`\`\`
`,
    techTags: JSON.stringify(['linux', 'arch', 'systemd', 'shell']),
    repoUrl: 'https://github.com/endlevell',
    liveUrl: null,
    coverImage: null,
    featured: true,
    sortOrder: 10,
    status: 'active',
    createdAt: earlier(38),
    updatedAt: earlier(5),
  },
  {
    slug: 'nix-lab',
    title: 'Nix Lab',
    summary: 'Small reproducibility experiments for dev shells and machine config.',
    body: `# Nix Lab

Nix is where I test reproducible environments, mostly to understand which parts of a setup are truly declarative and which parts still need discipline.

- development shells
- package pinning
- repeatable tooling
- notes on failures
`,
    techTags: JSON.stringify(['nix', 'linux', 'devops']),
    repoUrl: 'https://github.com/endlevell',
    liveUrl: null,
    coverImage: null,
    featured: true,
    sortOrder: 20,
    status: 'wip',
    createdAt: earlier(28),
    updatedAt: earlier(4),
  },
  {
    slug: 'void-service-sandbox',
    title: 'Void Service Sandbox',
    summary: 'Runit service experiments for understanding simple init systems.',
    body: `# Void Service Sandbox

Void Linux is a good place to study services without a large abstraction layer. This project keeps examples for runit service directories, logging, and failure behavior.

I use it as a controlled playground before touching real machines.
`,
    techTags: JSON.stringify(['void-linux', 'runit', 'sysadmin']),
    repoUrl: 'https://github.com/endlevell',
    liveUrl: null,
    coverImage: null,
    featured: false,
    sortOrder: 30,
    status: 'active',
    createdAt: earlier(22),
    updatedAt: earlier(9),
  },
  {
    slug: 'low-level-sketchbook',
    title: 'Low-Level Sketchbook',
    summary: 'Notes and tiny programs for memory, compilation, and systems basics.',
    body: `# Low-Level Sketchbook

This is a collection of small C, C++, Rust, and Go experiments. The point is to keep the scope tiny enough that each program teaches one thing.

\`\`\`c
#include <stdio.h>

int main(void) {
  puts("inspect the small parts first");
  return 0;
}
\`\`\`
`,
    techTags: JSON.stringify(['c', 'rust', 'go', 'systems']),
    repoUrl: 'https://github.com/endlevell',
    liveUrl: null,
    coverImage: null,
    featured: true,
    sortOrder: 40,
    status: 'active',
    createdAt: earlier(15),
    updatedAt: earlier(3),
  },
];

const postSeeds = [
  {
    slug: 'why-i-keep-breaking-linux',
    title: 'Why I Keep Breaking Linux',
    excerpt: 'Breaking a setup is annoying, but it shows which parts I never understood.',
    body: `# Why I Keep Breaking Linux

I learn fastest when a system stops being abstract. A broken boot entry, a misbehaving service, or a missing permission forces me to trace the path instead of memorizing commands.

The trick is writing down the fix after the panic is gone. Notes turn a random failure into a reusable map.
`,
    coverImage: null,
    tags: JSON.stringify(['linux', 'notes']),
    published: true,
    publishedAt: earlier(12),
    createdAt: earlier(12),
    updatedAt: earlier(6),
  },
  {
    slug: 'small-services-are-good-teachers',
    title: 'Small Services Are Good Teachers',
    excerpt: 'A tiny daemon can teach process lifecycle, logs, permissions, and deployment.',
    body: `# Small Services Are Good Teachers

Big platforms hide a lot. A small service does not. You still need configuration, logs, permissions, updates, restart behavior, and a way to know when it fails.

That makes tiny services a good training ground for sysadmin habits.
`,
    coverImage: null,
    tags: JSON.stringify(['sysadmin', 'devops']),
    published: true,
    publishedAt: earlier(8),
    createdAt: earlier(8),
    updatedAt: earlier(2),
  },
  {
    slug: 'reading-code-with-a-notebook',
    title: 'Reading Code With a Notebook',
    excerpt: 'Writing down unknowns makes unfamiliar code less intimidating.',
    body: `# Reading Code With a Notebook

When code feels too large, I write down names first: functions, files, commands, inputs, outputs. Then I connect them slowly.

The notebook is not for perfect documentation. It is for keeping enough context in my head to make the next question smaller.
`,
    coverImage: null,
    tags: JSON.stringify(['software', 'learning']),
    published: true,
    publishedAt: earlier(3),
    createdAt: earlier(3),
    updatedAt: earlier(1),
  },
];

await ensureDatabase();

for (const project of projectSeeds) {
  await db.insert(projects).values(project).onConflictDoNothing({ target: projects.slug }).run();
}

for (const post of postSeeds) {
  await db.insert(posts).values(post).onConflictDoNothing({ target: posts.slug }).run();
}

console.log(`Seeded ${projectSeeds.length} projects and ${postSeeds.length} posts.`);
