# Frame packet: f04-cache-aside

## Project inputs

- Project: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes
- Design truth: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes/frame.md
- RULES_DIR: /Users/rberoj/.claude/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 4 — Cache-aside: the everyday caching pattern

- scene: The well-architected deck's cache-aside triangle — Application, Valkey, Database — walked chronologically: check, miss, read once, fill with TTL, then a hit that never touches the database
- timecode: 00:34.5–00:49.0
- duration: 14.5
- poster: 12
- transition_in: cut
- status: outline
- voiceover: "Cache-aside is a common starting point. Your app checks Valkey first. On a miss, it reads the database and caches the result with an expiry. The next hit skips the database."
- src: compositions/frames/f04-cache-aside.html
- assets: assets/brand/valkey-icon-periwinkle.svg, assets/icons/durability.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the one currently-lit flow
- roles: title (frame_title "CACHE-ASIDE"), three node_cards — APPLICATION / "Cache-aside logic" at left (x≈250, y≈520), VALKEY / "Fast path" top-centre (x≈960, y≈330) carrying the icon mark top-right of the card, DATABASE / "Source of truth" bottom-right (x≈1560, y≈700) with the durability glyph small beside its eyebrow; five flows (frame.md flow) with pills; step_bar at y≈830; footnote (caption_size)

**On screen:** CACHE-ASIDE · APPLICATION · VALKEY · DATABASE · pills: GET key · MISS · read once · SET + EX 60 · HIT · return · step bar: 1 · CHECK → 2 · MISS → 3 · LOAD → 4 · FILL → 5 · HIT · footnote: Write path: update database, then invalidate cache

**Inherit from frame.md components exactly:** node_card (resting vs current), flow (periwinkle = fast path; `expensive` maroon = the database read ONLY), pill, step_bar. Flows are cubic beziers drawn with `svg-path-draw`; once drawn they rest at 0.32 opacity; the current flow is 7px at full opacity. The current card lifts 6px with the periwinkle border.

**Shot sequence (voice cues: "checks" 3.8, "miss" 5.8, "reads" 6.5, "database" 7.0, "caches" 7.7, "expiry" 9.1, "next" 10.4, "hit" 10.8, "skips" 11.2, voice ends 12.6):**

- Scene 1 (0.0–3.6s): title, then the three cards enter (entrance token, 0.15s stagger); the step bar enters reading "READY · The application owns the cache decision." No flows yet.
- Scene 2 (3.6–5.6s): 1 · CHECK — APPLICATION current; flow app→Valkey draws periwinkle with pill "GET key"; step bar swaps to "1 · CHECK · Ask Valkey before asking the database."
- Scene 3 (5.6–6.6s): 2 · MISS — return flow Valkey→app draws in hairline grey (not periwinkle, not maroon) with pill "MISS"; VALKEY card current; step bar "2 · MISS · The key is absent."
- Scene 4 (6.6–8.0s): 3 · LOAD — flow app→DATABASE draws in `expensive` maroon with pill "read once"; DATABASE card current; step bar "3 · LOAD · Read the source value once."
- Scene 5 (8.0–10.2s): 4 · FILL — flow app→Valkey draws periwinkle with pill "SET + EX 60"; VALKEY current; a small mono tag `EX 60` appears on the Valkey card; step bar "4 · FILL · Store with an expiry, then return."
- Scene 6 (10.2–12.8s): 5 · HIT — a second GET flow pulses periwinkle, then the return flow Valkey→app draws periwinkle with pill "HIT · return"; the maroon database flow stays at 0.32; step bar "5 · HIT · The database is never touched."
- Scene 7 (12.8–14.5s): footnote fades in at y≈875: "Write path: update database, then invalidate cache". Hold.

**Guardrails.** The maroon flow always leaves the APPLICATION card, never the Valkey card (read-through would be the wrong pattern). No adoption percentages or "most common" ranking. Labels ≥40px; nothing below y 896.

## Selected motion rule: svg-path-draw

---
name: svg-path-draw
description: Animate SVG paths drawing progressively using stroke-dasharray and stroke-dashoffset.
metadata:
  tags: svg, stroke, draw, path, reveal, icon, vector
---

# SVG Path Draw

Reveals an SVG shape by animating its stroke as if a pen were tracing it. Two stroke properties together: **`stroke-dasharray = <pathLength>`** makes the entire path one dash; **`stroke-dashoffset`** starts at the path length (dash shifted fully out of view → invisible) and tweens to `0` (fully drawn). The length comes from the DOM API `path.getTotalLength()` — measured, never guessed.

Works on anything with a stroke: `<path>`, `<circle>`, `<rect>`, `<line>`, `<polyline>`, `<polygon>`, `<ellipse>`.

## Recipe

```html
<!-- inside a standard scene clip -->
<svg class="logo-mark" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path id="bar-left" d="M 60 40 L 60 160" />
  <path id="bar-right" d="M 140 40 L 140 160" />
  <path id="bar-mid" d="M 60 100 L 140 100" />
</svg>
```

```css
.logo-mark path {
  fill: none; /* outline-only draw — a fill would appear immediately and ruin the reveal */
  stroke: {accentColor};
  stroke-width: 12;
  stroke-linecap: round; /* softer endpoints */
  stroke-linejoin: round;
}
```

```js
// Setup: measure each path and set its dash pattern. Real measured geometry, not a magic number.
document.querySelectorAll(".logo-mark path").forEach((p) => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`;
  p.style.strokeDashoffset = `${len}`;
});

// Stagger draws so the eye reads continuous motion — each segment starts at
// ~70-80% of the previous segment's duration, before it finishes.
tl.to(
  "#bar-left",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#bar-right",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_2_START,
);
tl.to(
  "#bar-mid",
  { strokeDashoffset: 0, duration: FINAL_SEGMENT_DUR, ease: "power2.out" },
  SEG_3_START,
);

// Companion wordmark fades in only after the last stroke settles.
tl.to(
  ".brand-line",
  { opacity: 1, duration: BRAND_FADE_DUR, ease: "power1.out" },
  BRAND_FADE_START,
);
```

## Variations

- **Ring starting at 12 o'clock** — `<circle>` / `<rect>` strokes start at 3 o'clock by default; rotate the element `-90deg` so a progress ring draws from the top:

```html
<circle
  cx="100"
  cy="100"
  r="60"
  id="ring"
  style="transform-origin: 100px 100px; transform: rotate(-90deg)"
/>
```

- **Linear (constant-speed) draw** — `ease: "none"` for a steady-rate "real pen" trace.
- **Draw then fill** — for filled shapes, tween `fillOpacity: 0 → 1` AFTER the stroke completes (requires `fill-opacity: 0` initially and a real `fill` in CSS):

```js
tl.to(
  "#path",
  { strokeDashoffset: 0, duration: SEGMENT_DRAW_DUR, ease: "power2.out" },
  SEG_1_START,
);
tl.to(
  "#path",
  { fillOpacity: 1, duration: FILL_FADE_DUR, ease: "power1.out" },
  SEG_1_START + SEGMENT_DRAW_DUR,
);
```

## Values

| token             | range                                   | notes                                                                                              |
| ----------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SEGMENT_DRAW_DUR  | 0.3–0.8s                                | fast snap vs deliberate pen trace; >~1s feels sluggish for a logo reveal                           |
| FINAL_SEGMENT_DUR | 60–80% of SEGMENT_DRAW_DUR              | proportional to segment length — a short connector at full duration reads slower than its siblings |
| SEG_N_START       | previous start + 70–80% of its duration | reads as continuous motion, not N isolated animations                                              |
| SEG_1_START       | 0–0.4s                                  | a small ~0.2s lead-in lets the viewer settle before motion                                         |
| BRAND_FADE_START  | ≥ last stroke end (+ ~0.2s beat)        | earlier and the wordmark competes with the draw                                                    |
| BRAND_FADE_DUR    | 0.3–0.8s                                | snap (urgent) vs glide (premium)                                                                   |

Ease families are discrete choices: **stroke draws** use `power2.out` (a hand lifting at end of stroke) or `none` for constant speed — never `back.out` / `elastic.out` (pens don't bounce). **Fades** use `power1.out`.

## Critical Constraints

- **`fill: none`** for outline-only draws — otherwise the fill appears immediately.
- **Dasharray/dashoffset = the measured `getTotalLength()`**, set at setup; requires the SVG in the DOM (inline SVG is fine; a loaded `<image>` SVG is not).
- **Complex paths**: if `getTotalLength()` looks wrong, overestimate slightly (`len * 1.05`) — too large is invisible at animation start; too small clips the end.
- **Stagger multi-path draws at ~70–80%** of the previous segment's duration.
- **A drawn line must land on something.** When the path is a connector (rail, beam, underline, callout) rather than a shape, both endpoints must sit on real elements and the draw must do a job — reveal, route, validate, or emphasize. A stroke that only decorates empty space reads as filler; attach it or cut it.

## See also

`svg-icon-enrichment` (internal parts animate after the outline draws) · `counting-dynamic-scale` (stroke draws an icon while a number counts up) · `hacker-flip-3d` (logo draws, wordmark decodes beneath).
