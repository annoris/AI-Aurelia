# Architecture and module boundaries

Aurelia AI runs as three decoupled Node.js applications—a React 18 web client, an Express API with Prisma, and a document collector—alongside a standalone static interactive showcase (`site/`) published via GitHub Pages. Each runtime service has its own dependencies and start commands. See [Local development](DEVELOPMENT.md) for setup, commands, and default ports.

## Source map

| Path | Responsibility |
| :--- | :--- |
| [frontend/src/](../frontend/src/) | React 18 routes, pages, shared components, browser state, locale schemas, and API clients (`:3000`) |
| [server/index.js](../server/index.js) | Express application startup and endpoint registration (`:3001`) |
| [server/endpoints/](../server/endpoints/) | HTTP request handling, embed management, MCP routes, and endpoint authorization |
| [server/middleware/](../server/middleware/) | Shared request middleware |
| [server/models/](../server/models/) | Application persistence access |
| [server/prisma/](../server/prisma/) | Prisma SQLite schema, migrations, and seed configuration |
| [server/domain/](../server/domain/) | Enterprise domain modules (local CRM leads, pipeline stages, quotes, and channel catalog) |
| [server/services/](../server/services/) | Integration catalog and bounded Google Drive / HubSpot import services |
| [server/utils/](../server/utils/) | Model providers (`AiProviders/`), embedding engines (`EmbeddingEngines/`), vector stores (`vectorDbProviders/`), agents, and MCP tooling |
| [server/jobs/](../server/jobs/) | Scheduled and background job implementations |
| [collector/](../collector/) | Document, web link, YouTube transcript, raw-text, and audio extraction service (`:8888`) |
| [site/](../site/) | Zero-dependency HTML5 / CSS3 / modular ES interactive browser sandbox for GitHub Pages |
| [docker/](../docker/) | Multi-arch container build (`Dockerfile`), Compose stack (`docker-compose.yml`), and usage guide |
| [scripts/](../scripts/) | Local diagnostics (`doctor.mjs`), 3-service launcher (`dev-local.mjs`), Pages preview (`serve-pages.mjs`), static validator (`validate-pages.mjs`), and headless Chrome screenshots (`capture-screenshots.mjs`) |
| [extras/](../extras/) | Shared dependency alignment checks (`verifyPackageVersions.mjs`) and translation utilities (`translator/`) |
| [.github/](../.github/) | CI and GitHub Pages workflows, issue/PR templates, and README header banner asset |

## Request and document flow

The web client calls the API through its frontend model modules. The Express API applies authentication and role-based authorization, reads or writes application records via Prisma, and invokes model, agent, MCP, or integration services as needed. Provider credentials and outbound provider requests belong strictly on the server.

For document ingestion, the API coordinates with the collector through [server/utils/collectorApi/](../server/utils/collectorApi/). The collector extracts clean text and metadata from supported inputs (PDF, DOCX, XLSX, PPTX, TXT, Markdown, web links, YouTube transcripts, and audio). Adding library documents to a workspace is a separate step that chunks text, computes embeddings, and writes vectors to the configured vector store (LanceDB by default) for retrieval during chat. Importing a file to the document library alone does not make it available to a workspace until explicitly attached.

The database schema and migrations live under [`server/prisma/`](../server/prisma/). Runtime files live under `server/storage/` and `collector/storage/`; these directories contain private documents, SQLite databases, local credentials, and generated indexes. Environment files supply local configuration—keep runtime storage and real `.env` files out of version control.

The [`site/`](../site/) directory provides an isolated, buildless interactive browser sandbox backed exclusively by deterministic client-side sample data (`site/assets/js/data.js`) for GitHub Pages visitors, without touching `server/`, `collector/`, or external model APIs.

## Change ownership

Keep endpoint handlers focused on request validation, authorization, calling services, and translating results into HTTP responses. Put provider adapters and bounded import operations in [`server/services/`](../server/services/), and shared enterprise behavior in [`server/domain/`](../server/domain/). Reuse existing persistence models and provider abstractions rather than duplicating them in UI code.

Frontend pages own presentation and interaction; shared components and frontend model modules provide reusable controls and API access. Follow the [frontend implementation rules](../frontend/AGENTS.md) and [design system](DESIGN_SYSTEM.md) when changing product interfaces.

The integration catalog describes configuration; explicit provider checks establish verified access. Preserve visible failures and report confirmed persistence results. See [Business connections](INTEGRATIONS.md) for implemented connectors, limits, and credential handling.

## Verification

Run `npm run doctor` for non-destructive local prerequisite diagnostics and `npm run verify` to validate [`site/`](../site/), [`README.md`](../README.md), [`docs/screenshots/`](screenshots/README.md), shared package versions, and locale schemas. Follow the checks in [Local development](DEVELOPMENT.md) for the services and behavior changed. A diagnostic, static check, or build does not establish live provider connectivity; that requires an explicit authorized provider check.
