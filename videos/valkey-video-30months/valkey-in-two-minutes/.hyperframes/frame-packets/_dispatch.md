# Dispatch context — shared by every frame worker on this project

Read `_role.md` first (your complete role), then your packet(s), then `frame.md`. This file resolves the few points where the role's two halves use different wording, and fixes project constants. Where this file and `_role.md` disagree on a path, THIS file wins.

## Project constants

- `PROJECT_DIR` = `/Users/rberoj/Code/GitHub/valkey-io/valkey-shareable-content/videos/valkey-video-30months/valkey-in-two-minutes`
- Canvas: **1920 × 1080**, 30 fps.
- Captions: **enabled**. Keep-out cutoff: **nothing below y = 896**.
- Design truth: `frame.md` at the project root. Pull every colour, font, size, and component treatment from it. The storyboard block owns content; `frame.md` owns style.
- Assets: every path your block names already exists under `PROJECT_DIR/assets/`. Reference them with project-relative paths exactly as written in the block (e.g. `assets/icons/performance.svg`, `assets/brand/valkey-icon-periwinkle.svg`, `assets/participants/03-aws.svg`). Never reference any other media, never fetch, never inline a copy of an SVG — use `<img src="…">`.

## Output paths (this overrides the role's `compositions/<frame_id>.html` wording)

Write exactly two files per assigned packet and nothing else:

1. `PROJECT_DIR/compositions/frames/<frame_id>.html`
2. `PROJECT_DIR/compositions/frames/<frame_id>.motion.json`

`<frame_id>` is the packet file name without `.md` (e.g. `f04-cache-aside`). It is also the root `data-composition-id` and the `window.__timelines` key.

## Non-negotiables that lint and check will fail you on

- The whole `.html` file is ONE bare `<template>…</template>` fragment. First bytes `<template`, last bytes `</template>`. No doctype, html, head, or body.
- Everything lives inside the template: `<style>`, `<script>`, `@font-face`. **Do not load GSAP** — the host page already provides the `gsap` global. Do not add any `<script src>`.
- Root: `<div id="root" data-composition-id="<frame_id>" data-width="1920" data-height="1080">` styled by `#root { position:absolute; inset:0; overflow:hidden; }` — never a class on the root, never hardcoded 1920px/1080px on it.
- Ground: a dedicated full-bleed `class="clip"` element on track 0 spanning the full duration, carrying the `frame.md` ground gradient. Never paint the background on `#root`.
- Every `class="clip"` element has `data-start`, `data-duration`, `data-track-index`. Use at most two clips: the ground (track 0) and one content layer (track 1) spanning the full duration; animate children of the content layer, never the clip itself (no autoAlpha/visibility/display tweens on `.clip`).
- Exactly one `gsap.timeline({ paused: true })`, built synchronously (no `document.fonts.ready`, no promises), registered as `window.__timelines["<frame_id>"] = tl;`. Do not call `tl.seek`/`tl.play`.
- Entrances use `gsap.fromTo` with explicit from-state. No CSS `transition`, no `repeat: -1`, no `Math.random`, no `Date.now`, no `bounce`/`elastic` eases.
- Never pair a CSS `transform` with a GSAP tween of `x`/`y`/`scale`/`rotation` on the same element. Centre with `inset`/`margin`/`left`+`top` arithmetic, not `translate(-50%,-50%)`.
- Animate transforms and paint only (`x`, `y`, `scale`, `opacity`, `color`, `backgroundColor`, `borderColor`, `strokeDashoffset`, `attr`). Never tween `width`/`height`/`top`/`left`.
- Prefix every id and every class you author with `<frame_id>-`. Only `#root` and `.clip` are exempt.
- Fonts: declare `@font-face` inside the template for the two shipped files and use ONLY these families:

```css
@font-face { font-family: "Open Sans"; src: url("assets/fonts/OpenSans-Variable.woff2") format("woff2"); font-weight: 300 800; font-style: normal; }
@font-face { font-family: "Cascadia Code"; src: url("assets/fonts/CascadiaCode-Variable.woff2") format("woff2"); font-weight: 200 700; font-style: normal; }
```

- No `<audio>`, no `<video>`, no exit animation (Frame 14 may settle, never fade out), no narration sentence rendered as text.
- **The brand lockup is never drawn by a frame.** The bottom-right zone x 1660–1860, y 940–1000 belongs to the master timeline. Frames 2 and 13 additionally leave their stated hero zone EMPTY — the master timeline flies the lockup there.
- Any `<img>` of an SVG: give it explicit `width`/`height` CSS so a file without a `viewBox` (Oracle) still sizes; use `object-fit: contain`.

## Reference skeleton (shape only — content comes from your packet)

```html
<template>
  <style>
    @font-face { font-family: "Open Sans"; src: url("assets/fonts/OpenSans-Variable.woff2") format("woff2"); font-weight: 300 800; }
    @font-face { font-family: "Cascadia Code"; src: url("assets/fonts/CascadiaCode-Variable.woff2") format("woff2"); font-weight: 200 700; }
    #root { position: absolute; inset: 0; overflow: hidden; font-family: "Open Sans", sans-serif; color: #1A2026; }
    .clip { position: absolute; inset: 0; }
    .fXX-ground { background: linear-gradient(135deg, #FFFFFF 0%, #F7FBFE 62%, #F1EFFD 100%); }
    .fXX-title { position: absolute; left: 96px; top: 88px; font-size: 44px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #30176E; }
  </style>
  <div id="root" data-composition-id="fXX-example" data-width="1920" data-height="1080">
    <div class="clip fXX-ground" data-start="0" data-duration="8" data-track-index="0"></div>
    <div class="clip fXX-stage" data-start="0" data-duration="8" data-track-index="1">
      <h2 id="fXX-title" class="fXX-title">Title</h2>
    </div>
  </div>
  <script>
    (() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#fXX-title", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.1);
      window.__timelines["fXX-example"] = tl;
    })();
  </script>
</template>
```

Wrap your script in an IIFE as above so `const` names cannot collide with sibling frames mounted on the same page.

## Motion sidecar shape

```json
{ "scene": "<frame_id>", "duration_s": <block duration>, "rules": ["<ids actually used>"], "exit": { "vector": "static (hold)", "still_moving": false }, "entry": { "vector": "<e.g. y -32px over 0.55s power3.out>", "from_rest": true } }
```

This film cuts between held frames on a shared ground; report honestly (`still_moving: false` is expected for every frame here).

## Finish

Re-read your file against the self-check in `_role.md`. Then stop — do not run the CLI, do not edit STORYBOARD.md, do not report beyond confirming the two files were written.
