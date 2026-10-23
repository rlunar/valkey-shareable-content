# Frame packet: f12-semantic-cache

## Project inputs

- Project: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes-portrait
- Design truth: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes-portrait/frame.md
- RULES_DIR: /Users/rberoj/.claude/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 12 — Semantic caching: vector similarity for AI

- scene: The well-architected deck's semantic-cache row — Prompt, Embedding, Valkey Search, Model — with a VALID? gate added; a hit returns Paris without the model, then a miss calls the model once and stores
- timecode: 01:34.5–01:51.5
- duration: 17
- poster: 11
- transition_in: cut
- status: outline
- voiceover: "For AI, embed the prompt and search cached vectors with Valkey Search. A close, valid match reuses the answer. Otherwise, call the model and cache the result. Check context and freshness before reuse."
- src: compositions/frames/f12-semantic-cache.html
- assets: assets/brand/valkey-icon-periwinkle.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the one currently-lit flow
- portrait: Pipeline vertical; the 'outside Valkey' boundary is one dashed region on the right containing EMBEDDING and MODEL; same beats and cues.
- roles: title top-left; the five node_cards run TOP-TO-BOTTOM down the centre (300×130 each; centres y≈400/620/840/1060/1280; x centre 540, with EMBEDDING and MODEL offset right to x≈700 inside a dashed 'outside Valkey' boundary on the right half); the point cloud sits inside the VALKEY SEARCH card; flows are vertical beziers with pills alongside; HIT return flow runs up the left edge back to PROMPT; step_bar at y≈1420 (two lines allowed); footnote at y≈1520

**On screen:** SEMANTIC CACHE · PROMPT · EMBEDDING · VALKEY SEARCH · VALID? · MODEL · outside Valkey · pills · step bar: 1 · EMBED → 2 · SEARCH → 3 · VALIDATE → HIT → 4 · MISS → 5 · STORE · footnote: Same scope · compatible model/context · expiry

**Inherit from frame.md components exactly** as in Frame 4: node_card, flow (periwinkle = embed/search/validate/hit/store; `expensive` maroon = the MODEL call only), pill, step_bar.

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "embed" 1.2, "search" 2.4, "Search" 4.9, "close" 5.7, "match" 6.9, "reuses" 7.3, "Otherwise" 8.8, "call" 9.7, "cache" 10.9, "Check" 12.4, "context" 12.8, "freshness" 13.7, voice ends 15.5):**

- Scene 1 (0.0–1.2s): title; the five cards enter (entrance token, 0.1s stagger) with the dashed "outside Valkey" boundary drawing around EMBEDDING and MODEL (`svg-path-draw`); step bar "READY · Cache by meaning, not by the exact string."
- Scene 2 (1.2–2.4s): 1 · EMBED — PROMPT current; flow PROMPT→EMBEDDING draws periwinkle, pill "embedding"; step bar "1 · EMBED · Convert the prompt into a vector."
- Scene 3 (2.4–5.6s): 2 · SEARCH — flow EMBEDDING→VALKEY SEARCH draws periwinkle, pill "KNN"; VALKEY SEARCH current; the point cloud appears at 3.0s with the Paris dot nearest the ring centre; step bar "2 · SEARCH · Find the nearest cached vectors in scope."
- Scene 4 (5.6–8.6s): 3 · VALIDATE — flow VALKEY SEARCH→VALID? draws periwinkle; the three words tick periwinkle one by one (close 5.7, same context 6.3, fresh 6.9); at 7.3s the HIT return flow (a long bezier beneath the row from VALID? back to PROMPT) draws periwinkle with pill "HIT · no LLM" and "Paris" appears on the PROMPT card in periwinkle; MODEL stays resting; step bar "3 · HIT · Reuse the cached answer."
- Scene 5 (8.6–11.6s): 4 · MISS — at 8.8s the second VALID? word "same context" turns grey (a failed check); flow VALID?→MODEL draws `expensive` maroon with pill "MISS"; MODEL current; step bar "4 · MISS · No safe match: call the model once."
- Scene 6 (11.6–14.0s): 5 · STORE — flow MODEL→VALKEY SEARCH draws periwinkle with pill "store + TTL"; a new grey dot joins the point cloud; step bar "5 · STORE · Save the embedding and answer with an expiry."
- Scene 7 (14.0–17.0s): footnote at y≈875 "Same scope · compatible model/context · expiry" fades in at 14.0s. Hold.

**Guardrails.** No fabricated similarity percentage or universal threshold — the gate is three qualitative words. Distance is not a similarity percentage. Both models sit inside the "outside Valkey" boundary. A hit bypasses the model, not the embedding step. The scope ring stays visible from Scene 3 on.

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
