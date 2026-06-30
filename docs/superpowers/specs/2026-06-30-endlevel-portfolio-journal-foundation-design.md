# Endlevel Portfolio + Journal Foundation Design

Date: 2026-06-30

## Scope

Build phase 1 of the personal portfolio and journal site. This phase establishes the Astro 6 app foundation, Nord/TUI design system, public read paths, SQLite data layer, shared markdown rendering, SEO/RSS/sitemap basics, Docker shell, and seed content.

Admin authentication, CRUD forms, uploads, preview endpoints, rate limiting, and full CSP hardening are intentionally deferred to phase 2. The schema includes `admin_sessions` now so the later auth phase has a stable migration path.

## User Identity And Static Config

The site owner is `endlevel`.

Static config lives in `src/lib/config/` and is version-controlled, not admin-managed:

- Display name: `endlevel`
- GitHub name: `endlevell`
- GitHub URL: `https://github.com/endlevell`
- Email: `me@endlevel.dev`
- Discord: `endlevel`
- Domain placeholder: `https://endlevel.dev`
- Tagline: `a passionate tech enthusiast`
- Bio: high school student with strong interest in Linux, DevOps, sysadmin work, software engineering, and low-level programming. The copy should keep the user's "tinkerer" voice, polished for public presentation.
- Languages: C, C++, C#, Rust, Go, Python, JavaScript, TypeScript, Lua, Java, Kotlin
- Systems: Arch Linux, Void Linux, Nix
- Android: POCO F3 running PixelOS A16 QPR2

Seed projects will be credible placeholders based on Linux, sysadmin, and low-level interests. They must be clearly editable and not presented as inflated professional claims.

## Architecture

Use one Astro 6 codebase with TypeScript strict mode and the `@astrojs/node` adapter in standalone mode. The default output is static where possible; DB-backed public pages use `export const prerender = false`.

Public routes in phase 1:

- `/`
- `/projects`
- `/projects/[slug]`
- `/blog`
- `/blog/[slug]`
- `/blog/tags/[tag]`
- `/rss.xml`
- `/404`
- `/robots.txt`
- sitemap through `@astrojs/sitemap`

Core directories:

- `src/components/ui/` for `TerminalWindow`, `Caret`, `Button`, `Badge`, empty states, and markdown presentation.
- `src/components/layout/` for nav, footer, shell, and SEO.
- `src/components/home/`, `src/components/projects/`, and `src/components/blog/` for page-specific display components.
- `src/lib/db/` for Drizzle schema, client, query helpers, migrations, and seed data.
- `src/lib/markdown/` for one shared renderer.
- `src/lib/config/` for typed owner/site/stack config.

No CSS framework is used because the brief requires handwritten CSS custom properties and Astro scoped component styles. Public pages ship no hydrated UI islands. The only public JavaScript is the small Lenis/typewriter polish layer and Astro's `<ClientRouter />`.

## Design System

The visual language is TUI x Nord, dark-only. Canonical Nord tokens are defined once in global CSS and all component styles consume semantic custom properties. Raw hex values outside the token file are not allowed except where a third-party package requires them.

Typography is monospace everywhere through Astro's native Fonts API with a self-hosted JetBrains Mono-compatible font. Line height should be generous, around 1.6 to 1.7, because monospace body text is dense.

Primary motifs:

- Terminal chrome wrapper with a title/path line such as `~/projects`.
- Command nav with labels like `$ projects`, `$ blog`, `$ github`.
- Blinking caret implemented with CSS animation and a reduced-motion fallback.
- `ls`-style project and post listings instead of card-heavy grids.
- Sparing box-drawing dividers for section boundaries.
- A shell-session 404 page with a real 404 status.

The home page uses an asymmetric terminal/workbench layout rather than a centered hero. Mobile collapses to one readable column with no horizontal scrolling.

## Data Model

Use SQLite through `better-sqlite3` and Drizzle ORM. Tables:

- `projects`
- `posts`
- `admin_sessions`

Projects include slug, title, summary, markdown body, JSON-encoded tech tags, repo/live URLs, cover image path, featured flag, sort order, status, and timestamps.

Posts include slug, title, excerpt, markdown body, cover image path, JSON-encoded tags, published flag, published date, and timestamps.

The SQLite file is ignored by git. A seed script inserts:

- 4 starter projects
- 3 starter posts

Seed content should make public templates useful immediately without pretending to be final portfolio history.

## Markdown

One shared renderer handles every markdown-to-HTML conversion:

`remark-parse` -> `remark-gfm` -> `remark-rehype` -> `@shikijs/rehype` with the `nord` theme -> `rehype-sanitize` -> `rehype-stringify`

The renderer is server-side only in phase 1. `rehype-sanitize` always runs, including future admin preview calls. Malicious payloads such as `<script>`, event handler attributes, and `javascript:` links must render inert.

## SEO And Feeds

Use one `SEO.astro` component for title, description, canonical URL, Open Graph, Twitter card, and optional JSON-LD.

Home page gets `Person`/`ProfilePage` JSON-LD. Blog post pages get `BlogPosting` JSON-LD with author, `datePublished`, and `dateModified`.

RSS includes published posts only. Sitemap excludes `/admin/*` and `/api/*`. `robots.txt` disallows `/admin` and `/api`.

## Motion

Use Lenis from the maintained `lenis` package with `autoRaf: true`. Skip initialization when `prefers-reduced-motion: reduce` matches.

Use Astro `<ClientRouter />` for page transitions. Keep transitions subtle and terminal-like. Typewriter text and caret animation must respect reduced-motion and show final text immediately when motion is reduced.

## Security And CSP Notes

Phase 1 includes baseline safe defaults:

- Strict TypeScript.
- Sanitized markdown output.
- No third-party scripts.
- No admin routes implemented yet.
- No secrets committed.
- `.env.example` documents required values.

Astro's current CSP documentation notes limitations with `<ClientRouter />`. Phase 1 keeps `<ClientRouter />` for the requested page transitions. Phase 2 hardening must choose one of these paths:

- Keep `<ClientRouter />` and accept the documented native CSP limitation.
- Remove `<ClientRouter />` and enable stricter native CSP.

Shiki's inline token styles require `style-src 'unsafe-inline'` if a strict CSP is later added while keeping Shiki. `script-src` should remain strict and hash-based.

## Errors And Empty States

Missing project or post slugs return the real 404 page. Empty project/post lists render terminal-style empty states with plain links to relevant sections. Markdown render failures return a safe fallback message and log the server-side error without exposing stack traces.

## Verification

Phase 1 must pass:

- `astro check`
- `npm run build`
- malicious markdown smoke test
- RSS output smoke test
- sitemap and robots exclusion check
- JS-disabled navigation check
- contrast check for Nord muted text on actual backgrounds

## Documentation Checked

The design depends on the current docs for these APIs:

- Astro Fonts API: https://docs.astro.build/en/guides/fonts/
- Astro view transitions and `ClientRouter`: https://docs.astro.build/en/guides/view-transitions/
- Astro on-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/
- Astro Node adapter: https://docs.astro.build/en/guides/integrations-guide/node/
- Astro CSP config: https://docs.astro.build/en/reference/configuration-reference/#securitycsp
- Shiki rehype package: https://shiki.style/packages/rehype
- Drizzle SQLite guide: https://orm.drizzle.team/docs/sqlite/get-started-sqlite

## Open Decisions

No open design decisions remain for phase 1. The user approved:

- Phase split with foundation first.
- Shiki with relaxed `style-src` if CSP is added later.
- Self-hosted Docker and Caddy target.
- Placeholder domain `endlevel.dev`.
