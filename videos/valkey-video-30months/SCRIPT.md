# Valkey in two minutes: memory-speed data and practical patterns

## Scope

The employee approved a longer video. This revision keeps the exact definition, releases, modules, integrations, all 19 use cases and non-Apple participant logos, while adding five standalone scenes: memory versus disk, SET/GET, cache-aside, semantic caching with vector similarity, and a final Docker command.

This is a script and HyperFrames authoring brief, not executable composition HTML or a rendered video. TIMELINE.json is a structured editorial handoff, not a native HyperFrames import format.

- Planned runtime: 120 seconds, 1920 × 1080, 16:9, 30 fps, 3,600 frames across 14 scenes.
- Narration: 229 whitespace-delimited words. Acronym expansion adds spoken words. Record and fit each scene before export; the timeline is planned, not audio-measured.
- Audience: developers and technical decision-makers. Tone: technically credible, practical and welcoming.
- Overview panels retain all 19 labels; cache-aside and semantic caching now receive dedicated walkthroughs as well.
- Exclude Apple branding everywhere. Use the explicit participant allowlist, not an unfiltered website capture.
- Sources checked October 2, 2026. Release and roster evidence carries forward from the preceding revision; recheck both before publication.
- Interpretations retained: “put-sub” means Pub/Sub; “KV cache” means inference tensor KV-cache offload; Streams event logs and AOF persistence are distinct.

## Exact definition, preserved

> Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever.

Use this exact wording in scene 2. Speak BSD as individual letters and key/value as “key value.” The closing phrase quotes Valkey's stated project commitment.

## Docker correction

The requested `docker run --rm valkey/valkey-alpine` references a repository whose lookup returned HTTP 404. The official `alpine` tag under `valkey/valkey` is active. The final frame therefore uses `docker run --rm valkey/valkey:alpine`. This was verified through registry metadata, not by running a container. [[24]](https://hub.docker.com/v2/repositories/valkey/valkey/tags/alpine) [[25]](https://hub.docker.com/v2/repositories/valkey/valkey-alpine/)

## Scene-by-scene script

### Scene 1: 00:00–00:08 | Memory speed versus disk

**Voiceover:** “Memory access is faster than disk access. Valkey keeps working data in memory, with optional disk persistence.”

**On screen:** MEMORY vs DISK; RAM: working data; Disk: persistent storage; Conceptual comparison, not a benchmark

**Motion and composition:** Open with two hardware-level paths from a processor: RAM and persistent disk/SSD. Animate the memory read arriving first, with no numeric latency, bar ratio, multiplier or benchmark axis. Label the comparison Conceptual. Then put Valkey around the in-memory working dataset with an optional persistence arrow to disk. Do not portray RAM as durable, networked Valkey as local RAM speed, or every database query as a physical disk read. End on the Valkey logo for the definition.

**Overview use-case IDs:** None

**Sources:** [[22]](https://valkey.io/topics/introduction/) [[16]](https://valkey.io/topics/persistence/) [[26]](https://valkey.io/topics/client-side-caching/)

### Scene 2: 00:08–00:27 | What Valkey is

**Voiceover:** “Valkey is an open source (BSD) high-performance key/value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever.”

**On screen:** VALKEY; Open source · BSD licensed; High-performance key/value datastore; Caching · Message queues · Primary database; Backed by the Linux Foundation; OPEN SOURCE FOREVER

**Motion and composition:** Speak the exact requested definition over two phases relative to this scene: 0–12 seconds for the Valkey logo, key/value diagram and workloads; 12–19 seconds for Linux Foundation backing and OPEN SOURCE FOREVER. Attribute the commitment to valkey.io. Use phrase captions, not the entire paragraph on one frame.

**Overview use-case IDs:** None

**Sources:** [[1]](https://valkey.io/)

### Scene 3: 00:27–00:35 | SET a key and value

**Voiceover:** “Start with a key and a value. SET stores it. GET reads it back.”

**On screen:** START WITH A KEY AND VALUE; SET Key Value; OK; GET Key; "Value"

**Motion and composition:** Show an illustrative valkey-cli transcript, not a shell command. At scene-local 0–3s reveal SET Key Value; at 3s show OK. At 4–5s reveal GET Key, then show "Value" and hold. Keep Key and Value capitalization intact. No TTL is implied by this basic SET. The transcript is documented expected behavior, not a recorded execution.

**Illustrative terminal content:**

```text
valkey> SET Key Value
OK
valkey> GET Key
"Value"
```

**Overview use-case IDs:** None

**Sources:** [[21]](https://valkey.io/commands/set/)

### Scene 4: 00:35–00:53 | Cache-aside: the everyday caching pattern

**Voiceover:** “Cache-aside is a common starting point. Your app checks Valkey first. On a miss, it reads the database and caches the result with an expiry. The next hit skips the database.”

**On screen:** CACHE-ASIDE; Application; Valkey cache; Primary database; 1. Check cache; 2. Miss: read database; 3. Populate cache + expiry; 4. Next hit: skip database; Write path: update database, then invalidate cache

**Motion and composition:** Give caching the featured-use-case position requested by the employee, without inventing adoption percentages or a measured most-common ranking. Show the application owning each arrow. For the first read: app → Valkey GET product:42 → miss; app → primary database → product data; app → Valkey SET product:42 "blue mug" EX 60 → OK; app → caller returns product. For a second read while the entry is valid, app → Valkey → hit → caller, with no database arrow lit. Never draw Valkey fetching the database on a miss; that would imply read-through caching. A final small write-path note says update database, then invalidate cache. TTL and invalidation reduce staleness but do not guarantee consistency under races. Production needs failure and stampede handling.

**Cache-population example (inside valkey-cli):**

```text
SET product:42 "blue mug" EX 60
```

**Scene-local animation beats:**

- 0–4s: app cache lookup and miss.
- 4–8s: app reads primary database.
- 8–12s: app populates cache with expiry and returns.
- 12–18s: next request cache hit skips database.

**Overview use-case IDs:** None

**Dedicated walkthrough IDs:** 1

**Sources:** [[1]](https://valkey.io/) [[21]](https://valkey.io/commands/set/) [[23]](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

### Scene 5: 00:53–00:57 | Releases

**Voiceover:** “Choose stable releases, or explore the next release candidate.”

**On screen:** RELEASES; Featured stable: 9.1.2; Supported prior lines: 8.1.10 · 7.2.14; Preview: 9.2.0-rc1; As of 2026-10-02

**Motion and composition:** Show a compact static release board. Keep the preview in a separate outlined region with the word PREVIEW, never in the stable row. Numbers remain visual so narration does not rush. These are the stable releases featured on the homepage, not an exhaustive support matrix. Recheck just before render/publication.

**Overview use-case IDs:** None

**Sources:** [[1]](https://valkey.io/) [[2]](https://github.com/valkey-io/valkey/releases)

### Scene 6: 00:57–01:02 | Modules

**Voiceover:** “Extend Valkey with JSON, Search, Bloom, and LDAP modules.”

**On screen:** EXTEND WITH MODULES; valkey-json: JSON documents; valkey-search: Full-text + vectors; valkey-bloom: Membership filters; valkey-ldap: Authentication

**Motion and composition:** Attach four named extension tiles to the server. Display module names as text, not invented logos. The framing must show these as loadable modules. The Search tile covers full-text and vector search; Bloom is approximate membership, not a fraud classifier.

**Overview use-case IDs:** None

**Sources:** [[6]](https://valkey.io/topics/valkey-json/) [[7]](https://valkey.io/blog/valkey-search-1_2/) [[8]](https://github.com/valkey-io/valkey-search) [[9]](https://valkey.io/topics/bloomfilters/) [[10]](https://github.com/valkey-io/valkey-ldap)

### Scene 7: 01:02–01:06 | Integrations

**Voiceover:** “Connect through GLIDE, Spring Boot, Fastify, and Lambda Powertools.”

**On screen:** CONNECT YOUR STACK; Valkey GLIDE; Spring Boot · Fastify; Powertools for AWS Lambda

**Motion and composition:** Show applications connecting through the client/integration layer. Ground the labels in spring-data-valkey, @fastify/valkey-glide, and the GLIDE-backed idempotency integrations for Powertools. These are distinct integrations, not one universal adapter. Use text labels to avoid adding unrequested third-party integration logos.

**Overview use-case IDs:** None

**Sources:** [[4]](https://github.com/valkey-io/valkey-glide) [[5]](https://github.com/valkey-io/spring-data-valkey)

### Scene 8: 01:06–01:11 | Use cases: application state and traffic

**Voiceover:** “Cache data, manage sessions, and control traffic.”

**On screen:** APPLICATION STATE + TRAFFIC; Cache; Sessions; Counters; Rate limiter; Global IDs

**Motion and composition:** Reveal the five use-case labels together within 0.3 seconds, then hold. Use one request diagram with cache, session and traffic-control branches. Highlight existing labels rather than replacing them. Display a small Application patterns marker so this does not imply turnkey guarantees.

**Overview use-case IDs:** 1, 2, 4, 5, 6

**Sources:** [[1]](https://valkey.io/) [[4]](https://github.com/valkey-io/valkey-glide) [[12]](https://valkey.io/commands/incr/)

### Scene 9: 01:11–01:16 | Use cases: service coordination

**Voiceover:** “Coordinate services and keep retries under control.”

**On screen:** SERVICE COORDINATION; Distributed locks; Message queue; Chats / Pub/Sub; Idempotency; Microservices

**Motion and composition:** Show a service-to-service request path with a lock, queued work and retry marker. Keep all five labels visible for almost the full scene. Do not suggest Pub/Sub persists chat history, distributed locks are failure-proof, or idempotency means exactly-once external effects.

**Overview use-case IDs:** 3, 7, 10, 11, 13

**Sources:** [[4]](https://github.com/valkey-io/valkey-glide) [[13]](https://valkey.io/topics/distlock/) [[14]](https://valkey.io/topics/streams-intro/) [[15]](https://valkey.io/topics/pubsub/)

### Scene 10: 01:16–01:21 | Use cases: ordered data and membership

**Voiceover:** “Track rankings and event histories. Add Bloom filters for fraud-screening prechecks.”

**On screen:** ORDERED DATA + MEMBERSHIP; Rank / leaderboard; Time-series; Append-only log · Streams; Probabilistic membership; Fraud prechecks · Bloom module

**Motion and composition:** Use a leaderboard and timestamped event stream. Add a Bloom membership gate feeding Verify against source, never Fraud detected. Pair Probabilistic membership with the smaller Fraud prechecks label, not a fifth independent capability. Streams is the event-log model; AOF persistence is documented separately in USE_CASES.md.

**Overview use-case IDs:** 8, 9, 12, 17

**Sources:** [[9]](https://valkey.io/topics/bloomfilters/) [[14]](https://valkey.io/topics/streams-intro/) [[17]](https://valkey.io/)

### Scene 11: 01:21–01:28 | Use cases: documents, search and AI

**Voiceover:** “Build with JSON documents and full-text search. Add vector search, KV-cache offload, and semantic caching.”

**On screen:** DOCUMENTS, SEARCH + AI; Document database / JSON; Full-text search engine; Vector database; LLM KV cache offload; Semantic cache; Modules + integrations

**Motion and composition:** Keep five large labels visible. Connect JSON documents to full-text and vector indexes. Show two distinct cache paths: inference tensor chunks for LLM KV cache offload, and similar prompts/answers for semantic cache. Embedding generation and inference live outside Valkey.

**Overview use-case IDs:** 14, 15, 16, 18, 19

**Sources:** [[6]](https://valkey.io/topics/valkey-json/) [[7]](https://valkey.io/blog/valkey-search-1_2/) [[8]](https://github.com/valkey-io/valkey-search) [[11]](https://valkey.io/blog/modern-ai-workloads-mapping-to-valkey/)

### Scene 12: 01:28–01:46 | Semantic caching: vector similarity for AI

**Voiceover:** “For AI, embed the prompt and search cached vectors with Valkey Search. A close, valid match reuses the answer. Otherwise, call the model and cache the result. Check context and freshness before reuse.”

**On screen:** SEMANTIC CACHE; Prompt → embedding; Valkey Search: vector similarity; Close match + valid context + fresh answer?; Hit: reuse cached answer; Miss: call model → cache answer + embedding; Same scope · compatible model/context · expiry

**Motion and composition:** Use two non-sensitive illustrative prompts: What is the capital of France? and Capital city of France?, with cached answer Paris. A separate embedding model converts the second prompt into a vector. Show nearest neighbors within the correct scope in Valkey Search; animate a qualitative distance gate plus context/freshness checks, never a fabricated measured 98% match or a universal threshold. On a validated hit, return Paris and bypass response generation, not the embedding step. For a miss or failed validation, show the application invoking an external language model, storing prompt embedding and answer with expiry, and returning the answer. Keep both embedding and language models outside Valkey. A 2D point diagram is a conceptual projection, not the actual embedding dimensions. Do not reuse private answers across users or tenants.

**Scene-local animation beats:**

- 0–4s: embed prompt externally.
- 4–8s: scoped vector similarity lookup.
- 8–12s: validate threshold context freshness then hit.
- 12–18s: miss calls model then caches response and embedding.

**Overview use-case IDs:** None

**Dedicated walkthrough IDs:** 19

**Sources:** [[8]](https://github.com/valkey-io/valkey-search) [[11]](https://valkey.io/blog/modern-ai-workloads-mapping-to-valkey/) [[23]](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

### Scene 13: 01:46–01:52 | Participant community

**Voiceover:** “Built together, by the Valkey community. Open source forever.”

**On screen:** VALKEY PROJECT PARTICIPANTS; valkey.io; github.com/valkey-io

**Motion and composition:** Use all 21 non-Apple participant marks from PARTICIPANT_LOGOS.json in a balanced alphabetic 7-column by 3-row wall, fully visible within 0.3 seconds and held for the scene. Keep the Valkey logo and small valkey.io / GitHub labels above it; reserve the dominant quick-start CTA for the next scene. No scrolling carousel. Label Valkey project participants, not customers, sponsors or endorsements. Apple is excluded from all imagery, transitions and backgrounds.

**Overview use-case IDs:** None

**Sources:** [[3]](https://valkey.io/participants/) [[18]](https://github.com/valkey-io)

### Scene 14: 01:52–02:00 | Run Valkey: final command

**Voiceover:** “Run Valkey's core server with Docker using this command. Start building at valkey dot I O.”

**On screen:** TRY VALKEY; docker run --rm valkey/valkey:alpine; Core server · Docker required; valkey.io; github.com/valkey-io

**Motion and composition:** Make the corrected Docker command the final hero. Reveal it by scene-local 1s, then keep the full command unchanged through the final frame. Use large monospace type. This is a shell command, unlike the earlier SET/GET CLI example. Do not add simulated startup logs or claim a successful live run. Caption Core server · Docker required so the audience does not infer the command installs Search, JSON or other modules. No published host port or persistent volume is configured by this minimal demo command. Do not portray it as a production deployment.

**Final on-screen shell command:**

```bash
docker run --rm valkey/valkey:alpine
```

**Overview use-case IDs:** None

**Sources:** [[24]](https://hub.docker.com/v2/repositories/valkey/valkey/tags/alpine) [[1]](https://valkey.io/)

## HyperFrames production directions

- Use exact start/end times from TIMELINE.json; end times are exclusive. Keep transitions within the planned 120 seconds.
- The memory-speed opening is a qualitative hardware comparison. No numeric speedup, implied benchmark ratio, or claim that networked Valkey accesses take local-RAM latency. Disk remains available for persistence; RAM is volatile.
- Introduce cache-aside as a common pattern and give it prominent placement. The reviewed sources do not establish a numerical most-common ranking, so no ranking or adoption statistic is asserted.
- Cache-aside choreography must keep the application in control of database reads and cache population. Include miss → database read → fill + expiry, then a subsequent hit. Address write invalidation in a small note without implying perfect consistency.
- Semantic-cache choreography must show an external embedding model, Valkey Search, scope/context/freshness validation, a hit response, and a model-call fallback that populates the cache. Avoid an invented universal similarity threshold and distinguish vector distance from similarity percentages.
- SET Key Value and GET Key are Valkey commands inside a client session. The final docker run line is a shell command. Neither example is a captured execution. Do not fabricate measured performance or startup logs.
- Display all use-case labels within 0.3s of each overview-panel entrance and hold through the scene. Use a consistent 3×2 layout and labels at least 40px with two lines where needed. Keep space below for actual-recording captions.
- Distinguish modules, integrations and application patterns using the USE_CASES.md mapping. The release board is not a universal feature-compatibility matrix.
- Review official Valkey brand rules before production. Use original logos without cropping, recoloring or generative redraws. Alphabetic participant wall: 21 marks, 7×3, scene 13 at 01:46–01:52. Keep mark clear space and equal visual weight. Apple remains excluded.
- Scene 14 is the final frame, not the participant wall. Hold the full Docker command from about 01:53 through 02:00. Use large monospace text, with valkey.io and github.com/valkey-io secondary. Do not obscure it with captions.
- The Docker quick start launches only the core server and does not publish a host port, configure durable storage, or load the earlier modules. Docker must already be installed/running. The alpine tag is mutable; pin a version/digest for reproducible production instructions.
- Use a restrained instrumental bed under a clear voice if audio is produced. Say GLIDE as glide, JSON as jay-sun, LDAP as ell-dap and valkey.io as valkey dot eye oh. Generate captions from recorded speech.

## Authoring handoff

Build a 120-second HyperFrames explainer from this script and TIMELINE.json. Preserve the exact definition and all 19 overview labels. Add the five new scenes as specified, including real cache-aside hit/miss flow and semantic caching with validation and fallback. Use only the participant-logo allowlist, never Apple. The final command must be docker run --rm valkey/valkey:alpine. Follow the current HyperFrames composition and seek-safe animation contracts. Fit actual voiceover to each scene, validate the composition, inspect every new walkthrough and the participant wall, and review the entire video before export.

## Script-stage verification

Run `python3 valkey-video-script/validate_brief.py` from the workspace root. These offline tests check timeline continuity, source mappings, exact definition/narration parity, all 19 use cases, the participant allowlist, the five new scenes, complete walkthrough beats and corrected final command. They do not validate rendered legibility, recorded speech timing, actual Docker startup, deployments or trademark permissions.
