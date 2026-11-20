# Running Aurelia AI on Bare Metal (Without Docker)

> [!WARNING]
> Bare-metal deployment is provided as a reference for advanced administrators.
> You are responsible for process supervision, TLS termination, firewalling,
> and securing `server/storage/` and `.env` files on your host.

This guide documents how to build and run **Aurelia AI** directly on a Linux or
macOS server using Node.js and npm without Docker.

## Minimum Requirements

> [!TIP]
> Provision at least **2 GB of RAM** and **10 GB+ of disk storage** (more if
> storing large document corpora, vector indexes, or local embedding/LLM models).

- **Node.js `>=18.12.1`** (`.nvmrc` pins `v24.22.2` for reproducible builds)
- **npm** (bundled with Node.js)
- **Git**

## Initial Installation

1. Clone the repository from the `main` branch:

   ```bash
   git clone https://github.com/annoris/aurelia.git
   cd aurelia
   ```

2. Install dependencies for all three services (`server`, `collector`, and `frontend`):

   ```bash
   npm --prefix server install
   npm --prefix collector install
   npm --prefix frontend install
   ```

3. Create your environment files from the templates:

   ```bash
   cp -n server/.env.example server/.env
   cp -n collector/.env.example collector/.env
   cp -n frontend/.env.example frontend/.env
   ```

4. Configure `server/.env` with an explicit persistent `STORAGE_DIR`:

   ```env
   STORAGE_DIR="/absolute/path/to/aurelia-ai/server/storage"
   ```

5. Configure `frontend/.env` so the browser reaches the API through `/api` when served behind the server or a reverse proxy:

   ```env
   # VITE_API_BASE="http://localhost:3001/api" # Local split-port development only
   VITE_API_BASE="/api"
   ```

## Building and Starting in Production

Aurelia AI consists of three components: `frontend` (compiled static assets),
`server` (API + SSR frontend host), and `collector` (document/web/YouTube ingestion).

1. Build the production frontend bundle:

   ```bash
   npm run build:frontend
   ```

2. Copy the built frontend bundle into `server/public`:

   ```bash
   rm -rf server/public
   cp -R frontend/dist server/public
   ```

3. Generate the Prisma client and apply production database migrations:

   ```bash
   npm run prisma:generate
   npm --prefix server exec -- prisma migrate deploy --schema=./prisma/schema.prisma
   ```

4. Start the `server` and `collector` processes (or manage them with `systemd` / `pm2`):

   ```bash
   (cd server && NODE_ENV=production node index.js) &
   (cd collector && NODE_ENV=production node index.js) &
   ```

5. Open `http://localhost:3001` (or your reverse-proxied domain) to verify Aurelia AI is online.

## Updating a Bare-Metal Deployment

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$HOME/aurelia-ai"
cd "$APP_DIR"

git fetch origin main
git pull --ff-only origin main
echo "Updated HEAD to $(git log -1 --pretty=format:'%h')"

echo "Flushing runtime environment state"
curl -fsS -I "http://localhost:3001/api/env-dump" | head -n 1 || true

echo "Installing dependencies and rebuilding frontend"
npm --prefix frontend install
npm run build:frontend

rm -rf server/public
cp -R frontend/dist server/public

echo "Stopping existing Aurelia AI processes"
pkill -f "node index.js" || true

echo "Updating collector and server dependencies"
npm --prefix collector install
npm --prefix server install
npm run prisma:generate
npm --prefix server exec -- prisma migrate deploy --schema=./prisma/schema.prisma

echo "Starting production services"
mkdir -p "$APP_DIR/logs"
(cd "$APP_DIR/server" && NODE_ENV=production node index.js) > "$APP_DIR/logs/server.log" 2>&1 &
(cd "$APP_DIR/collector" && NODE_ENV=production node index.js) > "$APP_DIR/logs/collector.log" 2>&1 &
```

## Reverse Proxy with Nginx (WebSocket & Streaming Support)

Agent invocations use WebSockets and LLM responses use HTTP streaming, so
buffering must be disabled and `Upgrade` headers forwarded:

```nginx
server {
  listen 80;
  server_name your-domain.example.com;

  # WebSocket support for agent invocations
  location ~* ^/api/agent-invocation/(.*) {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
  }

  location / {
    proxy_connect_timeout 605;
    proxy_send_timeout    605;
    proxy_read_timeout    605;
    send_timeout          605;
    keepalive_timeout     605;

    # Enable real-time HTTP streaming for LLM responses
    proxy_buffering off;
    proxy_cache off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:3001;
  }
}
```
