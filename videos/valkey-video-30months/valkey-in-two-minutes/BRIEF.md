---
workflow: general-video
flow: companion
storyboard: yes
message: "Memory-speed data, practical patterns, open source forever."
destination: event-screen
aspect: 1920x1080
language: en
audience: developers and technical decision-makers
length: 120s
angle: explainer
---

## Intent

A two-minute Valkey explainer, built from the reviewed SCRIPT.md in the parent
folder: what Valkey is (the exact valkey.io definition), the hands-on basics
(SET/GET, cache-aside), the platform (releases, modules, integrations), all 19
use cases, a semantic-caching deep dive, the participant community, and the
Docker quick start. Tone: technically credible, practical, welcoming.

First showing: screens at Kubernetes Community Day Buenos Aires, 2026-10-03.
Event screens are often muted, so on-screen text and the caption track carry the
message without the voice. The piece is meant to be reused at any later
occasion, so nothing event-specific appears in the video, and the first and last
frames share one ground so it loops cleanly.

## Assets

- ../STORYBOARD.md (moved to this project root) — the reviewed 14-frame plan; the dispatch unit.
- ../SCRIPT.md, ../NARRATION.txt, ../TIMELINE.json, ../USE_CASES.md, ../LOGOS.md, ../RESEARCH.md — authoritative wording, timings, guardrails, and sources.
- ../../../valkey-brand/logo-svgs/ — official Valkey lockups; the persistent brand slot and the icon mark on diagram nodes.
- ../../../valkey-brand/icons/ — the 16 outline icons; one glyph per use-case label (Frames 8–11) and the two endpoints of Frame 1.
- ../../../external-assets/LFMainLogo/Horizontal/lf-horizontal-color.svg — Linux Foundation mark, Frame 2.
- ../../../valkey-brand/valkey-io-capture/assets/ — 20 participant logos (byte-matched to valkey.io/img/), Frame 13; NetApp Instaclustr frozen separately.
- ../../../valkey-brand/ValkeyDesignSystem/assets/fonts/ — Open Sans and Cascadia Code variable fonts.
- ../../../sessions/well-architected-on-a-budget/components/{CacheAsideDiagram,SemanticCacheDiagram}.vue — the diagram grammar Frames 4 and 12 inherit.

## Customizations

- Voiceover: synthesized from NARRATION.txt (one line per frame); real voice duration drives each scene within its planned window.
- Captions: a root caption track from the narration word timings, confined to the reserved lower band, so a muted screen still reads.
- Persistent brand slot: one colour horizontal lockup on the master timeline, bottom-right on every frame; it travels into the hero position in Frames 2 and 13 and is the bottom band in Frame 14.
- Music bed (added on request): HeyGen catalog track resolved as `bgm_003` ("soft minimal electronic background loop, gentle, even, corporate tech, instrumental"), looped with 2.5s crossfades to 125.5s, 1.2s fade-in / 4s fade-out, placed at volume 0.18 on track 11 in group `music`, and carved dynamically against the `voiceover` group at strength 0.8 (6 bands 160 Hz–2.5 kHz, level envelope floor −19.2 dB).

## Notes

- Minimal: one white-to-ice ground for the whole film, periwinkle #6983FF the only accent, maroon #642637 only as the expensive-path colour in the two diagrams, no imagery, no decorative icons, no background diagrams behind the use-case panels.
- Hard exclusion: Apple — no mark, name, or incidental appearance.
- Guardrails per frame are in STORYBOARD.md and SCRIPT.md: no latency numbers, no "most common" ranking, no "Fraud detected", no fabricated similarity percentages, no simulated Docker output, the application owns every database arrow in cache-aside, both AI models sit outside Valkey.
- Final command is exactly `docker run --rm valkey/valkey:alpine`.
- Plan reviewed and revised three times in chat before this build; sketch pass skipped at the user's "create the video" to meet the same-day screen date. The final Studio preview remains the render gate.

## 2026-10-03 — portrait variant

A 9:16 version of this film was built as a sibling project, `../valkey-in-two-minutes-portrait`
(same frames, timings, voice, captions, carved bed, assets, and guardrails; geometry re-laid for
1080×1920). This landscape project is unchanged.
