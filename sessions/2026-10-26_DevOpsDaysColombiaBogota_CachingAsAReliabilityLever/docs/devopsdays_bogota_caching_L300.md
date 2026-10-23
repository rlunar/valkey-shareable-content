# Caching as a Reliability Lever (L300)

**Cut DB spend and tame latency with query & semantic caching**

DevOpsDays Bogotá 2026 · Roberto Luna Rojas · Valkey project, AWS

Session type: Talk (30 min, L300 technical) · Track: SRE / Cloud / Platform Engineering

---

## Who this is for

You run services with a database behind them. You have felt the pain of a read path that falls over under load, or a cloud bill that climbs faster than your traffic, or an LLM feature that costs more per request than you want to admit. This is a technical talk. I show architecture, code, and the numbers. I am honest about where caching helps and where it bites back.

Prerequisites: you are comfortable with databases, cloud deployment, and basic distributed-systems vocabulary (TTL, replication, consistency). No prior caching experience required, but we move fast past the basics.

---

## 1. The problem, stated precisely

Your database does the same expensive work over and over. Three failure modes, each with a signature on your dashboards:

1. **Latency spikes.** The same heavy reads repeat and queue behind each other. p50 looks fine, p99 climbs, and it climbs worst exactly when traffic peaks.
2. **Pager noise.** Repeated reads saturate the origin DB. Connection pools exhaust, CPU pins, and the on-call gets paged for load the system already computed minutes ago.
3. **Spend that outpaces traffic.** Every repeated query is billed compute. Every repeated LLM prompt is billed inference. Nothing remembers the last answer, so you pay again.

A cache tier is the lever that addresses all three at once. The rest of this talk is how to pull it without creating new problems.

### Why an uncached application degrades: an Amazon retail example

Abstract failure modes are easy to nod along to and hard to feel. So walk one concrete read path with me: a product detail page on Amazon retail. One page view fans out into many backend reads. Price. Availability. Buy-box eligibility. Ratings and review counts. Recommendations. Each is a query against a datastore, and most of them are the same answer for every shopper looking at that product in that minute.

Now picture a popular item during a traffic surge, a Prime Day lightning deal or a holiday spike. A few hundred thousand shoppers hit the same product in the same window. Without a cache, every one of those page views runs the full fan-out against the origin databases. Here is the mechanical chain of why that degrades, step by step.

**1. The database does redundant work.** The price of that item did not change between shopper one and shopper two hundred thousand, but the origin computes it two hundred thousand times. Each query parses, plans, acquires buffers, reads pages, and serializes a result. The answer is identical and the work is repeated in full every time.

**2. Connection pools saturate.** An application server holds a bounded pool of database connections, say 100. Under normal load a read returns in a few milliseconds and the connection is handed back almost immediately. When the origin slows under volume, each read holds its connection longer. This is Little's Law in action: the number of in-flight requests equals arrival rate times service time. Hold time climbs, so in-flight count climbs, and the fixed-size pool runs dry. New requests now block waiting for a connection before they do any work at all.

**3. Queues form and latency compounds.** Once requests queue for connections, waiting time stacks on top of actual service time. p50 can still look acceptable while p99 and p999 blow out, because the tail is where the queued requests live. Shoppers see the product page hang. The slowdown is not linear with traffic, it is a knee: past a certain utilization the system falls off a cliff.

**4. The origin itself contends.** On the database, concurrent identical reads pile onto the same hot rows and pages. CPU pins at 100%, the buffer cache thrashes, and any lock or latch contention multiplies. The database is now spending its cycles managing congestion rather than answering queries, so service time rises further, which per step 2 makes the pool problem worse. This is a feedback loop.

**5. Retries turn a slowdown into an outage.** Clients time out on the hanging page and retry. Each retry is another request against an already-saturated origin, so load goes up precisely when the system has the least headroom. This is a retry storm, and it is how a latency problem becomes a full saturation event and pages the on-call. The database can tip from slow to effectively down.

The root cause under all five steps is the same: the system repeats expensive, identical work and has nowhere to remember the answer. A cache breaks the chain at step 1. If the price, availability, and review count for that product are served from a cache tier, two hundred thousand page views collapse to one origin read plus a TTL's worth of refreshes, and the fan-out never reaches the database at surge volume. The connection pool stays healthy, no queue forms, the origin never contends, and there is nothing to retry-storm against. Same traffic, no degradation, because the repeated work stopped at the cache.

The cascade, and where the cache cuts it:

```
  WITHOUT CACHE                               WITH CACHE

  surge: 200k shoppers, same product          surge: 200k shoppers, same product
          │                                            │
          ▼                                            ▼
  ┌─────────────────────────┐                 ┌─────────────────────────┐
  │ 1. page fan-out          │                 │ cache tier (Valkey)      │
  │    price, stock, ratings │                 │ 1 origin read + TTL      │
  │    = many reads each     │                 │ refreshes, served hot    │
  └───────────┬─────────────┘                 └───────────┬─────────────┘
              ▼                                            │
  ┌─────────────────────────┐                             │  fan-out never
  │ 2. redundant DB work     │                             │  reaches the DB
  │    identical answers     │                             │  at surge volume
  │    recomputed 200k×       │                            ▼
  └───────────┬─────────────┘                 ┌─────────────────────────┐
              ▼                                 │ origin stays idle-ish    │
  ┌─────────────────────────┐                 │ pool healthy, no queue   │
  │ 3. connection pool drains│                 │ no contention            │
  │    (Little's Law)        │                 │ nothing to retry against │
  └───────────┬─────────────┘                 └─────────────────────────┘
              ▼                                            │
  ┌─────────────────────────┐                             ▼
  │ 4. queues form, p99/p999 │                     same traffic,
  │    blow out (the knee)   │                     no degradation
  └───────────┬─────────────┘
              ▼
  ┌─────────────────────────┐
  │ 5. origin contends ──────┼──┐  feedback loop:
  │    CPU pins, locks       │  │  slower service time
  └───────────┬─────────────┘  │  feeds back into step 3
              │  ◀──────────────┘
              ▼
  ┌─────────────────────────┐
  │ 6. timeouts → retry storm│
  │    slow tips to DOWN     │  ← on-call paged
└─────────────────────────┘
```

#### The pool math, with numbers

Step 2 and step 3 above are governed by Little's Law: the number of in-flight requests equals arrival rate times service time, `L = λ × W`. Rearranged, the most throughput a connection pool can sustain before it drains is `λ_max = pool_size / service_time`. Plug in real numbers for one app server with a 100-connection pool.

| State | DB service time (W) | Offered load (λ) | In-flight needed (L = λ × W) | Pool of 100 |
|-------|--------------------|-------------------|------------------------------|-------------|
| Healthy | 4 ms | 8,000 req/s | 32 | fits, 68 to spare |
| Origin slowed 10x under contention | 40 ms | 8,000 req/s | 320 | **exhausted 3.2x over** |
| Same load, cache at 98% hit | 4 ms | 160 req/s to origin | 0.6 | barely touched |

Read the middle row: nothing about the offered load changed, only the service time. When identical reads pile onto the origin and push service time from 4 ms to 40 ms, the in-flight count the pool must hold jumps from 32 to 320. The pool caps at 100, so requests 101 and beyond block waiting for a connection before they run a single query. That is the exact moment the page starts to hang, and it is why degradation is a knee, not a slope: the pool was 68% idle right up until service time crossed the line, then it fell off a cliff.

At a healthy 4 ms the same pool could sustain 25,000 req/s (`100 / 0.004`); at 40 ms it sustains only 2,500, below the offered 8,000. The cache row is the fix in one line: serve 98% of reads from Valkey and the origin sees 160 req/s, needing well under one connection. The pool never notices the surge.

### The mental model

```
            miss                         
  client ───────▶ cache ───────▶ origin (DB or model)
         ◀───────       ◀───────                       
            hit (fast, cheap)     slow, expensive
```

Every request is a bet: is the cost of a cache lookup plus the risk of staleness lower than the cost of recomputing at the origin? For read-heavy and repetition-heavy workloads the bet pays. The engineering is in measuring the bet honestly and bounding the staleness.

---

## 2. Query caching, in depth

### 2.1 Cache-aside (lazy loading)

The application owns the logic. This is the most common pattern and the one I reach for first.

```python
def get_product(product_id):
    key = f"product:{product_id}"
    val = cache.get(key)
    if val is not None:
        return deserialize(val)          # hit
    row = db.query("SELECT ... WHERE id = %s", product_id)  # miss
    cache.set(key, serialize(row), ex=300)   # populate with a 5 min TTL
    return row
```

Properties:
- The cache only ever holds data someone actually asked for. Memory tracks the working set, not the whole table.
- A miss costs one extra round trip (lookup, then DB, then write-back). You trade a little miss latency for a lot of hit latency.
- The app must handle a cold cache. After a flush or deploy, the first requests all miss. See the stampede section.

### 2.2 Read-through and write-through

The cache layer, not the app, talks to the origin. Less application code, tighter coupling to the caching library.

- **Read-through:** on a miss the cache loads from the DB itself and returns it. The app sees one interface.
- **Write-through:** writes go to the cache, which synchronously writes to the DB. The cache is never stale relative to the DB, at the cost of write latency.
- **Write-behind:** the cache acknowledges the write and flushes to the DB asynchronously. Fast writes, but you can lose data in a crash window. Use only where that loss is acceptable.

### 2.3 Where query caching wins and where it does not

| Signal | Cache it? |
|--------|-----------|
| Read-heavy, repeated keys (catalog, config, sessions) | Yes, query cache |
| Expensive aggregations recomputed often | Yes, cache the result, not the rows |
| Low hit ratio, mostly unique reads | No, the tier is overhead |
| Write-heavy with strict read-after-write | Only with write-through or careful invalidation |

The economics are governed by hit ratio. If `h` is the hit ratio, average read cost is roughly `h * cost_cache + (1 - h) * (cost_cache + cost_db)`. Below a break-even hit ratio the extra lookup on every miss makes you slower and no cheaper. Measure `h` before you celebrate.

---

## 3. TTL and invalidation: the part that bites

A cache is a second copy of your data. The entire difficulty of caching is keeping that copy honest. Two tools: time (TTL) and events (invalidation).

### 3.1 TTL strategy

- **Short TTL (seconds to low minutes):** bounds staleness tightly, lower hit ratio, more origin load. Good for data that changes but where a few seconds stale is fine.
- **Long TTL (hours):** high hit ratio, big savings, but stale data lingers unless you invalidate explicitly.
- **TTL jitter:** never set the exact same TTL on a large batch of keys. Add randomness (`ttl = base + random(0, base * 0.1)`) so they do not all expire in the same second and stampede the origin together.

### 3.2 Explicit invalidation

On a write, proactively evict or update the affected keys:

```python
def update_product(product_id, changes):
    db.update(product_id, changes)
    cache.delete(f"product:{product_id}")   # next read repopulates
```

The hard cases are derived and fan-out keys. If `product:42` feeds `category:electronics:page:1`, a write to product 42 must invalidate the list key too. Track these dependencies explicitly. Do not hope a TTL saves you, document the relationships.

### 3.3 The three classic failure modes

- **Cache stampede (thundering herd):** a hot key expires, thousands of concurrent requests all miss and hit the DB at once. Mitigate with a per-key lock so only one request recomputes while others wait, or serve-stale-while-revalidate.
- **Cache penetration:** requests for keys that do not exist bypass the cache every time and pound the DB. Mitigate by caching the negative result (a short-TTL "not found" sentinel) or a Bloom filter in front.
- **Cache avalanche:** a large set of keys expires simultaneously (see TTL jitter) or the cache node itself drops. Mitigate with jitter, multi-AZ, and graceful origin-side rate limiting.

```python
# Single-flight: only one caller recomputes a hot key
def get_with_singleflight(key, loader, ttl=300):
    val = cache.get(key)
    if val is not None:
        return val
    lock = f"lock:{key}"
    if cache.set(lock, "1", nx=True, ex=10):   # won the lock
        try:
            val = loader()
            cache.set(key, val, ex=ttl)
            return val
        finally:
            cache.delete(lock)
    else:                                       # lost the lock, wait briefly
        time.sleep(0.05)
        return get_with_singleflight(key, loader, ttl)
```

---

## 4. Semantic caching for AI and RAG

Exact-match caching fails for LLM traffic. No two user prompts are byte-identical, so a hash-keyed cache hits almost never. The insight: for a model, "What is the refund window?" and "How many days do I have to return something?" should resolve to the same cached answer. Match on meaning, not bytes.

### 4.1 How it works

```
prompt ──▶ embed ──▶ vector ──▶ nearest-neighbor search in cache
                                      │
                       sim ≥ threshold│          sim < threshold
                                      ▼                    ▼
                              return cached answer    call model,
                              (cache hit)             store (prompt_vec, answer)
```

1. Embed the incoming prompt into a vector with the same embedding model every time.
2. Search the cache for the nearest stored prompt vector (cosine similarity).
3. If the best match is at or above a similarity threshold, return its stored answer. That is a hit, and you skipped an inference call.
4. Otherwise call the model, then store the new `(vector, answer)` pair.

### 4.2 Valkey as the vector store

Valkey holds the prompt vectors and supports vector similarity search, so the embedding index and your existing cache live in one tier. Store the answer alongside the vector, set a TTL, and deploy across AZs for the same reliability story as the query cache.

```python
THRESHOLD = 0.92   # cosine similarity; tune this carefully

def semantic_get(prompt):
    vec = embed(prompt)                       # same model, always
    hit = vstore.knn(vec, k=1)                # nearest neighbor in Valkey
    if hit and hit.score >= THRESHOLD:
        return hit.answer                     # cache hit, no inference
    answer = model.complete(prompt)           # miss
    vstore.add(vec, answer, ttl=3600)
    return answer
```

### 4.3 The threshold is the whole game

The similarity threshold is a dial between savings and correctness:

- **Too loose (low threshold):** you serve a stored answer to a prompt that was only superficially similar. You just gave a close-but-wrong answer to save a fraction of a cent. This is the failure mode that erodes trust.
- **Too tight (high threshold):** almost everything misses, you call the model anyway, and the cache earns nothing.

Tune it against a labeled set of prompt pairs, not by feel. Guardrails that keep this honest:
- **Scope the cache per intent or namespace** so unrelated domains cannot collide.
- **Never semantically cache personalized or user-specific answers** unless the key includes the user or tenant. "What is *my* balance?" is not the same question across users even when the vectors are near-identical.
- **Log every hit with its similarity score** so you can audit near-threshold decisions and move the dial with evidence.
- **Exclude anything with a freshness or compliance requirement** (prices, legal text, live inventory) from semantic caching, or gate it behind a very short TTL.

---

## 5. Reliability architecture

Caching is an SRE lever, not just a speed trick. A cache in front of the origin absorbs the load the DB would otherwise take at the worst possible moment.

### 5.1 Multi-AZ Valkey

Run Valkey across multiple availability zones with a primary and replicas in separate AZs. If a node or an entire AZ is lost, a replica is promoted and the cache stays up. The goal is that losing the cache never cascades into an origin-DB overload.

```
        ┌─────────────── AZ a ───────────────┐
        │  Valkey primary  ◀── reads/writes   │
        └───────────────┬─────────────────────┘
                        │ replication
        ┌───────────────▼──── AZ b ───────────┐
        │  Valkey replica  (promote on failover) │
        └─────────────────────────────────────┘
        ┌───────────────┬──── AZ c ───────────┐
        │  Valkey replica  (read scaling)      │
        └─────────────────────────────────────┘
```

### 5.2 Failure posture: fail open, not closed

If the cache is unreachable, the application should fall back to the origin, not error out. A cache outage degrades you to "slow", never to "down". Wrap cache calls so a timeout falls through to the DB, and rate-limit the origin so a cold or missing cache cannot take the database with it.

```python
def cached_read(key, loader, ttl=300):
    try:
        val = cache.get(key)            # short timeout on this client
        if val is not None:
            return val
    except CacheUnavailable:
        pass                            # fail open: fall through to origin
    val = loader()
    try:
        cache.set(key, val, ex=ttl)
    except CacheUnavailable:
        pass                            # best-effort write-back
    return val
```

### 5.3 What to watch

- **Hit ratio** per key class. A falling hit ratio is your early warning that TTLs or invalidation changed the economics.
- **p99 and p999 read latency**, cache vs origin path, tracked separately.
- **Origin-DB connection saturation and CPU**, to confirm the cache is actually shielding it.
- **Eviction rate and memory pressure.** High evictions mean the working set outgrew the cache and your hit ratio will suffer.
- **For semantic caches:** hit similarity distribution, and a sampled audit of near-threshold hits for correctness.

---

## 6. The numbers and the decision framework

Valkey gets you up to 55% DB cost savings for frequently accessed data. That number is a function of hit ratio, so treat it as a ceiling you earn, not a given.

### 6.1 The break-even view

Plot cost against hit ratio. Below the break-even point the extra lookup on every miss makes the tier pure overhead. Above it, savings grow with hit ratio until they flatten near the ceiling. Know where your workload sits before you commit.

### 6.2 A worked example

Numbers make this real. Both scenarios below are illustrative, with assumptions stated so you can plug in your own.

**Scenario A: query cache on a product read path.**

Assume 10,000 reads/sec, a Postgres read at 8 ms, a Valkey GET at 0.5 ms, and an 85% hit ratio.

- Average read latency becomes `0.85 * 0.5ms + 0.15 * 8.5ms = 1.7 ms`, down from 8 ms. That is a 79% drop, and the win concentrates in the tail because the DB path is the slow one.
- DB read volume falls from 10,000 rps to 1,500 rps, an 85% reduction. That is the load you no longer provision for, and the saturation you no longer page on.
- The miss path costs 8.5 ms (lookup then DB), slightly worse than no cache. That is the price of the bet, and at an 85% hit ratio you pay it only 15% of the time.

**Scenario B: semantic cache on an LLM support assistant.**

Assume 1,000,000 prompts/month, an inference call at $0.01, an embedding at $0.0001, and a 40% semantic hit ratio.

| Line item | Without cache | With semantic cache |
|-----------|---------------|---------------------|
| Embeddings (all prompts) | $0 | $100 |
| Inference (misses only) | $10,000 | $6,000 |
| **Monthly total** | **$10,000** | **$6,100** |

That is a 39% cut, and it scales with hit ratio: push the ratio to 55% and the inference line drops to $4,500. The embedding cost is near-noise here, which is why semantic caching pays even at a modest hit ratio. The risk is not cost, it is a loose threshold serving a wrong answer, so tune against labeled pairs before you widen it.

### 6.3 Decision table

| Workload signal | Verdict |
|-----------------|---------|
| Read-heavy, repeated keys | Yes, query cache |
| Near-identical LLM prompts, tolerant of close answers | Yes, semantic cache |
| Low hit ratio, mostly unique reads | No, complexity not worth it |
| Strong freshness or compliance need | Only with tight TTL and explicit invalidation |
| Personalized per-user answers | Only with user or tenant in the key |

### 6.4 Start Monday morning

1. **Find the repetition.** Pick your hottest read or most-repeated prompt. One path, measured.
2. **Add the tier.** Query cache for reads, semantic cache for prompts. Set a TTL you can defend and wire invalidation on writes.
3. **Watch hit ratio against cost.** Prove the savings and the p99 drop on that one path before you expand. Honest numbers only.

---

## 7. Real-world case studies

The worked examples above are illustrative. Here are two production results from AWS engineering teams, with the numbers they published.

### 7.1 Amazon Ads: query cache at Amazon scale

Amazon Sponsored Products serves billions of ad impressions a day, peaking at tens of millions of read requests per second across terabytes of cached data, at p99 latency under 5 ms and 99.99% availability. The team runs a multi-cluster ElastiCache architecture (their cache service is called Horus) that isolates each ad-retrieval workload in its own cluster so it can scale and be monitored independently.

They upgraded from ElastiCache for Redis to ElastiCache for Valkey 8.0 on Graviton instances, and the result was **over 45% lower infrastructure cost and 12% higher throughput**, with zero downtime and no application code changes because Valkey is a drop-in replacement. The upgrade used a dual-write path: the client wrote to both the old and new clusters in parallel (a 100 ms put timeout, exceptions aggregated so a partial failure did not block other writes), read traffic shifted over gradually, and rollback stayed available the whole time.

What to take to your own system:
- The multi-cluster split pays off at large scale (they cite a rough 30 TB line above which dedicated clusters beat one shared cluster). Below that, a single cluster is simpler and usually the right call.
- Dual-write plus gradual read-shift plus a live rollback path is a reliable recipe for changing a cache tier under load without an outage.
- The savings came from two levers stacked: Valkey's efficiency and Graviton pricing. Separate your levers when you model your own case.

Source: [Amazon Ads upgrades to ElastiCache for Valkey](https://aws.amazon.com/blogs/database/amazon-ads-upgrades-to-amazon-elasticache-for-valkey-to-achieve-12-higher-throughput-and-save-over-45-in-infrastructure-costs) (AWS Database Blog, Nov 2025).

### 7.2 Semantic cache with Amazon Bedrock: the threshold trade-off, measured

This is the evidence for everything I claimed about the similarity threshold. The team built a semantic cache on ElastiCache for Valkey (vector search with an HNSW index and cosine similarity, Amazon Titan Text Embeddings V2 producing 1024-dimensional vectors, Claude 3 Haiku for inference) and replayed 63,796 real chatbot queries plus paraphrased variants from the public SemBenchmarkLmArena dataset against an empty cache.

The headline: semantic caching cut LLM inference cost by **up to 86% and average end-to-end latency by up to 88%**. The important part is the table, because it shows the threshold is a dial you set with eyes open, not a default you accept:

| Similarity threshold | Cache hit ratio | Answer accuracy | Cost savings | Latency reduction |
|----------------------|-----------------|-----------------|--------------|-------------------|
| 0.99 | 23.5% | 92.1% | 15.8% | 17.1% |
| 0.95 | 56.0% | 92.6% | 51.9% | 57.7% |
| 0.90 | 74.5% | 92.3% | 72.5% | 72.2% |
| 0.80 | 87.6% | 91.8% | 84.6% | 86.1% |
| 0.75 | 90.3% | 91.2% | 86.3% | 88.3% |
| 0.50 | 94.3% | 87.5% | 88.0% | 89.3% |

Read it the way I argued in section 4.3. As you loosen the threshold, hit ratio and savings climb, but accuracy holds in the low 90s until about 0.75 and then falls off a cliff at 0.50 (87.5%). That knee is the whole point: 0.75 bought 86% savings while still answering 91% of hits correctly, and pushing to 0.50 added two more points of savings while giving back nearly four points of accuracy. For individual queries, a cache hit cut latency by up to 59x, from several seconds to about a hundred milliseconds.

Their operational guidance lines up with section 3: set a TTL that matches how often your data changes (they suggest roughly 23 hours with jitter for a catalog refreshed daily), scope cache lookups per user or segment for anything personalized, and keep live or compliance-sensitive answers out of the cache or behind a very short TTL.

Source: [Lower cost and latency for AI using ElastiCache as a semantic cache with Bedrock](https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/) (AWS Database Blog, Nov 2025).

### 7.3 What the two cases prove together

The query-cache case is a reliability and cost story at massive read scale: the cache shields the origin and the tier itself got 45% cheaper to run. The semantic-cache case is the AI cost story with the honest caveat attached: big savings are real, and the threshold that unlocks them is exactly where correctness is won or lost. Same lever, two workloads, one discipline: measure hit ratio against cost, and bound the staleness.

---

## Key takeaways

1. A practical model for query vs. semantic caching and when each fits.
2. How to quantify DB cost savings and tail-latency improvement from a cache tier, governed by hit ratio.
3. Invalidation and TTL patterns (stampede, penetration, avalanche) that keep caches reliable instead of becoming a new source of bugs.
4. A multi-AZ Valkey reference architecture that fails open and shields the origin.

---

*Roberto Luna Rojas · Valkey project, AWS · DevOpsDays Bogotá 2026*
