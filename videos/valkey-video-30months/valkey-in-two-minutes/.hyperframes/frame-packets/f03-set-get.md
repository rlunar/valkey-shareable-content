# Frame packet: f03-set-get

## Project inputs

- Project: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes
- Design truth: /Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes/frame.md
- RULES_DIR: /Users/rberoj/.claude/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 3 — SET a key and value

- scene: An illustrative valkey-cli transcript types SET Key Value → OK, then GET Key → "Value" and holds
- timecode: 00:28.0–00:34.5
- duration: 6.5
- poster: 5
- transition_in: cut
- status: outline
- voiceover: "Start with a key and a value. SET stores it. GET reads it back."
- src: compositions/frames/f03-set-get.html
- assets: none
- blueprint: compose
- rules: discrete-text-sequence, context-sensitive-cursor
- focal: the terminal card's current line
- roles: title (frame_title "START WITH A KEY AND VALUE"), terminal card (terminal_card, ≈1240×420 centred at y≈560), four transcript lines (code 64px mono), caret (context-sensitive-cursor)

**On screen:**

```text
valkey> SET Key Value
OK
valkey> GET Key
"Value"
```

**Shot sequence (voice cues: "SET" 2.6, "stores" 3.0, "GET" 3.7, "reads" 4.0, voice ends 4.9):**

- Scene 1 (0.0–2.4s): title enters; the empty terminal card enters with a blinking caret after the prompt `valkey> ` (prompt in secondary colour).
- Scene 2 (2.4–3.2s): `SET Key Value` types in (`discrete-text-sequence`, ~14 chars over 0.6s) starting at 2.5s; at 3.1s a new line prints `OK` in periwinkle.
- Scene 3 (3.4–4.6s): a new prompt line; `GET Key` types from 3.6s; at 4.3s `"Value"` prints in periwinkle on the next line.
- Scene 4 (4.6–6.5s): caret blinks on a fresh empty prompt line; hold composed.

**Guardrails.** A client-session transcript, not a shell command — keep the `valkey>` prompt text exactly; it is what distinguishes this from Frame 14. Preserve "Key" / "Value" capitalization exactly. No TTL, no latency readouts, no window chrome.

## Selected motion rule: discrete-text-sequence

---
name: discrete-text-sequence
description: Replace entire text states at frame thresholds for non-linear typing effects — typos, bulk additions, pauses, backspaces, simulated thinking.
metadata:
  tags: text, typing, discrete, threshold, non-linear, sequence
---

# Discrete Text Sequence

Instead of character-by-character typewriter, replace entire string states at time thresholds — enabling non-linear effects (typos, backspaces, bulk paste, "thinking" gaps) that smooth per-char typing can't achieve. If your effect is "type each character, no edits", this rule is overkill — use the smooth-slice variation below.

## How It Works

The typing is authored as a sparse array of `{ t, text }` states; on every `onUpdate` a **reverse search** finds the latest entry whose `t` has passed and renders its text. Display jumps between states with no animation between them — the realism comes from the schedule shape: fast keystroke clusters (0.06–0.20s apart), pauses at word breaks (0.3–0.6s), a typo, backspaces peeling back to the fork, then a bulk paste replacing many chars in one entry. A block cursor blinks via a deterministic sin square wave on the same timeline.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="terminal">
  <div class="prompt">$</div>
  <div class="text-wrap">
    <span class="text" id="text"></span><span class="cursor" id="cursor">_</span>
  </div>
</div>
```

```css
.terminal {
  font-family: {monoFont}; /* monospace required — proportional jitters even in a fixed box */
  display: flex;
  align-items: baseline;
  font-size: TERMINAL_FONT_SIZE;
}
.text-wrap {
  display: inline-flex;
  align-items: baseline;
  min-width: TEXT_WRAP_MIN_WIDTH; /* ≥ widest state — stops right-edge jitter */
  white-space: nowrap;
}
.cursor {
  display: inline-block; /* inline ignores width */
  width: CURSOR_WIDTH;
}
```

```js
// Each entry shows from its t until the NEXT entry's t.
// Shape: keystrokes → typo → backspace to the fork → bulk paste → completion mark.
const SEQUENCE = [
  { t: 0.0, text: "" },
  { t: T_K1, text: "{p1}" }, // first keystrokes (~3-5 chars, 0.1-0.2s apart)
  { t: T_K2, text: "{p1 + ' ' + p2_typo}" }, // continuation containing a typo
  { t: T_BS, text: "{p1 + ' ' + p2_partial}" }, // backspace(s) — peel back to the fork
  { t: T_BULK, text: "{fullCorrectedText}" }, // bulk paste — many chars in one jump
  { t: T_DONE, text: "{fullCorrectedText + ' ✓'}" }, // completion marker
];

// Reverse-search for the latest entry whose t has passed
function textAt(time) {
  for (let i = SEQUENCE.length - 1; i >= 0; i--) {
    if (time >= SEQUENCE[i].t) return SEQUENCE[i].text;
  }
  return "";
}

const textEl = document.getElementById("text");
const cursorEl = document.getElementById("cursor");

const driver = { t: 0 };
tl.to(
  driver,
  {
    t: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      textEl.textContent = textAt(driver.t);
    },
  },
  0,
);

// Cursor blink — deterministic sin square wave, never a CSS animation
const blink = { p: 0 };
tl.to(
  blink,
  {
    p: Math.PI * 2 * BLINK_CYCLES,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      cursorEl.style.opacity = Math.sin(blink.p) > 0 ? "1" : "0";
    },
  },
  0,
);
```

## Variations

- **Smooth character slice** (continuous typewriter — no pauses, no edits): faster to author but uniformly "machine-typed", missing the human realism:

```js
const fullText = "{fullPhrase}";
const len = { v: 0 };
tl.to(
  len,
  {
    v: fullText.length,
    duration: TYPE_DUR,
    ease: "power1.inOut",
    onUpdate: () => {
      textEl.textContent = fullText.substring(0, Math.floor(len.v));
    },
  },
  0,
);
```

- **Thinking pause** — hold one state for `THINK_HOLD_DUR` (0.8–2.0s; under 0.5s reads as a stutter, not thought) simply by leaving a gap before the next entry's `t`.
- **State pulse on completion** — when the final state lands, `tl.to(".text", { scale: 1.03–1.08, duration: 0.15–0.3, yoyo: true, repeat: 1 }, T_DONE)`.
- **Per-state color shift** — in `onUpdate`, branch on `driver.t` vs the milestones: success color after `T_DONE`, dim mid-edit, normal while typing.

## Values

| token               | range                                        | notes                                                                  |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| TERMINAL_FONT_SIZE  | 48–96px                                      | full-bleed comps; smaller for terminal-style detail                    |
| TEXT_WRAP_MIN_WIDTH | ≥ widest state                               | measure with a hidden probe after `document.fonts.ready` if unsure     |
| milestone `t`s      | keystrokes 0.06–0.20s apart; pauses 0.3–0.6s | monotonically increasing; `T_DONE ≤ TOTAL_DURATION − ~1s` climax dwell |
| TYPE_DUR (smooth)   | `chars × 0.06–0.12s`                         | fast → relaxed                                                         |
| BLINK_CYCLES        | one cycle per 0.5–0.8s                       | `TOTAL_DURATION / 0.8 ≤ BLINK_CYCLES ≤ TOTAL_DURATION / 0.5`           |
| CURSOR_WIDTH        | ~0.3× font size                              | gap to text single-digit px so the cursor feels attached               |

## Critical Constraints

- **Reverse-search the array each frame** — O(n) with small n (≤30 typical); don't index by frame, the sequence is sparse.
- **`min-width` on the text wrap is mandatory** — without it the right edge jitters as state length changes.
- **Discrete jumps must be INSTANT** — any transition on the text turns the jump into a smear and kills the "typing" feel.
- **Cursor blink is sin/sequence-driven on the timeline**, `display: inline-block`, monospace font, `white-space: nowrap` (wrapping mid-state breaks the illusion; trailing spaces must survive).
- **Discrete vs smooth** — use discrete only for non-linear states (typos, pauses, bulk paste); plain typing takes the smooth-slice variation.

## See also

`context-sensitive-cursor` (same SEQUENCE pattern + segment-colored cursor) · `3d-text-depth-layers` (discrete text with layered depth) · `counting-dynamic-scale` (discrete label beside a smooth counter) · `press-release-spring` (post-completion press beat).

## Selected motion rule: context-sensitive-cursor

---
name: context-sensitive-cursor
description: Cursor color and styling that adapt to the current text segment being typed — accent color on highlights, dim on placeholders, etc.
metadata:
  tags: cursor, color, context, typewriter, styling, segment
---

# Context-Sensitive Cursor

In a typewriter sequence, the cursor's color (and optionally height / blink behavior) matches the **active text segment** — brand accent while typing the brand name, dim on placeholders, success color on the completion mark. The eye lands on the keyword being typed because the cursor shifts with it; a fixed single-color cursor is visual noise by comparison. Layers on top of [discrete-text-sequence](discrete-text-sequence.md)'s SEQUENCE pattern.

## How It Works

The text is authored as a SEQUENCE of `{ t, text, segment, color }` entries; a linear driver's `onUpdate` reverse-searches for the current entry and writes both the visible text and the cursor's `background` (the cursor is a colored block, so `background`, NOT `color`). A second linear tween sweeps a phase `p` through `2π × BLINK_CYCLES_PER_SCENE` and gates cursor opacity on `sin(p) > 0` — a deterministic square-wave blink on the timeline.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="terminal">
  <div class="prompt">$</div>
  <div class="text-wrap">
    <span class="text" id="text"></span><span class="cursor" id="cursor">_</span>
  </div>
</div>
```

```css
.terminal {
  font-family: {monoFont}; /* proportional fonts drift the cursor mid-segment */
  display: flex;
  align-items: baseline;
  white-space: pre; /* preserve trailing spaces — cursor sits at segment end */
}
.text {
  white-space: pre;
}
.cursor {
  display: inline-block; /* inline ignores width/height */
  width: {cursorWidth}px;
  height: {cursorHeight}px;
  background: {textColor}; /* default — overridden per segment in onUpdate */
  vertical-align: {cursorBaselineFix}px; /* small negative — anchor to baseline, not line-height */
}
```

```js
// Adjacent entries usually share a text prefix but may differ in `segment` —
// that's what shifts the cursor color mid-line.
const SEQUENCE = [
  { t: 0, text: "", segment: "main", color: "{mainColor}" },
  { t: T_LEADIN_END, text: "{leadInChunk}", segment: "main", color: "{mainColor}" },
  { t: T_BRAND_IN, text: "{leadInBrandPrefix}", segment: "brand", color: "{brandColor}" },
  { t: T_BRAND_OUT, text: "{leadInBrandFull}", segment: "main", color: "{mainColor}" },
  { t: T_CMD_IN, text: "{leadInCmdPrefix}", segment: "cmd", color: "{cmdColor}" },
  { t: T_SUCCESS, text: "{leadInDone}", segment: "success", color: "{successColor}" },
];

function entryAt(time) {
  for (let i = SEQUENCE.length - 1; i >= 0; i--) {
    if (time >= SEQUENCE[i].t) return SEQUENCE[i];
  }
  return SEQUENCE[0];
}

const textEl = document.getElementById("text");
const cursorEl = document.getElementById("cursor");

const driver = { t: 0 };
tl.to(
  driver,
  {
    t: DURATION,
    duration: DURATION,
    ease: "none",
    onUpdate: () => {
      const entry = entryAt(driver.t);
      textEl.textContent = entry.text;
      cursorEl.style.background = entry.color;
    },
  },
  0,
);

// Deterministic square-wave blink
const blink = { p: 0 };
tl.to(
  blink,
  {
    p: Math.PI * 2 * BLINK_CYCLES_PER_SCENE,
    duration: DURATION,
    ease: "none",
    onUpdate: () => {
      cursorEl.style.opacity = Math.sin(blink.p) > 0 ? "1" : "0";
    },
  },
  0,
);
```

## Variations

- **Non-blinking during active typing** — suppress blink while letters are appearing (solid cursor), resume on idle. This MUST be a pure function of the driver's time: tracking a mutable `lastChangeTime` in `onUpdate` is not reverse-seek-safe (scrubbing backwards leaves the stale forward-pass value behind and the cursor blinks — or holds solid — at the wrong frames). Bake the change times from the SEQUENCE instead — every entry whose `text` differs from its predecessor is a typing event:

```js
// Baked once at build time — no runtime state.
const CHANGE_TIMES = SEQUENCE.filter((e, i) => i > 0 && e.text !== SEQUENCE[i - 1].text).map(
  (e) => e.t,
);
// In onUpdate — identical result at any seek, either direction:
const isTyping = CHANGE_TIMES.some((t) => t <= driver.t && driver.t - t < TYPING_GRACE);
cursorEl.style.opacity = isTyping ? "1" : Math.sin(blink.p) > 0 ? "1" : "0";
```

- **Cursor HEIGHT shifts on segment** — larger cursor on the brand segment: `cursorEl.style.height = entry.segment === "brand" ? cursorHeightEmphasis : cursorHeight` (1.1–1.25×; more reads as glitch).
- **Contrast reversal** — a dark-text-on-light segment needs a dark cursor too; keep `entry.color` as the single source of truth and read from it.

## Values

| token                  | range                       | notes                                                                                           |
| ---------------------- | --------------------------- | ----------------------------------------------------------------------------------------------- |
| DURATION               | 4–8s per typed line         | `≥ SEQUENCE[last].t + closing dwell`                                                            |
| entry `t` spacing      | 0.2–0.5s micro-additions    | ascending, non-uniform — slow down on highlights                                                |
| segment palette        | 3–4 colors max              | more reads as random; brand vs success should differ in saturation/luminance                    |
| cursorWidth / Height   | 8–24px / 0.85–1.0× fontSize | too thin vanishes in render compression; too tall outranks the text                             |
| cursorBaselineFix      | small negative px           | drop the block to the text baseline                                                             |
| BLINK_CYCLES_PER_SCENE | period ≈ 0.6–1.2s           | **whole number** — otherwise the sin sweep ends mid-cycle and the cursor pops on the last frame |
| TYPING_GRACE           | 0.15–0.3s                   | **< shortest dwell between adjacent entries** — otherwise the cursor never blinks               |

## Critical Constraints

- **Cursor color goes on `background`** — it's a colored block, not a glyph.
- **Blink is timeline-driven sin, pure of any mutable tracker** — the typing-grace variation shows the seek-safe form.
- **`white-space: pre` on text and container** — collapsed trailing spaces park the cursor in the wrong column.
- **Monospace font + `display: inline-block` cursor** — proportional faces drift the cursor mid-segment; inline ignores the block geometry.
- **BLINK_CYCLES_PER_SCENE is a whole number** for the fixed DURATION.

## See also

`discrete-text-sequence` (the underlying SEQUENCE pattern) · `camera-cursor-tracking` (camera follows the cursor) · `press-release-spring` (post-typing confirm press).
