# Valkey 9.2 GA metrics research

Research date: 2026-10-11

## Scope and evidence rules

This note uses only first-party material in the official
[`valkey-io/valkey`](https://github.com/valkey-io/valkey) repository: pull
requests, issues, source code, tests, and release-oriented implementation
material.

- **Measured result** means the Valkey project published a workload, test
  environment, and observed result.
- **Theoretical/configuration fact** means the behavior or bound follows from
  the merged configuration or source, but is not a benchmark result.
- **Unavailable metric** means no quantitative result was found in the reviewed
  first-party sources. It must not be converted into a marketing number.

## Executive summary

| Feature | Defensible quantitative statement | Classification |
|---|---|---|
| Forkless RDB save | Enabling the infrastructure adds **4 bytes of metadata per key**. The implementation limits cloned string items to **512 bytes each** and the aggregate clone pool to **1 MiB**. | Configuration/source facts, not measured savings |
| LZ4 replication compression | On **3 million BlockMesh tweet values averaging about 315 bytes**, LZ4 level 0 reported **52% bandwidth savings**, **2.5 seconds compression CPU**, and **less than 1% throughput overhead**. | Measured PR result |
| Large sorted sets using the B+ tree | On a **3 million-member** sorted set, the largest reported command gain was **ZADD score updates: 205K to 421K ops/s, +105%**. For **5 million 20-byte members**, measured index overhead fell by **36% to 43%**, depending on insertion pattern. | Measured PR results |

## 1. Forkless RDB save

### What the official sources establish

The merged [Forkless Save PR
#4460](https://github.com/valkey-io/valkey/pull/4460) adds an alternative RDB
background-save method that serializes through a background iterator rather
than creating a fork child.

The PR documents two relevant configuration facts:

- `forkless-infrastructure-enabled` defaults to `no`, is immutable after
  startup, and allocates **4 additional bytes of metadata per key** when
  enabled.
- `bgsave-default-method` defaults to `fork`; `forkless` must be selected to
  make it the default save method, and Valkey can fall back to a fork-based save
  when incompatible modules are loaded.

The merged source also supplies implementation bounds:

- A cloned string item is limited to **512 bytes**.
- The aggregate pool for cloned items is limited to **1 MiB**.
- The dynamic background-iteration queue is capped at **10,000 items**.

These constants are visible in
[`src/bgiteration.c` at the merge
commit](https://github.com/valkey-io/valkey/blob/acba5ddd0/src/bgiteration.c#L181-L188).
They are bounds on selected internal buffers, not a bound on the feature's
entire memory footprint.

### What can be said about memory impact

Forkless save avoids creating the traditional RDB fork child and therefore
avoids that save path's fork-time copy-on-write mechanism. This is an
architectural fact, not a measured percentage or byte saving.

The implementation is not “zero extra memory.” It deliberately introduces
per-key metadata, queues, temporary clones, retained entries, and buffered
replication data while iteration is active. The source tracks clone-pool and
buffered-replication memory explicitly; the latter is excluded from the
maxmemory eviction calculation. See the merged
[`bgiteration.c`](https://github.com/valkey-io/valkey/blob/acba5ddd0/src/bgiteration.c)
and [PR #4460](https://github.com/valkey-io/valkey/pull/4460).

### Quantitative savings unavailable

No official comparative benchmark was found in PR #4460, its linked tracking
issue [#4219](https://github.com/valkey-io/valkey/issues/4219), its linked
component PRs, or the merged tests that reports any of the following:

- peak RSS for forkless save versus fork-based `BGSAVE`;
- copy-on-write bytes avoided;
- percentage memory reduction;
- memory saved for a named dataset or write rate;
- CPU or latency impact under a production-like workload.

Therefore, the video should **not** claim a percentage memory saving for
forkless RDB save. A technically safe line is:

> Forkless save avoids creating an RDB fork child and its copy-on-write
> exposure. The trade-off is four bytes of metadata per key plus bounded and
> workload-dependent iterator memory.

The “bounded” qualifier applies to the explicitly capped clone pool and queue;
total transient memory remains workload-dependent.

## 2. LZ4 replication compression

### Measured replication result

[PR #3853, Streaming Compression support for
Replication](https://github.com/valkey-io/valkey/pull/3853), publishes this
headline benchmark:

- Dataset: **3 million BlockMesh tweet keys**, approximately **315 bytes per
  value**.
- Codec: **LZ4 level 0**, the default LZ4 level in the result.
- Bandwidth savings: **52%**.
- Compression CPU: **2.5 seconds**.
- Throughput overhead: **less than 1%**.

The PR does not state enough timing context to reinterpret “2.5 seconds
compression CPU” as CPU percentage, cores consumed, or end-to-end latency.
Keep it in the original unit and scope.

“52% bandwidth savings” corresponds to sending approximately **48% of the
uncompressed byte volume**, or about a **2.08:1 uncompressed-to-compressed
ratio**. That ratio is arithmetic derived from the published percentage, not a
separately measured project result.

### Configuration and observability facts

The same PR establishes:

- Replication compression is disabled by default with
  `repl-compression no`.
- `yes` or `lz4` enables LZ4 when the primary and replica negotiate support.
- Steady-state compression operates in bounded batches of at most **1 MiB** of
  raw backlog input.
- The replica reads wire data in **16 KiB** chunks.
- `INFO replication` exposes per-link `repl_compressed_bytes` and
  `repl_uncompressed_bytes` counters for active compressed links; they reset
  when the replica reconnects.

These are implementation/configuration facts, not benchmark outcomes.

### Related RDB compression results are not replication results

[PR #3531, streaming compression for on-disk
RDB](https://github.com/valkey-io/valkey/pull/3531), reports that whole-stream
LZ4 produced:

- **30% to 77% faster saves** than per-string LZF;
- **24% to 73% faster loads**;
- **45% to 73% smaller RDB files**.

The benchmark used an `r7g.2xlarge` Graviton instance with 8 vCPUs, 61 GB RAM,
and NVMe storage, averaged over three repeats, with synthetic JSON and
BlockMesh tweet datasets.

These numbers apply to **on-disk RDB save/load**, not network replication.
PR #3531 explicitly says replication compression was outside its scope.
They must not be presented as replication bandwidth, CPU, or latency results.

### Replication metrics unavailable

Beyond the headline result in PR #3853, the reviewed first-party material does
not provide:

- absolute compressed and uncompressed byte totals for the 3-million-key run;
- wall-clock duration for the reported 2.5 CPU seconds;
- end-to-end replication latency or replica lag;
- p50, p95, or p99 latency;
- primary and replica CPU utilization percentages;
- results across multiple network speeds, value distributions, or compression
  ratios.

The 52% result is workload-specific and should not be generalized as a
guaranteed saving.

## 3. Large sorted-set B+ tree

### Feature and compatibility facts

[PR #4359](https://github.com/valkey-io/valkey/pull/4359) replaces the skiplist
used by non-listpack sorted sets with a B+ tree behind an ordered-index
abstraction. Small listpack-encoded sorted sets are unchanged.

The large sorted-set encoding name changes from `skiplist` to `btree`, while
the numeric encoding value remains 7. The PR states that there is no RDB or AOF
format change and no module API change.

The implementation uses:

- 61-way fanout;
- 512-byte leaf nodes;
- 2,048-byte inner nodes on 64-bit builds;
- subtree sizes for logarithmic rank navigation;
- AVX2 or NEON feature searches, with a scalar fallback.

### Measured throughput benchmark

The PR says these results were measured on the earlier feature branch in
[#4206](https://github.com/valkey-io/valkey/pull/4206) and **were not re-run for
the #4359 merge**.

Environment and method:

- ARM Graviton 3, `c7g.metal`, 64 cores;
- `io-threads=9`;
- pipeline depth 10;
- one 3-million-member sorted set;
- five repetitions;
- 95% confidence intervals within 2%, except `ZRANDMEMBER`, which was within
  5%.

| Command | Workload | Skiplist | B+ tree | Change |
|---|---|---:|---:|---:|
| `ZADD` | Score update, all hits | 205K ops/s | 421K ops/s | **+105%** |
| `ZREM` | 50/50 random add/remove | 386K | 680K | **+76%** |
| `ZCOUNT` | Score-range count | 720K | 917K | **+27%** |
| `ZRANK` | Point rank lookup | 692K | 825K | **+19%** |
| `ZRANGE` | 100-element rank scan | 174K | 183K | **+6%** |
| `ZRANDMEMBER` | 100 random samples | 5.0K | 5.1K | **+2%** |
| `ZSCORE` | Point score lookup | 1.44M | 1.46M | **+2%** |
| `ZRANGEBYSCORE` | 100-element score scan | 95K | 96K | **+1%** |
| `ZPOPMIN` | Pop minimum, append new member | 1.08M | 1.08M | **0%** |

The PR attributes the strongest gains to mutations that reposition elements
and benefit from cache locality. It also notes that `ZSCORE` and
`ZRANDMEMBER` use hashtable paths rather than the ordered index.

### Measured memory benchmark

Method:

- 5 million members;
- 20-byte elements;
- jemalloc heap profiling;
- result measures **per-member index overhead excluding user data**.

| Insertion pattern | Skiplist | B+ tree | Saving |
|---|---:|---:|---:|
| Sequential, dense packing | 50.3 B/member | 28.5 B/member | **21.8 B/member, 43%** |
| Random, fresh fill | 50.3 B/member | 32.0 B/member | **18.2 B/member, 36%** |

At 5 million members, multiplying the reported per-member differences gives
approximately:

- **109 MB decimal** (about **104 MiB**) less index overhead for sequential
  dense packing;
- **91 MB decimal** (about **86.8 MiB**) less for a random fresh fill.

Those aggregate values are derived arithmetic. The project published the
per-member measurements.

### Important limitation

The B+ tree implementation in the measured PR does not merge sibling leaves
after deletion. Empty nodes are freed, but delete-heavy workloads can leave
sparse leaves. The PR explicitly warns that such workloads can have worse
memory results than the fresh-fill measurements. The **36% to 43%** saving is
therefore not a universal guarantee.

## Recommended video-safe metrics

The following statements stay within the published evidence:

1. **Sorted sets:** “In a three-million-member benchmark, B+ tree sorted sets
   more than doubled ZADD score-update throughput, from 205 thousand to 421
   thousand operations per second. In a separate fresh-fill benchmark, index
   overhead fell by 36 to 43 percent.”
2. **Replication compression:** “For three million tweet-sized values, LZ4
   replication compression reduced bandwidth by 52 percent with less than one
   percent throughput overhead in the published benchmark.”
3. **Forkless save:** “Forkless save avoids the fork child and its
   copy-on-write exposure. Official sources quantify four bytes of metadata per
   key, but do not publish a comparative percentage for peak-memory savings.”

Do not combine these independent benchmarks into a single end-to-end Valkey
9.2 performance claim.

## Official source index

- [Forkless Save PR #4460](https://github.com/valkey-io/valkey/pull/4460)
- [Forkless tracking issue #4219](https://github.com/valkey-io/valkey/issues/4219)
- [Merged forkless implementation constants](https://github.com/valkey-io/valkey/blob/acba5ddd0/src/bgiteration.c#L181-L188)
- [Replication compression PR #3853](https://github.com/valkey-io/valkey/pull/3853)
- [On-disk RDB LZ4 compression PR #3531](https://github.com/valkey-io/valkey/pull/3531)
- [Sorted-set B+ tree merge PR #4359](https://github.com/valkey-io/valkey/pull/4359)
- [Earlier B+ tree feature PR #4206](https://github.com/valkey-io/valkey/pull/4206)

