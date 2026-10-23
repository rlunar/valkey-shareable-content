---
brand: Valkey
source: design.md (2026-09-04) + live capture of valkey.io (2026-09-05)
frame: 1920x1080 primary · 1080x1920 · 1080x1080
governing_principle: atoms are sacred · composition is free · numbers come from the script

colors:
  hero-purple: "#30186e"
  section-purple: "#30176e"
  accent-periwinkle: "#6983ff"
  action-blue: "#0053b8"
  ink: "#002a3a"
  white: "#fff"

fonts:
  display: "Open Sans"
  body: "Open Sans"

typography:
  # --- reading ramp (carried from design.md; cqw added for frame use) ---
  hero-line:
    fontFamily: "{fonts.display}"
    fontSize: 70px          # source ledger; retained for chrome/reference
    fontSizeCqw: 3.65cqw
    fontWeight: 700
    lineHeight: 1
    tracking: 2px
  body-base:
    fontFamily: "{fonts.body}"
    fontSize: 18px
    fontSizeCqw: 0.94cqw    # below the 1.4cqw floor — chrome/colophon only in frames
    fontWeight: 400
    lineHeight: 1.4
  ui-strong:
    fontFamily: "{fonts.body}"
    fontSize: 18px
    fontSizeCqw: 0.94cqw
    fontWeight: 600
    lineHeight: 1.2

  # --- frame-native display/hero ramp ---
  wordmark-mega:
    fontFamily: "{fonts.display}"
    fontSize: 30cqw
    fontWeight: 700
    lineHeight: 0.84
    tracking: -1.2cqw
  display-hero:
    fontFamily: "{fonts.display}"
    fontSize: 14cqw
    fontWeight: 700
    lineHeight: 0.92
    tracking: -0.35cqw
  claim-jumbo:
    fontFamily: "{fonts.display}"
    fontSize: 10cqw
    fontWeight: 700
    lineHeight: 0.94
    tracking: -0.2cqw
  section-head:
    fontFamily: "{fonts.display}"
    fontSize: 4.2cqw
    fontWeight: 700
    lineHeight: 1
    tracking: 0.1cqw
  pill-giant:
    fontFamily: "{fonts.display}"
    fontSize: 2.6cqw
    fontWeight: 600
    lineHeight: 1
    tracking: 0.08cqw
  stat-numeral:
    fontFamily: "{fonts.display}"
    fontSize: 8cqw
    fontWeight: 700
    lineHeight: 0.9
    tracking: -0.1cqw
  stat-ledger:
    fontFamily: "{fonts.display}"
    fontSize: 5.2cqw
    fontWeight: 700
    lineHeight: 0.92
    tracking: -0.05cqw
  card-head:
    fontFamily: "{fonts.display}"
    fontSize: 2.4cqw
    fontWeight: 700
    lineHeight: 1.05
  body-frame:
    fontFamily: "{fonts.body}"
    fontSize: 1.6cqw        # ≈31px @1920 — reading floor for prose
    fontWeight: 400
    lineHeight: 1.4
  ui-frame:
    fontFamily: "{fonts.body}"
    fontSize: 1.5cqw
    fontWeight: 600
    lineHeight: 1.2
    tracking: 0.05cqw
  micro-label:
    fontFamily: "{fonts.body}"
    fontSize: 1.4cqw        # legibility floor — never below this
    fontWeight: 600
    lineHeight: 1
    tracking: 0.2cqw

rounded:
  compact: 10px             # cards; source verbatim
  panel: 20px               # major panels; source verbatim
  pill: 30px                # actions; source verbatim

spacing:
  xs: 10px
  s: 20px
  m: 40px
  l: 80px
  frame-pad: 5cqw           # 96px @1920 — safe area inside the frame

shadow:
  card: "0 2px 8px rgba(0,0,0,.1)"
  action: "0px 4px 10px rgba(0,0,0,.25)"

components:
  # --- surface grounds (full-frame) ---
  ground-hero:
    backgroundColor: "{colors.hero-purple}"
    textColor: "{colors.white}"
    intent: primary full-frame ground (cover, hero claim, closer)
  ground-section:
    backgroundColor: "{colors.section-purple}"
    textColor: "{colors.white}"
    intent: secondary ground; gradient start toward periwinkle
  ground-feature:
    backgroundColor: "{colors.accent-periwinkle}"
    textColor: "{colors.white}"
    intent: feature/documentation ground — the periwinkle plate
  ground-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    intent: editorial light ground for ledger / catalog / benchmark
  ground-gradient-purple-peri:
    backgroundColor: "linear-gradient(180deg,{colors.section-purple} 0%,{colors.accent-periwinkle} 100%)"
    textColor: "{colors.white}"
    intent: transition ground (source: whats-new-section gradient)
  ground-hero-plate:
    backgroundColor: "{colors.hero-purple}"
    backgroundImage: "assets/hero-plate.webp"
    backgroundBlend: "screen"
    textColor: "{colors.white}"
    intent: >
      the site's REAL hero ground — the cyan/violet light-streak plate that sits behind
      FAST. RELIABLE. on valkey.io, composited over hero-purple. The one photographic
      surface in the system; fires once, on the opening frame.

  # --- actions ---
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.white}"
    typography: "{typography.ui-strong}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    shadow: "{shadow.action}"
    intent: standard CTA (`.cta` / `a.cta` in source)
  button-primary-giant:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.white}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1.6cqw 3.4cqw"
    shadow: "{shadow.action}"
    intent: frame-scale CTA on hero/closer plates
  button-hero-on-peri:
    backgroundColor: "{colors.white}"
    textColor: "{colors.accent-periwinkle}"
    typography: "{typography.ui-strong}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    shadow: "{shadow.action}"
    intent: `.hero-button` inversion — used on periwinkle ground
  button-hero-on-peri-giant:
    backgroundColor: "{colors.white}"
    textColor: "{colors.accent-periwinkle}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1.6cqw 3.4cqw"
    shadow: "{shadow.action}"
    intent: frame-scale hero-button on periwinkle plates
  link-inline:
    textColor: "{colors.action-blue}"
    typography: "{typography.body-frame}"
    intent: inline anchor color on light ground

  # --- cards & cells ---
  card-performance:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "40px"
    shadow: "{shadow.card}"
    intent: `.homepage-performance-card` — stat cell on light plates
  card-blog:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "40px"
    shadow: "{shadow.card}"
    intent: `.homepage-blog-card` — editorial preview cell
  card-documentation:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "40px"
    shadow: "{shadow.card}"
    intent: `.documentation-card` — major panel on periwinkle plate

  participants-wall:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.compact}"
    cellPadding: "{spacing.m}"
    logoMaxHeight: "3.2cqw"
    logoOpacity: 1
    intent: >
      the participants row from valkey.io as a frame-scale wall — real partner logos on
      `{components.ground-light}`, each in its OWN brand colors. This is the one place a
      non-Valkey color may appear, because the logos are third-party trademarks and
      recoloring them is both off-brand and a trademark problem. Never tint, never
      monochrome, never invent a partner.

  # --- chrome atoms ---
  eyebrow-kicker:
    textColor: "{colors.white}"
    typography: "{typography.micro-label}"
    intent: single-line eyebrow — ration to a minority of frames
  section-numeral:
    textColor: "{colors.white}"
    typography: "{typography.micro-label}"
    intent: safe-area top-right index (01 / 06)
  rule-hairline:
    borderTop: "1px solid rgba(255,255,255,0.35)"
    intent: safe-area rule under kicker or above footer bar
  colophon-bar:
    textColor: "{colors.white}"
    typography: "{typography.micro-label}"
    intent: bottom safe-area line — wordmark left, index right
---

# frame.md — Valkey at frame scale

> **Atoms are sacred · composition is free · numbers come from the script.**

## Overview

Valkey is a fast, reliable, open-source key/value store. The web brand is quiet and load-bearing:
three purples, one periwinkle plate, one action blue, ink for headings on light. At **frame
scale** that translates to **whole-frame grounds** — Hero Purple carries most identity beats,
Periwinkle is the feature/documentation plate, and light-on-ink is reserved for the ledger and
catalog frames where numbers do the talking. The wordmark and short declarative payoffs
("FAST.", "OPEN SOURCE, FOREVER.") get frame-native display sizes far above the 70px web hero;
long copy stays close to the reading floor. There is no second family, no illustration system,
no accent second color — restraint is the character.

### Frame Craft Bar

- **Squint.** One element dominates at 3–6× its nearest neighbor. On identity/claim frames it is
  the word; on ledger frames it is a single numeral; on the feature plate it is a card.
- **Silence.** Sparse frames (cover, claim, focal-artifact, closer) read **55–75% empty**. The
  **ledger** treatment is the one named density exception.
- **Restraint.** One CTA per frame. One periwinkle plate per sequence. Action Blue appears once
  per frame. If two atoms want the same voltage, demote one.
- **Reference.** Aim: a foundry specimen for an infrastructure brand (Redis Labs keynote plate,
  a Stripe press slide). Fail: a bootstrap SaaS grid with three feature icons and a hover shadow.

## Colors

Six tokens, no more. At frame scale colors are **grounds first, ink second, accent last**.

- **`{colors.hero-purple}` #30186e** — the default cover/closer ground; carries the wordmark and
  short payoff lines in `{colors.white}`.
- **`{colors.section-purple}` #30176e** — visually a hair cooler; used as the *start* of the
  gradient toward periwinkle (`{components.ground-gradient-purple-peri}`) and as a section
  ground when hero-purple has already been used in the sequence.
- **`{colors.accent-periwinkle}` #6983ff** — the **feature plate** (documentation-section). Fires
  **once per sequence**. Never as a small accent — always as a full ground.
- **`{colors.action-blue}` #0053b8** — CTA fill and inline links on light ground. One CTA per
  frame; never used as a decorative block.
- **`{colors.ink}` #002a3a** — headings on `{components.ground-light}`. Never on purple.
- **`{colors.white}` #fff** — type on purple/periwinkle; ledger/catalog ground.

**Pairings (source-locked).** White type on hero/section/periwinkle. Ink headings on white.
Action-blue CTA with white type. Never invert: no purple type on white, no ink on periwinkle.

## Typography

Two ramps live in the frontmatter.

- **Reading ramp** (`hero-line`, `body-base`, `ui-strong`) carries the source's px values. Note
  `body-base` at 0.94cqw sits below the frame legibility floor — it is chrome/colophon only.
  Never carry a beat's meaning below 1.4cqw.
- **Display/hero ramp** (`wordmark-mega` → `micro-label`) is authored in `cqw` and is where
  frame identity happens. Anchor points: the mega wordmark fills a cover; `display-hero`
  carries a two-word claim; `claim-jumbo` carries a three-to-four-word claim; `section-head`
  labels a plate; `stat-numeral` / `stat-ledger` carry data.

**Legibility floor: 1.4cqw (≈27px @1920).** Any load-bearing line — headline, claim, CTA label,
ledger numeral, kicker — is ≥ the floor. `micro-label` sits at the floor exactly.

**Fit-to-measure.** Headlines wrap only when the ramp step for their word count lets them.
Cap the headline block at **≤ 78cqw wide**; never let a line touch the safe margin. Step by
words: ≤3 words → `wordmark-mega` / `display-hero`; 4–6 → `claim-jumbo`; 7+ → `section-head`.

## Layout — The Frame

The **frame** is the unit: primary **1920×1080** landscape; also **1080×1920** portrait and
**1080×1080** square. Delete `max-width: 1400px` — the frame IS the container.

- **Safe area:** `{spacing.frame-pad}` (5cqw ≈ 96px @1920) inset on all four edges. Load-bearing
  content sits inside; the wordmark on a cover may bleed to the safe edge but never past it.
- **Frame-relative sizing.** Display sizes, gaps, and padding are in `cqw` against 1920
  (`px ÷ 1920 × 100 = cqw`). Chrome atoms (button radius, hairlines, shadows) stay in px.
- **cqw, not vw.** In the showcase, each frame is a `container-type: size` container and internal
  sizing uses **`cqw`** — this is what lets a 720px-wide review tile render at true 1920 proportions.

## Elevation & Depth

Two shadows, no third. `{shadow.card}` under `card-performance` / `card-blog`. `{shadow.action}`
under any CTA pill. No inner shadow, no glow, no drop under type, no card-on-card stacking. The
depth ceiling for a Valkey frame is a single lifted plane above the ground.

## Shapes

Three radii, source-locked and unchanged at frame scale. `{rounded.compact} 10px` for cards,
`{rounded.panel} 20px` for the documentation panel, `{rounded.pill} 30px` for every action —
including the frame-scale giants (`button-primary-giant`, `button-hero-on-peri-giant`). No
sharp corners, no radius under 10px, no oval buttons — the pill radius stays fixed at 30px even
when the button's height grows into `cqw`.

## Components

The frontmatter carries every buildable unit as a token. Prose here is context — intent, when to
use, and any construction the token set can't encode.

- **Grounds.** `{components.ground-hero}` is the default cover/closer ground.
  `{components.ground-section}` swaps in when hero-purple has already carried the previous frame.
  `{components.ground-feature}` — the periwinkle plate — is the sequence's single feature beat
  and never appears twice at full strength. `{components.ground-light}` is reserved for ledger,
  catalog, and blog-preview frames where ink type carries data.
  `{components.ground-gradient-purple-peri}` is a transition ground; the gradient runs top-to-
  bottom, section-purple → periwinkle, mirroring the `.whats-new-section` construction.
- **Actions.** `{components.button-primary}` and `{components.button-hero-on-peri}` are the
  source atoms; their `-giant` variants swap the pill's inner padding + type token for frame
  scale while keeping `{rounded.pill}` and `{shadow.action}` unchanged. Only ONE action pill per
  frame — a double-CTA is a web reflex.
- **Cards.** `{components.card-performance}` and `{components.card-blog}` share the same
  compact-radius / card-shadow construction but differ in intent: performance carries a numeral
  + label, blog carries a title + one line of dek. `{components.card-documentation}` is the
  major panel — `{rounded.panel}` — and appears only on `{components.ground-feature}`.
- **Chrome.** `{components.eyebrow-kicker}`, `{components.section-numeral}`,
  `{components.rule-hairline}`, and `{components.colophon-bar}` compose the safe-area rail. The
  hairline is a 1px `rgba(255,255,255,.35)` divider — the only construction not held by a
  size/color token. Ration the kicker: not every frame gets one.

## Motion & Timing

Valkey's voice is terse and declarative ("FAST. RELIABLE."). Motion serves that voice in
**two registers**. Pick one per deliverable and stay in it — mixing them is what makes a
brand piece read as unsure of itself.

**What never moves, in either register.** The wordmark's own geometry (no skew, no stretch,
no rotate, no letter-splitting, no draw-on), the pill's radius, ground *color* mid-frame,
and the safe-area chrome. A frame may carry the wordmark across the screen; it may not
deform it. Third-party participant logos are equally fixed — position only, never shape or
color. If an identity element deforms, the frame is no longer Valkey.

### Register A — Specimen (static showcase sheets, brand books, stills)

**Cuts, not transitions.** A cover holds, then cuts to a claim; a claim holds, then cuts to
a stat. No fade between grounds, no slide between claims — rhythm comes from element count
per frame, not motion between them.

- **May animate.** A stat numeral counting up on entry (0 → target, ≤0.4s, ease-out). A
  cursor blink in a code cell. Nothing else.
- **Dwell.** Sparse frames hold ~2.4s; ledger ~4s; catalog scrolls once at reading speed.

### Register B — Sizzle (launch reels, promos, motion graphics)

A reel has to move or it is a slideshow. Atoms stay sacred; **composition and camera are
free.** The governing law is the velocity-matched seam: *how a scene exits determines how
the next enters — same axis, same direction, matched speed, cut mid-motion on both sides.*

- **One current.** The film picks a single dominant direction (default LEFT) and every
  ordinary seam rides it. Other vectors are RESERVED and spending one must mean something:
  **UP** = elevation (a conclusion rises above what came before); **Z-pull** (inverse
  zoom-through) = ARRIVAL, something bigger landing. Never run consecutive seams in
  opposing directions.
- **Smooth beats bouncy.** Long-tail decel — `power3` default, `power4.out` / `expo.out` on
  a fast arrival. No `back.out` / `bounce.out` / `elastic.out`. Valkey is infrastructure;
  infrastructure does not wobble.
- **Text enters as a cascade, not a block.** Words arrive staggered from below with binary
  opacity (`waterfall entry`); gaps shrink across the cascade and the last word snaps.
  Between two text beats, the seam is a per-word `waterfall cut` riding the current.
- **Blur is scale-dependent.** 10px peak on text-scale subjects; 18–20px only when both
  sides of the cut are full-bleed surfaces. Blur the wrapper, never the children.
- **No idle wobble.** Breathing, floating, glow-pulsing to fill time is banned — it reads
  as "the video is waiting." Every beat between entry and exit is owned by a staged reveal,
  an intentful camera path, or a count-up. Prefer a held still frame to bad motion; a
  low-amplitude jitter is the only sanctioned aliveness during a hold.
- **Dwell.** A sizzle beat holds ~2.2–2.6s — the specimen dwell, cut tighter. Below ~1.8s a
  declarative line stops being readable at 1920.
- **Determinism.** No `repeat` / `yoyo`, no `Math.random`, no `Date.now`, no CSS
  `transition` / `@keyframes` for motion. Every render must be byte-identical; stagger
  derives from element index.
- **Export.** 30fps, sRGB, H.264.

## Frame Treatments

Each treatment composes frontmatter components and adds only placement. Recipes below carry
resolved values; anything a treatment names references a token.

### 1 · Identity Cover  (identity/cover · move: wordmark fills the frame)
**Ground** `{components.ground-hero}`, padding `{spacing.frame-pad}`.
**Container** single flex column, centered on both axes.
**Composes** `{components.ground-hero}`, `{components.eyebrow-kicker}`, `{components.colophon-bar}`.
**Focal** the wordmark set in `{typography.wordmark-mega}`, centered, block ≤ 78cqw wide.
**Chrome** `{components.eyebrow-kicker}` top-left safe corner ("open source · in-memory"); `{components.section-numeral}` top-right ("01 / 07"); `{components.colophon-bar}` bottom rail (small wordmark left, "valkey.io" right); `{components.rule-hairline}` above the colophon.
**Accent** none — the ground IS the accent.
**Silence** ~68% empty.
**Fixed** wordmark set in `{typography.wordmark-mega}`, always centered, always on `{colors.hero-purple}`.  **Free** the eyebrow string, the sequence numeral.
**Density** sparse.

### 2 · Oversized Claim  (editorial/oversized-claim · move: two words, one period)
**Ground** `{components.ground-hero}`, padding `{spacing.frame-pad}`.
**Container** single flex column, centered horizontally, offset ~6cqw above frame center.
**Composes** `{components.ground-hero}`, `{components.eyebrow-kicker}`.
**Focal** payoff line set in `{typography.display-hero}`, centered, block ≤ 78cqw wide. Two-word max at this step; step down to `{typography.claim-jumbo}` at 4–6 words.
**Chrome** `{components.eyebrow-kicker}` top-center safe rail (rationed); `{components.colophon-bar}` bottom.
**Accent** none.
**Silence** ~72% empty.
**Fixed** the period after each word (voice), the center anchor, white on hero-purple.  **Free** the payoff string.
**Density** sparse.

### 3 · Focal Artifact  (focal-artifact · move: one command, one caption)
**Ground** `{components.ground-section}`, padding `{spacing.frame-pad}`.
**Container** single flex column, centered.
**Composes** `{components.ground-section}`, `{components.card-performance}` (repurposed as a command cell), `{components.eyebrow-kicker}`.
**Focal** a single `{components.card-performance}`, centered, ~54cqw wide, carrying one command in `{typography.card-head}` on white (the source Fira Mono is *not* loaded, so this stays in `{fonts.body}`); a one-line caption under the card in `{typography.body-frame}` `{colors.white}`.
**Chrome** `{components.eyebrow-kicker}` top-left; `{components.section-numeral}` top-right; `{components.colophon-bar}` bottom.
**Accent** the `{colors.action-blue}` cursor/prompt glyph inside the card — single instance.
**Silence** ~60% empty.
**Fixed** one card, centered, on section-purple; card uses `{rounded.compact}` + `{shadow.card}`.  **Free** the command text and its caption.
**Density** sparse.

### 4 · Performance Ledger  (data/ledger · move: three numerals, three labels)
**Ground** `{components.ground-light}`, padding `{spacing.frame-pad}`.
**Container** CSS grid, 3 columns, gap `{spacing.m}` (40px). Section header row above, ledger row below.
**Composes** `{components.ground-light}`, `{components.card-performance}` (×3), plus a section title in `{typography.section-head}` `{colors.ink}`.
**Focal** three `{components.card-performance}` tiles side-by-side. Each carries a `{typography.stat-ledger}` numeral in `{colors.ink}` above a `{typography.ui-frame}` label in `{colors.action-blue}`.
**Chrome** section title left-aligned above the grid; `{components.section-numeral}` in ink at top-right; `{components.colophon-bar}` in ink at the bottom rail.
**Accent** `{colors.action-blue}` — used only for the three labels, tying the row together.
**Silence** tight by design — the named density exception.
**Fixed** three cards, equal width, one shadow.  **Free** the three numerals and their labels.
**Density** dense-exception.

### 5 · Documentation Plate  (brand-signature · move: the periwinkle plate)
**Ground** `{components.ground-feature}`, padding `{spacing.frame-pad}`.
**Container** two-column flex, headline block left (~44cqw wide), `{components.card-documentation}` right (~40cqw wide).
**Composes** `{components.ground-feature}`, `{components.card-documentation}`, `{components.button-hero-on-peri-giant}`, `{components.eyebrow-kicker}`.
**Focal** left column: `{typography.claim-jumbo}` headline in `{colors.white}` over a `{typography.body-frame}` sub-line; below, `{components.button-hero-on-peri-giant}` — the source's inversion (white pill, periwinkle text).
**Chrome** `{components.eyebrow-kicker}` top-left; `{components.section-numeral}` top-right; `{components.card-documentation}` on the right holds a `{typography.card-head}` title in `{colors.ink}` + three `{typography.body-frame}` lines in `{colors.ink}`.
**Accent** the single white pill against periwinkle.
**Silence** ~50% empty (periwinkle carries the visual weight).
**Fixed** periwinkle ground, exactly one pill, panel uses `{rounded.panel}`.  **Free** headline, dek, panel body.
**Density** standard.

### 6 · Catalog Sheet  (chrome/catalog · move: three blog previews, hairline chrome)
**Ground** `{components.ground-light}`, padding `{spacing.frame-pad}`.
**Container** CSS grid, 3 columns, gap `{spacing.m}`. Kicker row above.
**Composes** `{components.ground-light}`, `{components.card-blog}` (×3), a section title in `{typography.section-head}` `{colors.ink}`.
**Focal** the row of three `{components.card-blog}` tiles — each carries a `{typography.card-head}` title in `{colors.ink}` + one `{typography.body-frame}` line in `{colors.ink}` + a `{components.link-inline}` "read →" in `{colors.action-blue}`.
**Chrome** section title top-left in ink; `{components.section-numeral}` top-right in ink; `{components.colophon-bar}` bottom rail in ink.
**Accent** the action-blue "read →" links — one per card, no other blue in the frame.
**Silence** ~40% empty.
**Fixed** three cards, one radius, one shadow.  **Free** titles, deks, dates.
**Density** dense-exception.

### 7 · Get-Started Closer  (identity/closer · move: imperative + one pill)
**Ground** `{components.ground-gradient-purple-peri}`, padding `{spacing.frame-pad}`.
**Container** single flex column, centered.
**Composes** `{components.ground-gradient-purple-peri}`, `{components.button-primary-giant}`, `{components.eyebrow-kicker}`.
**Focal** an imperative in `{typography.display-hero}` `{colors.white}` ("GET STARTED.") stepped down to `{typography.claim-jumbo}` if word count > 3.
**Chrome** `{components.eyebrow-kicker}` above the headline (rationed); `{components.colophon-bar}` at the bottom.
**Accent** one `{components.button-primary-giant}` centered below the headline — action-blue fires once, here.
**Silence** ~65% empty.
**Fixed** center anchor, one pill, gradient runs top→bottom.  **Free** the imperative text, the pill label.
**Density** sparse.

## Do's and Don'ts

**Do**
- Lead with a full-frame ground; let the color carry the frame.
- Set short lines terse, with periods, in `{typography.wordmark-mega}` / `{typography.display-hero}`.
- Ration `{components.ground-feature}` to one plate per sequence.
- Ration `{colors.action-blue}` to one atom per frame — the CTA, or the label row, never both.
- Center the focal element on cover / claim / focal-artifact / closer; reserve left-anchor for ledger and catalog.

**Don't**
- Stack cards on cards or add a second shadow layer.
- Put two CTAs in one frame (web reflex — a frame is not a landing page).
- Introduce a color, weight, radius, or shadow the source doesn't define.
- Put ink type on periwinkle, or purple type on white.
- Fill a sparse frame with decoration to look "complete" — the silence is the brand.
- Repeat the same left/right split for more than two consecutive frames.
- Promote Fira Mono / Noto Serif / Open Sans Condensed — imported but unloaded on source.

## Aspect-Ratio Behavior

| Treatment | 16:9 (1920×1080) | 9:16 (1080×1920) | 1:1 (1080×1080) |
|---|---|---|---|
| 1 · Identity Cover | wordmark centered, block ≤ 78cqw | wordmark stacks 2 lines, `{typography.display-hero}` step; colophon shortens to just the mark | wordmark single line at `{typography.display-hero}`; colophon centered |
| 2 · Oversized Claim | 2-word line centered | 2 words stack vertically, one per line; step to `{typography.claim-jumbo}` | single line, step down one ramp step |
| 3 · Focal Artifact | card centered, caption below | card widens to ~78cqw, caption stacks under | card centered, caption wraps to two lines |
| 4 · Performance Ledger | 3 columns × 1 row | 1 column × 3 rows; numerals hold `{typography.stat-ledger}` | 2 columns + 1 spanned card; numerals hold `{typography.stat-ledger}` |
| 5 · Documentation Plate | two columns L/R | headline block on top, panel below; pill sits between | headline top, panel bottom, pill anchored right of headline |
| 6 · Catalog Sheet | 3 columns × 1 row | 1 column × 3 rows, cards full-width | 2×2 grid, one cell reserved for section title |
| 7 · Get-Started Closer | imperative + pill centered | imperative stacks, pill sits below at same width | one line, pill wider proportionally |

Rule across ratios: safe area stays `{spacing.frame-pad}` on the **short edge**; no load-bearing
line drops below **1.4cqw**; the periwinkle plate reflows but never becomes a fragment on a
different ground.

## Approved Real Entities & Numerals

Only entities and figures the source cites may appear on any frame:

- **valkey.io** — the domain; the only URL that may appear in `{components.colophon-bar}`.
- **Open Sans** 400 / 600 / 700 — the only loaded families named in the source ledger.
- **FAST. RELIABLE. · OPEN SOURCE, FOREVER. · Performance · Documentation · GET STARTED** — the
  live homepage samples; other declarative lines may be composed in the same voice.
- **1400px, 10 / 20 / 40 / 80, 10 / 20 / 30, 70px, 18px, `#30186e / #30176e / #6983ff / #0053b8 / #002a3a / #fff`** — the source's numerals. Never invent a metric ("2× faster", "99.99%") that isn't in the script; a ledger frame with no supplied numerals renders as `— figure —` placeholders.

### Verified from the live capture of valkey.io (2026-09-05)

Everything below is quotable verbatim; nothing here is inferred.

- **Positioning.** "an open source (BSD) high-performance key/value datastore"; "backed by
  the Linux Foundation, ensuring it will remain open source forever."
- **Workloads.** caching · message queues · primary database — the three the homepage names.
- **Shipping version.** `9.1.2`, release date `2026-09-01`. Supported prior lines: `8.1.10`,
  `7.2.14`. Do not round, abbreviate, or bump these.
- **Install line.** `docker run --rm valkey/valkey:9.1.2` — verbatim, including `--rm`.
- **Datatypes.** strings · numbers · hashes · lists · sets · sorted sets · bitmaps ·
  hyperloglogs. Also: Lua scripting, module plugins, standalone or cluster, replication,
  high availability.
- **Official clients.** Python · Java · Node.js · PHP · Ruby.
- **Participants** (real, named on the page — use only these, spelled this way): Percona ·
  Alibaba Cloud · Aiven · UpCloud · Amazon Web Services · Google Cloud · Ericsson · Oracle
  Cloud Infrastructure · NetApp Instaclustr · ByteDance · k0rdent · Momento · Heroku ·
  DigitalOcean · BetterDB · anynines · Tencent Cloud · Vultr · Freshworks · IONOS Cloud ·
  Solanica.
- **Event.** ValkeyConf 2026 — October 5, 2026, Prague, Czechia.
- **Trademark line.** "Valkey and the Valkey logo are trademarks of LF Projects, LLC."
- **Nav actions.** Download · Documentation · Command Reference · Community · Participants ·
  Try Valkey. Any of these is a legal CTA label. Pick the one that pays off the frame's
  imperative — **Download** under "GET STARTED.", not "Documentation", which reads as a
  detour at the moment of the call.

## Pre-Render Self-Audit

Before finalizing any frame:

- [ ] **Squint.** One element dominates at 3–6× its nearest neighbor.
- [ ] **Silence.** Sparse plates read 55–75% empty; ledger/catalog are the only density exceptions.
- [ ] **Restraint.** One action-blue atom in the frame. One periwinkle plate in the sequence.
- [ ] **Weight.** Only 400 / 600 / 700 present; hero lines at 700.
- [ ] **Depth.** At most one shadow layer; no card-on-card.
- [ ] **Geometry.** Radii only 10 / 20 / 30 px; colors only the six tokens; spacing only 10/20/40/80 + `frame-pad`.
- [ ] **Anchor.** Centered on cover / claim / focal / closer; left on ledger / catalog. No more than two consecutive frames share an anchor.
- [ ] **Elements.** ≤ 2–3 distinct elements per sparse frame; ledger / catalog exceptions declared.
- [ ] **Floor.** No load-bearing line under 1.4cqw. `body-base` (0.94cqw) is chrome only.
- [ ] **Pairings.** White on purple/periwinkle; ink on white; action-blue with white type — no inversions.
- [ ] **Fidelity.** Every size in the frame references a `{typography.X}` / `{components.X}` / `{spacing.X}` token — no invented numbers.

## Known Gaps

- **`cqw` as a string.** The DESIGN.md spec's consumer-behavior table stores unknown units as
  strings; the frame-native sizes here (`cqw` values on `typography.*` and `components.*`) will
  be preserved verbatim by spec consumers but not resolved.
- **Aspect re-scale is guidance.** The table above documents the intended reflow per ratio;
  exact reflowed sizes are computed at render, not stored as separate tokens.
- **Motion & Timing** and **Frame Treatments** are video extensions not present in the source
  design.md; consumers of the base spec will preserve them as unknown sections.
- **Colophon URL** uses `valkey.io` verbatim from the source; no other domain may appear.
- **Mono / serif families** (Fira Mono, Noto Serif, Open Sans Condensed) are imported but
  unloaded per the source ledger — do not promote them into any frame role.
