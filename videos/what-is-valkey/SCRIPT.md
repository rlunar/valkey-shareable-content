# What is Valkey? Under two minutes

Recording script and animation brief. Planned runtime: **1:55**, including command and diagram holds. Audience: developers and architects encountering Valkey for the first time.

## Opening hook

“Are traffic peaks forcing you to oversize your database? If thousands of requests need the same answer, repeating the same work can become your bottleneck.”

Alternate opening, with the same visual: “Are you paying for peak database capacity while most requests ask for data you've already fetched?”

Use the first opening in the narration below. The second is an editorial option.

## Visual contract

Show one concept at a time. Use one short headline, labels of one to three words, and a maximum of four main components. Narration carries the explanation. Reveal only the arrow being discussed, then hold its result. Put terminal commands on their own full-screen shot. Use the Valkey colors and fonts already present in the library.

The library provides conceptual references. Rebuild or crop the relevant diagram stage for the recording; exclude navigation, options, long explanations, and resource dashboards. All displayed replies below are expected examples pending live recording.

## 00:00–00:13 | Repeated work creates pressure

**Voiceover**

“Are traffic peaks forcing you to oversize your database? If thousands of requests need the same answer, repeating the same work can become your bottleneck.”

**On screen:** `Same request. Repeated work.`

**Animation**

Start with Application and Database. Send three identical product requests across the same arrow, one after another. The database's pending-request stack grows. Freeze before introducing any new component. Show pressure through queued work, with no invented latency or cost counter.

**Library reference:** [C12 — cache on/off](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C12), “Start without a cache” and “Make the database busy.”

## 00:13–00:25 | Why memory is faster

**Voiceover**

“Memory is faster to access than disk because the system can read working data without waiting for storage input and output. Disk remains essential for durability. Memory is where applications keep data that must be read and changed quickly.”

**On screen:** `Memory: working data` · `Disk: durable storage`

**Animation**

Show one request taking a short direct path to memory. Beside it, show a longer conceptual path through persistent storage. Label the comparison as conceptual and display no latency numbers, multipliers, or benchmark bars.

**Library reference:** [In-memory explainer](../../Valkey_Demo_Library/animations/in-memory-explainer.html), memory working-set concept; [speed explainer](../../Valkey_Demo_Library/animations/valkey-speed.html), RAM/data path. Use a qualitative illustration.

## 00:25–00:38 | How key-value datastores work

**Voiceover**

“A key-value datastore works like a dictionary. The application provides a unique key, and the datastore returns the value associated with it. The key identifies the data directly, while commands create, read, update, delete, or expire that value.”

**On screen:** `Key` → `Value`

**Animation**

Start with the key `product:42`. Connect it directly to one product value. Replace that value once to illustrate an update, then add a small expiry clock. Keep database tables and query-language syntax off screen.

## 00:38–00:50 | Introduce Valkey

**Voiceover**

“Valkey is an open source, vendor-neutral, in-memory data structure store backed by the Linux Foundation. Applications use it for caching, shared state, messaging, and database workloads.”

**On screen:** `Valkey` · `Open source` · `Vendor neutral`

**Animation**

Cut to one Valkey server with a small memory compartment containing the key and value from the previous scene. Reveal the open source and vendor-neutral labels after the name, followed by the Linux Foundation attribution. Keep the earlier database off screen during this definition.

## 00:50–01:02 | Store, retrieve, expire

**Voiceover**

“Start with a key and a value. SET stores a product with a sixty-second lifetime. GET reads it back. The application chooses what to store and how long it remains useful.”

**On screen:** One command and reply at a time.

**Demo inside valkey-cli**

```console
valkey> SET demo:product:42 "Blue mug" EX 60
OK
valkey> GET demo:product:42
"Blue mug"
```

**Animation**

Hold the complete SET line before showing OK. Replace the command with GET, then reveal the value. Use a small clock icon labelled `60 s`; do not animate sixty seconds passing.

**Library reference:** [U18 — object caching](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U18).

## 01:02–01:22 | Reuse the result

**Voiceover**

“For caching, the application checks Valkey first. A miss sends it to the database, then it stores the result. The next matching request can reuse that result. Fewer repeated reads reach the database, giving it more room for work that needs fresh data.”

**On screen, sequentially:** `Miss` → `Store result` → `Hit`

**Animation**

Use Application, Valkey, and Database. First light Application → Valkey and show miss. Then light Application → Database and return the product. Then light Application → Valkey to fill the entry. On a second request, only the Valkey path lights up. The database stays still.

Keep the three phases distinct; allow a pause between each. Display no complete flowchart during this scene.

**Library reference:** [U01](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U01), `pg-cold` and `pg-warm`; [C01 — cache-aside](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C01).

## 01:22–01:35 | Data structures serve different jobs

**Voiceover**

“Valkey supports multiple value types, for example: hashes for records, sorted sets for rankings, and Streams for queued work. These structures let applications update shared data with atomic commands instead of building every operation from a read followed by a write.”

**On screen:** Three separate shots: `Hash: session`, `Sorted set: scores`, `Stream: jobs`.

**Animation**

Use three hard cuts. Show one session record, then one player moving in a leaderboard, then one job entering a Stream. Keep each shot on screen for several seconds. Do not assemble a feature wall.

**Library references:** [U02 — sessions](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U02), [U08 — leaderboards](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U08), [U07 — work queues](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U07).

## 01:35–01:46 | Persistence and availability

**Voiceover**

“When your workload needs recovery, Valkey supports disk persistence and replication. Clustering distributes keys across servers. The settings you choose determine how the system recovers and what data may be lost during a failure.”

**On screen:** `Persistence` then `Replication` then `Clustering`.

**Animation**

First show Valkey → Disk. Replace that shot with Primary → Replica. Replace it again with three shards, each holding different keys. Introduce no failover choreography within this short episode.

**Library reference:** [A06 — server and application boundary](../../Valkey_Demo_Library/animations/ValkeyConf_Animations.html#A06) for component styling. Persistence and sharding are simplified additions supported by the primary sources below.

## 01:46–01:55 | First experiment

**Voiceover**

“Start with one repeated request. Store its result, add an expiry, and measure hits, misses, and database reads. Go to valkey dot I O to learn more.”

**On screen:** `Try SET / GET` then `valkey.io`.

**Animation**

Return to the same product key from the demo. Reveal a single hit badge. End with `valkey.io` and the Valkey logo. Keep the final shot still for two seconds.

## Recording preparation

Run the two commands against the selected, version-pinned Valkey server. Use the same product in the diagram and terminal. The server needs no module for this demo. Expiry values depend on elapsed recording time.

The hook describes a workload opportunity. Capacity reduction needs a measured hit rate, reusable requests, and a sized cache; it is not an unconditional infrastructure saving.

## Primary sources

- [Valkey introduction](https://valkey.io/topics/introduction/) — definition, data structures, atomic operations, persistence, replication, clustering.
- [Valkey project](https://www.linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community) — Linux Foundation project governance.
- [SET](https://valkey.io/commands/set/) — value storage and expiry.
- [Valkey persistence](https://valkey.io/topics/persistence/) — recovery configuration.
- [AWS caching overview](https://aws.amazon.com/caching/) — repeated work, traffic peaks, and overprovisioning.

Source review: October 11, 2026. This deliverable is a script and production brief; narration timing and command replies have not been confirmed by a recording.
