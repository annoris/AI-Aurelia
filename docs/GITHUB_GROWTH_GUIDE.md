# Aurelia AI — GitHub Growth & Release Guide

Use this checklist when configuring repository discovery metadata, GitHub Pages, social previews, and release publishing for [`annoris/aurelia`](https://github.com/annoris/aurelia).

## 1. Repository Metadata (About Panel)

In **GitHub → Settings / About (gear icon)**:

- **Description (< 160 chars):**
  ```text
  Self-hosted AI automation platform for SMBs & enterprises: RAG workspaces, visual agent flows, MCP tools, local CRM & embed widget.
  ```
  *(133 characters — fits cleanly without truncation on desktop and mobile GitHub search results.)*

- **Website:**
  ```text
  https://annoris.github.io/aurelia/
  ```

- **Topics (15 recommended):**
  ```text
  ai-agents
  rag
  llm
  mcp
  self-hosted
  business-automation
  enterprise-ai
  workflow-automation
  open-source-ai
  document-ai
  crm
  knowledge-base
  vector-database
  react
  nodejs
  ```

- **Include in the home page:** Enable **Releases** and **Packages / Environments** (`github-pages`) as appropriate; keep **Discussions** enabled for community Q&A.

## 2. Repository Settings & Release Checklist

- [ ] **Enable GitHub Pages via GitHub Actions:**
  1. Go to **Settings → Pages**.
  2. Under **Build and deployment → Source**, choose **GitHub Actions**.
  3. Confirm [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) finishes green on `main` and publishes to `https://annoris.github.io/aurelia/`.

- [ ] **Upload Social Preview Image:**
  1. GitHub Social Preview uploads require a `1280×640` PNG or JPG raster image (GitHub Settings does not accept SVG directly for the Open Graph upload field).
  2. Export a `1280×640` PNG from [`.github/assets/banner.svg`](../.github/assets/banner.svg) or [`site/assets/img/og-card.svg`](../site/assets/img/og-card.svg) (or capture at `2x` in Chrome) and upload it under **Settings → General → Social preview**.

- [ ] **Enable GitHub Discussions:**
  1. Go to **Settings → General → Features** and check **Discussions**.
  2. Pin a **Welcome & Architecture Q&A** thread linking to [the live sandbox](https://annoris.github.io/aurelia/) and [`docs/DEVELOPMENT.md`](DEVELOPMENT.md).

- [ ] **Verify CI Branch Protections (Optional / Recommended):**
  1. Confirm [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (`verify` job running script syntax checks, `validate-pages.mjs`, `verifyPackageVersions.mjs`, and `verifyTranslations.mjs`) passes on `main`.
  2. Optionally mark the `verify` check as required in **Settings → Rules / Branches** for pull requests targeting `main`.

- [ ] **Publish Release `v1.19.0`:**
  1. Create an annotated tag `v1.19.0` matching [`package.json`](../package.json) and [`CHANGELOG.md`](../CHANGELOG.md):
     ```bash
     git tag -a v1.19.0 -m "Release v1.19.0: Interactive GitHub Pages showcase, visual docs, and CI"
     git push origin v1.19.0
     ```
  2. In **Releases → Draft a new release**, select `v1.19.0`, set the title to `Aurelia AI v1.19.0 — Interactive Sandbox, Visual Docs & CI`, paste the `1.19.0` section from [`CHANGELOG.md`](../CHANGELOG.md), and publish.

- [ ] **Pin Starter Issues (`good first issue` / `documentation`):**
  1. Open and pin 2–3 well-scoped issues (e.g., adding integration tests for bounded connectors, adding sample workflows for additional SMB verticals, or improving vector adapter setup docs) labeled `good first issue` and `help wanted`.
