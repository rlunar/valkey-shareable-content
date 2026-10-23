# Valkey 9.2 GA: five-minute demo-led variant

## Production brief

- Runtime target: 5 minutes.
- Narration: approximately 585 words. Command reveals, result holds, and diagram animation supply the remaining runtime.
- Format: fast technical walkthrough with a command or configuration sample for every headline feature.
- Audience: developers and operators who already understand basic Valkey commands.
- Publication target: November 15, 2026.
- This script presents Valkey 9.2 as the generally available release scheduled for November 15, 2026.
- Keep `Valkey 9.2` and `GA release` visible during the opening and closing.
- Open with Path Hash, the release's new prefix-oriented data type.

## Scene 1 — 00:00–00:20 | Path Hash hook

**Voiceover**

“How do you find the most specific rule for a request path in one lookup? Valkey 9.2 introduces Path Hash. It can find the longest stored prefix or return every matching ancestor. Valkey 9.2 is generally available. Let's see it in action.”

**On screen**

```text
Valkey 9.2 · GA release

How do you find the most specific rule?

/api → /api/v1 → /api/v1/orders
Request: /api/v1/orders/42
Longest match: /api/v1/orders
```

**Visual direction**

Open on the hook question. Build the three stored paths from broadest to most specific. Then send one request through the tree and highlight `/api/v1/orders` as the longest stored prefix. Keep the result visible as the video moves into the command demonstration.

---

## Scene 2 — 00:20–01:10 | Path Hash

**Voiceover**

“Path Hash is a binary-safe, radix-tree-backed data type.

“This example stores routing rules at three nested paths. `PHLONGEST` returns the most specific stored prefix. `PHPREFIXES` returns every matching ancestor. Each path can hold several fields, and the whole tree lives under one Valkey key.

“Path Hash was initially designed for AI KV-cache placement. An inference router can encode cumulative prompt-block hashes as paths and ask which workers hold each reusable prefix. The router still chooses the worker. Valkey performs exact byte-prefix matching, not vector or semantic search.

“The tree occupies one cluster slot, its TTL applies to the top-level key, and a large `PHDELPREFIX` operation can block while it removes the subtree.”

**Demo**

```console
valkey> PHSET routes /api FIELDS 1 owner platform
OK
valkey> PHSET routes /api/v1 FIELDS 1 owner payments
OK
valkey> PHSET routes /api/v1/orders FIELDS 1 owner checkout
OK
valkey> PHLONGEST routes /api/v1/orders/42 WITHVALUES
1) "/api/v1/orders"
2) 1) "owner"
   2) "checkout"
valkey> PHPREFIXES routes /api/v1/orders/42 WITHVALUES
```

**Diagram**

```text
/api ──► /api/v1 ──► /api/v1/orders
 broad       │              │
             │              └─ PHLONGEST
             └─────────────── PHPREFIXES returns all ancestors
```

---

## Scene 3 — 01:10–01:45 | Large sorted sets

**Voiceover**

“Large sorted sets now use a B-plus tree instead of a skiplist. Small listpack-encoded sets are unchanged, and command and persistence formats remain compatible.

“In the feature benchmark, ZADD score updates rose from 205 thousand to 421 thousand operations per second. ZREM rose 76 percent. With five million 20-byte members, index overhead fell from 50.3 bytes per member to between 28.5 and 32 bytes—a 36 to 43 percent reduction.

“Those results belong to the pull request's workloads. Delete-heavy sets may save less because sparse leaves are not yet compacted.”

**On screen**

```text
Large sorted sets: skiplist → B+ tree

Feature benchmark · ARM Graviton 3
3M members · pipeline 10
ZADD: 205K → 421K ops/s     +105%
ZREM: 386K → 680K ops/s      +76%

5M members · 20-byte elements
Index overhead: 50.3 B → 28.5–32.0 B/member
Reduction: 36–43%
```

**Demo**

```console
valkey> OBJECT ENCODING leaderboard
"btree"
```

**Visual direction**

Show the skiplist changing into a compact B+ tree. Reveal throughput and memory results separately. Keep the benchmark hardware, dataset, pipeline depth, and feature-PR scope visible beside every percentage.

---

## Scene 4 — 01:45–02:15 | Stream lifecycle

**Voiceover**

“`XACKDEL` and `XDELEX` make Stream cleanup aware of consumer-group references.

“Billing and analytics both read the same event. Billing finishes first. In `ACKED` mode, Valkey acknowledges its copy but returns two because analytics still references the event. When analytics finishes, Valkey returns one and deletes it.

“`KEEPREF`, `ACKED`, and `DELREF` make different retention trade-offs. They do not create exactly-once delivery.”

**Demo**

```console
valkey> XACKDEL events billing ACKED IDS 1 1234-0
1) (integer) 2
valkey> XACKDEL events analytics ACKED IDS 1 1234-0
1) (integer) 1
valkey> XLEN events
(integer) 0
```

**Diagram**

Show one event connected to two pending-entry lists. Remove one line after the first command and the event after the second.

---

## Scene 5 — 02:15–02:50 | Atomic application operations

**Voiceover**

“`INCREX` combines an increment and expiration. This counter increases and receives a sixty-second TTL in one atomic command.

“Conditional `EXEC` can commit a transaction only when `IFEQ`, `IFNE`, `NX`, or `XX` conditions pass. That replaces a separate `WATCH` round trip for common optimistic-locking flows.

“`SET IFNE` covers a smaller compare-and-set case, and `MOVE REPLACE` can overwrite a destination key.”

**Demo montage**

```console
valkey> INCREX api:user:42 EX 60
1) (integer) 1
2) (integer) 1
valkey> TTL api:user:42
(integer) 60
```

```console
valkey> MULTI
OK
valkey> HSET cart:{42} total 149
QUEUED
valkey> EXEC IFEQ version:{42} 7
```

```console
valkey> SET config:new enabled IFNE disabled
OK
valkey> MOVE session:42 1 REPLACE
(integer) 1
```

---

## Scene 6 — 02:50–03:20 | ACL roles and digest

**Voiceover**

“ACL roles turn repeated selector sets into named policy. Here, three application users can share one read-only API role. Updating the role changes their effective permissions immediately.

“Roles do not hold passwords and cannot include other roles. Their permissions add to the user’s own selectors.

“`ACL DIGEST` fingerprints the effective ACL state, so automation can compare policy before and after `ACL LOAD`.”

**Demo**

```console
valkey> ACL SETROLE readonly-api +@read ~api:* resetchannels
OK
valkey> ACL SETUSER app on >demo-password role=readonly-api
OK
valkey> ACL GETUSER app
valkey> ACL DIGEST
"…server-specific fingerprint…"
```

**Diagram**

Draw the role once, connect it to several users, and keep each password attached to its user rather than the role.

---

## Scene 7 — 03:20–04:10 | Persistence and compression

**Voiceover**

“Forkless snapshots move RDB serialization into a background thread instead of a forked child. This removes copy-on-write page duplication as a source of peak memory growth. The exact saving depends on writes during the snapshot, and the project publishes no universal percentage.

“The fixed cost is four extra bytes per key when forkless infrastructure is enabled—about 400 megabytes for 100 million keys, before allocator effects.

“Replication compression saves network bandwidth, not demonstrated server memory. In the pull request's BlockMesh benchmark—three million keys with values around 315 bytes—LZ4 reduced replication bandwidth by 52 percent, used 2.5 seconds of compression CPU, and added less than one percent throughput overhead.”

**Configuration sample**

```conf
forkless-infrastructure-enabled yes
bgsave-default-method forkless
rdbcompression lz4
repl-compression lz4
```

**Verification sample**

```console
valkey> BGSAVE
Background saving started
valkey> INFO persistence
valkey> INFO replication
```

**Diagram**

```text
Main thread ──► background snapshot thread ──► LZ4 RDB
Primary ═════ negotiated LZ4 or plaintext ═══► Replica

Forkless support: +4 B/key
100M keys: ≈400 MB metadata
Small-item clone pool: capped at 1 MiB
Copy-on-write saving: workload-dependent

Replication PR benchmark:
3M keys × ~315 B · BlockMesh tweets
Bandwidth: -52% · CPU: 2.5s · Throughput: <1% overhead
```

Label both LZ4 paths and forkless saving `OPT-IN`. Label the 400 MB value as arithmetic from four bytes per key, not a benchmark. Label the replication result `BANDWIDTH SAVING`, not memory saving.

---

## Scene 8 — 04:10–04:42 | Observe and protect an overloaded server

**Voiceover**

“Hot-key detection samples requests and reports estimated high-QPS keys. It is disabled until `hotkeys-top-k` is greater than zero.

“Replication throttling can slow client writes when a replica falls behind. Priority polling lets cluster heartbeats, replication, and slot migration run during heavy client work. Reserved slots preserve connection capacity for clients arriving from configured networks.

“The network list controls priority and capacity. ACL and TLS still control access.”

**Configuration and command sample**

```console
valkey> CONFIG SET hotkeys-top-k 10
OK
valkey> CONFIG SET hotkeys-sampling-percentage 10
OK
valkey> HOTKEYS GET
```

```conf
repl-throttling-enabled yes
priority-preemptive-poll-interval-us 2000
priority-subnets "10.0.0.0/8"
maxclients-reserved 128
```

**Diagram**

Show normal requests in one lane and replication, cluster heartbeat, migration, and administrative connections in labeled priority lanes. Do not draw priority subnets as a security boundary.

---

## Scene 9 — 04:42–05:00 | Try Valkey 9.2

**Voiceover**

“Valkey 9.2 is generally available. Try Path Hash, test large sorted sets, and measure forkless snapshots and replication compression with your workload. Start with the release notes and the demos linked below.”

**Demo**

```console
valkey> CONFIG INFO rdbcompression
```

**Final frame**

```text
Valkey 9.2 · GA release
Explore the release and demos
```

## Production check before publication

The narration and title cards target the Valkey 9.2 generally available release scheduled for November 15, 2026.

Before publication, compare the final release notes with the feature list, confirm command syntax and configuration defaults, and record the demos against the generally available build. Update any changed feature or reply and use the published release link in the video description.

## Demo recording plan

### Record live

Record Path Hash, Stream cleanup, `INCREX`, conditional `EXEC`, ACL roles, hot-key detection, and `OBJECT ENCODING`. These produce concise outputs that communicate the feature directly.

### Use prepared environments

Forkless saving, LZ4 replication, replication throttling, priority processing, reserved connections, and alternate TLS certificates require startup configuration or multiple processes. Prepare them before recording. Show the configuration, architecture, and selected `INFO` output rather than spending video time assembling the environment.

### Present the B+ tree benchmark honestly if retained

- Present the B+ tree numbers as results reported by PR #4359.
- Keep `ARM Graviton 3`, `3M-member sorted set`, `pipeline 10`, and `feature PR benchmark` visible.
- Say “up to 43 percent less index overhead” rather than “Valkey 9.2 uses 43 percent less memory.”
- Say “roughly twice the ZADD throughput in this benchmark” rather than “Valkey 9.2 is twice as fast.”
- Do not reproduce the numbers with a tiny laptop test and imply equivalence.
- If you run a new benchmark, show the complete command, hardware, dataset size, thread count, pipeline depth, number of repetitions, and result distribution.

## Architecture diagram guidelines

- Start each diagram with the workload problem: nested paths, two consumer groups, replica lag, or exhausted connections.
- Animate the command and the state change together.
- Use solid arrows for data and dashed arrows for feedback or control.
- Mark disabled-by-default features `OPT-IN`.
- Keep application decisions outside Valkey. Path Hash returns prefix data; the AI router chooses a worker.
- Keep authorization separate from scheduling. ACL and TLS grant access; priority subnets reserve capacity.
- Display downgrade boundaries next to the LZ4 RDB rather than burying them in narration.
- Avoid generic speed lines, exploding charts, and unlabeled percentages.

## Source boundary

Feature behavior and limitations come from [GA-METRICS-RESEARCH.md](./GA-METRICS-RESEARCH.md) and the linked first-party sources, pending the final release check described above. The B+ tree segment uses the benchmark and memory measurements reported in Valkey PR #4359:

- ZADD score updates: 205K to 421K operations per second, reported as `+105%`.
- ZREM mixed add/remove workload: 386K to 680K operations per second, reported as `+76%`.
- Per-member index overhead with 20-byte members: 50.3 bytes for the skiplist versus 28.5–32.0 bytes for the B+ tree, reported as 36–43% lower depending on insertion pattern.

These figures describe the PR's stated environment and workload. They are not universal release-wide performance guarantees.

Forkless Save PR #4460 publishes no comparative percentage for memory saved. It documents four bytes of metadata per key, while the merged implementation caps its small-item clone pool at 1 MiB. The amount of copy-on-write memory avoided depends on the dataset and write activity during the snapshot.

Replication Compression PR #3853 reports 52% bandwidth savings, 2.5 seconds of compression CPU, and less than 1% throughput overhead for three million BlockMesh tweet values averaging about 315 bytes. This is a network-bandwidth result, not a measured server-memory reduction.
