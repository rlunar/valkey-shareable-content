# Valkey Design System

A design system for **Valkey**, the open source (BSD) high-performance key/value datastore backed by the Linux Foundation. It packages the canonical Valkey brand — logo artwork, palette, gradients, type roles, spacing, shape and voice — together with reusable React primitives and a recreation of the valkey.io website, so agents and designers can produce on-brand material without re-deriving the brand each time.

## What Valkey is

Valkey is an in-memory key/value datastore used for caching, message queues, and as a primary database. It runs standalone or clustered, with replication and high availability, and supports strings, numbers, hashes, lists, sets, sorted sets, bitmaps and hyperloglogs, Lua scripting, and module plugins. The project is community-governed under LF Projects, LLC, with a public participant list of cloud providers and vendors.

Product surfaces represented here:

| Surface | Description | In this system |
|---|---|---|
| **valkey.io website** | Marketing home, download, documentation topics, command reference, blog, community, events, participants | `ui_kits/website/` — 5 screens |
| **Brand system** | Logos, palette, gradients, fonts, code themes, voice | `assets/`, `tokens/`, `guidelines/` |

There is no shipped Valkey GUI application in the provided sources, so no app UI kit exists here. The Valkey server itself is a CLI/daemon; its interface surface is the `valkey-cli` terminal, represented through the code-block component and code themes rather than as a UI kit.

## Sources this system was built from

Everything below was read directly; nothing was reconstructed from memory.

- **Brand assets codebase** (attached locally, read-only): `valkey-brand-assets/valkey-brand/`
  - `valkey_brand_guidelines.md` — Valkey Brand Guidelines **v2.0, September 2026**. The authoritative source for palette, type roles, logo rules, shape, voice, code themes.
  - `Valkey-Branding.md` — palette with RGB/CMYK/Pantone plus the Carbon dark/light code-theme mappings.
  - `valkey-gradients.css` — the canonical ten-gradient library.
  - `logo-svgs/`, `logo-pngs/` — official logo artwork (12 SVG variants, 14 PNGs).
  - `Valkey-Fonts/` — Play, Open Sans, Cascadia Code, Inter, Source Code Pro (TTF + WOFF2 + OFL licenses).
  - `valkey_brand_guidelines.pdf`, `Valkey-One-Pager_v2026.07.pdf` — not parsed; the Markdown guideline supersedes the PDF.
  - `Wallpapers/` — empty in the attached copy (only a `.DS_Store`).
- **Website repository**: <https://github.com/rlunar/valkey-io.github.io> (branch `main`), a fork of <https://github.com/valkey-io/valkey-io.github.io>. Read: `sass/_valkey.scss`, `sass/_colors.scss`, `sass/_typography.scss`, `templates/default.html`, `index.html`, `blog.html`, `docs-page.html`, `commands.html`, `community.html`, `templates/includes/*`, `content/_index.md`, `content/community/_index.md`, `content/connect.md`, `config.toml`. Copied: site icons, hero and aside imagery, participant logos.
- **Uploaded font subsets**: `uploads/` (Inter, Open Sans, Source Code Pro WOFF2 subsets). The full variable WOFF2 files from the brand bundle are what `tokens/fonts.css` ships; the uploads are kept as-is.

Readers with access should explore both repositories further — the website repo in particular is the ground truth for how the brand is actually implemented, and contains far more page templates and content than are recreated here.

## Two layers: guideline vs. implementation

The 2026 guideline and the live website disagree in places. This system follows the **guideline** for new work and records the **website** values separately so recreations stay faithful.

| Concern | Guideline (use for new work) | Website today (legacy) |
|---|---|---|
| Headings | Play Bold | inherits Open Sans |
| Code | Cascadia Code | falls back to Fira Mono |
| Palette | 9 canonical Valkey colors | canonical colors plus older Linux Foundation blue/green/yellow/red/grey sets and one-off purples |
| Contrast | 4.5:1 normal text | some normal-size white text on ValkeyBlueAura (≈3.3:1) |

Legacy website surfaces are exposed as `--valkey-*` implementation tokens (`--valkey-deep-purple`, `--valkey-page-shade`, `--valkey-aside-shade`, …) in `tokens/colors.css`, separate from the canonical palette.

---

## CONTENT FUNDAMENTALS

**Voice.** Direct, technical but readable, evidence-based, community-centered, and confident without inflation. Lead with what the reader can do. Support performance claims with data. Credit contributors.

**Person.** Second person for instructions to the reader ("You can connect with Valkey in many ways", "If you have a question about Valkey, head over to…"). First-person plural for the project speaking about itself ("We welcome your involvement in the Valkey community!", "We value your ideas!", "We look forward to seeing our list of participants grow"). Never first-person singular.

**Casing.** Sentence case for body copy, buttons, and most headings ("See Installation Guide", "Documentation by topic"). Title Case appears in navigation and section headers ("Command Reference", "Client Libraries", "Latest Blog Posts", "How to Contribute with us?"). ALL CAPS is reserved for short hero display statements and hero CTAs — the homepage hero is literally `FAST. RELIABLE.` / `OPEN SOURCE, FOREVER.` with a `GET STARTED` button — plus uppercase eyebrow labels (`.link-readmore`, aside link blocks, blog sidebar `h2`s). Do not set paragraphs in caps.

**Naming rules.** Write **Valkey**, never `VALKEY`, except inside intentionally all-caps display text. **Valkey.io** only when referring to the website. **open source** with no hyphen. **high-performance** hyphenated before a noun. Preserve exact capitalization of commands, config keys, and output (`SET`, `HGETALL`, `valkey.conf`, `docker run --rm valkey/valkey:8`).

**Typical copy shapes.**
- Hero subtitle, one long sentence of substance then one of governance: "Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever."
- Card body, one sentence of what plus who it is for: "Step-by-step instructions on how to install and configure Valkey for first-time users."
- Community card, conditional then action: "If you encounter any issues while using Valkey, please help us improve the project by filing a bug report at our GitHub repository."
- Banner, event plus date plus place: "**Save Your Spot for ValkeyConf 2026** | October 5, 2026 | Prague, Czechia".
- Empty state, plain and helpful: "We couldn't find any results matching your search" / "Check your spelling or try different keywords".
- Link text is descriptive, not "click here": `Read More`, `Explore`, `Learn More`, `Update this Page on GitHub!`, `Back to top`.

**Emoji.** Not used anywhere in the brand guidelines, the website templates, or the content. Do not introduce them.

**Vibe.** Infrastructure-grade seriousness with an open-source community warmth. It reads like a well-run standards body that also throws a conference: precise nouns, no hype adjectives, credit shared generously ("Logo design by Ziyang."), and legal/trademark language kept visible rather than buried.

---

## VISUAL FOUNDATIONS

### Color

Canonical palette (hex is authoritative; names are written without spaces and keep their capitalization):

| Name | Hex | Role |
|---|---|---|
| ValkeyBlueAura | `#6983FF` | brand accent, icon, focus, large fields, gradients |
| ValkeyBlackDenim | `#1A2026` | primary text, dark backgrounds, footer, code surfaces |
| ValkeyBestWhite | `#FFFDFA` | preferred light background |
| ValkeyPurpleIndigo | `#30176E` | dark brand fields, headings, gradients |
| ValkeyPalaceBurgundy | `#642637` | editorial accent, notices |
| ValkeyCandy | `#E0A2AF` | highlight on dark fields, illustration |
| ValkeySummerLavender | `#BCB5E7` | highlight on dark fields, secondary surfaces |
| ValkeyColdCream3 | `#F7FBFE` | cool light surface, code text |
| ValkeyMistyIce | `#D3DDE7` | borders and separators on light |
| Logo Light | `#E7E4F4` | embedded light wordmark color, logo files only |

Proportions: most of the canvas in ValkeyBestWhite, ValkeyColdCream3 or ValkeyBlackDenim; ValkeyPurpleIndigo for depth and hierarchy; ValkeyBlueAura as the accent; Candy, SummerLavender and PalaceBurgundy sparingly. Never give every supporting color equal weight.

Contrast constraints that bite: ValkeyBlueAura on light is ≈3.3:1 and white on ValkeyBlueAura is also ≈3.3:1 — both are large-text/controls only. Candy and SummerLavender never carry text on light backgrounds. Never signal status by color alone.

### Gradients

Ten named tokens, five light and five dark, in `tokens/gradients.css` — angles and stops are part of the definition and must not be altered. Defaults: **Midnight Aura** (`#1A2026 → #30176E → #6983FF`, 135°) for dark heroes, **Ice Aura** for light technical backgrounds, **Misty Lavender** when content needs quiet, **Candy Bloom/Frost** for community and editorial. Vertical descents (`--valkey-dark-blue-descent`, `--valkey-dark-lavender-descent`) for tall layouts and section transitions. Long text goes on a solid or translucent surface layered over a gradient, never directly on the multi-stop run.

The website adds its own implementation gradients: the What's New band is `linear-gradient(#30176E, #6983FF)`, the participants band `linear-gradient(180deg, #6983FF 0%, #BCB5E7 100%)`, page titles `linear-gradient(#382270, #4E51BF)`, and the hero pill CTA `linear-gradient(to right, #FFFFFF, #B7C2F7)`.

### Backgrounds and imagery

The homepage hero is a **full-bleed photograph** (`assets/img/hero-bg.webp`) under a ValkeyPurpleIndigo scrim: `linear-gradient(to bottom, rgba(48,24,110,0.15), rgba(48,24,110,0.75))` over `background-size: cover; background-position: right center`, plus a second bottom-fading overlay pseudo-element. Article pages use a flat `#E2E8F0` page shade with white content cards; the docs/blog aside uses `#F1F0FA`, and one aside is a fixed decorative image (`assets/img/aside-banner.webp`, `background-position: center bottom`, sticky, hidden below 1100px). No repeating patterns, no textures, no hand-drawn illustration, no noise or grain. Imagery reads **cool and technical** — blue/indigo cast, real photography of people and hardware rather than stock abstraction — warmed only by Candy in editorial contexts.

### Type

Play for titles and short display copy (400/700 only); Open Sans for everything readable (400 body, 600 nav/buttons/labels, 700 emphasis, 1.5–1.7 line height); Cascadia Code for code with ligatures disabled, 14px minimum in dense UI and 16px in docs; Inter is logo-construction only. Desktop scale: hero 70px, section display 60px, H1 40px, H2 32px, H3 24px, body 18px, nav/button 16px, caption 14–15px, code 16px. Uppercase display copy takes a small positive letter-spacing; the website's own hero uses `letter-spacing: 2px` at 70px and `-1px` on legacy `h1`.

### Spacing and layout

A 10px rhythm with 20/30/40/80px the common intervals. Max page width `1400px`; hero content up to `1200px`; prose capped at `800–890px`; aside columns `420px` max. Breakpoints at `768px`, `1024px`, `1400px`. Header is `min-height: 80px` with the horizontal logo at `130×46px`. Two-column pages run 62% main / 30% aside above 768px. The site's html font-size is `10px` so `rem` values read as tenths (`1.8rem` = 18px). Reduce columns before reducing type size.

### Shape and corners

Large cards and section panels 18–20px; inner cards and code blocks 8–10px; compact controls 4–8px; pills 24–30px or `999px`; avatars and icon fields 50%. Square corners where a table, terminal or technical diagram demands them. Do not round every nested element — the website's blog article card is deliberately square while its container is round.

### Cards

Light surface (white on the shaded page), 20–30px internal padding, either a `1px` hairline (`#E2E8F0` / ValkeyMistyIce) or a blue-tinted shadow `0 4px 24px rgba(105,131,255,0.10)` — never both heavy. Title, concise body, one primary action; consistent heights across a row. Dark cards use ValkeyPurpleIndigo or the site's `#2D2471` with ValkeyBestWhite/ColdCream3 text, and the documentation cards on the homepage are `#2D2471` at `20px` radius with `4rem` padding and an outlined pill button pinned to the bottom via `margin-top: auto`.

### Buttons, links and states

Three real button shapes exist in the source:
1. **Gradient hero pill** — white-to-`#B7C2F7` gradient, ValkeyBlueAura label, `30px` radius, `0 4px 10px rgba(0,0,0,0.25)`, 22px label, min-width 380px on desktop.
2. **Outlined pill** — `1px solid currentColor` or `#E2E8F0`, `24px`–`50px` radius, 14–16px semibold label in `#2D3748`, transparent background.
3. **Solid rectangle CTA** — Pacific-blue background, `5px` radius, white label (legacy `.cta`).

**Hover.** Underline for text links and footer links; footer icon links additionally drop to `opacity: 0.8`; the banner link to `opacity: 0.75`; event labels to `0.85`. Outlined pills invert — background fills with the border color and the label goes white (`.community-card .btn:hover { background:#072150; color:#fff }`) or fills with the accent (`.homepage-blog-card-readmore:hover { background:#667eea; color:#fff }`). Cards raise their shadow from `0 4px 24px rgba(105,131,255,0.10)` to `0 8px 32px rgba(105,131,255,0.18)`. Nav items grow a `3px` bottom border above 1024px and underline below it. Aside link blocks darken `#D1D9FF → #B9C6FF`.

**Press.** No dedicated pressed state exists in the source. Do not invent scale-down or squash effects; carousel dots are the only transform in the system (`scale(1.1)` on hover, `scale(1.2)` when current).

**Focus.** Inputs swap their border to ValkeyBlueAura on focus. Keep focus visible always; the guideline is explicit that a small color shift alone is not enough.

**Motion.** Short and unshowy: `0.2s ease` on cards, buttons and dots, `0.3s ease-in-out` on the hero pill and participants chip, `0.5s ease-in-out` on the carousel track transform. No bounce, no spring, no parallax, no entrance animation on load. Fades and color/shadow transitions only. Respect `prefers-reduced-motion`.

### Borders, shadows, transparency

Hairlines are `1px` — `#D3DDE7`/`#E2E8F0` on light, `rgba(255,255,255,0.08)` between footer bands. Shadow set: `0 2px 8px rgba(0,0,0,0.10)` for raised cards, `0 2px 5px rgba(0,0,0,0.20)` for menus, `0 4px 10px rgba(0,0,0,0.25)` for the hero pill, and the blue-tinted card pair above. No inner shadows, no bevels, no glows — and never any shadow on the logo. Transparency appears in two places only: white at 20% (`rgba(255,255,255,0.2)`) as the What's New panel over its gradient, and the purple photo scrim. **No backdrop blur anywhere in the source** — do not add frosted glass.

### Fixed and sticky elements

The docs/blog decorative aside is `position: sticky; top: 0` with `height: 100vh`. The command-table first column and header row are sticky within their scroll container. The header itself is static, not sticky. The announcement banner sits above the header and is dismissible, with its closed state stored in `localStorage` for 24 hours.

### Code surfaces

Dark theme: ValkeyBlackDenim background, ColdCream3 text, Candy keywords, BlueAura definitions/numbers/prompt, MistyIce strings, SummerLavender comments. Light theme: ColdCream3 background, BlackDenim text, PurpleIndigo keywords, PalaceBurgundy strings/numbers and italic comments. Container: `2rem` padding, `10px` radius, `1px solid #D3DDE7`, `400 16px/1.6 "Cascadia Code"`, ligatures off, left-aligned, whitespace preserved.

---

## ICONOGRAPHY

**There is no icon font and no sprite sheet.** The website ships individual **SVG files** in `static/img/`, referenced as plain `<img>` tags with explicit `width`/`height` attributes — e.g. `<img src="/img/IconGithub.svg" alt="GitHub Icon" width="16" height="16" />`. All of them are copied into `assets/icons/`:

| File | Where it is used | Size in source |
|---|---|---|
| `IconGithub.svg` | header GitHub button, footer | 16px header / 20px footer |
| `IconSlack.svg`, `IconLinkedin.svg`, `IconMail.svg` | footer social row | 20px |
| `IconX.svg` | footer social row | 20px |
| `IconYoutube.svg` | footer social row | 24px |
| `icon-outline-close.svg` | banner dismiss | 16px in a 24px hit area |
| `caret-right.svg` | breadcrumb separator | 8×10px |
| `icon-question.svg`, `icon-bug.svg`, `icon-users.svg`, `icon-bulb.svg`, `icon-sheild.svg`, `icon-book.svg` | community card grid (one per card) | 48px |

Two icon scales therefore exist in practice: **16–24px** interface icons and **48px** feature-card icons (the guideline also permits 40–48px). Style is mixed by role — the social marks are faithful third-party brand glyphs (kept exactly as their owners require), while the six community icons are a consistent outline set. Blog share buttons are inline `<svg>` with `fill: #6983FF`, hovering to `#553C9A`.

Unicode is used as a text glyph in two spots: `›` appended to `.link-readmore` via `content: ' ›'`, and `•` / `◦` as CSS list bullets in the client list. The commands empty state renders a literal `</>` as 6rem type. **No emoji.** The Valkey keyhole icon is identity-only — never a generic database, security or navigation symbol.

If a screen needs an icon that does not exist in `assets/icons/`, prefer a text label. Do not draw a new glyph in a different style, and do not substitute an emoji.

---

## Index

Root manifest:

| Path | What it is |
|---|---|
| `styles.css` | the one stylesheet consumers link; `@import`s only |
| `tokens/` | `fonts.css`, `colors.css`, `gradients.css`, `typography.css`, `spacing.css`, `shape.css`, `code-theme.css`, `base.css` |
| `assets/logos/` | 12 official SVG logo variants + 3 PNGs |
| `assets/icons/` | 14 site SVG icons |
| `assets/img/` | hero photograph, decorative aside, site logo files, favicon |
| `assets/participants/` | 12 participant company logos |
| `assets/fonts/` | Play, Open Sans, Cascadia Code, Inter, Source Code Pro WOFF2 + OFL licenses |
| `guidelines/` | foundation specimen cards (Design System tab) |
| `components/` | React primitives, grouped |
| `ui_kits/website/` | valkey.io recreation |
| `SKILL.md` | Agent Skills entry point |
| `github.md` | upstream repo association and sync record |

Components:

- `components/core/` — `Button`, `Badge`, `Card`, `CodeBlock`, `DataTable`, `Blockquote`
- `components/forms/` — `SearchInput`, `Select`
- `components/navigation/` — `Banner`, `SiteHeader`, `SiteFooter`, `Breadcrumbs`, `ReadMoreLink`
- `components/brand/` — `Logo`, `Icon`, `ParticipantCard`

**Intentional additions** (not literal source components, added because consumers need them):
- `Icon` — a thin wrapper over the copied SVG files so screens reference `assets/icons/` by name instead of hard-coding paths.
- `DataTable` — the source styles command and feature-comparison tables via page CSS rather than a component; wrapping it keeps the sticky-header/first-column behaviour reusable.

UI kits:

- `ui_kits/website/` — Home, Documentation topic, Command reference, Blog index, Community. See its `README.md`.

## Known asset issue: logo SVGs render black

Every class-based logo SVG in `valkey-brand-assets/valkey-brand/logo-svgs/` (and `static/img/valkey-horizontal.svg` in the website repo) has an **empty `<defs>`** — the `<style>` block that defined `.cls-1`/`.cls-2`/`.st0`/`.st1` was stripped, apparently by the C2PA signing step that added the `c2pa:manifest` metadata. Without those rules every path falls back to black, so the color, light, and white variants all render as solid black artwork.

Only `valkey-icon-periwinkle.svg`, `valkey-icon-black.svg` and `valkey-icon-white.svg` carry real `fill` attributes and render correctly.

Because recoloring official logo artwork is not permitted, nothing here rewrites the SVGs. Instead **every logo reference in this system points at the supplied PNG artwork** in `assets/logos/*.png`, which is unaffected. The SVGs are kept in `assets/logos/` so they can be swapped back in the moment fixed files are available — at which point changing the extensions in `components/brand/Logo.jsx` is the only edit needed. Please supply re-exported SVGs with their style rules intact (or inline `fill` attributes).

## Trademark

Valkey and the Valkey logo are trademarks of LF Projects, LLC. Logo design by [Ziyang](https://github.com/dizys). Review the [LF Projects Trademark Policy](https://lfprojects.org/policies/trademark-policy/) before using the marks. Fonts ship under the SIL Open Font License; keep the `LICENSE-*-OFL.txt` files alongside them.
