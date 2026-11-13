# Slidev deck — Caching as a Reliability Lever

DevOpsDays Bogotá 2026 · Roberto Luna Rojas · Valkey project, AWS

This folder holds the Slidev version of the talk plus the D3 diagram components. The Marp version and export instructions live one level up in `artifacts/`.

## Layout

```
slidev/
├── README.md                 ← this file
├── slides.md                 ← copy devopsdays_bogota_caching_slidev.md here as slides.md
└── components/               ← auto-imported Slidev Vue components
    ├── CascadeFlow.vue            (slide: The degradation cascade)
    ├── PoolKneeChart.vue          (slide: The pool math, with numbers)
    ├── SemanticFlowDiagram.vue    (slide: Semantic caching: how it works)
    └── ThresholdTradeoffChart.vue (slide: Case study — semantic cache with Bedrock)
```

The deck markdown currently lives at `../devopsdays_bogota_caching_slidev.md`. Copy or symlink it into this folder as `slides.md` so the Slidev CLI and the `components/` auto-import work together.

## Setup

```
npm init slidev@latest        # or: npm i -g @slidev/cli
npm i d3                       # D3 is required by the diagram components
```

Place the four `.vue` files in `components/`. Slidev auto-imports any component in that folder by filename, so `<CascadeFlow />`, `<PoolKneeChart />`, `<SemanticFlowDiagram />`, and `<ThresholdTradeoffChart />` are usable in the slides with no import line.

## Wiring a diagram into its slide

The components are stubs: the Vue + D3 + `$clicks` wiring is done, the drawing logic is marked `TODO` per the D3 SPEC in each slide's speaker notes. To use one, drop the component tag into the matching slide and set that slide's `clicks:` count so navigation knows how many build steps it holds.

| Component | Slide | `clicks:` |
|-----------|-------|-----------|
| `CascadeFlow` | The degradation cascade | 6 |
| `PoolKneeChart` | The pool math, with numbers | 5 |
| `SemanticFlowDiagram` | Semantic caching: how it works | 5 |
| `ThresholdTradeoffChart` | Case study — semantic cache with Bedrock | 5 |

Example slide header:

```md
---
clicks: 6
---

# The degradation cascade

<CascadeFlow />
```

Each component reads Slidev's injected `$clicks` via `useSlideContext()` and re-runs `draw(clicks)` on mount and on every click change, so the D3 build advances in lockstep with the slide's clicks. Keep the existing markdown text/table on the slide as a fallback until the component is implemented, then remove or hide it.

## Run

```
slidev slides.md               # dev server at http://localhost:3030, press "p" for presenter
```

Presenter mode shows the speaker notes (including the D3 SPEC blocks) and a next-slide preview.

## Export

See `../devopsdays_bogota_deck_export_instructions.md` for the full export matrix. In short: `slidev export slides.md --format pdf --with-clicks` keeps the click builds as pages; `--format pptx --with-clicks` for PowerPoint. Export needs `npm i -D playwright-chromium` once.

## Palette (official Valkey hexes)

ValkeyPurple `#30176E` · ValkeyRed `#642637` · ValkeyBlue `#6983FF` · ValkeyBlack `#1A2026` · ValkeyLavender `#BCB5E7` · ValkeyPink `#E0A2AF` · ValkeyWhite3 `#F7FBFE`. The components already use these constants; keep any new visuals on the same palette.

## Note on QA

The D3 animations run in the browser (Slidev/Vue). They can't be rendered or screenshot headlessly from the authoring environment, so preview and visually QA them with `slidev slides.md` locally before presenting.
