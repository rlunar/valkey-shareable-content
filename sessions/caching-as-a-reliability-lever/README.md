# Caching as a Reliability Lever

Slidev deck for DevOpsDays Bogotá, October 26, 2026 (30 minutes, L300). 31 slides, visual first: every concept is a click-driven D3 or CSS diagram, code samples are full-width Monokai inside a macOS Terminal frame, and the explanations live in the speaker notes.

## Run

Requires Node.js 20.19 or later and pnpm.

```bash
pnpm install
pnpm run dev
```

Slidev prints the local URL, normally `http://localhost:3030`. Press `p` for presenter mode; the notes carry `[click]` markers that follow each diagram step. Restart the dev server after editing `setup/shiki.ts` (setup files load at startup).

## Build and export

```bash
pnpm run build
pnpm run export
pnpm run export:clicks
pnpm run export:pptx
```

## Layout

- `slides.md` is the canonical presentation, speaker notes included. No em dashes anywhere, by request.
- `style.css` holds the whole visual system (Valkey palette, Open Sans and Cascadia Code from `valkey-brand/`, header pattern, cards, cover and closing, Terminal frame colors). Slide-level `<style>` blocks are intentionally absent: they are scoped per slide in Slidev.
- `setup/shiki.ts` selects the Monokai theme for all code blocks. Swap to `catppuccin-mocha` or `catppuccin-latte` there if preferred.
- `slide-top.vue` renders the footer (page counter plus logo) and switches to the light logo on dark slides.
- `assets/public/` is the Vite public directory: `flaticon/` (three outline icons from Flaticon via the Magnific MCP server, recolored to Valkey deep purple), `images/` (Freepik stock photo for the Prime Day slide, speaker headshot), `qr/` (LinkedIn and valkey.io QR codes).
- `docs/` keeps the long-form source, run sheet, and earlier drafts.
- Presenter identity defaults are defined in `vite.config.mjs`; copy `.env.example` to `.env` to override them locally.

## Components

All diagrams take a `step` prop and are wired as `<Component :step="$clicks" />` with a matching `clicks:` count in the slide frontmatter, so every click state renders correctly when you jump to a slide or export with `--with-clicks`. Transient motion (particles, count-ups) is skipped in print and export mode.

| Component | Slide | Steps |
| --- | --- | --- |
| `DegradationCascade.vue` | the cascade: six stages in a snake, live gauges, feedback loop, then the cache cuts the chain | 6 |
| `LittlesLawChart.vue` | connections in use = arrivals × service time, pool ceiling, the knee, the cached line | 4 |
| `MentalModelDiagram.vue` | client, Valkey, origin; hit and miss particles; the expected-cost bet | 4 |
| `StrategyFlow.vue` | read-through, write-through, write-behind traces (`scenario` prop); narratives follow `animations/Valkey_Demo_Library` | 5 each |
| `TtlTimeline.vue` | one key over 12 minutes, expiry, delete-on-write; synchronized expiry versus jitter on a log scale | 6 |
| `FailureModeDiagram.vue` | stampede, penetration, avalanche (`mode` prop), each with its fix | 4 each |
| `SemanticCacheDiagram.vue`, `ThresholdDial.vue` | ported verbatim from `sessions/well-architected-on-a-budget` | 5, 2 |
| `FailoverDiagram.vue` | multi-AZ: lose AZ a, fail open to the origin, promote the replica, recover | 5 |
| `GatewayShedDiagram.vue` | cache unavailable: the API gateway rate limits while Valkey warms up | 4 |
| `MetricGauges.vue` | six operating targets as radial gauges | 6 |
| `CostPerMillion.vue` | cost per million reads with and without the cache (illustrative, indexed) | 3 |
| `ThresholdTradeoffChart.vue` | the Bedrock semantic-cache evaluation, savings versus accuracy by threshold | 4 |
| `ImpactBoard.vue` | closing numbers with count-ups | 5 |
| `TerminalWindow.vue`, `StepBar.vue`, `BrandLogo.vue`, `PresenterIdentity.vue` | shared chrome | |

`components/diagram-kit.js` is the shared D3 helper set (palette, node cards, flows with draw-in, particles, pills, gauges, count-ups) that keeps the diagrams in the well-architected visual grammar.

## Sources cited on the slides

- AWS News Blog, All the numbers: Amazon Prime Day 2026, powered by AWS (ElastiCache: 2.3 quadrillion daily requests, 2.1 trillion in a minute).
- AWS Database Blog, Amazon Ads upgrades to Amazon ElastiCache for Valkey (300M+ US audience, 45% lower infrastructure cost, 12% higher throughput, zero downtime).
- AWS Database Blog, Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock (63,796 queries; 86.3% savings, 88.3% lower latency, 91.2% accuracy at threshold 0.75).
- The 55% database cost figure is a workload target from the well-architected deck, not a benchmark; the cost-per-million chart is an illustrative model.
