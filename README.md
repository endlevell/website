<div align="center">

# endlevel.website

Personal portfolio and journal site for `endlevel`, built as a fast TUI-inspired Astro application with a private admin dashboard.

[![Astro](https://img.shields.io/badge/Astro-6.4.8-cba6f7?style=for-the-badge&labelColor=1e1e2e)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-89b4fa?style=for-the-badge&labelColor=1e1e2e)](https://www.typescriptlang.org)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-a6e3a1?style=for-the-badge&labelColor=1e1e2e)](https://orm.drizzle.team)
[![Turso](https://img.shields.io/badge/Turso-libSQL-fab387?style=for-the-badge&labelColor=1e1e2e)](https://turso.tech)
[![Vercel](https://img.shields.io/badge/Vercel-ready-cdd6f4?style=for-the-badge&labelColor=1e1e2e)](https://vercel.com)

</div>

## Overview

This repository contains a single Astro codebase for a developer portfolio, markdown-powered journal, and private admin dashboard. The public site is designed around a Ratatui and Neovim-inspired interface: flat Catppuccin Mocha colors, Iosevka typography, powerline status bars, and directory-style project and post listings.

The admin area manages dynamic projects and posts without a separate backend service. Server routes handle auth, validation, markdown rendering, and database writes directly inside Astro.

## Features

- TUI-inspired portfolio homepage with profile metadata, tech stack, featured projects, and latest posts.
- Dynamic project and blog routes backed by Drizzle ORM.
- Private single-admin dashboard for project and post CRUD.
- Markdown rendering through one shared `unified` pipeline with GFM, Shiki, and sanitization.
- Session auth using Argon2id password hashes and HttpOnly cookies.
- RSS, sitemap, robots, SEO metadata, and JSON-LD support.
- Vercel serverless deployment with Turso/libSQL-compatible persistence.
- Responsive mobile layout with connected powerline navigation and flat terminal surfaces.

## Stack

| Layer | Tooling |
| --- | --- |
| Framework | Astro 6, TypeScript |
| Styling | Hand-written CSS, Catppuccin Mocha tokens, Iosevka |
| Database | Drizzle ORM, libSQL/Turso |
| Auth | Argon2id, server-side sessions |
| Markdown | unified, remark, rehype, Shiki, rehype-sanitize |
| Deployment | Vercel adapter |

## Getting Started

### Requirements

- Node.js 22 or newer
- npm
- Optional: Turso account for production persistence

### Install

```bash
npm install
```

### Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

For local development, use a file-backed libSQL database:

```txt
SITE_URL=http://localhost:4321
DATABASE_URL=file:./data/site.db
ADMIN_PASSWORD_HASH=$argon2id$...
SESSION_COOKIE_NAME=endlevel_admin_session
```

Generate an admin password hash:

```bash
npm run auth:hash -- your-password
```

### Seed Local Content

```bash
npm run db:seed
```

### Develop

```bash
npm run dev
```

Open `http://localhost:4321`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro dev server |
| `npm run build` | Type-check and build for Vercel |
| `npm run preview` | Start local Astro dev server for QA |
| `npm run check` | Run Astro diagnostics |
| `npm run db:seed` | Seed starter projects and posts |
| `npm run auth:hash` | Generate Argon2id password hash |
| `npm run test:markdown` | Verify markdown sanitization pipeline |
| `npm run test:feeds` | Verify RSS/feed generation |

## Deployment

This project is configured for Vercel through `@astrojs/vercel` and `vercel.json`.

Production requires a persistent libSQL database. Turso is the intended default.

Required Vercel environment variables:

```txt
SITE_URL=https://endlevel.tech
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
ADMIN_PASSWORD_HASH=$argon2id$...
SESSION_COOKIE_NAME=endlevel_admin_session
```

Seed production once from a local shell:

```bash
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npm run db:seed
```

Detailed notes live in [`docs/deploy-vercel.md`](docs/deploy-vercel.md).

## Project Structure

```txt
src/
  components/
    admin/       Admin forms and dashboard UI
    blog/        Blog listing components
    home/        Homepage sections
    layout/      Navigation, footer, SEO, statusline
    projects/    Project listing components
    ui/          Shared TUI primitives
  layouts/       Public and admin layouts
  lib/
    admin/       Admin data helpers
    auth/        Passwords, sessions, origin checks
    config/      Site and tech-stack config
    db/          Drizzle schema, client, seed, bootstrap
    markdown/    Shared markdown renderer
    validation/  Zod form schemas
  pages/         Astro routes and API endpoints
```

## Security Notes

- Admin password is stored only as an Argon2id hash in environment variables.
- Session tokens are hashed at rest and stored server-side.
- Admin cookies are HttpOnly, SameSite Strict, and secure outside localhost.
- Mutating admin endpoints reject mismatched origins.
- Markdown is sanitized on every render, including admin preview paths.
- Local `.env`, generated databases, Vercel output, and build artifacts are ignored by Git.

## License

Private personal project. All rights reserved unless stated otherwise.
