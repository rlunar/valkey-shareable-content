# Valkey video series

## Series goal

Build a five-video technical series that starts with the basic value proposition, shows where Valkey fits, teaches practical caching patterns, and then moves into AI workloads and release-specific features.

Each video should answer one question:

1. What is Valkey?
2. What changed in Valkey 9.2?
3. What are the five most useful Valkey application patterns?
4. How do exact query caching and semantic caching differ?
5. Which caching strategy should an application use?

## Recording scripts

| Episode | Script | Teleprompter | Planned runtime |
|---|---|---|---|
| What is Valkey | [Recording script](what-is-valkey/SCRIPT.md) | [Read-only script](what-is-valkey/TELEPROMPTER.md) | 1:55 |
| Valkey 9.2 GA | [Sample-led script](valkey-9.2.0-rc1/SCRIPT-SAMPLES-VARIANT.md) | [Read-only script](valkey-9.2.0-rc1/TELEPROMPTER.md) | 5:00 |
| Top five use cases | [Recording script](top-5-use-cases/SCRIPT.md) | [Read-only script](top-5-use-cases/TELEPROMPTER.md) | 5:00 |
| Query and semantic caching | [Recording script](query-semantic-caching/SCRIPT.md) | [Read-only script](query-semantic-caching/TELEPROMPTER.md) | 5:00 |
| Caching strategies | [Recording script](caching-strategies/SCRIPT.md) | [Read-only script](caching-strategies/TELEPROMPTER.md) | 5:00 |

The four new scripts include opening hooks, narration, demonstrations, and individual-shot animation direction tied to scenes in `Valkey_Demo_Library`. Shared guidance is in [ANIMATION-GUIDE.md](ANIMATION-GUIDE.md). Timings are production targets pending narration recording; application demos have not been run as part of script preparation.

## Recommended publishing order

The requested numbering works for recording. For evergreen viewing and playlists, this order gives the smoothest learning path:

1. What is Valkey?
2. Top five Valkey use cases
3. Caching strategies
4. Query and semantic caching
5. Valkey 9.2 release

The release video can still publish earlier while 9.2 is timely. Link it back to the evergreen videos.

---

## Video 1 — What is Valkey in under two minutes?

**Status:** New recording script is ready at [what-is-valkey/SCRIPT.md](what-is-valkey/SCRIPT.md), using a peak-capacity hook and library diagram references. Earlier material remains under `videos/valkey-video-30months/`.

**Viewer promise**

Understand what Valkey is, why it keeps working data in memory, what it can do beyond caching, and how to run it.

**Suggested hook**

“Your application should not wait on the slowest part of its architecture for every request. Valkey keeps frequently used data in memory and gives applications data structures they can update atomically.”

Avoid a generic claim that Valkey is a fixed number of times faster than a database. The result depends on the database, query, network, persistence configuration, and workload.

**Core sequence**

1. Why memory access is faster than disk access.
2. How key-value datastores associate a unique key with a value.
3. Valkey as an open source, vendor-neutral project backed by the Linux Foundation.
4. `SET` and `GET`.
5. Data structures: strings, hashes, lists, sets, sorted sets, and Streams.
6. Persistence, replication, and clustering.
7. Docker quick start.

**Primary demo**

```console
valkey> SET product:42 "blue mug" EX 60
OK
valkey> GET product:42
"blue mug"
valkey> TTL product:42
(integer) 60
```

**Architecture diagram**

```text
Client → Application → Valkey
                       │
                       ├─ in-memory working data
                       └─ optional persistence → disk
```

Do not draw Valkey as a transparent cache that automatically queries the application database.

**Target duration:** 1:45–2:00.

---

## Video 2 — Valkey 9.2 release

**Status:** The sample-led script is prepared for the Valkey 9.2 generally available release scheduled for November 15, 2026. Complete a final release-note and demo verification before publication.

- `videos/valkey-9.2.0-rc1/RESEARCH.md`
- `videos/valkey-9.2.0-rc1/GA-METRICS-RESEARCH.md`
- `videos/valkey-9.2.0-rc1/SCRIPT.md`
- `videos/valkey-9.2.0-rc1/SCRIPT-SAMPLES-VARIANT.md`

**Recommended version**

Use the sample-led variant. Its opening introduces Path Hash by asking how an application can find the most specific stored rule for a request path in one lookup. The first visual shows nested paths and highlights the longest matching prefix before moving into the command demonstration.

The release tour also gives large sorted sets their own segment, including the feature PR's measured ZADD and ZREM throughput improvements and 36–43% lower index overhead. The operations segment states the available metric boundary: forkless save avoids copy-on-write exposure but has no published percentage memory-saving benchmark, while LZ4 replication compression reported 52% bandwidth savings with less than 1% throughput overhead for its published workload.

**Target duration:** 5:00.

---

## Video 3 — Top five Valkey use cases

**Working title**

“Five Valkey Use Cases You Can Build Today”

**Viewer promise**

Follow five players through a multiplayer game platform and see how five Valkey data structures solve five scaling problems.

**Suggested hook**

“A multiplayer game becomes popular. More application servers handle more players, but repeated reads, local sessions, background work, rankings, and request limits still need shared state.”

### 1. Cache

```console
valkey> GET game:42
(nil)
valkey> SET game:42 '{"name":"Star Arena","mode":"ranked"}' EX 60
OK
```

Diagram: application-controlled cache-aside flow. Show the application reading the database after a miss and populating Valkey.

Guardrail: TTL reduces stale-data duration but does not solve invalidation races or cache stampedes.

### 2. Session

```console
valkey> HSET session:abc123 user_id jacob role player
(integer) 2
valkey> EXPIRE session:abc123 1800
(integer) 1
```

Diagram: browser cookie contains an opaque session ID; session data stays server-side in Valkey.

Guardrail: use unpredictable identifiers, TLS, appropriate cookie controls, rotation, and expiration. Valkey does not apply browser-session security automatically.

### 3. Message queue

Use Streams rather than presenting Pub/Sub as a durable queue.

```console
valkey> XADD matches '*' player zhao result win
"…-0"
valkey> XREADGROUP GROUP processors worker-1 COUNT 1 STREAMS matches '>'
```

Diagram: producers → Stream → consumer group → workers → acknowledgement.

Guardrail: show retries, pending messages, and acknowledgements. Do not claim exactly-once external effects.

### 4. Leaderboard

```console
valkey> ZADD leaderboard 1250 paty 980 madelyn 1420 zhao
(integer) 3
valkey> ZREVRANGE leaderboard 0 2 WITHSCORES
```

Diagram: player event → `ZINCRBY` → sorted set → top-N query.

Guardrail: define tie behavior and whether ranks are global, regional, seasonal, or tenant-scoped.

### 5. Rate limiter

For a short beginner video, show a fixed-window limiter first:

```console
valkey> INCR rate:robert:2026-10-10T12:30
(integer) 1
valkey> EXPIRE rate:robert:2026-10-10T12:30 60 NX
(integer) 1
```

If the video targets Valkey 9.2, replace the two-command setup with:

```console
valkey> INCREX rate:robert EX 60
1) (integer) 1
2) (integer) 1
```

Diagram: requests → atomic counter → allow/reject decision.

Guardrail: explain that fixed windows permit boundary bursts. Sliding-window and token-bucket designs make different trade-offs.

**Target duration:** 4:30–5:30.

---

## Video 4 — Query caching and semantic caching

**Working title**

“Exact Cache or Semantic Cache? Build the Right AI Caching Layer”

**Viewer promise**

Understand why exact query and prompt caches give a deterministic yes-or-no lookup, while semantic caching returns a maybe that must be close enough and pass validation before reuse.

**Suggested hook**

“Exact caching is black or white. Valkey has the key or it does not. Semantic caching is gray. Valkey may have an answer if the meaning is close enough.”

### Stage 1: normalized query cache

```text
Raw request
   ↓ normalize stable inputs
SHA-256(model + tenant + prompt + parameters + data version)
   ↓
GET query-cache:<digest>
```

Demo the first miss and second exact hit. Include model, tenant or authorization scope, relevant parameters, and source-data version in the key. Do not hash only the prompt when those inputs affect the answer.

For a specific key and the cache's current state, this lookup is deterministic: hit or miss, yes or no. Freshness and correctness still depend on versioning, invalidation, and expiry.

### Stage 2: semantic lookup

```text
Prompt
  ↓
Embedding model
  ↓
Valkey Search KNN within the correct scope
  ↓
Candidate: maybe
  ↓
Similarity threshold + model/context/version/freshness checks
  ├─ valid hit → reuse answer
  └─ miss       → call model → cache answer and embedding
```

Unlike exact lookup, semantic search returns nearby candidates rather than a binary answer. Treat each candidate as a maybe until it is close enough and passes the application's validation checks.

**Suggested demo**

1. Ask: “What is Valkey?”
2. Cache the generated answer and embedding.
3. Ask: “Explain Valkey.”
4. Show an exact miss.
5. Show a semantic candidate.
6. Display the similarity score and validation fields.
7. Return the cached answer.
8. Change tenant, corpus version, or model and show reuse being rejected.

**Metrics panel**

- Exact-cache hit rate.
- Semantic-cache hit rate.
- Model calls avoided.
- Median and tail latency by outcome.
- False-reuse review rate.
- Cache age and invalidation reason.

Avoid presenting one universal similarity threshold. Threshold selection depends on the embedding model, corpus, task, and cost of a wrong reuse.

**Target duration:** 5:00–7:00.

---

## Video 5 — Caching strategies

**Working title**

“Cache-Aside, Write-Through, or Write-Behind?”

**Viewer promise**

Use a global music-streaming service to choose a caching pattern based on consistency, latency, failure handling, and ownership of writes.

**Suggested hook**

“Everything that can be queried, can be cached. But artist pages, playlist edits, and listening events do not have the same freshness or durability contract.”

### Cache-aside

```text
Read:
Application → Valkey
            miss
Application → Database → Valkey fill → response

Write:
Application → Database → invalidate Valkey
```

Best fit: read-heavy systems where the application can tolerate a miss and explicitly manages cache population.

Demo:

```console
valkey> GET artist:pacific-june
(nil)
# Application reads the database.
valkey> SET artist:pacific-june '{"name":"Pacific June","genre":"US pop"}' EX 60
OK
```

Risk to animate: concurrent reader repopulates stale data around an update.

### Write-through

```text
Application → caching/service layer
                   ├─ write database
                   └─ update cache
```

Best fit: frequently read data that should be cached immediately after writes.

Important clarification: Valkey core does not automatically write an arbitrary external database. The application, library, or caching service owns the coordinated write.

Risk to animate: one destination succeeds while the other fails. Define ordering, retry, idempotency, and rollback behavior.

### Write-behind

```text
Application → Valkey / durable change queue → asynchronous writer → Database
```

Best fit: workloads that prioritize write latency and can accept delayed persistence.

Use a Stream to make the asynchronous database-write intent explicit:

```console
valkey> XADD listening-events '*' listener hari track_id 42 event_id play-8
"…-0"
```

Risk to animate: worker outage, growing backlog, retries, duplicate processing, ordering, and data loss if the buffer is not durable enough for the requirement.

### Comparison frame

| Strategy | Read miss | Write latency | Consistency burden | Main risk |
|---|---|---:|---|---|
| Cache-aside | Application loads data | Database write path | Application | Stale fill and stampede |
| Write-through | Usually already cached | Database plus cache | Coordinating layer | Partial write |
| Write-behind | Usually already cached | Lowest immediate latency | Async writer and queue | Backlog or lost writes |

End with a decision:

- Start with cache-aside for a simple read cache.
- Choose write-through when immediate cache population justifies coordinated-write complexity.
- Choose write-behind only when delayed persistence and its failure model are acceptable.

**Target duration:** 5:00–6:00.

---

## Shared production system

### Reusable visual components

- Application, Valkey, database, worker, client, and model nodes.
- Terminal component with `valkey>` prompt.
- Key/value card with TTL indicator.
- Hit, miss, pending, acknowledged, and expired states.
- Solid arrows for data; dashed arrows for control and invalidation.
- A small “application responsibility” label for logic Valkey does not perform.

### Shared demo environment

Build one reproducible environment for videos 1, 3, and 5:

- One Valkey server pinned to the demonstrated version.
- A small product database or fixture.
- A minimal application that exposes cache hit/miss behavior.
- Seed data for sessions, Streams, and a leaderboard.
- Reset and seed commands that can run before each recording.

Add Valkey Search and a deterministic embedding setup for video 4. Keep it separate from the beginner environment so the first videos remain easy to reproduce.

### Consistent closing

Use the same final structure:

1. One-sentence takeaway.
2. One production caveat.
3. Link to the commands, source code, and next video in the series.

## Next production artifacts

The separate scripts are ready:

```text
videos/what-is-valkey/SCRIPT.md
videos/top-5-use-cases/SCRIPT.md
videos/query-semantic-caching/SCRIPT.md
videos/caching-strategies/SCRIPT.md
videos/ANIMATION-GUIDE.md
```

Next production work is narration recording and a reproducible demonstration environment. Use the per-scene library references in each script to choose the diagrams and scenario steps.
