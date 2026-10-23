# Frame packet: f01-memory-vs-disk

## Project inputs

- Project: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes
- Design truth: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes/frame.md
- RULES_DIR: /Users/rberoj/.claude/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 1 — Memory speed versus disk

- scene: Two paths leave a processor; the RAM read lands first in periwinkle, a thin outline wraps the in-memory working set, a dashed arrow continues to disk
- timecode: 00:00.0–00:08.0
- duration: 8
- poster: 5
- transition_in: cut
- status: outline
- voiceover: "Memory access is faster than disk access. Valkey keeps working data in memory, with optional disk persistence."
- src: compositions/frames/f01-memory-vs-disk.html
- assets: assets/icons/memory-efficiency.svg, assets/icons/durability.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the RAM path lighting periwinkle while the disk pulse is still travelling
- roles: title (frame_title), processor node (node_card, label PROCESSOR), RAM endpoint (glyph memory-efficiency + panel_label "RAM · working data"), Disk endpoint (glyph durability + panel_label "Disk · persistent storage"), conceptual caption (caption_size)

**On screen:** MEMORY vs DISK · RAM: working data · Disk: persistent storage · "Conceptual comparison, not a benchmark"

**Shot sequence (voice cues: "Memory" 0.3, "disk" 2.1, "Valkey" 3.3, "memory" 4.9, "optional" 5.8, "persistence" 6.6):**

- Scene 1 (0.0–2.4s): title lands top-left (frame_title entrance). A processor node card sits left-centre (x≈300, y≈535). Two horizontal hairline paths (SVG, `svg-path-draw`) draw rightward from it at y≈430 (upper) and y≈640 (lower) toward two endpoints at x≈1380: upper = memory-efficiency glyph above "RAM · working data", lower = durability glyph above "Disk · persistent storage". Endpoints enter with the frame.md entrance token.
- Scene 2 (2.4–3.6s): two pulses (14px periwinkle dots) leave the processor together along both paths. The RAM pulse arrives at 3.3s and its path turns periwinkle 5px; the disk pulse is still only halfway and stays grey. Caption "Conceptual comparison, not a benchmark" appears bottom-left of the content band at 3.0s (y≈860).
- Scene 3 (3.6–5.6s): a thin 3px periwinkle outline (no fill) draws around the RAM endpoint (`svg-path-draw`, rectangle path); the words "working data" tint periwinkle. The disk pulse arrives at 5.2s with no colour change.
- Scene 4 (5.6–8.0s): a dashed grey 3px arrow draws from the RAM outline down-right to the disk endpoint, labelled "optional persistence" in caption_size. Hold composed; nothing else enters. Leave the bottom-right brand-slot zone empty.

**Guardrails.** No latency numbers, bar ratios, multipliers, or axes — the word "Conceptual" stays on screen. Do not draw RAM as durable, do not imply networked Valkey equals local-RAM latency, and do not imply every database query is a physical disk read.

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
