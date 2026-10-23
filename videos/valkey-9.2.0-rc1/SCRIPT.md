# Valkey 9.2.0-rc1: five-minute feature tour

## Production brief

- Planned runtime: 5 minutes.
- Audience: developers, architects, and Valkey operators.
- Tone: technically credible, energetic, and practical.
- Format: presenter voiceover with animated architecture diagrams and recorded terminal demonstrations.
- Central message: Valkey 9.2 expands what applications can model, makes common operations more atomic, and gives operators more control under load.
- Keep `9.2.0-rc1` and `PRE-RELEASE` visible in the opening and closing. Do not present this as the stable 9.2 release.
- The narration is approximately 825 words, targeting a brisk 165 words per minute. Record it before locking scene timing.

## Scene-by-scene script

### Scene 1 — 00:00–00:20 | Opening

**Voiceover**

“Valkey 9.2 has reached its first release candidate. The headline is a completely new prefix-oriented data type, but this release also changes how applications clean up Streams, build atomic operations, manage access policies, create snapshots, detect hot keys, and protect replication during heavy traffic. Let’s look at the features that matter—and what they actually do.”

**On screen**

- `Valkey 9.2.0-rc1`
- `PRE-RELEASE`
- Data modeling · Atomic operations · Security · Operations

**Visual direction**

Open with the release number, then reveal four feature lanes. Avoid a wall of release-note bullets.

---

### Scene 2 — 00:20–01:25 | Path Hash

**Voiceover**

“The biggest addition is Path Hash: a binary-safe, radix-tree-backed data type for prefix-oriented data.

“Imagine an API router. We store configuration at `/api`, override it at `/api/v1`, and add a more specific owner at `/api/v1/orders`. With `PHLONGEST`, Valkey can find the most specific stored prefix of a request path. With `PHPREFIXES`, it can return every matching ancestor, from the broadest configuration to the most specific.

“Each stored path can contain multiple fields and values, and one top-level Valkey key contains the complete tree. That makes it useful for hierarchical routing, configuration inheritance, and prefix indexes.

“The original motivating use case is AI inference. A router can represent cumulative prompt-block hashes as paths, ask which workers hold each reusable prefix, and combine that information with live worker load. Path Hash does not perform vector or semantic search. It matches exact byte prefixes.

“There are boundaries to remember: the whole tree occupies one Valkey key and one cluster slot, expiration applies to that top-level key rather than individual paths, and large prefix deletions are synchronous.”

**Terminal demo**

```console
valkey> PHSET routes /api FIELDS 2 owner platform timeout 30
OK
valkey> PHSET routes /api/v1 FIELDS 2 owner payments timeout 10
OK
valkey> PHSET routes /api/v1/orders FIELDS 1 owner checkout
OK
valkey> PHLONGEST routes /api/v1/orders/42 WITHVALUES
1) "/api/v1/orders"
2) 1) "owner"
   2) "checkout"
valkey> PHPREFIXES routes /api/v1/orders/42 FIELDS 2 owner timeout
```

**Architecture diagram**

```text
Request: /api/v1/orders/42
                 │
                 ▼
       Valkey key: routes
                 │
        ┌────────┴────────┐
      /api             owner=platform
        │
      /api/v1          owner=payments
        │
      /api/v1/orders   owner=checkout
```

Animate the query down the shared prefix. Highlight all three nodes for `PHPREFIXES`, then only the deepest node for `PHLONGEST`.

For the AI variation, use a second compact diagram:

```text
Prompt blocks → cumulative hashes → Path Hash lookup
                                      │
                         matching cache locations
                                      │
                         Router + live worker load
                                      │
                                  AI worker
```

Keep embedding models and vector databases out of this diagram; they are not part of this feature.

---

### Scene 3 — 01:25–02:05 | Stream cleanup

**Voiceover**

“Streams also gain server-side lifecycle controls. In a fan-out design, several consumer groups may reference the same event. Deleting it when the first group finishes can break the others, while keeping every event forever wastes memory.

“`XACKDEL` combines acknowledgement and conditional deletion. In `ACKED` mode, the event is removed only after every consumer group has acknowledged it or can no longer receive it. A result of two means this group acknowledged the event, but another reference remains. A result of one means the entry was deleted.

“`KEEPREF` and `DELREF` provide different retention trade-offs, so applications still need to choose the mode that matches their delivery policy.”

**Demo diagram and terminal**

```text
                    ┌── billing group ─── ACK ──┐
Stream event 42 ────┤                           ├── delete when clear
                    └── analytics group ─ ACK ──┘
```

```console
valkey> XACKDEL events billing ACKED IDS 1 1234-0
1) (integer) 2
valkey> XACKDEL events analytics ACKED IDS 1 1234-0
1) (integer) 1
```

Animate the event remaining after the first acknowledgement and disappearing after the second.

---

### Scene 4 — 02:05–02:50 | Smaller atomic application logic

**Voiceover**

“Several commands now collapse common multi-step patterns into one atomic operation.

“`INCREX` increments a number and sets its expiration together. That is a natural fit for counters such as request windows, where separating `INCR` and `EXPIRE` can leave a key without a TTL if the client fails between commands.

“Conditional `EXEC` adds `IFEQ`, `IFNE`, `NX`, and `XX` checks directly to a transaction. You can queue changes and commit them only if a version key still has the expected value—without first issuing `WATCH`.

“And `SET IFNE` updates a value only when the current value differs from the supplied comparison. These commands reduce round trips, but conditional `EXEC` still requires all participating keys to share a cluster slot.”

**Terminal montage**

```console
valkey> INCREX api:user:42 EX 60
1) (integer) 1
2) (integer) 1
```

```console
valkey> MULTI
OK
valkey> SET version:{cart:42} 8
QUEUED
valkey> HSET cart:{cart:42} total 149.00
QUEUED
valkey> EXEC IFEQ version:{cart:42} 7
```

Show a “condition passed” gate before the two queued writes. Then briefly show the gate closed and a null result when the version does not match.

---

### Scene 5 — 02:50–03:30 | ACL roles and policy verification

**Voiceover**

“Access-control administration becomes more reusable with ACL roles. A role is a named set of selectors that can be assigned to multiple users. Change the role once, and its members immediately receive the new effective permissions.

“Roles cannot contain passwords, cannot include other roles, and their permissions are combined with the user’s own selectors. Because those selectors are additive, a user rule cannot subtract a permission already granted by a role.

“The new `ACL DIGEST` command produces a fingerprint of the ACL rules currently in effect. That gives automation a simple way to verify whether an `ACL LOAD` operation produced the intended policy.”

**Terminal demo**

```console
valkey> ACL SETROLE readonly-api +@read ~api:* resetchannels
OK
valkey> ACL SETUSER app on >secret resetkeys resetcommands role=readonly-api
OK
valkey> ACL DIGEST
"…policy fingerprint…"
```

**Diagram**

Show one `readonly-api` policy card connected to three users. Animate a policy change at the role and highlight all three users. Keep authentication—the password—on each user, outside the role.

---

### Scene 6 — 03:30–04:30 | Persistence and resilience

**Voiceover**

“The operations story is just as substantial.

“Forkless RDB snapshots can serialize data in a background thread instead of a forked child. This is opt-in and must be enabled at startup. It reduces dependence on `fork` and copy-on-write, but it is not magically nonblocking: writes to data currently being serialized can wait, and modules need compatible callbacks.

“RDB files and replication streams can now use LZ4 compression. Whole-stream RDB compression and replication compression are also opt-in. Replicas negotiate support so older or opted-out replicas can continue receiving uncompressed data. An older Valkey release cannot load the new LZ4-wrapped RDB, so downgrade procedures matter.

“Built-in hot-key detection samples accesses and reports estimated high-QPS keys with `HOTKEYS GET`.

“Under overload, optional replication throttling can slow client writes when a replica falls behind. Priority event processing gives cluster heartbeats, replication, and slot migration opportunities to run during heavy client traffic. Reserved connection slots can keep capacity available for clients arriving from configured administrative networks.

“These are targeted safeguards, not guarantees of zero data loss, uninterrupted replication, or authorization. TLS and ACLs still decide who is trusted.”

**Architecture diagram**

Use one primary and one replica:

```text
Clients ── writes ──► Primary ══ compressed replication ══► Replica
                        │                    ▲
                        │ lag signal         │
                        └── throttle writes ─┘

Admin subnet ──► reserved connection capacity
Cluster/replication events ──► priority processing lane
```

Beside it, show a persistence choice:

```text
Primary ── fork snapshot ─────► RDB
        └─ forkless thread ───► LZ4 RDB
```

Label every optional path `OPT-IN`.

---

### Scene 7 — 04:30–04:48 | Performance and tooling montage

**Voiceover**

“Large sorted sets now use a B-plus tree instead of a skiplist, while preserving command and persistence formats; `OBJECT ENCODING` now reports `btree`. Valkey 9.2 also adds configuration metadata through `CONFIG INFO`, dataset-driven benchmarks, safer script-cache memory limits, and a long list of replication, cluster, memory, TLS, and correctness improvements.”

**Visual direction**

Use four rapid cards:

- `OBJECT ENCODING leaderboard → btree`
- `CONFIG INFO hotkeys-*`
- `valkey-benchmark --dataset products.csv`
- `maxmemory-scripts`

Do not show PR benchmark percentages unless the exact hardware and workload are displayed.

---

### Scene 8 — 04:48–05:00 | Close

**Voiceover**

“Valkey 9.2 RC1 is a serious expansion: richer data modeling, safer event cleanup, smaller atomic workflows, reusable security policy, and more operational control. It is still a release candidate. Test client behavior, modules, persistence compatibility, and production workloads before adopting it.”

**On screen**

- `Valkey 9.2.0-rc1`
- `Test the release candidate`
- `github.com/valkey-io/valkey/releases/tag/9.2.0-rc1`

## Demo guidelines

### Keep the demonstrations reproducible

- Pin the server image or binary to `9.2.0-rc1`; do not use `latest`.
- Begin each demo from a clean database or use unique key names.
- Pre-type long setup commands when they do not teach the feature. Record the commands that express the concept.
- Increase terminal font size and reveal one command at a time.
- Use a separate terminal window for setup and the clean presentation window for the visible demo.
- Capture real output before animation work. If output must be reconstructed, label it as illustrative.
- Do not expose real passwords in shell history. The ACL password in this script is demonstration-only.

### Recommended live-demo priority

If production time is limited, record these three real demos:

1. Path Hash with `PHSET`, `PHLONGEST`, and `PHPREFIXES`.
2. Two-group Stream cleanup showing status `2`, then status `1`.
3. `INCREX` followed by `TTL`.

Use diagrams or prepared terminal cards for ACL, persistence, compression, and overload controls. Demonstrating those faithfully requires more setup and is harder to understand in a five-minute video.

### Diagram design rules

- Show the problem state first, then introduce the feature.
- Animate only the active path; dim unrelated components.
- Keep Valkey at the center of data operations, but keep application decisions—such as selecting an AI worker—outside Valkey.
- Use solid arrows for actual data flow and dashed arrows for control or configuration.
- Label optional features `OPT-IN`.
- For replication, distinguish primary-to-replica data from the replica-lag feedback signal.
- For ACLs, separate authentication attached to a user from authorization inherited through a role.
- For Path Hash, visually distinguish exact-path lookup, ancestor-prefix lookup, and descendant traversal.
- Avoid unverifiable speed gauges, universal percentage improvements, or “zero downtime” language.

## Editorial cautions

- Say “Valkey 9.2 RC1,” not “the stable Valkey 9.2 release.”
- Path Hash performs byte-prefix matching, not semantic or vector similarity.
- `ACKED` is a retention choice, not an exactly-once delivery guarantee.
- Forkless snapshots may still block particular writes and require module support.
- LZ4, hot-key detection, replication throttling, and reserved client slots are not enabled by default.
- Priority subnets reserve capacity; they do not authenticate or authorize clients.
- B+ tree benchmark results in the feature PR are workload-specific.

## Source

The facts, command contracts, limitations, and first-party source links supporting this script are collected in [RESEARCH.md](./RESEARCH.md).
