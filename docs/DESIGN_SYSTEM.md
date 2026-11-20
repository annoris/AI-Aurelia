# Aurelia AI design system

This is the design contract for Aurelia AI product interfaces ([`frontend/`](../frontend/)) and the interactive GitHub Pages showcase ([`site/`](../site/)). Each screen and state must be inspected and verified before being marked complete.

## Typography

Use the shared `--font-ui` token from [`frontend/src/index.css`](../frontend/src/index.css) and [`site/assets/css/tokens.css`](../site/assets/css/tokens.css): `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Tailwind `font-sans` uses the same stack. Do not introduce a second UI font or load competing display web fonts on individual views. Keep `--font-mono` (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) for code, JSON manifests, embed snippets, identifiers, and tabular metrics (`font-variant-numeric: tabular-nums`).

| Role | Size | Line height | Weight |
| :--- | :--- | :--- | :--- |
| Body, controls, navigation | 14px | 1.5 | 400 or 500 |
| Supporting text and metadata | 12px | 1.5 | 400 or 500 |
| Section title | 18–20px | 1.3 | 600 |
| Page title | 28–36px, responsive | 1.2 | 600 or 700 |

Use standard weights 400, 500, 600, and 700. Avoid synthetic extra-bold text, intermediate 550/650 weights, compressed tracking, and tiny uppercase labels. Interactive text remains legible at 200% zoom. Mobile inputs below `768px` use at least `16px` where needed to prevent browser focus zoom without changing the standard `14px` body scale.

## Color and surfaces

Both the React client and the GitHub Pages showcase support dark and light color schemes with navy/obsidian-slate neutrals and teal primary actions:

- **Showcase Dark Default ([`site/assets/css/tokens.css`](../site/assets/css/tokens.css)):** Obsidian-slate canvas `--bg: #0b1120`, elevated panel `--bg-elevated: #111827`, surface `--surface: #162033`, primary text `--fg: #f8fafc`, muted text `--muted: #94a3b8`, teal accent `--accent: #2dd4bf` (strong `#0f766e` / hover `#115e59`), and brushed gold highlight `--gold: #ddbf80`.
- **Showcase Light Toggle (`[data-theme="light"]`):** Neutral canvas `#f7f8fa`, white surfaces `#ffffff`, navy text `#182230`, muted text `#667085`, borders `#e4e7ec`, teal action `#0f766e` (soft `#f0fdfa`), and brushed gold `#a88443`.
- **Full Application Theme ([`frontend/src/index.css`](../frontend/src/index.css)):** Default dark navy surfaces (`#0f172a` / `#1e293b` / `#111827`) with teal primary actions (`#0f766e` / `#2dd4bf`) alongside `[data-theme="light"]` overrides (`#0f766e` / `#182230`). Respect custom instance palettes—never hardcode competing purple or neon action systems. Use semantic status colors (`--success`, `--warning`, `--danger`) strictly for genuine state feedback.

## Layout and spacing

Use a 4px spacing grid (`4, 8, 12, 16, 24, 32, and 48px`). Related items should have tighter gaps than separate sections. Prefer one clear primary action per section and a consistent hierarchy across sidebar, page header, forms, cards, and empty states.

Use flexible tracks, `min-width: 0`, sensible content widths, and wrapping for long labels. Full-height shells use `100vh` with `100dvh` where supported. Validate at `320`, `390`, `768`, and `1440` CSS pixels (`scrollWidth <= innerWidth`). Never disable zoom or clip overflowing content to hide a layout defect. Respect safe areas and avoid automatic focus shifts that jump or zoom mobile viewports.

## Icons and interaction

Use Phosphor icons (`@phosphor-icons/react`) consistently in `frontend/` and crisp inline SVGs in `site/`. Standard icon sizes are `16`, `20`, and `24px`. Never render raw standard OS emojis in template lists, sidebar items, or buttons. Icon-only buttons must carry accessible names (`aria-label`). Use real links for navigation and real buttons for actions, enforce `44px` minimum touch target heights on mobile controls, provide visible `:focus-visible` rings, lock background regions with `inert` when mobile drawers open, support `Escape` dismissal on `<dialog>` overlays, and honor `@media (prefers-reduced-motion: reduce)`.

Loading, empty, unavailable, configured, error, and success are distinct states and must remain distinguishable without relying solely on color.

## Truthful product behavior

Show saved configuration as configuration, not verified connectivity. Never fabricate active channels, customers, qualification scores, revenue, savings, usage metrics, or outbound delivery. Sample/demo datasets (including the deterministic `site/` sandbox) must be explicitly labeled as sample records. Never populate real failure states with placeholder records.

Confirm mutations only after the server confirms persistence. Preserve user input when a request fails, display a visible error, and provide a real retry path. Describe unsupported or draft-only capabilities plainly—never imply an external email, calendar booking, or CRM writeback happened when only a local draft or record was saved.

## Implementation and QA gates

1. Inspect the current source, shared tokens, existing routes, permissions, and data contracts before editing. Assign file ownership when work is delegated.
2. Apply shared tokens and reusable patterns first, then page layout and details. Preserve existing data, identifiers, security boundaries, and custom instance settings.
3. Run the relevant lint, verification, and build checks (`npm run verify`, `npm run lint:ci`, `npm run build:frontend`). Use meaningful behavior tests for data, permissions, and error paths; compilation alone does not prove UX correctness.
4. Open revised routes directly, including lazy routes, to verify CSS loads independently. Inspect computed font family, size, weight, color, and layout.
5. Verify desktop (`1440×900`) and mobile (`390×844`) screenshots from the live current build (or run `npm run screenshots` for `site/`). Check zero horizontal overflow, readable wrapping, navigation, dialogs, keyboard focus, loading, empty, failure/retry, and dark/light themes.
6. Report only observed results, exact commands, viewport sizes, and limitations. Fix failed checks or report blockers clearly.
