# IBTO Clone

A pixel-faithful rebuild of [ib-to.org](https://ib-to.org) (Instituto Brasileiro de Treinamento Operacional) on a different stack than the rest of this template's Next.js scaffold, as requested.

## Stack

- **Bun** — package manager & JS/TS runtime for both the frontend tooling and the backend service
- **Vite** — dev server / build for the frontend
- **React 19 + TypeScript** — components (`src/components`)
- **Tailwind CSS v4** — utility styling, design tokens (brand colors, `Audiowide`/`Aleo`/`Poppins` fonts) declared in `src/index.css`
- **TanStack Router** — file-based routes in `src/routes` (`/`, `/quem-somos`, `/areas-de-atuacao`, `/contato`)
- **TanStack Query** — data-fetching hooks in `src/hooks/useContent.ts`, seeded with `initialData` so pages render instantly and revalidate against the API in the background
- **Redis (via `ioredis`)** — `server/` is a small Bun HTTP API that read-through-caches page content in Redis; see below

## Structure

```
shared/content.ts     # single source of truth for real site copy — imported by both frontend and backend
src/routes/           # TanStack Router pages
src/components/       # Header, Footer, Hero, TeamCard, ServiceGrid, etc.
src/hooks/useContent.ts
src/lib/api.ts        # fetch wrappers for the content API
server/               # Bun API + Redis cache
  redisClient.ts       # where the Redis connection is configured
  cache.ts             # getOrSetCache() read-through helper
  index.ts             # Bun.serve() exposing /api/nav and /api/content/:slug
public/images/         # real assets downloaded from ib-to.org (logo, hero, team photos, service badges, social icons)
```

## Running it

Two independent processes — the frontend works standalone even if the API isn't running, since queries fall back to the bundled static content:

```bash
bun install
bun run dev      # Vite dev server on http://localhost:5173
bun run server   # Bun API on http://localhost:3001 (proxied from /api by Vite)
```

No Redis server is required for local dev: `cache.ts` treats any Redis error as a cache miss and serves straight from `shared/content.ts`. Point `REDIS_URL` at a real instance to see it actually cache.

## Content fidelity

All copy, images, team bios, service badges, and links in `shared/content.ts` were extracted directly from the live site's HTML/CSS (fetched via `curl`, since the project's Puppeteer MCP was unavailable this session) — no placeholder text.
