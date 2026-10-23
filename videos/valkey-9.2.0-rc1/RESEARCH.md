# Valkey 9.2.0-rc1 research

Checked October 10, 2026. This note is based only on first-party Valkey sources: the official release/tag, merged pull requests and issues, and the source, command metadata, configuration comments, and tests at tag `9.2.0-rc1`.

## Executive summary

Valkey 9.2.0-rc1 is a **pre-release**, published September 16, 2026. The release has low upgrade urgency because it is the first 9.2 release candidate, not a production-stable 9.2 release. Its headline is not one isolated feature but a broad expansion in data modeling, atomic operations, stream lifecycle management, access control, persistence, replication resilience, and operator tooling. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)] [[tag](https://github.com/valkey-io/valkey/tree/9.2.0-rc1)]

The best short-video story is:

1. **Path Hash** introduces prefix-native lookup inside Valkey, including exact, longest-prefix, ancestor-prefix, and subtree traversal operations.
2. **Streams become easier to reclaim safely** with `XACKDEL` and `XDELEX`.
3. **Atomic application logic gets smaller** with `INCREX`, `SET IFNE`, and conditional `EXEC`.
4. **ACL administration scales better** with reusable roles and a digest that verifies the effective policy.
5. **Large deployments get new operational controls**: forkless snapshots, LZ4 persistence/replication compression, hot-key detection, replication throttling, priority event handling, and reserved administrative connections.

The release also replaces the large-sorted-set skiplist with a B+ tree, adds an alternate TLS certificate, limits cached script memory, expands configuration introspection, improves `valkey-cli` and `valkey-benchmark`, and includes many performance and correctness fixes. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)]

## Release status and compatibility boundary

- This is **9.2.0-rc1**, marked as a GitHub pre-release. Do not describe it as the stable 9.2 release. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)]
- The tag resolves to commit `f01ed55e8c3d8a7d0c1d12661e9818edec758d42`. [[tag](https://github.com/valkey-io/valkey/tree/9.2.0-rc1)]
- The one explicit behavior change is that active expiration of keys and hash fields increments the dirty counter. Save-point thresholds may therefore trigger `BGSAVE` more often than before. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)] [[PR #3118](https://github.com/valkey-io/valkey/pull/3118)]
- New commands and command options require 9.2-aware clients only if a client library hard-codes command metadata or reply schemas. Raw RESP clients can send them directly.
- Several major features are opt-in and keep old defaults: forkless infrastructure defaults off, `bgsave-default-method` defaults to `fork`, whole-RDB LZ4 is not the default, replication compression defaults off, hot-key detection defaults off, replication throttling is optional, and reserved client slots default to zero. [[valkey.conf](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

## Main user-visible features

### 1. Path Hash: prefix-native data inside Valkey

Path Hash is a new binary-safe data type backed by Valkey's radix tree. One top-level Valkey key contains a tree whose logical paths each hold a field/value map. It supports exact lookup, longest stored prefix, all stored ancestor prefixes, prefix-scoped traversal, atomic field updates, persistence, replication, and Cluster behavior. [[PR #4506](https://github.com/valkey-io/valkey/pull/4506)] [[command metadata](https://github.com/valkey-io/valkey/tree/9.2.0-rc1/src/commands)]

The initial motivating use case is an AI inference KV-cache placement index: a router can ask which workers hold reusable cumulative prompt prefixes, then combine the result with current worker load. The type itself is general purpose; it does not understand tokens, models, vector similarity, workers, or cache tiers. Matching is exact byte-prefix matching. [[PR #4506](https://github.com/valkey-io/valkey/pull/4506)]

Other plausible applications include hierarchical routing, longest-prefix configuration, autocomplete indexes, URL or filesystem-like policy lookup, and any workload that needs ancestor-prefix queries without storing every path as a separate top-level key. These are capabilities of the general data model, not separately benchmarked product claims. [[PR #4506](https://github.com/valkey-io/valkey/pull/4506)]

#### Command family

| Command | Purpose |
|---|---|
| `PHSET`, `PHMSET` | Set fields at one or multiple paths atomically within one Path Hash key |
| `PHGET`, `PHMGET`, `PHGETALL` | Exact-path reads |
| `PHEXISTS`, `PHCARD` | Path existence and logical path count |
| `PHLONGEST` | Return the longest stored path that prefixes a query |
| `PHPREFIXES` | Return every stored ancestor prefix, shortest to longest |
| `PHDEL`, `PHDELPREFIX` | Delete fields, a path, or a complete descendant subtree |
| `PHSCAN` | Incrementally traverse paths, optionally below a prefix |

The complete syntax and reply contracts are defined in the tagged command metadata. [[Path Hash command files](https://github.com/valkey-io/valkey/tree/9.2.0-rc1/src/commands)] [[PR #4506](https://github.com/valkey-io/valkey/pull/4506)]

#### Runnable CLI example

```console
$ valkey-cli PHSET routes /api FIELDS 2 owner platform timeout 30
OK
$ valkey-cli PHSET routes /api/v1 FIELDS 2 owner payments timeout 10
OK
$ valkey-cli PHSET routes /api/v1/orders FIELDS 1 owner checkout
OK

$ valkey-cli PHGET routes /api/v1 owner timeout
1) "payments"
2) "10"

$ valkey-cli PHLONGEST routes /api/v1/orders/42 WITHVALUES
1) "/api/v1/orders"
2) 1) "owner"
   2) "checkout"

$ valkey-cli PHPREFIXES routes /api/v1/orders/42 FIELDS 2 owner timeout
1) 1) "/api"
   2) 1) "platform"
      2) "30"
2) 1) "/api/v1"
   2) 1) "payments"
      2) "10"
3) 1) "/api/v1/orders"
   2) 1) "checkout"
      2) (nil)
```

The example uses human-readable path bytes for clarity. Production inference systems may use fixed-width binary hash segments instead. Output shown is the expected RESP2 shape derived from the command metadata; it was not executed against a packaged RC server for this note. [[`PHSET`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/phset.json)] [[`PHGET`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/phget.json)] [[`PHLONGEST`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/phlongest.json)] [[`PHPREFIXES`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/phprefixes.json)]

#### Important limitations

- Prefixes are raw byte prefixes, not path segments, UTF-8 components, or semantic similarity.
- The tree is scoped to one top-level key and therefore one Cluster hash slot.
- TTL applies to the top-level key, not to individual paths in v1.
- `PHDELPREFIX` is synchronous and atomic; deleting a very large subtree can cause latency.
- `PHSCAN`, like `SCAN`, can produce duplicates or omissions while the tree is concurrently modified, so consumers should be idempotent.
- Persistence and failover follow the deployment's existing Valkey durability and asynchronous replication guarantees; Path Hash does not create zero-RPO behavior. [[PR #4506](https://github.com/valkey-io/valkey/pull/4506)]

### 2. Safer Stream cleanup with `XACKDEL` and `XDELEX`

Stream fan-out becomes difficult to reclaim when multiple consumer groups progress at different rates. Before these commands, an application often needed a janitor that tracked every group's high-water mark and trimmed only after all groups had passed an entry. `XACKDEL` and `XDELEX` bring pending-entry-list-aware deletion into the server. [[PR #4629](https://github.com/valkey-io/valkey/pull/4629)] [[issue #2903](https://github.com/valkey-io/valkey/issues/2903)]

- `XACKDEL key group [KEEPREF|DELREF|ACKED] IDS n id...` acknowledges entries in one group and deletes when the selected mode permits it.
- `XDELEX key [KEEPREF|DELREF|ACKED] IDS n id...` deletes with awareness of references across groups.
- `KEEPREF` is the default and can leave pending references in other groups.
- `ACKED` deletes only when every group has acknowledged the entry or can no longer receive it.
- `DELREF` forcibly removes pending references from all groups.
- Each requested ID gets a status: `-1` not found/not applicable, `1` deleted, or `2` acknowledged/not deleted because references remain. [[`XACKDEL`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/xackdel.json)] [[`XDELEX`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/xdelex.json)] [[PR #4629](https://github.com/valkey-io/valkey/pull/4629)]

#### Runnable fan-out example

```console
$ id=$(valkey-cli --raw XADD events '*' type order-created id 42)
$ valkey-cli XGROUP CREATE events billing 0 MKSTREAM
OK
$ valkey-cli XGROUP CREATE events analytics 0
OK

$ valkey-cli XREADGROUP GROUP billing worker-1 COUNT 1 STREAMS events '>'
$ valkey-cli XREADGROUP GROUP analytics worker-2 COUNT 1 STREAMS events '>'

# Billing finishes first. ACKED acknowledges billing but keeps the entry
# because analytics still references it. Expected per-ID status: 2.
$ valkey-cli XACKDEL events billing ACKED IDS 1 "$id"
1) (integer) 2

# Analytics finishes. The entry can now be removed. Expected status: 1.
$ valkey-cli XACKDEL events analytics ACKED IDS 1 "$id"
1) (integer) 1
```

The commands propagate equivalent `XACK` and `XDEL` effects rather than requiring replicas to understand the new command names, which was intentionally designed for backward-compatible replication effects. [[PR #4629](https://github.com/valkey-io/valkey/pull/4629)] [[stream tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/type/stream-cgroups.tcl)]

### 3. `INCREX`: increment and set expiry atomically

`INCREX` combines numeric increment, optional expiration, and optional existence conditions in one command:

```text
INCREX key [NX|XX]
            [EX seconds|PX milliseconds|EXAT unix-seconds|PXAT unix-milliseconds]
            [BYINT integer|BYFLOAT float]
```

It starts a missing key at zero, increments by one when no `BY*` option is supplied, and returns a two-element reply: the resulting/current value and the increment actually applied. A skipped `NX`/`XX` operation reports an applied increment of zero. [[PR #3253](https://github.com/valkey-io/valkey/pull/3253)] [[command metadata](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/increx.json)] [[tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/type/incr.tcl)]

#### Runnable rate-window example

```console
$ valkey-cli INCREX api:user:42 EX 60
1) (integer) 1
2) (integer) 1

$ valkey-cli INCREX api:user:42 BYINT 5
1) (integer) 6
2) (integer) 5

$ valkey-cli TTL api:user:42
(integer) 60
```

When an expiration option is omitted, an existing TTL is preserved. Integer overflow, invalid floats, `NaN`, and infinity are rejected. `NX` and `XX` are mutually exclusive, as are `BYINT` and `BYFLOAT`. [[tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/type/incr.tcl)]

### 4. Conditional transactions without `WATCH`

`EXEC` now accepts repeatable preconditions:

```text
EXEC [IFEQ key value|IFNE key value|NX key|XX key]...
```

All conditions use implicit AND. If any condition fails, the queued transaction is discarded and `EXEC` returns null, matching the abort shape of a failed `WATCH`. This removes the extra `WATCH` round trip and is friendlier to pipelined clients and connection-sharing models. [[PR #4019](https://github.com/valkey-io/valkey/pull/4019)] [[command metadata](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/exec.json)] [[tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/multi.tcl)]

#### Runnable optimistic-locking example

```console
$ valkey-cli
127.0.0.1:6379> SET version:{cart:42} 7
OK
127.0.0.1:6379> GET version:{cart:42}
"7"
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> SET version:{cart:42} 8
QUEUED
127.0.0.1:6379> HSET cart:{cart:42} total 149.00
QUEUED
127.0.0.1:6379> EXEC IFEQ version:{cart:42} 7
1) OK
2) (integer) 1
```

Conditions only compare strings for `IFEQ`/`IFNE`; non-string values do not match. In Cluster, every condition key and every transaction key must share a slot. The syntax intentionally provides a flat AND list only; use scripts when more complex expressions are required. [[PR #4019](https://github.com/valkey-io/valkey/pull/4019)]

Related command improvements:

- `SET key value IFNE comparison` writes only if the current value is different; a missing key satisfies `IFNE`. [[PR #3105](https://github.com/valkey-io/valkey/pull/3105)] [[`SET`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/set.json)]
- `MOVE key db REPLACE` can overwrite the destination database's existing key. [[PR #2993](https://github.com/valkey-io/valkey/pull/2993)] [[`MOVE`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/move.json)]
- `SISMEMBER ... XX` and the `ZRANGE` family's `XX` distinguish a missing key from an empty/negative result. Note that the tagged `SISMEMBER` metadata says its `XX` history began in 9.1.0 even though the RC release note lists it under 9.2 command updates. [[`SISMEMBER`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/sismember.json)] [[`ZRANGE`](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/zrange.json)]

### 5. Reusable ACL roles

ACL roles are named, reusable collections of selectors that can be assigned to multiple users. Permission checks OR together a user's own selectors and all assigned role selectors. Updating a role immediately changes effective permissions for its members. [[PR #3967](https://github.com/valkey-io/valkey/pull/3967)]

```console
$ valkey-cli ACL SETROLE readonly-api +@read ~api:* resetchannels
OK
$ valkey-cli ACL SETUSER app on '>secret' resetkeys resetcommands \
    role=readonly-api
OK
$ valkey-cli ACL GETROLE readonly-api
$ valkey-cli ACL GETUSER app
$ valkey-cli ACL ROLES
```

Roles can be stored in the ACL file or `valkey.conf`, survive `CONFIG REWRITE`, and are loaded before users so file order does not matter. Existing ACL files without roles continue to load. `ACL GETUSER` gains a `roles` field and `ACL LIST` emits role entries before user entries. [[PR #3967](https://github.com/valkey-io/valkey/pull/3967)] [[ACL role tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/acl-role.tcl)]

Limitations and traps:

- Roles cannot nest.
- Roles cannot have passwords or be turned on/off.
- A user's own rules can add permissions but cannot subtract permissions granted by a role because selectors use OR semantics.
- New roles inherit defaults such as `alldbs`; operators should explicitly reset database/channel scope where required.
- A role cannot be deleted while users still reference it. [[PR #3967](https://github.com/valkey-io/valkey/pull/3967)]

### 6. `ACL DIGEST`: verify the policy that is actually active

`ACL DIGEST` returns a fixed-size SHA-256-derived hexadecimal fingerprint of effective ACL user rules. It allows a controller to compare the digest before and after `ACL LOAD` without reproducing Valkey's normalization and ACL parser client-side. Equivalent rules in a different order produce the same digest; changing permissions or password hashes changes it. [[PR #4446](https://github.com/valkey-io/valkey/pull/4446)] [[command metadata](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/acl-digest.json)]

```console
$ valkey-cli ACL DIGEST
"24ece0a4daea0bcb936b438ae6c9f36db76f57dfc70e00def7b2c26041c49822"
```

The literal digest above is the PR's example, not a universal expected value. It fingerprints the current server's ACL state. The command does not change the existing `ACL LOAD` reply. [[PR #4446](https://github.com/valkey-io/valkey/pull/4446)]

### 7. Forkless RDB snapshots

Forkless save serializes RDB data with a background thread instead of a forked child. It is designed for environments where `fork()` and copy-on-write pressure are undesirable. Enabling the infrastructure allocates four additional bytes of metadata per key. [[PR #4460](https://github.com/valkey-io/valkey/pull/4460)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

```conf
forkless-infrastructure-enabled yes
bgsave-default-method forkless
```

The infrastructure setting is immutable and must be set at startup. The save method is runtime configurable, but selecting `forkless` requires the infrastructure to have been enabled. `INFO persistence` reports current/last save type and estimated time remaining. [[PR #4460](https://github.com/valkey-io/valkey/pull/4460)] [[INFO tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/unit/info.tcl)]

Operational caveats:

- Writes to a key currently being serialized may block and be transparently retried after the background worker releases it.
- A script or function that writes undeclared keys cannot be paused mid-execution and may synchronously block the main thread.
- Modules with custom data types must declare thread-safe forkless RDB callbacks; otherwise Valkey falls back to fork-based save.
- Module loading is blocked during a forkless save. [[PR #4460](https://github.com/valkey-io/valkey/pull/4460)]

### 8. Whole-RDB and replication LZ4 compression

`rdbcompression lz4` compresses the entire logical RDB stream as one LZ4 frame inside a Valkey Compressed Stream envelope. This differs from the existing default, which applies LZF to individual strings inside an otherwise plain RDB. The default remains unchanged for compatibility. [[PR #3531](https://github.com/valkey-io/valkey/pull/3531)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)] [[RDB tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/integration/rdb-compression.tcl)]

```console
$ valkey-cli CONFIG SET rdbcompression lz4
OK
$ valkey-cli SAVE
OK
```

Steady-state and diskless replication can use negotiated LZ4 with `repl-compression lz4`; compression is active only when both sides opt in, and older or opted-out replicas continue with plaintext. Disk-based full sync follows `rdbcompression` and uses compressed RDB only when every attaching replica advertises support. [[PR #3853](https://github.com/valkey-io/valkey/pull/3853)] [[PR #4075](https://github.com/valkey-io/valkey/pull/4075)] [[replication tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/integration/repl-compression.tcl)]

Downgrade warning: an older Valkey version cannot load the new LZ4-wrapped format. Before downgrade, switch back to legacy compression, rewrite configuration, create a new snapshot, and verify it with the older binary:

```console
$ valkey-cli CONFIG SET rdbcompression yes
$ valkey-cli CONFIG REWRITE
$ valkey-cli SAVE
```

This procedure is documented directly in the tagged sample configuration. [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

### 9. Built-in hot-key detection

Valkey can now sample accesses and report the highest estimated-QPS keys using `HOTKEYS GET`; `HOTKEYS RESET` clears the current and completed windows. Detection is disabled when `hotkeys-top-k` is zero, the default. [[PR #3708](https://github.com/valkey-io/valkey/pull/3708)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)] [[command metadata](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/hotkeys-get.json)]

```console
$ valkey-cli CONFIG SET hotkeys-top-k 10
OK
$ valkey-cli CONFIG SET hotkeys-sampling-percentage 10
OK
$ valkey-cli CONFIG SET hotkeys-window-seconds 5
OK

# Generate traffic, then wait for a reporting window to close.
$ valkey-cli HOTKEYS GET
```

`HOTKEYS GET` reports the last completed window, not the currently open one. Sampling is approximate: lower sampling percentages reduce overhead but make low-QPS estimates coarse. Expiry and eviction do not immediately erase a tracked sample, and rename/move can leave the old name visible until window rotation. [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

### 10. Resilience under overload

Valkey 9.2 adds three related but distinct controls:

- **Replication throttling** can slow client writes when a replica falls behind, aiming to avoid replica disconnects and expensive full synchronization. It is opt-in with `repl-throttling-enabled`. [[PR #4356](https://github.com/valkey-io/valkey/pull/4356)]
- **Priority event handling** lets cluster heartbeats, replication, and slot migration interrupt long batches of normal client work. `priority-preemptive-poll-interval-us` trades tighter internal-event latency for client batching throughput; the sample configuration documents a default of 2000 microseconds. [[PR #4076](https://github.com/valkey-io/valkey/pull/4076)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]
- **Reserved administrative connections** identify clients from configured `priority-subnets` and reserve `maxclients-reserved` slots inside the existing `maxclients` total. Raising the reservation at runtime does not evict existing normal clients; it restricts new normal connections until usage falls below the new ceiling. [[PR #4005](https://github.com/valkey-io/valkey/pull/4005)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

```conf
repl-throttling-enabled yes
priority-preemptive-poll-interval-us 2000
maxclients 10000
priority-subnets "192.168.1.0/24 10.0.0.0/8"
maxclients-reserved 128
```

These features mitigate specific overload and control-plane failure modes; they do not guarantee that replication never disconnects, that failover is lossless, or that administrative clients are authorized. CIDR priority controls capacity and scheduling, while ACL/TLS still control security.

### 11. Alternate TLS certificates

Valkey can load a second server certificate/key pair:

```conf
tls-cert-file server-rsa.crt
tls-key-file server-rsa.key
tls-alt-cert-file server-mldsa.crt
tls-alt-key-file server-mldsa.key
```

This allows, for example, a post-quantum certificate alongside RSA for clients with different algorithm support. New `INFO TLS` fields expose alternate certificate serial and expiry information, and certificate auto-reload watches alternate-key changes. [[PR #3717](https://github.com/valkey-io/valkey/pull/3717)] [[PR #4663](https://github.com/valkey-io/valkey/pull/4663)] [[configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)]

This provides certificate-selection flexibility, not automatic post-quantum security for every connection; the negotiated result depends on the certificates, OpenSSL build, client capabilities, and configured cipher/signature support.

### 12. Safer script-cache memory

`maxmemory-scripts` adds a memory limit for scripts cached through `EVAL`, complementing the existing independent 500-script count limit. Scripts loaded by `SCRIPT LOAD` are not evicted by this setting, but `SCRIPT LOAD` is now `DENYOOM` and therefore subject to the normal global `maxmemory` path. [[PR #866](https://github.com/valkey-io/valkey/pull/866)]

This closes two different abuse paths: a small number of very large `EVAL` scripts and an unbounded number of `SCRIPT LOAD` scripts. Depending on the global eviction policy, `SCRIPT LOAD` may evict keys or fail with OOM. [[PR #866](https://github.com/valkey-io/valkey/pull/866)]

### 13. Large sorted sets move from skiplist to B+ tree

Large sorted sets now use a B+ tree behind an ordered-index abstraction; small sorted sets keep listpack encoding. The intended user-visible command semantics, RDB/AOF format, configuration, and module API remain unchanged. `OBJECT ENCODING` is the direct visible difference:

```console
$ valkey-cli OBJECT ENCODING leaderboard
"btree"
```

The PR reports lower memory overhead and substantial gains for mutation-heavy benchmark cases, but those measurements belong to the feature branch's stated hardware/workload and should not be generalized as universal Valkey 9.2 performance. The implementation does not yet merge sparse sibling leaves after heavy deletion, so delete-heavy occupancy can degrade until future compaction work. [[PR #4359](https://github.com/valkey-io/valkey/pull/4359)]

## Operator and developer quality-of-life improvements

### Configuration introspection

`CONFIG INFO pattern...` returns metadata such as parameter type, flags, numeric range, and valid enum values. This can power safer configuration UIs and validation without copying server rules into every tool. [[PR #3050](https://github.com/valkey-io/valkey/pull/3050)] [[command metadata](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/commands/config-info.json)]

```console
$ valkey-cli CONFIG INFO 'rdbcompression'
$ valkey-cli CONFIG INFO 'hotkeys-*'
```

### CLI environment defaults

`valkey-cli` now reads `VALKEYCLI_HOST`, `VALKEYCLI_PORT`, and `VALKEYCLI_USER`, reducing repeated flags in development and automation. Password handling remains separate; avoid putting secrets into shell history. [[PR #3402](https://github.com/valkey-io/valkey/pull/3402)] [[PR #4126](https://github.com/valkey-io/valkey/pull/4126)] [[source](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/src/valkey-cli.c)]

```console
$ export VALKEYCLI_HOST=127.0.0.1
$ export VALKEYCLI_PORT=6379
$ export VALKEYCLI_USER=app
$ valkey-cli PING
PONG
```

### Data-driven `valkey-benchmark`

`valkey-benchmark` can load CSV/TSV data and substitute columns through `__field:name__` placeholders. It supports variable-size content, headers, `--maxdocs`, random placeholders, pipelining, and multi-threaded operation. [[PR #2823](https://github.com/valkey-io/valkey/pull/2823)] [[tests](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/tests/integration/valkey-benchmark.tcl)]

```csv
sku,name,price
1001,Blue mug,12.50
1002,Green mug,13.00
```

```console
$ valkey-benchmark --dataset products.csv --maxdocs 2 -n 10000 \
    HSET product:__field:sku__ \
    name "__field:name__" price "__field:price__"
```

The benchmark also improves multi-thread scaling, accepts larger `-r` keyspaces, and handles malformed repeat-count input safely. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)]

## Complete categorized change inventory

The release note remains the canonical exhaustive list. The inventory below compresses it into production-relevant themes while retaining every top-level release-note item. [[release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)]

### New features and enhanced behavior

- ACL digest; forkless RDB snapshots; `XACKDEL`/`XDELEX`; alternate TLS certificate; ACL roles; script-cache memory limit; Path Hash; whole-RDB LZ4; hot-key detection; replication throttling; priority system events; reserved administrative connections; `INCREX`.

### Performance and efficiency

- SIMD radix-tree child search.
- Multi-command parsing from the replication stream.
- Shared objects for Pub/Sub patterns and `WATCH` keys.
- B+ tree for large sorted sets.
- Background-thread cluster-config saving in best-effort mode.
- Batched `HMGET`, `SMISMEMBER`, and `ZMSCORE` lookups.
- I/O-thread memory prefetching for 30 hash/set/sorted-set member commands.
- `MEMORY PURGE` support for glibc's main arena.
- Batched command propagation into one replication-buffer write.
- Fewer `lseek` calls in disk replication.
- Cached daylight-saving information.
- Cheaper keyspace notifications when nobody subscribes.
- Fast path for exact `XTRIM MAXLEN = 0`.
- Cluster bus and inbound TLS accept work on shared I/O threads.
- Listpack support for small hashes with field expiry.
- Skipped post-command bookkeeping when no downstream work is pending.

### Command and API changes

- `MOVE REPLACE`; bounds validation for `WAIT`/`WAITAOF`; `CONFIG INFO`; `SET IFNE`; conditional `EXEC`; `SISMEMBER XX`; more defensive `NOT_KEY` handling; corrected `DEBUG HELP`; `ZRANGE ... XX`; corrected `ZRANGE` and `XPENDING` reply schemas.

### Cluster and replication

- Keyless-command redirection from replicas for capable clients.
- Immediate cluster-state update after changing full-coverage config.
- More robust `CLUSTER BUMPEPOCH`.
- Retry `PSYNC` after `-BUSY`.
- Consistent `-NOMASTERLINK` when a replica's primary link is down.
- Configurable cluster replica priority.
- Fast retry after an unwinnable failover vote.
- Per-target authentication for `CLUSTER MIGRATESLOTS`.
- LZ4 compression for disk-based full sync.
- `cluster-replica-no-failover if-empty`.
- Negotiated LZ4 steady-state replication.
- Stable `CLUSTERSCAN` fingerprints with shared hash seed.
- Immediate failover check after runtime config changes.
- Validation of node/shard IDs and gossip.
- Prompt persistence of address and replica-priority changes.
- Safer handling of malformed open-slot RDB metadata.
- Valid rewritten propagation for `XADD`/`XTRIM`.
- Clearing stale primary-failure gossip.
- PFAIL recovery when a PING is lost but peer traffic continues.
- Restriction of `CLUSTER SYNCSLOTS FINISH` to migration clients.

### Configuration

- Memory units for commandlog request/reply size thresholds.
- Validation of `cluster-announce-ip`.
- Validation of empty `tls-ca-cert-dir`.
- Documentation of database-level ACL rules.
- Module load order preserved by `CONFIG REWRITE`.
- `unixsocketgroup` sandbox/chown documentation.

### Module API

- Raw borrowed scans for hash/set/sorted-set keys.
- Loading support for legacy modules exporting `RedisModule_OnLoad`.
- Time-bounded, resumable global defrag callbacks.
- External-memory accounting APIs.
- Corrected integer return declarations for three ACL/user APIs.

### Observability and logging

- More complete client-memory accounting.
- More complete `CONFIG RESETSTAT`.
- Correct THP `madvise` recommendation.
- Better manual-failover, TLS-date, gossip, PFAIL, RDMA, and module-version logging.
- musl/Alpine crash stack traces through libbacktrace.
- Total transaction timing in slowlog/commandlog.
- Last successful full-sync duration.
- Correct 32-bit crash-handler signal parsing.
- Inbound/outbound cluster-link establishment counters.
- Complete EVAL-script memory reporting.
- Correct primary and alternate TLS certificate reload/reporting.

### CLI, build, and packaging

- CLI host/port/user environment variables.
- Dataset-driven benchmark commands.
- Correct failure from `valkey-cli --rdb`.
- Benchmark input validation, larger random keyspaces, and better multi-thread scaling.
- REUSE/SPDX-compatible licensing metadata.
- Reliable parallel generation of `release.h`.
- Private CMake link dependencies.
- Propagated `CPPFLAGS`.
- Minimum CMake version 3.24.

### Notable correctness and security fixes

- Reject unsafe module loads during async replication loading and atomic slot migration.
- Reject cluster slot mutations on replicas.
- Fix cluster heartbeat, transaction-slot, timer, blocked-client, and slot-sync crashes.
- Make stream consumer-group mutations invalidate `WATCH` and client tracking.
- Fix case-colliding function-library deletion/replacement crash.
- Avoid tracking routing-only tokens as client keys.
- Harden malformed cluster config, IDs, gossip, and RDB metadata.
- Fix a TLS 100% CPU busy loop.
- Fix excess client eviction with deferred closes.
- Fix concurrent RDB compression corruption.
- Preserve field TTLs during hash encoding conversion on load.
- Fix B+ tree score-boundary errors in `ZCOUNT` and `ZREMRANGEBYSCORE`.
- Fix `SORT STORE` option-like destination ACL bypass. [[PR #4665](https://github.com/valkey-io/valkey/pull/4665)]

## Recommended 60-90 second video structure

### Hook: 0-8 seconds

“Valkey 9.2's first release candidate adds a new data type—and then quietly upgrades streams, transactions, security, and operations.”

Visual: `9.2.0-rc1` badge with “pre-release” clearly visible.

### Scene 1: 8-28 seconds — Path Hash

Show three nested paths entering one Valkey key, then:

```console
PHLONGEST routes /api/v1/orders/42
PHPREFIXES routes /api/v1/orders/42
```

Message: “Exact and prefix lookup now live in one radix-tree-backed data type—designed first for AI KV-cache routing, but useful for any hierarchical index.”

### Scene 2: 28-42 seconds — Streams

Show one event consumed by billing and analytics. Billing's first `XACKDEL ... ACKED` returns `2`; analytics' returns `1` and the event disappears.

Message: “Streams can acknowledge and reclaim messages safely across consumer groups without a custom cleanup process.”

### Scene 3: 42-55 seconds — Atomic app logic

Rapid montage:

```console
INCREX api:user:42 EX 60
SET config:new value IFNE old
EXEC IFEQ version 7
```

Message: “Counters with TTL, compare-and-set, and multi-key optimistic locking now take fewer commands and round trips.”

### Scene 4: 55-70 seconds — Security and operations

Split screen:

- `ACL SETROLE`, `ACL DIGEST`
- `HOTKEYS GET`
- forkless save and LZ4 arrows

Message: “Reusable ACL roles, policy fingerprints, built-in hot-key detection, forkless snapshots, and negotiated compression make large deployments easier to run.”

### Close: 70-80 seconds

“It is still an RC. Test client compatibility, snapshot downgrade paths, modules, and workloads before production.”

## Claims to avoid in the video

- Do not call RC1 the stable Valkey 9.2 release.
- Do not say Path Hash performs semantic or vector matching.
- Do not imply forkless save is nonblocking in every case.
- Do not say LZ4 is enabled by default.
- Do not claim compression always improves latency or cost; results depend on CPU, data, and network.
- Do not say replication throttling prevents all full syncs or data loss.
- Do not treat priority subnets as authentication or authorization.
- Do not generalize PR benchmark percentages beyond their stated test setup.
- Do not claim new stream deletion modes are automatically safe for every retention policy; `KEEPREF`, `ACKED`, and `DELREF` deliberately make different tradeoffs.

## Verification record

- Inspected the official GitHub release metadata and complete release-note body.
- Cloned the official `9.2.0-rc1` tag at commit `f01ed55e8c3d8a7d0c1d12661e9818edec758d42`.
- Inspected tagged command JSON, `valkey.conf`, implementation comments, and relevant unit/integration tests.
- Read first-party PR descriptions for the major features and linked first-party issues where they supplied motivation.
- CLI snippets are designed to be runnable against a 9.2.0-rc1 server, but the examples were **not executed** against a built RC binary in this research pass. Expected replies are based on tagged command schemas and tests.

## Primary source index

- [Official 9.2.0-rc1 release](https://github.com/valkey-io/valkey/releases/tag/9.2.0-rc1)
- [Official 9.2.0-rc1 source tag](https://github.com/valkey-io/valkey/tree/9.2.0-rc1)
- [Tagged sample configuration](https://github.com/valkey-io/valkey/blob/9.2.0-rc1/valkey.conf)
- [Tagged command metadata](https://github.com/valkey-io/valkey/tree/9.2.0-rc1/src/commands)
- [Tagged tests](https://github.com/valkey-io/valkey/tree/9.2.0-rc1/tests)
- [Path Hash PR #4506](https://github.com/valkey-io/valkey/pull/4506)
- [Stream cleanup PR #4629](https://github.com/valkey-io/valkey/pull/4629)
- [ACL roles PR #3967](https://github.com/valkey-io/valkey/pull/3967)
- [ACL digest PR #4446](https://github.com/valkey-io/valkey/pull/4446)
- [`INCREX` PR #3253](https://github.com/valkey-io/valkey/pull/3253)
- [Conditional `EXEC` PR #4019](https://github.com/valkey-io/valkey/pull/4019)
- [Forkless save PR #4460](https://github.com/valkey-io/valkey/pull/4460)
- [RDB LZ4 PR #3531](https://github.com/valkey-io/valkey/pull/3531)
- [Replication LZ4 PR #3853](https://github.com/valkey-io/valkey/pull/3853)
- [Full-sync LZ4 PR #4075](https://github.com/valkey-io/valkey/pull/4075)
- [Hot-key detection PR #3708](https://github.com/valkey-io/valkey/pull/3708)
- [Replication throttling PR #4356](https://github.com/valkey-io/valkey/pull/4356)
- [Priority event processing PR #4076](https://github.com/valkey-io/valkey/pull/4076)
- [Reserved connection slots PR #4005](https://github.com/valkey-io/valkey/pull/4005)
- [Alternate TLS certificate PR #3717](https://github.com/valkey-io/valkey/pull/3717)
- [Script-cache memory PR #866](https://github.com/valkey-io/valkey/pull/866)
- [Sorted-set B+ tree PR #4359](https://github.com/valkey-io/valkey/pull/4359)
- [Dataset benchmark PR #2823](https://github.com/valkey-io/valkey/pull/2823)
