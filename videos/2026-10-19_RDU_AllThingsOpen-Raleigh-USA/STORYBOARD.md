---
format: 1920x1080
duration: 123.6s
message: "Valkey is fast, reliable, open source forever, and built for the workloads developers run every day"
arc: Hook → Promise → Capability → Proof → Credibility → (Use case → QR ×7) → Call → QR Finale
audience: backend and platform engineers choosing a key/value datastore
mode: autonomous
music: driving minimal tech, tight percussive pulse, rising energy, no vocals
---

## Video direction

**Palette system** — from `FRAME.md`, by role, never invented. Frame 1 is
`ground-hero-plate` (the site's real light-streak plate over hero-purple) — the only
photographic surface in the film. Frame 2 `ground-hero`. Frame 3 `ground-section`. Frame 4
`ground-feature` — the sequence's **single periwinkle plate**. Frame 5 `ground-light` (white)
so real participant logos keep their own trademark colors. The seven use-case plates return
to `ground-section` / `ground-hero`, using the supplied periwinkle SVGs as focal marks without
spending another full periwinkle ground. The call uses `ground-gradient-purple-peri`; the
15-second QR finale returns to `ground-section` with four white scannable cards.
White type on purple/periwinkle; ink on white; one `action-blue` atom per frame, no exceptions.

**Type** — Open Sans 400/600/700 only, from the embedded faces. Display beats use
`wordmark-mega` / `display-hero` / `claim-jumbo` by word count (≤3 → display-hero, 4–6 →
claim-jumbo). No load-bearing line below the 1.4cqw floor.

**Motion grammar** — `FRAME.md` **Register B (Sizzle)**. Long-tail decel only: `power3`
default, `power4.out` / `expo.out` on fast arrivals. No `back.out` / `bounce.out` /
`elastic.out` anywhere. Text arrives as a **waterfall entry** — staggered from below,
binary opacity via `tl.set`, gaps shrinking across the cascade, last word snaps. The
wordmark and the participant logos move as rigid bodies: position only, never deformed,
never recolored, never drawn-on.

**Reveal model — the beat grid is the clock.** There is no narration; the BGM pulse is
what reveals are cued to. Each narrative frame opens with only its anchor element and pays
the rest off across its back ~50% on the beat. The QR interstitial is the deliberate
exception: all four codes and legends are fully composed from local t=0 and stay still.

**Seam grammar** — the film's current is **LEFT**. Opening cuts remain at 3.1 / 6.0 / 11.3 /
14.4 / 17.4. The use-case chapter alternates each 2.6-second use case with the shared
10-second QR frame: 20.0–30.0 / 32.6–42.6 / 45.2–55.2 / 57.8–67.8 / 70.4–80.4 /
83.0–93.0 / 95.6–105.6. Every boundary continues LEFT with partial travel and mirrored
`power4.in` / `power4.out`. The single **Z-pull (inverse zoom-through)** lands the call at
105.6; the call then resumes LEFT into the 15-second final QR closer at 108.6. Seam vectors
live in `ledger.json`; the master block is stamped from it, never hand-tuned.

**Rhythm / held-frame allocation** — Frames 1–3 and 5 reveal on the beat. **Frame 4 is the
deliberate held breather**. Each use case performs its meaningful system action, then hands
to a fully still 10-second scan interval. The call holds composed before the final 15-second
QR closer. The 55-second music bed repeats in three overlapping windows with one-second
crossfades so the longer cut never drops to silence.

**Negative list** — never: a second type family (Fira Mono / Noto Serif / Open Sans
Condensed are imported-but-unloaded on source and stay unloaded); a colour outside the six
tokens except inside a third-party logo; two CTAs in one frame; a second periwinkle plate;
card-on-card or a second shadow layer; ink on periwinkle or purple on white; nav bars,
footers, scrollbars, browser chrome, or a real cursor; invented metrics. And both motion
failure modes: **slideshow** (front-load then freeze) and **screensaver** (breathing,
floating, glow-pulsing to fill time). No `repeat` / `yoyo`, no `Math.random`, no
`Date.now`, no CSS `transition` / `@keyframes` for motion.

## Frame 1 — Hook: FAST. RELIABLE.

- status: animated
- src: compositions/frames/01-hook.html
- duration: 3.1s
- transition_in: cut
- poster: 2.1s
- scene: The site's real light-streak plate ignites; FAST. RELIABLE. cascades in over it.
- blueprint: titlecard-reveal (Adapt)
- focal: assets/hero-plate.webp
- roles: hero-plate.webp = background (full-bleed, screen-blended over hero-purple) · valkey-logo.svg = supporting
- sfx: impact-soft, riser
- handoff_out: headline block `#f1-headline` at x:0 y:0 scale:1 opacity:1, accelerating LEFT (`power4.in`) through −230px, opacity reaching 0 at ~30% of travel; cut lands mid-motion at 2.6s.

Adapt: keep the titlecard signature — a full-bleed ground with one declarative lockup — but
the ground is the captured hero plate rather than a flat field, and the headline lands as a
two-phrase waterfall instead of a single fade.

Scene 1 (0.0–0.9s): `ground-hero-plate` full-bleed — the light-streak plate over
hero-purple, composited `screen` so the streaks read as light, not as a pasted photo. A
slow intentful push runs underneath on the root (`multi-phase-camera`) — establish, no
back-half re-push. Nothing else on screen yet. Layered-depth, ~100% of frame, 3 layers
(plate / vignette / type well).
Scene 2 (0.9–1.7s): **FAST.** then **RELIABLE.** arrive as a two-word **waterfall entry**
(`waterfall-entry`) from below in `display-hero` 700 white — anchor-weight travel, binary
`tl.set` opacity, the second word snapping tighter than the first. Centered, headline block
≤78cqw. The off-focus plate drops back with a light **selective blur**
(`depth-of-field-blur`) so the type owns the focal plane.
Scene 3 (1.7–2.6s): the small Valkey wordmark and the `colophon-bar` settle into the
bottom safe rail on the beat — the last reveal, in the back half. Frame reads still, then
`#f1-headline` accelerates LEFT into the 2.6s cut.

## Frame 2 — Promise: OPEN SOURCE, FOREVER.

- status: animated
- src: compositions/frames/02-promise.html
- duration: 2.9s
- transition_in: cut-the-curve LEFT
- poster: 1.9s
- scene: OPEN SOURCE, FOREVER. slams in on the beat; the official Linux Foundation logo lands under it.
- blueprint: kinetic-type-beats (Reproduce)
- focal: oversized claim with official foundation mark
- roles: `assets/lf-horizontal-color.svg` — supporting proof in native colors on a white clear-space plane
- sfx: impact-soft
- handoff_in: headline block `#f2-headline` ignites at x:+230 y:0 scale:1 opacity:0.35, decelerating LEFT (`power4.out`) to x:0 opacity:1 — mid-flight at the cut, never from rest.
- handoff_out: `#f2-headline` at x:0 y:0 scale:1 opacity:1, accelerating LEFT (`power4.in`) through −230px, opacity 0 by ~30% of travel; cut at 5.0s.

Scene 1 (0.0–0.7s): `ground-hero` flat hero-purple. `#f2-headline` arrives mid-flight from
the right on the seam's `power4.out` — **OPEN SOURCE, FOREVER.** in `claim-jumbo` 700 white
(4 words → claim-jumbo per the ramp), centered, offset ~6cqw above frame center. It is the
only thing on screen; the frame does not open loaded.
Scene 2 (0.7–1.5s): on the next beat **Backed by** reveals beneath the claim in `body-frame`
400, followed by the official full horizontal Linux Foundation SVG in native colors on a
tight white clear-space plane. The three units share the existing masked **waterfall reveal**
(`dynamic-content-sequencing`); the logo begins at the former **Linux** token's timing so the
back-half payoff keeps its original cadence. Centered, ~55% of frame occupied, 68% empty.
Scene 3 (1.5–2.4s): **keyword glow** (`asr-keyword-glow`) lands once on **FOREVER.** on the
beat, then decays to rest. Held still — no drift, no breathing — until the LEFT exit fires
into the 5.0s cut.

## Frame 3 — Capability: one store, eight jobs

- status: animated
- src: compositions/frames/03-capability.html
- duration: 5.3s
- transition_in: cut-the-curve LEFT
- poster: 4.2s
- scene: A fixed line holds while its rotary slot cycles all eight common Valkey workloads at a readable pace.
- blueprint: fixed-anchor-cycle (Adapt)
- focal: (text-only beat)
- roles: (none — typographic beat)
- sfx: three click-tick accents across the longer run
- handoff_in: line group `#f3-line` arrives mid-flight at 5.0s.
- handoff_out: `#f3-line` accelerates LEFT into the cut at 9.8s.

Scene 1 (0.0–1.2s): `ground-section` section-purple. The fixed anchor **"ONE DATASTORE FOR"**
arrives first; the rotary slot remains empty until the next pulse.
Scene 2 (1.2–4.0s): the slot rotates through **CACHING.** → **MESSAGE QUEUES.** →
**PRIMARY DATABASE.** → **SESSIONS.** → **LEADERBOARDS.** → **CHATBOTS.** →
**IOT STREAMS.** → **GEOSPATIAL.** Each jump lasts 0.11s, then the selected use case
holds fully composed for exactly 0.25s before the next jump. Every stop
alternates section-purple and periwinkle grounds; the rotisserie never flashes white.
Scene 3 (4.0–4.8s): **GEOSPATIAL.** holds while the group takes a doubled nudge-curve
settle. The stamped LEFT exit begins at local 4.52s.

## Frame 4 — Proof: shipping, right now

- status: animated
- src: compositions/frames/04-proof.html
- duration: 3.1s
- transition_in: cut-the-curve LEFT
- poster: 2.2s
- scene: The periwinkle plate — version 9.1.2 beside a Linux terminal where the Docker line types itself.
- blueprint: typewriter-reveal (Adapt)
- focal: version numeral + Linux terminal
- roles: (none — product proof is rendered as terminal UI on the feature plate)
- sfx: keystroke-soft, impact-soft
- handoff_in: left column `#f4-left` ignites at x:+230 y:0 scale:1 opacity:0.35, decelerating LEFT (`power4.out`) to x:0 opacity:1 — mid-flight at 7.4s.
- handoff_out: whole frame `#f4-root` at x:0 y:0 scale:1 opacity:1, accelerating UP (`power4.in`) through −230px y, opacity 0 by ~30% of travel; cut at 10.0s. The vector turns here — this is the chapter boundary into credibility.

Adapt: keep the typewriter signature — a command typing itself behind a live caret — inside
one Linux terminal plane on the periwinkle plate. The terminal uses the locked 20px panel
radius and single card shadow, with a white title bar above an ink shell body. A version block
carries the left column. This is the film's **single periwinkle plate**.

Scene 1 (0.0–0.7s): `ground-feature` periwinkle, full-bleed. Left column arrives mid-flight
on the seam curve: **9.1.2** in `stat-numeral` 700 white with **VERSION** above it in
`micro-label`. Two-column flex, headline block ~44cqw left. Right column still empty.
Scene 2 (0.7–1.0s): the Linux terminal lands on the right ~42cqw wide, arriving composed on
a smooth `power3` settle — white title bar labeled **LINUX TERMINAL**, ink shell body, and a
static `$` prompt visible before its content.
Scene 3 (1.0–2.0s): inside the terminal the install line **types itself** character-by-character
(`discrete-text-sequence`) behind a blinking `action-blue` caret
(`context-sensitive-cursor`) — `docker run --rm valkey/valkey:9.1.2`, verbatim, in enlarged
Open Sans 600 at **1.8cqw**. The caret is the frame's one blue atom. Beneath it, a subdued
white `micro-label`: "Released 2026-09-01".
Scene 4 (2.0–2.6s): **the deliberate held breather.** Typing stops, caret rests, nothing
moves — the one dead-still beat in the film, placed here so the participants lift reads as
a lift. Then `#f4-root` accelerates UP into the 10.0s cut.

## Frame 5 — Credibility: the industry runs on it

- status: animated
- src: compositions/frames/05-participants.html
- duration: 3.0s
- transition_in: cut-the-curve UP
- poster: 2.1s
- scene: Real participant logos rise onto the white catalog ground in a shrinking cascade.
- blueprint: grid-card-assemble (Adapt)
- focal: assets/p-aws.svg
- roles: p-aws.svg / p-google-cloud.svg / p-oracle.svg / p-ericsson.svg / p-bytedance.svg / p-percona.svg / p-aiven.svg / p-digitalocean.svg / p-heroku.svg / p-vultr.svg / p-netapp.svg / p-upcloud.svg / p-ionos.svg / p-momento.svg / p-anynines.svg / p-tencent.svg / p-alibaba.png = supporting (equal weight — the row IS the focal element, no single logo is hero)
- sfx: riser, impact-soft
- handoff_in: wall group `#f5-wall` ignites at y:+230 x:0 scale:1 opacity:0.35, decelerating UP (`power4.out`) to y:0 opacity:1 — mid-flight at 10.0s. The rise is the meaning: the industry lifting above the product claims.
- handoff_out: `#f5-wall` at x:0 y:0 scale:1 opacity:1 accelerates LEFT through −230px (`power4.in`), opacity reaching 0 by the cut at 12.5s.

Adapt: keep the grid-assemble signature — a field of cells resolving into an ordered wall —
but the cells are real captured trademark SVGs at native color on white, and they cascade in
reading order rather than from the center. Logos are rigid bodies: position and opacity
only, never scaled non-uniformly, never tinted, never cropped.

Scene 1 (0.0–0.6s): `ground-light` white arrives mid-flight rising from below on the seam's
`power4.out`. The section title **"THE INDUSTRY RUNS ON VALKEY"** in `section-head` 700 ink
is already composed, left-anchored top. The wall cells are empty.
Scene 2 (0.6–1.8s): seventeen participant logos reveal as a **waterfall cascade**
(`waterfall-entry`) in reading order across a 6-column grid, gap `spacing.m` — binary
`tl.set` opacity, per-cell Y offset varying by logo weight, gaps shrinking ×0.84 so the
cascade accelerates and the last cell snaps. Each logo constrained to 3.2cqw max height in
its own colors. Dense-exception density — this is the named one; the wall should feel like
a wall.
Scene 3 (1.8–2.5s): the row resolves composed and holds. One ink `micro-label` colophon in
the bottom rail. Then the whole wall accelerates LEFT into the caching chapter at 12.5s.

## Frame 6 — Use case: caching

- status: animated
- src: compositions/frames/07-caching.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: CACHING / HOT DATA, READY. A Valkey performance gauge resolves beside live cache-hit rows.
- rules: waterfall-entry, svg-icon-enrichment, stat-bars-and-fills
- focal: .media/images/icon_001.svg
- handoff_out: whole host accelerates LEFT into 14.6s.

The headline and official performance icon land first; key/value rows populate one by one and
a single action-blue hit marker confirms the hot path. Motion is finite and story-bearing.

## Frame 7 — Use case: sessions

- status: animated
- src: compositions/frames/08-sessions.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: SESSIONS / CART STATE THAT STICKS. A session key anchors a persistent shopping basket.
- rules: waterfall-entry, anchored-layout-expand, svg-icon-enrichment
- focal: .media/images/icon_002.svg
- handoff_out: whole host accelerates LEFT into 16.7s.

The reliability icon acts as the state badge while three item rows settle into a brand-native
basket. The session key locks last, turning persistence into a visible action.

## Frame 8 — Use case: message queues

- status: animated
- src: compositions/frames/09-message-queues.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: MESSAGE QUEUES / NOTIFICATIONS, IN ORDER. Four packets advance through a queue rail.
- rules: waterfall-entry, dynamic-content-sequencing, svg-icon-enrichment
- focal: .media/images/icon_003.svg
- handoff_out: whole host accelerates LEFT into 18.8s.

Packets step forward in order and one dispatches to a simple notification endpoint. The one
blue atom marks the active delivery, not decoration.

## Frame 9 — Use case: leaderboards

- status: animated
- src: compositions/frames/10-leaderboards.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: LEADERBOARDS / EVERY SCORE, RANKED LIVE. Three ranks update and one player overtakes.
- rules: waterfall-entry, nudge-curve, stat-bars-and-fills
- focal: .media/images/icon_004.svg
- handoff_out: whole host accelerates LEFT into 20.9s.

The ranking starts composed enough to read, then rows 02 and 03 trade positions on a single
seek-safe move while their score bars resolve.

## Frame 10 — Use case: chatbots

- status: animated
- src: compositions/frames/11-chatbots.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: CHATBOTS / PUBLISH ONCE. REPLY EVERYWHERE. One prompt fans out to three subscribers.
- rules: waterfall-entry, avatar-cloud-network, control-target-sync
- focal: .media/images/icon_005.svg
- handoff_out: whole host accelerates LEFT into 23.0s.

A prompt publishes onto a shared bus; three finite packets arrive at subscriber reply nodes in
sequence. The single blue dot is the publish event that causes every response.

## Frame 11 — Use case: IoT streams

- status: animated
- src: compositions/frames/12-iot.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: IOT STREAMS / MILLIONS OF SIGNALS. ONE FLOW. Sensor packets become an observable stream.
- rules: waterfall-entry, stat-bars-and-fills, chart-scrub-readout
- focal: .media/images/icon_006.svg
- handoff_out: whole host accelerates LEFT into 25.1s.

Five signals enter a shared stream and compact into a live chart window. The sweep is finite;
its purpose is to show ingestion becoming visibility.

## Frame 12 — Use case: geospatial

- status: animated
- src: compositions/frames/13-geospatial.html
- duration: 2.6s
- transition_in: cut-the-curve LEFT
- poster: 1.55s
- scene: GEOSPATIAL / THE NEAREST RIDE, NOW. A city grid resolves the nearest car route.
- rules: waterfall-entry, svg-path-draw, control-target-sync
- focal: .media/images/icon_007.svg
- handoff_out: the geospatial surface accelerates LEFT into its 95.6s QR interstitial.

The data-hash icon becomes a city grid; two origins compete and the nearest car takes a fixed
two-segment route to the one action-blue destination.

## Frame 13 — Call: get started

- status: animated
- src: compositions/frames/06-call.html
- duration: 3.0s
- transition_in: inverse zoom-through (Z-pull, ARRIVAL)
- poster: 2.2s
- scene: The gradient closer arrives oversized and retracts — logo, GET STARTED, valkey.io.
- blueprint: logo-assemble-lockup (Adapt)
- focal: assets/valkey-logo.svg
- roles: valkey-logo.svg = cutout (the lockup subject, rigid — no draw-on, no deform)
- sfx: impact-deep
- handoff_in: frame `#f6-root` ignites at 105.6s with scale 1.25, blur 18px, and opacity 0.35, retracting to scale 1 / blur 0 / opacity 1 on `expo.out` over 1.0s. **Arrives composed** — the logo, imperative, and pill are already at their final transforms inside the retracting wrapper. No grow-from-small entrance before 106.6s, or it fights the Z-pull sign.

Adapt: keep the lockup signature — mark, imperative, and one action resolving into a single
centered stack — but the assembly happens *outside* the seam window: the retraction delivers
the composed lockup, and only the pill and colophon are staged after it settles.

Scene 1 (0.0–0.5s): `ground-gradient-purple-peri` (section-purple → periwinkle, top to
bottom). The frame arrives **oversized and retracting** into the focal plane — the official
Valkey logo and the imperative **GET STARTED.** in `display-hero` 700 white sit centered,
already composed, riding the retraction. Nothing animates on its own inside this window.
Scene 2 (0.5–1.4s): retraction settles. Now the staged reveals fire: the
`button-primary-giant` action-blue pill lands below the imperative on a **waterfall entry**
(`waterfall-entry`) — the frame's one blue atom and its one CTA — then the
`colophon-bar` with **valkey.io** settles into the bottom rail on the next beat.
Scene 3 (1.4–2.5s): **the held read.** Everything still — centered lockup, one pill,
one URL, ~65% empty. No drift, pulse, or push. At local 2.22s the whole call frame
accelerates LEFT into the 108.6s final QR cut.

## Frame 14 — QR finale: scan and connect

- status: static scan hold
- src: compositions/frames/14-qr-finale.html
- duration: 15.0s
- transition_in: cut-the-curve LEFT
- poster: 2.0s
- scene: Four high-contrast QR cards present valkey.io, LinkedIn, Instagram, and KCD Argentina.
- focal: assets/valkey_io.svg · assets/valkey_linkedin.svg · assets/valkey_io-insta.png · assets/kcdargentina.png
- handoff_in: the full frame enters from +12% x at 108.6s, continuing the film's LEFT current.

The frame is fully composed from local t=0: **SCAN & CONNECT.** and all four QR cards are
visible together. The master wrapper carries the composition through the incoming seam;
the frame itself has no internal animation. It then remains unchanged through local 15.0s
for scanning. Legends stay visible beneath their matching codes: **valkey.io**,
**LinkedIn**, **Instagram**, and **KCD Argentina**.
