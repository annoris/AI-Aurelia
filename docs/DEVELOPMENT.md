# Local development

Aurelia AI runs three separately installed Node.js applications alongside a buildless static showcase in `site/`. Run commands from the repository root unless a command uses `--prefix`. Requires **Node.js `>=18`** (the repository pins `v24.22.2` in [`.nvmrc`](../.nvmrc)) and **npm**.

| Application / Target | Directory | Default local port | Responsibility |
| :--- | :--- | :--- | :--- |
| Web client | [`frontend/`](../frontend/) | `3000` | React 18 UI, routes, locale assets, API clients |
| API | [`server/`](../server/) | `3001` | Auth, RBAC, Prisma persistence, RAG, agents, MCP, CRM |
| Document collector | [`collector/`](../collector/) | `8888` | Document, web link, YouTube transcript & audio extraction |
| GitHub Pages sandbox | [`site/`](../site/) | `4176` | Static interactive browser sandbox (`npm run pages:dev`) |

## Check your checkout

```sh
npm run doctor
npm run doctor -- --json
```

`doctor` performs read-only checks for the declared Node minimum, the `.nvmrc` major version pin, installed `node_modules` directories, environment-file presence, the generated Prisma client, and `server/storage/` availability. It does not read credential values, contact providers, validate account permissions, verify migration state, or modify files. A warning is not a successful remote connection test.

## Configure once

Copy the example templates **only when the target file does not exist** (or run `npm run setup:envs`, which uses `cp -n` non-destructively):

| Example | Local target |
| :--- | :--- |
| [`server/.env.example`](../server/.env.example) | `server/.env.development` |
| [`collector/.env.example`](../collector/.env.example) | `collector/.env` |
| [`frontend/.env.example`](../frontend/.env.example) | `frontend/.env` |
| [`docker/.env.example`](../docker/.env.example) | `docker/.env` *(Docker Compose only)* |

Install dependencies in each service directory (or run `npm run setup` on a fresh checkout to install all three services, copy missing `.env` files, and initialize Prisma):

```sh
npm --prefix server install
npm --prefix collector install
npm --prefix frontend install
npm run setup:envs
```

For local development, [`frontend/.env.example`](../frontend/.env.example) points to `http://localhost:3001/api`. When changing the collector port, use matching `COLLECTOR_PORT` values in server and collector configuration. Existing storage and environment files remain authoritative—never overwrite populated `.env` files with examples.

Generate the Prisma client and initialize the local SQLite database when setting up for the first time:

```sh
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
# Or `npm run prisma:setup` to run generate + migrate + seed together
```

Back up a populated database before applying migrations. `doctor` and `dev:local` never reset, migrate, or seed the database automatically.

## Start services

### Full 3-tier application stack

```sh
npm run dev:local
```

`dev:local` launches `server`, `collector`, and `frontend` in parallel, streams prefixed logs, and terminates sibling services cleanly if one exits. You can also start individual services independently:

```sh
npm run dev:server
npm run dev:collector
npm run dev:frontend
```

Do not start duplicate services over occupied ports. `GET /api/ping` verifies that the API server responds; it does not verify model configuration, collector readiness, or external integrations.

### Interactive GitHub Pages showcase (`site/`)

Preview and validate the zero-dependency static showcase without installing service dependencies:

```sh
npm run pages:dev
# Serves http://127.0.0.1:4176

npm run pages:check
# Validates site/ HTML IDs/anchors, CSS url(), JS syntax, SVG assets, README links, and screenshots
```

## Verify a change

Run the root verification and service quality gates appropriate to your change:

```sh
npm run verify         # Runs pages:check + verify:packages + verify:translations
npm run lint:ci        # Runs ESLint checks across server, frontend, and collector
npm test               # Runs Jest unit tests from the repository root
npm run doctor         # Runs read-only Node, dependency, .env & Prisma checks
npm run build:frontend # Builds the production Vite bundle
```

For containerized verification with Docker Compose, use:

```sh
cp -n docker/.env.example docker/.env && docker compose -f docker/docker-compose.yml up -d --build
```

- **Showcase & visual regressions:** Run `npm run screenshots` (requires Google Chrome) to capture all 8 desktop (`1440×900 @2x`) and mobile (`390×844 @2x`) PNG screenshots into [`docs/screenshots/`](screenshots/README.md) with automated DOM and runtime error checks.
- **Error-path & responsive checks:** Exercise both successful and failed requests (ensuring rejected requests never display fabricated records), and check both narrow mobile (`390px`) and desktop (`1440px`) viewports for UI changes.

See [Architecture](ARCHITECTURE.md) for ownership boundaries, [Business connections](INTEGRATIONS.md) for connector workflows, and [Design system](DESIGN_SYSTEM.md) for UI standards.
