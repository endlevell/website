# Deploying on Vercel

This project uses Astro's Vercel adapter and a libSQL-compatible database.
Vercel serverless functions do not provide persistent local disk, so production
content should live in Turso or another libSQL endpoint.

## Required Vercel environment variables

```txt
SITE_URL=https://endlevel.dev
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
ADMIN_PASSWORD_HASH=$argon2id$...
SESSION_COOKIE_NAME=endlevel_admin_session
```

Local development can use:

```txt
DATABASE_URL=file:./data/site.db
```

## First deploy flow

1. Create a Turso/libSQL database.
2. Add the production environment variables in Vercel.
3. From a local shell with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set,
   run `npm run db:seed` once if you want the starter content.
4. Deploy on Vercel with the default build command: `npm run build`.

The app creates missing tables at runtime before queries run. The seed script is
manual on purpose; Vercel builds should not rewrite production content on every
deploy.

## Local commands

```bash
npm run db:seed
npm run dev
npm run build
```

`npm run preview` starts the Astro dev server for local QA. Astro's Vercel
adapter does not support `astro preview`.
