# Changelog

All notable changes to **Aurelia AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.19.0] - 2026-11-19

### Added

- **GitHub Pages Showcase & Automated Deployment**: Added the static showcase site in `site/`, local preview and validation scripts (`scripts/serve-pages.mjs`, `scripts/validate-pages.mjs`, `scripts/capture-screenshots.mjs`), and automated Pages deployment in `.github/workflows/pages.yml`.
- **Continuous Integration Workflow**: Added `.github/workflows/ci.yml` to syntax-check repository scripts, validate the GitHub Pages showcase, verify shared dependency alignment between `server` and `collector`, and validate all frontend locale schemas on every push and pull request.
- **Community & Governance Standards**: Added `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`, updated GitHub issue forms in `.github/ISSUE_TEMPLATE/`, and standardized `.github/FUNDING.yml`.

### Changed

- **Repository Hygiene & Package Normalization**: Normalized metadata (`repository`, `bugs`, `homepage`) and added discoverability keywords across root, `frontend`, `server`, and `collector` `package.json` manifests; replaced legacy `yarn` scripts with standardized `npm` and `node` commands (`npm run setup`, `npm run dev:local`, `npm run doctor`, `npm run verify`, `npm run pages:dev`).
- **Platform Documentation**: Rewrote `CONTRIBUTING.md`, `SECURITY.md`, `BARE_METAL.md`, and updated `docker/HOW_TO_USE_DOCKER.md` to reference `annoris/aurelia`, the `main` branch, npm workflows, and Docker Compose builds.
- **Collector YouTube Ingestion**: Consolidated YouTube transcript extraction in `collector/utils/extensions/YoutubeTranscript/YoutubeLoader/index.js` around `youtube-transcript-plus` and `youtubei.js`.
- **Hardened Repository Configuration**: Refined `.gitignore`, `.editorconfig`, and `.gitattributes` with binary asset rules and clean secret/runtime exclusions.

### Removed

- Removed legacy and broken `.github/workflows/*.yaml` automation files, empty submodule placeholders (`browser-extension/`, `embed/`, `.gitmodules`), internal draft/review docs, duplicate asset folders, and OS metadata (`.DS_Store`) files.

[Unreleased]: https://github.com/annoris/aurelia/compare/v1.19.0...HEAD
[1.19.0]: https://github.com/annoris/aurelia/releases/tag/v1.19.0
