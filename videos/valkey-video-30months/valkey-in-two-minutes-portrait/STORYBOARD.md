---
format: 1080x1920
fps: 30
duration: 125.5s
message: "Memory-speed data, practical patterns, open source forever."
arc: Hook → Definition → Hands-on → Platform → Use cases → Deep dive → Community → CTA
audience: developers and technical decision-makers
tone: technically credible, practical, welcoming
mode: collaborative
captions: enabled
caption_keepout: "nothing below y 1594"
style: "minimal — one idea per frame, one light ground for the whole film, type carries the message; periwinkle #6983FF is the accent and lights only the active element; a glyph appears only where it replaces words or identifies the Valkey node; no decorative icons, stripes, imagery, dark frames, or background diagrams; PORTRAIT: stack what landscape placed side by side — rows become columns, 3×2 grids become 2×3, diagrams run top-to-bottom; key content inside the title-safe box x 108–972, y 192–1728"
brand_slot: "ONE persistent colour horizontal lockup on the MASTER timeline, bottom-right (x 840–1020, y 1760–1820). Frames NEVER draw a lockup. In Frames 2 and 13 the master timeline flies this same element into the hero position the frame leaves empty, and back."
grounds: "every frame: full-bleed ice gradient clip per frame.md ground component; zero ground changes"
diagram_reference: "sessions/well-architected-on-a-budget/components/CacheAsideDiagram.vue and SemanticCacheDiagram.vue — Frames 4 and 12 inherit node cards, bezier flows, pill labels, step bar, two-colour path semantics (frame.md components node_card / flow / pill / step_bar)"
timing_source: "audio_meta.json — real HeyGen voice durations and word timestamps; each frame = voice + a short hold; cue times below are scene-local seconds from the word timings"
asset_paths: "project-relative (this directory); every asset a frame names is already staged under assets/"
hard_exclusion: Apple — no mark, name, or incidental appearance anywhere
variant: "portrait 9:16 derived 2026-10-03 from the landscape storyboard; same frames, timings, voice, assets, and guardrails"
---

## Frame 1 — Memory speed versus disk

- scene: Two paths leave a processor; the RAM read lands first in periwinkle, a thin outline wraps the in-memory working set, a dashed arrow continues to disk
- timecode: 00:00.0–00:08.0
- duration: 8
- poster: 5
- transition_in: cut
- status: animated
- voiceover: "Memory access is faster than disk access. Valkey keeps working data in memory, with optional disk persistence."
- src: compositions/frames/f01-memory-vs-disk.html
- assets: assets/icons/memory-efficiency.svg, assets/icons/durability.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the RAM path lighting periwinkle while the disk pulse is still travelling
- portrait: Paths are vertical then fan out: processor (540,520) → RAM (330,1150) and → Disk (750,1150). Same beats and cues as landscape.
- roles: title top-left (y≈200); processor node card centred at y≈520; two VERTICAL paths run downward from it to two endpoints side by side at y≈1150 — RAM at x≈330, Disk at x≈750 — each a 120px glyph above a two-line 36px label; the RAM path lights periwinkle; the dashed persistence arrow runs from the RAM outline across to the disk endpoint; caption 'Conceptual comparison, not a benchmark' at y≈1500

**On screen:** MEMORY vs DISK · RAM: working data · Disk: persistent storage · "Conceptual comparison, not a benchmark"

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "Memory" 0.3, "disk" 2.1, "Valkey" 3.3, "memory" 4.9, "optional" 5.8, "persistence" 6.6):**

- Scene 1 (0.0–2.4s): title lands top-left (frame_title entrance). A processor node card sits left-centre (x≈300, y≈535). Two horizontal hairline paths (SVG, `svg-path-draw`) draw rightward from it at y≈430 (upper) and y≈640 (lower) toward two endpoints at x≈1380: upper = memory-efficiency glyph above "RAM · working data", lower = durability glyph above "Disk · persistent storage". Endpoints enter with the frame.md entrance token.
- Scene 2 (2.4–3.6s): two pulses (14px periwinkle dots) leave the processor together along both paths. The RAM pulse arrives at 3.3s and its path turns periwinkle 5px; the disk pulse is still only halfway and stays grey. Caption "Conceptual comparison, not a benchmark" appears bottom-left of the content band at 3.0s (y≈860).
- Scene 3 (3.6–5.6s): a thin 3px periwinkle outline (no fill) draws around the RAM endpoint (`svg-path-draw`, rectangle path); the words "working data" tint periwinkle. The disk pulse arrives at 5.2s with no colour change.
- Scene 4 (5.6–8.0s): a dashed grey 3px arrow draws from the RAM outline down-right to the disk endpoint, labelled "optional persistence" in caption_size. Hold composed; nothing else enters. Leave the bottom-right brand-slot zone empty.

**Guardrails.** No latency numbers, bar ratios, multipliers, or axes — the word "Conceptual" stays on screen. Do not draw RAM as durable, do not imply networked Valkey equals local-RAM latency, and do not imply every database query is a physical disk read.

## Frame 2 — What Valkey is

- scene: The exact valkey.io definition passes beneath an empty hero-lockup zone one phrase at a time, then the Linux Foundation mark and OPEN SOURCE FOREVER
- timecode: 00:08.0–00:28.0
- duration: 20
- poster: 15
- transition_in: cut
- status: animated
- voiceover: "Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever."
- src: compositions/frames/f02-definition.html
- assets: assets/external/lf-horizontal-color.svg
- blueprint: kinetic-type-beats (Adapt)
- rules: waterfall-entry
- focal: one phrase caption at a time, centred, each replacing the last
- portrait: Phrases wrap to at most two lines; nothing below y 1594.
- roles: hero-lockup zone EMPTY — reserved x 240–840, y 420–560 (the master timeline flies the lockup here); phrase captions centred at y≈760 in 48px/600, soft-wrapped to two lines inside x 108–972; LF mark 480px wide centred at y≈1000; closing statement 72px/800 periwinkle centred at y≈760 wrapped to two lines (OPEN SOURCE / FOREVER); attribution at y≈920

**On screen (one phrase at a time):** Open source · BSD licensed → High-performance key/value datastore → Caching · Message queues · Primary database → Backed by the Linux Foundation → OPEN SOURCE FOREVER · valkey.io

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "key-value" 4.2, "caching" 8.4, "message" 9.3, "primary" 11.3, "backed" 13.7, "Linux" 14.5, "forever" 18.3):**

- Scene 1 (0.0–4.0s): no frame title. The reserved hero zone stays empty (the lockup arrives there from the master timeline). Phrase 1 "Open source · BSD licensed" enters at 0.6s (phrase_caption, deep purple, centred y≈560) using the entrance token.
- Scene 2 (4.0–8.2s): at 4.0s phrase 1 cuts out and "High-performance key/value datastore" replaces it in place (hard swap, kinetic-type-beats token swap — no crossfade, opacity 0→1 via `tl.set`).
- Scene 3 (8.2–13.4s): at 8.2s the line becomes "Caching · Message queues · Primary database"; the three words tint periwinkle one at a time on their cues (8.4, 9.3, 11.3) while the separators stay deep purple.
- Scene 4 (13.4–17.8s): at 13.4s the phrase cuts to "Backed by the Linux Foundation"; at 14.5s the LF colour mark fades in beneath it (centred, y≈700, directly on the ground — no card, no recolour).
- Scene 5 (17.8–20.0s): at 17.8s the phrase and LF mark fall away (opacity to 0 in 0.25s) and "OPEN SOURCE FOREVER" arrives via `waterfall-entry` word-by-word (hero_statement 88px 800 periwinkle, centred y≈580), landing by 18.6s; attribution "valkey.io" appears beneath in caption_size at 18.8s. Hold to 20.0s.

**Guardrails.** Wording is verbatim — no paraphrase, no extra words. BSD refers to the core project. The LF mark is used exactly as shipped. Nothing on screen but one phrase (and the LF mark in Scene 4); never stack phrases.

## Frame 3 — SET a key and value

- scene: An illustrative valkey-cli transcript types SET Key Value → OK, then GET Key → "Value" and holds
- timecode: 00:28.0–00:34.5
- duration: 6.5
- poster: 5
- transition_in: cut
- status: animated
- voiceover: "Start with a key and a value. SET stores it. GET reads it back."
- src: compositions/frames/f03-set-get.html
- assets: none
- blueprint: compose
- rules: discrete-text-sequence, context-sensitive-cursor
- focal: the terminal card's current line
- portrait: Window narrower and taller; transcript lines unchanged (they fit at 48px).
- roles: title top-left; macOS terminal window 936×560 centred (x 72–1008, y 560–1120): 56px title bar 'valkey-cli' with traffic lights, body in 48px Cascadia Code, five transcript lines at 60px line-height; caret as in landscape

**On screen:**

```text
valkey> SET Key Value
OK
valkey> GET Key
"Value"
```

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "SET" 2.6, "stores" 3.0, "GET" 3.7, "reads" 4.0, voice ends 4.9):**

- Scene 1 (0.0–2.4s): title enters; the empty terminal card enters with a blinking caret after the prompt `valkey> ` (prompt in secondary colour).
- Scene 2 (2.4–3.2s): `SET Key Value` types in (`discrete-text-sequence`, ~14 chars over 0.6s) starting at 2.5s; at 3.1s a new line prints `OK` in periwinkle.
- Scene 3 (3.4–4.6s): a new prompt line; `GET Key` types from 3.6s; at 4.3s `"Value"` prints in periwinkle on the next line.
- Scene 4 (4.6–6.5s): caret blinks on a fresh empty prompt line; hold composed.

**Guardrails.** A client-session transcript, not a shell command — keep the `valkey>` prompt text exactly; it is what distinguishes this from Frame 14. Preserve "Key" / "Value" capitalization exactly. No TTL, no latency readouts, no window chrome.

## Frame 4 — Cache-aside: the everyday caching pattern

- scene: The well-architected deck's cache-aside triangle — Application, Valkey, Database — walked chronologically: check, miss, read once, fill with TTL, then a hit that never touches the database
- timecode: 00:34.5–00:49.0
- duration: 14.5
- poster: 12
- transition_in: cut
- status: animated
- voiceover: "Cache-aside is a common starting point. Your app checks Valkey first. On a miss, it reads the database and caches the result with an expiry. The next hit skips the database."
- src: compositions/frames/f04-cache-aside.html
- assets: assets/brand/valkey-icon-periwinkle.svg, assets/icons/durability.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the one currently-lit flow
- portrait: Triangle rotated: app top-left, Valkey right-middle, database bottom-left; the maroon read flow runs app→database down the left edge; same beats and cues.
- roles: title top-left; three node_cards stacked vertically down the centre-left: APPLICATION (x≈120–420, y≈420) · VALKEY (x≈620–920, y≈700, icon mark top-right) · DATABASE (x≈120–420, y≈1000, durability glyph beside the eyebrow); flows are vertical/diagonal beziers between them with pills; step_bar at y≈1380 (full width x 72–1008, two lines allowed); footnote at y≈1500

**On screen:** CACHE-ASIDE · APPLICATION · VALKEY · DATABASE · pills: GET key · MISS · read once · SET + EX 60 · HIT · return · step bar: 1 · CHECK → 2 · MISS → 3 · LOAD → 4 · FILL → 5 · HIT · footnote: Write path: update database, then invalidate cache

**Inherit from frame.md components exactly:** node_card (resting vs current), flow (periwinkle = fast path; `expensive` maroon = the database read ONLY), pill, step_bar. Flows are cubic beziers drawn with `svg-path-draw`; once drawn they rest at 0.32 opacity; the current flow is 7px at full opacity. The current card lifts 6px with the periwinkle border.

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "checks" 3.8, "miss" 5.8, "reads" 6.5, "database" 7.0, "caches" 7.7, "expiry" 9.1, "next" 10.4, "hit" 10.8, "skips" 11.2, voice ends 12.6):**

- Scene 1 (0.0–3.6s): title, then the three cards enter (entrance token, 0.15s stagger); the step bar enters reading "READY · The application owns the cache decision." No flows yet.
- Scene 2 (3.6–5.6s): 1 · CHECK — APPLICATION current; flow app→Valkey draws periwinkle with pill "GET key"; step bar swaps to "1 · CHECK · Ask Valkey before asking the database."
- Scene 3 (5.6–6.6s): 2 · MISS — return flow Valkey→app draws in hairline grey (not periwinkle, not maroon) with pill "MISS"; VALKEY card current; step bar "2 · MISS · The key is absent."
- Scene 4 (6.6–8.0s): 3 · LOAD — flow app→DATABASE draws in `expensive` maroon with pill "read once"; DATABASE card current; step bar "3 · LOAD · Read the source value once."
- Scene 5 (8.0–10.2s): 4 · FILL — flow app→Valkey draws periwinkle with pill "SET + EX 60"; VALKEY current; a small mono tag `EX 60` appears on the Valkey card; step bar "4 · FILL · Store with an expiry, then return."
- Scene 6 (10.2–12.8s): 5 · HIT — a second GET flow pulses periwinkle, then the return flow Valkey→app draws periwinkle with pill "HIT · return"; the maroon database flow stays at 0.32; step bar "5 · HIT · The database is never touched."
- Scene 7 (12.8–14.5s): footnote fades in at y≈875: "Write path: update database, then invalidate cache". Hold.

**Guardrails.** The maroon flow always leaves the APPLICATION card, never the Valkey card (read-through would be the wrong pattern). No adoption percentages or "most common" ranking. Labels ≥40px; nothing below y 896.

## Frame 5 — Releases

- scene: A compact static release board: 9.1.2 featured, 8.1.10 and 7.2.14 as supported prior lines, 9.2.0-rc1 in a separate dashed PREVIEW region
- timecode: 00:49.0–00:55.0
- duration: 6
- poster: 3
- transition_in: cut
- status: animated
- voiceover: "Choose stable releases, or explore the next release candidate."
- src: compositions/frames/f05-releases.html
- assets: none
- blueprint: compose
- rules: waterfall-entry
- focal: the 9.1.2 card
- portrait: Stable cards stacked above the preview region; preview still visually separate.
- roles: title top-left; 9.1.2 card 600×240 centred at y≈520 (number 60px periwinkle); the two prior-line cards 440×180 side by side at y≈840 (x≈100 and x≈540); dashed PREVIEW region 600×180 centred at y≈1140; date stamp at y≈1500

**On screen:** RELEASES · Featured stable: 9.1.2 · Supported prior lines: 8.1.10 · 7.2.14 · PREVIEW: 9.2.0-rc1 · As of 2026-10-02

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice: "stable" ≈1.4, "next release candidate" ≈3.4–5.1):**

- Scene 1 (0.0–1.2s): title; the three stable cards arrive as a `waterfall-entry` cascade (total ≤0.3s) by 1.0s, 9.1.2's number in periwinkle 64px 800, the others in deep purple.
- Scene 2 (1.2–3.4s): hold; the 9.1.2 card takes the current state (periwinkle border) at 1.4s.
- Scene 3 (3.4–6.0s): the dashed PREVIEW region enters at 3.4s with "9.2.0-rc1" in secondary grey; the date stamp appears at 4.0s. Hold.

**Guardrails.** The preview never sits in the stable row and never gets periwinkle. These are the homepage's featured lines, not a support matrix.

## Frame 6 — Modules

- scene: Four named module cards dock onto the Valkey node: JSON, Search, Bloom, LDAP
- timecode: 00:55.0–01:01.5
- duration: 6.5
- poster: 4.5
- transition_in: cut
- status: animated
- voiceover: "Extend Valkey with JSON, Search, Bloom, and LDAP modules."
- src: compositions/frames/f06-modules.html
- assets: assets/brand/valkey-icon-periwinkle.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the Valkey node, current throughout
- portrait: Same dock order and cues; cards slide in from their edges.
- roles: title top-left; VALKEY hub card 300×140 centred at y≈900; four module cards 400×140 at the four corners of a 2×2 arrangement — top-left (x≈90,y≈560), top-right (x≈590,y≈560), bottom-left (x≈90,y≈1240), bottom-right (x≈590,y≈1240) — with connectors to the hub

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "JSON" 1.7, "Search" 2.4, "Bloom" 3.0, "LDAP" 4.0, voice ends 5.5):**

- Scene 1 (0.0–1.5s): title; the VALKEY card enters current (periwinkle border) at 0.4s.
- Scene 2 (1.5–4.4s): on each cue a module card slides in from its edge (fromTo x/y ±120 → 0, 0.5s, power3.out) to its diagonal position — top-left at 1.6s (json), top-right at 2.3s (search), bottom-left at 2.9s (bloom), bottom-right at 3.9s (ldap) — and its connector draws toward the centre card (`svg-path-draw`, 0.3s) as it lands.
- Scene 3 (4.4–6.5s): hold composed; all four connectors rest at 0.32 opacity, the centre card stays current.

**Guardrails.** Module names as text — no invented module logos, no glyphs on the tiles. Search covers full-text and vector; Bloom is approximate membership, never a fraud classifier; LDAP is authentication, not identity management.

## Frame 7 — Integrations

- scene: Three app cards connect through a client band — GLIDE, Spring Boot, Fastify, Powertools for AWS Lambda — to the Valkey node, text labels only
- timecode: 01:01.5–01:08.0
- duration: 6.5
- poster: 4.5
- transition_in: cut
- status: animated
- voiceover: "Connect through GLIDE, Spring Boot, Fastify, and Lambda Powertools."
- src: compositions/frames/f07-integrations.html
- assets: assets/brand/valkey-icon-periwinkle.svg
- blueprint: compose
- rules: svg-path-draw
- focal: the GLIDE label
- portrait: Flow runs top (apps) → middle (band) → bottom (Valkey).
- roles: title top-left; three app cards in a row at y≈460 (x≈90/390/690, 300×130); the client band 820×360 centred at y≈840 (GLIDE 36px on top, three integrations beneath); VALKEY card 300×140 centred at y≈1300; connectors run downward

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "GLIDE" 1.0, "Spring" 1.9, "Fastify" 2.8, "Lambda" 4.1, voice ends 5.6):**

- Scene 1 (0.0–1.0s): title; the three app cards, the empty band, and the Valkey card enter (entrance token, 0.1s stagger).
- Scene 2 (1.0–4.6s): "Valkey GLIDE" lands in the band at 1.0s and its connectors draw — three from the app cards into the band and one from the band to Valkey — in periwinkle (`svg-path-draw`, 0.5s); "Spring Boot" appears at 1.9s, "Fastify" at 2.8s, "Powertools for AWS Lambda" at 4.1s (entrance token each).
- Scene 3 (4.6–6.5s): hold composed; the VALKEY card takes the current state at 4.8s.

**Guardrails.** Text labels only — no third-party logos. They are distinct integrations, not one adapter; no equal-feature-coverage claim.

## Frame 8 — Use cases: application state and traffic

- scene: Five labels with their glyphs in a clean 3×2 grid, all present within 0.3s and held; nothing behind them
- timecode: 01:08.0–01:13.0
- duration: 5
- poster: 3
- transition_in: cut
- status: animated
- voiceover: "Cache data, manage sessions, and control traffic."
- src: compositions/frames/f08-usecases-state-traffic.html
- assets: assets/icons/performance.svg, assets/icons/data-hash.svg, assets/icons/data-list.svg, assets/icons/security.svg, assets/icons/vertical-scaling.svg
- blueprint: grid-card-assemble (Adapt)
- rules: waterfall-entry
- focal: the whole grid as one beat
- portrait: Grid is 2 columns × 3 rows; same waterfall arrival by 0.3s and same cue tints.
- roles: title top-left; 2×3 grid of panel_cells (cells 440×360; columns at x≈310/770; rows at y≈520/920/1320): performance→Cache, data-hash→Sessions, data-list→Counters, security→Rate limiter, vertical-scaling→Global IDs; sixth cell = marker 'Application patterns'
- use_case_ids: 1, 2, 4, 5, 6

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "Cache" 0.3, "sessions" 1.4, "traffic" 3.3, voice ends 4.3):**

- Scene 1 (0.0–0.5s): title lands; all five cells arrive as one `waterfall-entry` cascade completing by 0.3s; the marker cell fades in at 0.5s.
- Scene 2 (0.5–5.0s): hold. On each cue the matching label tints periwinkle for 0.6s then returns to deep purple: "Cache" at 0.3s, "Sessions" at 1.4s, "Rate limiter" at 3.3s. Nothing is drawn behind the grid.

**Guardrails.** Labels never swap in and out. No diagram behind the grid. The marker keeps this from reading as turnkey guarantees.

## Frame 9 — Use cases: service coordination

- scene: Five labels with their glyphs in the same 3×2 grid, present within 0.3s and held
- timecode: 01:13.0–01:18.0
- duration: 5
- poster: 3
- transition_in: cut
- status: animated
- voiceover: "Coordinate services and keep retries under control."
- src: compositions/frames/f09-usecases-coordination.html
- assets: assets/icons/hardening.svg, assets/icons/horizontal-scaling.svg, assets/icons/replication.svg, assets/icons/reliability.svg, assets/icons/community.svg
- blueprint: grid-card-assemble (Adapt)
- rules: waterfall-entry
- focal: the whole grid as one beat
- portrait: Identical cell positions to Frame 8.
- roles: title top-left; same 2×3 grid geometry as Frame 8: hardening→Distributed locks, horizontal-scaling→Message queue, replication→Chats / Pub/Sub, reliability→Idempotency, community→Microservices; marker 'Application patterns'
- use_case_ids: 3, 7, 10, 11, 13

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "Coordinate" 0.3, "retries" ≈2.3, voice ends 4.1):**

- Scene 1 (0.0–0.5s): title; five cells arrive as one `waterfall-entry` cascade by 0.3s; marker at 0.5s.
- Scene 2 (0.5–5.0s): hold; "Microservices" tints periwinkle at 0.4s for 0.6s, "Idempotency" at 2.3s for 0.6s.

**Guardrails.** Do not suggest Pub/Sub persists chat history, that locks are failure-proof, or that idempotency means exactly-once external effects. "Chats / Pub/Sub" is the exact label.

## Frame 10 — Use cases: ordered data and membership

- scene: Four labels and one paired sub-label in the same grid, present within 0.3s and held
- timecode: 01:18.0–01:24.0
- duration: 6
- poster: 3.5
- transition_in: cut
- status: animated
- voiceover: "Track rankings and event histories. Add Bloom filters for fraud-screening prechecks."
- src: compositions/frames/f10-usecases-ordered-membership.html
- assets: assets/icons/vertical-scaling.svg, assets/icons/observability.svg, assets/icons/data-list.svg, assets/icons/durability.svg
- blueprint: grid-card-assemble (Adapt)
- rules: waterfall-entry
- focal: the whole grid as one beat
- portrait: Identical cell positions to Frame 8.
- roles: title top-left; same 2×3 grid geometry: vertical-scaling→Rank / leaderboard, observability→Time-series, data-list→Append-only log · Streams, durability→Probabilistic membership (+ 24px second line 'Fraud prechecks · Bloom module'); fifth cell empty; sixth = marker 'Core + Bloom module'
- use_case_ids: 8, 9, 12, 17

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "rankings" 0.7, "histories" 1.4, "Bloom" 2.6, "prechecks" ≈4.6, voice ends 5.1):**

- Scene 1 (0.0–0.5s): title; the four cells arrive by 0.3s; marker at 0.5s.
- Scene 2 (0.5–6.0s): hold; "Rank / leaderboard" tints periwinkle at 0.7s, "Append-only log · Streams" at 1.4s, "Probabilistic membership" at 2.6s, and its sub-line tints at 4.6s. Each tint lasts 0.6s.

**Guardrails.** Never render "Fraud detected" — the sub-label says "prechecks". Streams is the event-log model; AOF persistence is a separate server mechanism.

## Frame 11 — Use cases: documents, search and AI

- scene: Five labels with their glyphs in the same grid, present within 0.3s and held
- timecode: 01:24.0–01:34.5
- duration: 10.5
- poster: 6
- transition_in: cut
- status: animated
- voiceover: "Build with JSON documents and full-text search. Add vector search, KV-cache offload, and semantic caching."
- src: compositions/frames/f11-usecases-documents-ai.html
- assets: assets/icons/data-hash.svg, assets/icons/hardening.svg, assets/icons/general-scaling.svg, assets/icons/memory-efficiency.svg, assets/icons/performance.svg
- blueprint: grid-card-assemble (Adapt)
- rules: waterfall-entry
- focal: the whole grid as one beat
- portrait: Identical cell positions to Frame 8.
- roles: title top-left; same 2×3 grid geometry: data-hash→Document database / JSON, hardening→Full-text search engine, general-scaling→Vector database, memory-efficiency→LLM KV cache offload, performance→Semantic cache; marker 'Modules + integrations'
- use_case_ids: 14, 15, 16, 18, 19

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "JSON" 0.9, "full-text" 2.4, "vector" 4.6, "KV-cache" 6.1, "semantic" 8.1, voice ends 9.6):**

- Scene 1 (0.0–0.5s): title; five cells arrive by 0.3s; marker at 0.5s.
- Scene 2 (0.5–10.5s): hold; labels tint periwinkle for 0.6s on their cues: JSON 0.9, Full-text 2.4, Vector 4.6, KV cache 6.1, Semantic cache 8.1. The extra seconds are hold, not more content.

**Guardrails.** Embedding and inference happen outside Valkey. KV cache means transformer key/value-tensor offload, distinct from the generic Cache in Frame 8. Full-text is a valkey-search module feature.

## Frame 12 — Semantic caching: vector similarity for AI

- scene: The well-architected deck's semantic-cache row — Prompt, Embedding, Valkey Search, Model — with a VALID? gate added; a hit returns Paris without the model, then a miss calls the model once and stores
- timecode: 01:34.5–01:51.5
- duration: 17
- poster: 11
- transition_in: cut
- status: animated
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

## Frame 13 — Participant community

- scene: A balanced 7×3 alphabetical wall of all 21 participant marks fills beneath an empty hero-lockup zone within 0.3s and holds
- timecode: 01:51.5–01:57.0
- duration: 5.5
- poster: 3
- transition_in: cut
- status: animated
- voiceover: "Built together, by the Valkey community. Open source forever."
- src: compositions/frames/f13-participants.html
- assets: assets/participants/01-aiven.svg, assets/participants/02-alibaba-cloud.png, assets/participants/03-aws.svg, assets/participants/04-anynines.svg, assets/participants/05-betterdb.svg, assets/participants/06-bytedance.svg, assets/participants/07-digitalocean.svg, assets/participants/08-ericsson.svg, assets/participants/09-freshworks.png, assets/participants/10-google-cloud.svg, assets/participants/11-heroku.svg, assets/participants/12-ionos-cloud.svg, assets/participants/13-k0rdent.svg, assets/participants/14-momento.svg, assets/participants/15-netapp-instaclustr.svg, assets/participants/16-oracle.svg, assets/participants/17-percona.svg, assets/participants/18-solanica.svg, assets/participants/19-tencent-cloud.svg, assets/participants/20-upcloud.svg, assets/participants/21-vultr.svg
- blueprint: grid-card-assemble (Adapt)
- rules: waterfall-entry
- focal: the wall as one beat
- portrait: Wall is 3×7 instead of 7×3; same alphabetical order, same arrival by 0.3s.
- roles: hero-lockup zone EMPTY — reserved x 300–780, y 260–360 (the master timeline flies the lockup here); eyebrow 'VALKEY PROJECT PARTICIPANTS' centred at y≈420; URLs at y≈470; the wall: 3 columns × 7 rows of marks in file order (01→21), each fitted inside a 260×80 box with object-fit contain, grid spanning x 120–960 and y 560–1540

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "Built" 0.3, "community" ≈2.0, "forever" ≈3.9, voice ends 4.3):**

- Scene 1 (0.0–0.5s): the eyebrow and URLs enter at 0.2s; all 21 marks arrive as one `waterfall-entry` cascade completing by 0.3s (binary opacity via `tl.set`, row by row).
- Scene 2 (0.5–5.5s): hold, near-static. No scrolling, no cell borders, no title rule, no hover states.

**Guardrails.** Apple is excluded from everything — do not add any mark not listed in assets. Use each file as shipped: no cropping, recolouring, filters, or redrawing; fit, never stretch. Equal visual weight — same box for every mark. The caption "participants" wording only; never customers, sponsors, or endorsements.

## Frame 14 — Run Valkey: final command

- scene: The corrected Docker command types into a hairline card by 1s and holds unchanged to the last frame
- timecode: 01:57.0–02:05.5
- duration: 8.5
- poster: 5
- transition_in: cut
- status: animated
- voiceover: "Run Valkey's core server with Docker using this command. Start building at valkey dot I O."
- src: compositions/frames/f14-docker-cta.html
- assets: none
- blueprint: compose
- rules: discrete-text-sequence
- focal: the command
- portrait: Command wraps visually at the space before 'valkey/valkey:alpine'; nothing bottom-right.
- roles: title top-left; macOS terminal window 936×420 centred (x 72–1008, y 620–1040): title bar 'Terminal — zsh'; the command in 52px Cascadia Code soft-wrapped onto two lines ('docker run --rm' / 'valkey/valkey:alpine' in periwinkle) — the text is still one command, never altered; caption 'Core server · Docker required' at y≈1100; links 'valkey.io · github.com/valkey-io' bottom-LEFT at x≈72, y≈1500

**On screen:** TRY VALKEY · docker run --rm valkey/valkey:alpine · Core server · Docker required · valkey.io · github.com/valkey-io

**Shot sequence (beats and cues are authoritative; any x/y inside them is landscape geometry — use the `roles:` and `portrait:` lines for placement) (voice cues: "Docker" 1.8, "command" 3.1, "valkey" 5.0, voice ends 7.1):**

- Scene 1 (0.0–1.0s): title and the empty card enter at 0.0–0.4s; the command types in (`discrete-text-sequence`, 36 characters) from 0.3s and is complete by 1.0s. No `$` prompt, no `valkey>` prompt.
- Scene 2 (1.0–8.5s): the command never changes again. The caption line "Core server · Docker required" appears at 3.2s; the links appear bottom-left at 5.0s. This is the final frame: a quiet settle is allowed, no exit.

**Guardrails.** The command is exactly `docker run --rm valkey/valkey:alpine`. No simulated startup logs, no "success" line, no port, no volume, no prompt character. The command must not be covered by captions — keep the card above y 800. Nothing is drawn bottom-right.
