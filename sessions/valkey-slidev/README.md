# Valkey Slidev capability demo

A 36-slide, Valkey-branded demonstration of [Slidev](https://sli.dev). The deck imports canonical fonts, imagery, and official logo artwork from the repository's `valkey-brand/ValkeyDesignSystem` directory; the production build bundles those assets into `dist/`.

The deck demonstrates:

- A three-column foundation slide covering the Redis OSS 7.2.4 fork, Linux Foundation governance, and community stewardship, revealed one tile per click
- An animated opening constellation of all 21 organizations on the current Valkey participants page
- Click builds and motion variants
- Dynamic Shiki line highlighting and Magic Move
- Offline X-style post cards and live `<Tweet>` syntax
- Mermaid diagrams and a click-driven cache-aside trace
- A D3.js three-tier architecture with progressive presentation, application, and data tiers
- A custom cluster morph that scales out from 3 shards / 9 nodes to 4 shards / 12 nodes and back again, including animated slot redistribution in both directions
- Addon samples for animated text, window mockups, and captioned STEM figures
- A complete 19-slide gallery of every built-in Slidev layout, with the layout type shown in every title
- Route links, Vue components, presenter notes, and export-ready local assets

The participant slide preserves the current ordering from `https://valkey.io/participants/`. Twelve logos are bundled from `valkey-brand/ValkeyDesignSystem/assets/participants`; nine newer organizations use their exact valkey.io image URLs and retain visible text labels as fallbacks.

The layout gallery covers `center`, `cover`, `default`, `end`, `fact`, `full`, `image`, `image-left`, `image-right`, `iframe`, `iframe-left`, `iframe-right`, `intro`, `none`, `quote`, `section`, `statement`, `two-cols`, and `two-cols-header`. Image and iframe examples use local fixtures under `public/`, so the gallery remains deterministic and network-independent.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Slidev, normally `http://localhost:3030`.

## Build or export

```bash
npm run build
npm run export
```

PDF export requires Playwright Chromium. Install it only when export is needed.
