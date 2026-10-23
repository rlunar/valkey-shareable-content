How do you find the most specific rule for a request path in one lookup? Valkey nine point two introduces Path Hash. It can find the longest stored prefix or return every matching ancestor. Valkey nine point two is generally available. Let's see it in action.

Path Hash is a binary-safe, radix-tree-backed data type.

This example stores routing rules at three nested paths. P H longest returns the most specific stored prefix. P H prefixes returns every matching ancestor. Each path can hold several fields, and the whole tree lives under one Valkey key.

Path Hash was initially designed for AI K V-cache placement. An inference router can encode cumulative prompt-block hashes as paths and ask which workers hold each reusable prefix. The router still chooses the worker. Valkey performs exact byte-prefix matching, not vector or semantic search.

The tree occupies one cluster slot, its time to live applies to the top-level key, and a large P H delete prefix operation can block while it removes the subtree.

Large sorted sets now use a B-plus tree instead of a skiplist. Small listpack-encoded sets are unchanged, and command and persistence formats remain compatible.

In the feature benchmark, Z add score updates rose from two hundred and five thousand to four hundred and twenty-one thousand operations per second. Z remove rose seventy-six percent. With five million twenty-byte members, index overhead fell from fifty point three bytes per member to between twenty-eight point five and thirty-two bytes—a thirty-six to forty-three percent reduction.

Those results belong to the pull request's workloads. Delete-heavy sets may save less because sparse leaves are not yet compacted.

X ack del and X delete X make Stream cleanup aware of consumer-group references.

Billing and analytics both read the same event. Billing finishes first. In acknowledged mode, Valkey acknowledges its copy but returns two because analytics still references the event. When analytics finishes, Valkey returns one and deletes it.

Keep ref, acknowledged, and delete ref make different retention trade-offs. They do not create exactly-once delivery.

Increment expire combines an increment and expiration. This counter increases and receives a sixty-second time to live in one atomic command.

Conditional exec can commit a transaction only when if equal, if not equal, N X, or X X conditions pass. That replaces a separate watch round trip for common optimistic-locking flows.

Set if not equal covers a smaller compare-and-set case, and move replace can overwrite a destination key.

A C L roles turn repeated selector sets into named policy. Here, three application users can share one read-only API role. Updating the role changes their effective permissions immediately.

Roles do not hold passwords and cannot include other roles. Their permissions add to the user's own selectors.

A C L digest fingerprints the effective A C L state, so automation can compare policy before and after A C L load.

Forkless snapshots move R D B serialization into a background thread instead of a forked child. This removes copy-on-write page duplication as a source of peak memory growth. The exact saving depends on writes during the snapshot, and the project publishes no universal percentage.

The fixed cost is four extra bytes per key when forkless infrastructure is enabled—about four hundred megabytes for one hundred million keys, before allocator effects.

Replication compression saves network bandwidth, not demonstrated server memory. In the pull request's BlockMesh benchmark—three million keys with values around three hundred and fifteen bytes—L Z four reduced replication bandwidth by fifty-two percent, used two point five seconds of compression C P U, and added less than one percent throughput overhead.

Hot-key detection samples requests and reports estimated high-Q P S keys. It is disabled until hot keys top K is greater than zero.

Replication throttling can slow client writes when a replica falls behind. Priority polling lets cluster heartbeats, replication, and slot migration run during heavy client work. Reserved slots preserve connection capacity for clients arriving from configured networks.

The network list controls priority and capacity. A C L and T L S still control access.

Valkey nine point two is generally available. Try Path Hash, test large sorted sets, and measure forkless snapshots and replication compression with your workload. Start with the release notes and the demos linked below.
