# Full Stack on Cloudflare (Course Playground)

A pnpm monorepo for building a full-stack Cloudflare Workers app.

At a high level:

- **`data-service`**: an edge backend that resolves “smart links” and tracks clicks (Durable Objects + Queues), with optional destination evaluation (Workflows).
- **`user-application`**: a React dashboard + a Worker backend (tRPC/Hono) that talks to `data-service` via a Cloudflare **service binding**.
- **`@repo/data-ops`**: shared database schema/queries and Zod schemas (used by both apps).

## Monorepo layout

```
apps/
	data-service/        # Cloudflare Worker (backend)
	user-application/    # Vite React app + Worker (frontend + BFF)
packages/
	data-ops/            # Shared DB/queries/zod schemas
```

## Tech stack (what you’ll see here)

- Cloudflare Workers (Wrangler)
- Hono
- Durable Objects, Queues, Workflows
- D1 (SQLite), KV, R2
- React + Vite + TanStack Router/Query
- tRPC
- Zod

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- pnpm
- Cloudflare Wrangler authenticated (`wrangler login`)

## Setup

Install dependencies from the repo root:

```bash
pnpm install
```

Build the shared package once (both apps depend on it):

```bash
pnpm build-package
```

If you change code in `packages/data-ops`, re-run the build.

## Local development

Run the backend Worker:

```bash
pnpm dev-data-service
```

Run the frontend dashboard (Vite on port 3000):

```bash
pnpm dev-frontend
```

### Tests

```bash
pnpm --filter data-service test
pnpm --filter user-application test
```

## Deploy

Both apps define `stage` and `production` environments in their `wrangler.jsonc`.

Deploy the backend first (the frontend references it via service binding):

```bash
pnpm --filter data-service stage:deploy
pnpm --filter data-service production:deploy
```

Then deploy the frontend Worker:

```bash
pnpm --filter user-application stage:deploy
pnpm --filter user-application production:deploy
```

## Cloudflare bindings (where to look)

- `data-service` bindings are defined in `apps/data-service/wrangler.jsonc` and include:

  - D1 (`DB`), KV (`CACHE`), R2 (`BUCKET`)
  - Queues (`QUEUE`) + consumers
  - Durable Objects (`EVALUATION_SCHEDULER`, `LINK_CLICK_TRACKER_OBJECT`)
  - Workflow binding (`DESTINATION_EVALUATION_WORKFLOW`)
  - Workers AI (`AI`) and Browser rendering (`VIRTUAL_BROWSER`) bindings

- `user-application` bindings are defined in `apps/user-application/wrangler.jsonc` and include:
  - D1 (`DB`)
  - service binding to `data-service` (`BACKEND_SERVICE`)
  - static assets binding (`ASSETS`) configured as an SPA

## Type generation

When you change Cloudflare bindings, regenerate types:

```bash
pnpm --filter data-service cf-typegen
pnpm --filter user-application cf-typegen
```

## Useful commands

- Build shared package: `pnpm build-package`
- Dev backend: `pnpm dev-data-service`
- Dev frontend: `pnpm dev-frontend`
- Deploy backend: `pnpm --filter data-service stage:deploy` / `production:deploy`
- Deploy frontend: `pnpm --filter user-application stage:deploy` / `production:deploy`
