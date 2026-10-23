---
name: valkey-minimal-ice-portrait
canvas: "#FFFFFF"
colors:
  ice: "#F7FBFE"
  paper: "#FFFDFA"
  periwinkle: "#6983FF"
  periwinkle_tint: "#F1EFFD"
  deep_purple: "#30176E"
  ink: "#1A2026"
  secondary: "#596672"
  hairline: "#D3DDE7"
  node_border: "#BCB5E7"
  expensive: "#642637"
  success_ok: "#6983FF"
typography:
  display:
    family: "Open Sans"
    file: "assets/fonts/OpenSans-Variable.woff2"
    weights: "300 800"
    title_weight: 800
    phrase_weight: 600
  body:
    family: "Open Sans"
    weight: 400
  mono:
    family: "Cascadia Code"
    file: "assets/fonts/CascadiaCode-Variable.woff2"
    weights: "200 700"
type_ramp:
  frame_title: "40px / 800 / deep_purple / letter-spacing 0.04em / uppercase"
  hero_statement: "72px / 800 / periwinkle or deep_purple"
  phrase_caption: "48px / 600 / deep_purple"
  panel_label: "36px / 700 / deep_purple / two lines allowed"
  node_label: "30px / 700 / ink (Open Sans)"
  node_eyebrow: "18px / 700 / deep_purple / letter-spacing 0.12em / uppercase (Cascadia Code)"
  pill_label: "22px / 700 / secondary → deep_purple when current (Cascadia Code)"
  code: "48px / 500 / ink (Cascadia Code); hero command 52px, soft-wrapped inside the window"
  caption_size: "26px / 400 / secondary"
spacing:
  frame_padding: "72px left and right, 150px top (clear of the action-safe inset)"
  title_slot: "top-left at x 72, baseline y 200"
  content_band: "y 260 to y 1560 — all content lives here"
  caption_keepout: "nothing below y 1594 (0.83 × 1920)"
  safe_zones: "action-safe inset 54px / 96px; title-safe inset 108px / 192px — key content inside title-safe (x 108–972, y 192–1728)"
  brand_slot: "bottom-right, master-timeline layer at x 840–1020, y 1760–1820; frames never draw a lockup"
  grid_gap: "40px between panel cells, 32px between node cards"
components:
  ground:
    description: "full-bleed clip, lowest track, linear-gradient(135deg, #FFFFFF 0%, #F7FBFE 62%, #F1EFFD 100%); the only gradient in the film"
  node_card:
    description: "white #FFFDFA fill, 3px solid node_border, no radius, 0 12px 36px rgba(48,23,110,0.08) shadow; eyebrow (mono 18px) above label (Open Sans 30px 700); current state: border periwinkle, fill periwinkle_tint, y -6px, shadow 0 16px 44px rgba(105,131,255,0.22)"
  flow:
    description: "SVG cubic bezier, stroke 5px round caps (7px when current), arrow marker; periwinkle = fast path, expensive = the one costly step; drawn via stroke-dashoffset, resting opacity 0.32 once drawn"
  pill:
    description: "mono 22px 700, 8px 18px padding, 999px radius, 2px hairline border, paper fill; current → periwinkle border + deep_purple text"
  step_bar:
    description: "deep_purple band with 8px periwinkle left rule, mono label in #E0A2AF, Open Sans detail in #F7FBFE, 28px text; sits at the bottom of the content band, never below y 880"
  terminal_card:
    description: "a macOS Terminal window: 14px radius, 2px hairline border, 0 18px 48px rgba(48,23,110,0.10) shadow; a 56px title bar in #ECEFF4 with a 1px hairline underneath, three 16px traffic lights at left (#FF5F57, #FEBC2E, #28C840, 12px apart) and a centred mono 22px title in secondary (Frame 3: 'valkey-cli', Frame 14: 'Terminal — zsh'); body white #FFFFFF, mono text in ink; the 'valkey>' REPL prompt in secondary; results and the highlighted command segment in periwinkle. No fake prompt for the shell command — the window title carries the shell context."
  panel_cell:
    description: "one outline icon (periwinkle stroke, 120px) centred above a 40px 700 label; no border, no fill, no stripe"
  release_card:
    description: "node_card anatomy; version number in periwinkle 64px 800; PREVIEW region uses a 3px dashed hairline border and secondary text"
  glyph:
    description: "assets/icons/<name>.svg — 96 viewBox outline icons, periwinkle stroke as shipped; never recolour, never fill"
motion_tokens:
  entrance: "fromTo, y 32→0 + opacity 0→1, 0.55s, power3.out"
  stagger_cap: "≤ 0.5s total for any group"
  flow_draw: "stroke-dashoffset to 0, 0.6s, power2.out"
  current_swap: "0.3s, power2.inOut"
  forbidden: "bounce.out, elastic.out, idle breathe/float/pulse loops, CSS transitions"
---

## Overview

A two-minute Valkey explainer that reads like the valkey.io site and the Valkey slide decks: one light ground for the whole film, periwinkle as the single accent, deep purple for headings, and type that carries the message. The look is deliberately quiet so that the two walkthrough diagrams (cache-aside, semantic cache) and the participant wall are the loudest things on screen.

## The frame

- The ground is the same on every frame: the ice gradient, authored as a full-duration `class="clip"` on the lowest track. No imagery, no photography, no dark frames.
- Portrait 1080×1920. Title top-left at y≈200, content centred in the band from y 260 to y 1560, nothing below y 1594. Stack what the landscape frame placed side by side; a row of five becomes a column, a 3×2 grid becomes 2×3. The brand lockup lives on the master timeline bottom-right and is never drawn by a frame.
- Light canvases need structure, not decoration: 3px card borders, hairline rules, full-saturation periwinkle on the one active element. No glows, no grain, no ghost text, no radial blooms.

## Composition rules

- One idea per frame. If the frame's words already say it, do not also draw it.
- Periwinkle lights exactly one thing at a time: the active flow, the current step, the highlighted number, the OK/result line. Everything else rests in ink, secondary, or hairline.
- `expensive` maroon appears only in the two walkthrough diagrams, on the costly step (the database read, the model call). Nowhere else.
- Glyphs are the brand outline icons and nothing else: one per use-case label in the panel frames, two endpoint glyphs in Frame 1. Diagram nodes identify themselves with the Valkey icon mark (`assets/brand/valkey-icon-periwinkle.svg`) when they are Valkey, and with text otherwise.
- Node cards, flows, pills, and the step bar follow the well-architected deck's CacheAsideDiagram / SemanticCacheDiagram anatomy exactly, scaled for 1080p (cards ≈ 300×140, flows 5px; diagrams run top-to-bottom).
- Monospace is Cascadia Code everywhere code or chrome appears: the CLI transcript, the Docker command, card eyebrows, pill labels, step-bar labels.

## Do

- Reveal on the narration cue; let the frame keep gaining information to the end.
- Use `fromTo` for every entrance so seeking is clean.
- Keep label text ≥ 40px and body text ≥ 26px.

## Don't

- No gradients except the ground. No shadows except the card shadows and the terminal window. No rounded corners except pills and the terminal window.
- No icons as decoration beside words that already read.
- No red for failures (the palette has none); a miss or a failed check is grey, never red.
- No Apple mark, name, or reference of any kind.
- Never render the narration as on-screen text; captions are a root track.
