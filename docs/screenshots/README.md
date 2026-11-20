# Aurelia AI Screenshot Suite

This directory holds the 8 automated live-rendered screenshots of the **Aurelia AI — Interactive Browser Sandbox & Showcase** ([`site/`](../../site/)), captured over headless Google Chrome DevTools Protocol (CDP) by [`scripts/capture-screenshots.mjs`](../../scripts/capture-screenshots.mjs).

Every workspace, document excerpt, workflow trace, MCP manifest, CRM lead, and connection slice displayed across these images is rendered deterministically client-side from multi-industry SMB & enterprise sample records in [`site/assets/js/data.js`](../../site/assets/js/data.js) with zero external API requests or backend credentials.

## Captured Screenshots

| File | Viewport | Pixel Dimensions | Captured State & Target | Visual Focus |
| :--- | :--- | :--- | :--- | :--- |
| [`01-welcome-showcase.png`](01-welcome-showcase.png) | `1440×900` (`@2x`) | `2880×1800` | `#welcome` at scroll `y = 0` | `#0b1120` obsidian-slate header, multi-industry editorial hero (`Put your business knowledge to work with full control.`), capability pills, and live `AURELIA / SANDBOX SNAPSHOT` card with 7-day SVG query bar chart and citation pills. |
| [`02-command-overview.png`](02-command-overview.png) | `1440×900` (`@2x`) | `2880×1800` | `#workspace-shell` (`#view=overview`) | Sandbox status banner, 4-workspace switcher (`Sales & Proposals`, `24/7 Customer Support`, `Clinic & Booking`, `Operations & SOPs`), 4 executive KPI cards, `7-Day Workspace Query Telemetry` SVG bar chart, and `Knowledge Coverage & Vector Grounding` radial ring (`75% GROUNDED`). |
| [`03-workspace-rag-chat.png`](03-workspace-rag-chat.png) | `1440×900` (`@2x`) | `2880×1800` | `#workspace-shell` (`#view=chat`) | Grounded assistant thread with clickable citation chips, expanded `Source Chunk: Service-Catalog-2026.pdf` excerpt card, suggested prompt chips, live message composer, and toggleable `Workspace Context` drawer (`3 Attached`, `1 Library`). |
| [`04-workflow-builder.png`](04-workflow-builder.png) | `1440×900` (`@2x`) | `2880×1800` | `#workspace-shell` (`#view=workflows`) | 3-column `Visual Agent Flows` studio (`4 flows` presets, 5 connected pipeline nodes with `Done · 95ms`–`75ms` badges, `Node Inspector` inputs, and completed `Execution Trace & Output` JSON console at `1205ms`). |
| [`05-agents-mcp-registry.png`](05-agents-mcp-registry.png) | `1440×900` (`@2x`) | `2880×1800` | `#workspace-shell` (`#view=agents`, scrolled to `#agents-skills-panel`) | 8 toggleable `Agent Skills & Permission Guardrails` cards (`5 of 8 active`, with `Strict Citation Grounding` toggled `OFF`), paired with `MCP Server Integrations` (`3 of 4 compiled`) and live-compiled `aurelia_mcp_servers.json` preview. |
| [`06-crm-lead-modal.png`](06-crm-lead-modal.png) | `1440×900` (`@2x`) | `2880×1800` | `<dialog id="lead-modal">` open from `#view=crm` | Centered native `<dialog>` over blurred dark backdrop inspecting `Northstar Cold Logistics` (`pnair@northstarcold.example`), 8 metadata grid cells, editable `Pipeline Stage` selector, intake notes, and `Draft only — not sent` AI follow-up box with `Regenerate Draft` and `Copy Draft`. |
| [`07-connections-models.png`](07-connections-models.png) | `1440×900` (`@2x`) | `2880×1800` | `#workspace-shell` (`#view=connections`) | Channel bridge cards (`Telegram Bot Bridge`, `Gmail / Outlook Draft Bridge`, `Website Chat Embed`), `Google Drive Manual Import` folder browser, `HubSpot Contact Batch Import` (`Batch Limit: 50` preview table), and live `Website Chat Embed Customizer` with copyable `<script>` snippet. |
| [`08-mobile-responsive.png`](08-mobile-responsive.png) | `390×844` (`@2x`) | `780×1688` | Mobile reload at `#view=overview` | Compact mobile sticky header (`AURELIA AI`, theme toggle, `#mobile-nav-btn`), stacked sandbox banner, wrapping workspace pills, horizontal touch-scrollable view strip, and zero horizontal overflow (`scrollWidth <= innerWidth`). |

## Automated Smoke Checks During Capture

Running `npm run screenshots` executes live headless Chrome CDP assertions before saving each PNG:

1. **Welcome & Desktop Header Responsive Check:** Verifies `#welcome`, `#hero-preview-card`, hero SVG elements, desktop header visibility (`#mobile-nav-btn` hidden, `#header-launch-cta` visible), and `scrollWidth <= innerWidth`.
2. **Overview & SVG Charts:** Confirms executive KPI cards (`>= 3`) and both SVG data visualizations (`7-Day Workspace Query Telemetry` and `Knowledge Coverage & Vector Grounding`) render cleanly within the viewport.
3. **Grounded RAG Chat & Citation Excerpt:** Triggers a prompt suggestion / query, confirms a new assistant response renders, expands `.citation-excerpt`, and verifies all `>= 4` workspace context document cards are present.
4. **Visual Workflow Simulation:** Clicks **Simulate Flow Run**, asserts all 5 `.flow-node` blocks complete (`is-running` cleared), and verifies `.flow-console` updates with a completed trace inside the viewport.
5. **Agent Skills & Live MCP Compilation:** Toggles a skill `.toggle-switch` (`ON` ↔ `OFF`) and verifies live state updates and recompilation of `#agents-mcp-section pre` (`aurelia_mcp_servers.json`).
6. **CRM Lead Inspection Modal:** Opens `<dialog id="lead-modal">` from the CRM table, verifies zero horizontal clipping across `.dialog-meta-cell` blocks and visible draft actions, and confirms `Escape` closes the modal cleanly.
7. **Connections & Embed Customizer:** Selects the `50 Contacts` HubSpot batch slice, confirms `.data-table-wrap` renders without horizontal overflow, and verifies live `#embed-preview-region pre` snippet visibility.
8. **Theme Toggle & Mobile Drawer Accessibility:** Toggles `#theme-toggle` (`dark` → `light` → `dark`), reloads at `390×844 @2x`, asserts `#mobile-drawer` starts hidden, verifies opening `#mobile-nav-btn` applies `#main-content.inert = true` and closing restores `inert = false`, and enforces `scrollWidth <= innerWidth`.
9. **Zero Runtime Errors:** Fails immediately on any `Runtime.exceptionThrown` or `console.error` event.

## Regenerating Screenshots

Ensure **Node.js `>=18`** and **Google Chrome** are available (set `CHROME_PATH` if Chrome is installed outside `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`):

```bash
npm run screenshots
```
