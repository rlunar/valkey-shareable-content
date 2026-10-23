---
theme: default
title: Caching as a Reliability Lever
titleTemplate: '%s · Valkey'
info: |
  Caching as a Reliability Lever. DevOpsDays Bogotá, October 23, 2026.
  Roberto Luna Rojas, Valkey project, AWS.
canvasWidth: 1200
aspectRatio: 16/9
colorSchema: light
transition: fade-out
clickAnimation: fade
highlighter: shiki
lineNumbers: false
codeCopy: false
mdc: true
layout: cover
class: cover-slide
---

<img class="cover-scene" src="/devopsdays/cover-pipeline-scene.jpg" alt="" />

<div class="cover-content">
  <img class="cover-event-logo" src="/devopsdays/devopsdays-bogota-2026-logo.png" alt="DevOpsDays Bogotá 2026" />

  <h1>Caching as a<br><span>Reliability Lever.</span></h1>
  <p class="cover-deck">Cut database spend and tame tail latency with query and semantic caching.</p>

  <div class="cover-speaker">
    <PresenterIdentity class="cover-presenter" />
    <BrandLogo class="cover-company-logo" />
  </div>

  <p class="cover-event">23 · 10 · 2026<br>Compensar Av. 68 · Bogotá</p>
  <p class="cover-hashtag">#DevOpsDaysBogota</p>
</div>

<!--
Open plainly: your database is doing the same expensive work over and over. That is the whole talk in one sentence.
I am Roberto, I work on the Valkey project at AWS. This is L300, so we move fast past the basics into architecture, code, and real numbers.
I will be honest about where caching helps and where it bites back.
Time check: 0:00.
-->

---
layout: default
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">THE PROBLEM, STATED PRECISELY</p>
  <h1>Your database does the same expensive work, over and over.</h1>
</div>

<div class="issue-grid">
  <article class="issue-card" v-click="1">
    <img src="/flaticon/latency.svg" alt="" />
    <span>01 · ON YOUR DASHBOARDS</span>
    <strong>Latency spikes</strong>
    <p>p50 looks fine. p99 climbs exactly when traffic peaks.</p>
  </article>
  <article class="issue-card" v-click="2">
    <img src="/flaticon/alarm.svg" alt="" />
    <span>02 · ON YOUR PHONE</span>
    <strong>Pager noise</strong>
    <p>Pools exhaust and CPU pins for work already done.</p>
  </article>
  <article class="issue-card" v-click="3">
    <img src="/flaticon/money-growth.svg" alt="" />
    <span>03 · ON YOUR BILL</span>
    <strong>Spend outpaces traffic</strong>
    <p>Every repeated query and every repeated prompt is billed again.</p>
  </article>
</div>

<div class="thesis" v-click="4">One root cause: repeated work with nowhere to remember the answer.</div>

<!--
Three failure modes, each with its own signature.

[click] Latency spikes. The same heavy reads repeat and queue behind each other. p50 looks fine, p99 climbs, and it climbs worst exactly when traffic peaks, because that is when the repetition is highest.

[click] Pager noise. Repeated reads saturate the origin database. Connection pools exhaust, CPU pins at 100%, and the on-call gets paged for load the system already computed minutes ago.

[click] Spend that outpaces traffic. Every repeated query is billed compute. Every repeated LLM prompt is billed inference. Nothing remembers the last answer, so you pay again.

[click] Do not let the audience treat these as three separate problems. They are three faces of one thing: repeated work with nowhere to remember the answer. A cache tier addresses all three at once, and the rest of the talk is how to pull that lever without creating new problems.
Time check: 1:30.
-->

---
layout: default
class: valkey-profile-slide
routeAlias: what-is-valkey
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">THE PLACE TO REMEMBER THE ANSWER · WHAT IS VALKEY</p>
  <h1>Valkey: open source, high performance, forever.</h1>
</div>

<ValkeyProfile :step="$clicks" />
<p class="interaction-hint"><kbd>→</kbd> workloads, backing, community</p>

<!--
So we need somewhere to remember the answer. For the rest of this talk, that place is Valkey. What is it?

[click] Valkey is an open source, high-performance key/value datastore. It handles caching, the classic workload and the one this talk is about. It handles message queues. And it can act as a primary database.

[click] It is BSD licensed, and the project is backed by the Linux Foundation, which means it will remain open source forever. Nobody can change that license on you.

[click] And here is the community part. In March 2024, Redis changed its license. Eight days later, the community launched Valkey: vendor neutral, under the Linux Foundation. Today the Technical Steering Committee has maintainers from AWS, Google Cloud, Oracle, Alibaba, Tencent, Ericsson, Percona, and Apple®. Eight companies, one project, no single owner.

***

- The icons carry the description; name the workloads instead of reading the tiles.
- Keep this to about 45 seconds: the audience is here for caching, not project history.
- The panel shows the seven permitted TSC affiliation logos from MAINTAINERS.md in github.com/valkey-io/valkey; Apple® is rendered as plain text because this presentation does not have permission to use the Apple logo.
- Dates: Redis relicensed on March 20, 2024; the Linux Foundation announced Valkey on March 28, 2024.
- Time check: 2:30.
-->

---
layout: default
class: prime-slide
---

<img class="prime-photo" src="/images/prime-day-boxes.jpg" alt="Cardboard parcels stacked at a front door on delivery day" />
<div class="prime-shade" aria-hidden="true"></div>

<div class="prime-copy">
  <p class="eyebrow eyebrow--dark">WHY AN UNCACHED APP DEGRADES · AN AMAZON RETAIL EXAMPLE</p>
  <h1>One product page. Many reads. The same answer for every shopper.</h1>

  <div class="prime-stat">
    <strong>2.3 quadrillion<small>ElastiCache requests served in a single day, Prime Day 2026</small></strong>
    <span>2.1 trillion requests in one minute at peak. Price, availability, buy box, ratings, recommendations: a page fans out into many reads, and in a lightning deal almost all of them are identical across shoppers in the same minute.</span>
  </div>
</div>

<p class="prime-source">Source: <a href="https://aws.amazon.com/blogs/aws/all-the-numbers-amazon-prime-day-2026-powered-by-aws/">All the numbers: Amazon Prime Day 2026, powered by AWS</a> (AWS News Blog). Photo: Freepik, licensed.</p>

<!--
Anchor the abstract failure modes in something everyone has seen: an Amazon product page.
One page view is not one query. It fans out: price, availability, buy-box eligibility, ratings and review counts, recommendations. Each is a read against a datastore, and most are the same answer for every shopper looking at that product in that minute.

Now the scale. In Prime Day 2026 (June 23 to 26) ElastiCache peaked at over 2.3 quadrillion requests in a day and 2.1 trillion requests in a single minute. That is what "serve the repeated answer from memory" looks like at the top end. Without that tier, every one of those page views would run the full fan-out against origin databases.

Next slide: the mechanical chain of why that degrades, step by step.
Time check: 2:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">THE DEGRADATION CASCADE · ONE PRODUCT, 200K SHOPPERS, NO CACHE</p>
  <h1>Each step causes the next, and step six feeds step two.</h1>
</div>

<DegradationCascade :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance one stage</p>

<!--
Walk the chain one box per click. The numbers animate: watch the gauge on each card.

[click] Redundant work. The price of the item did not change between shopper one and shopper two hundred thousand, but the origin computes it every time: parse, plan, buffers, pages, serialize. 8,000 identical reads per second.

[click] Service time climbs. Concurrent identical reads pile onto the same hot rows and pages. CPU pins, the buffer cache thrashes, latches contend. 4 milliseconds becomes 40.

[click] The pool exhausts. Little's Law: in-flight requests equal arrival rate times service time. Same 8,000 per second, ten times the service time, so the pool needs 320 connections and has 100. Requests 101 and up block before they run a single query.

[click] Queues form. Waiting time stacks on top of service time. p50 can still look acceptable while p99 and p999 blow out, because the tail is where the queued requests live. This is a knee, not a slope.

[click] Retry storm. Clients time out and retry, so load goes up precisely when headroom is gone. Point at the maroon arrow: retries feed back into step two. That loop is why slow tips to down.

[click] With the cache. Same traffic, same product, same minute. 98% of reads stop at Valkey, 160 per second reach the origin, every gauge falls back to blue. The chain never starts because the repeated work stopped at the cache.
Time check: 5:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">THE POOL MATH · LITTLE'S LAW</p>
  <h1>Connections in use = arrivals per second × time each one is held.</h1>
  <p class="slide-lead">Hold the traffic constant at 8,000 requests per second. Change only how long the database takes to answer.</p>
</div>

<LittlesLawChart :step="$clicks" />

<!--
This slide exists to fix one confusion: why does slower service time break a pool that was 68% idle?
Little's Law: L = lambda times W. The number of connections in use equals the arrival rate times the time each request holds a connection. The pool does not care about throughput by itself. It cares about arrivals times time.

[click] Draw the line for 8,000 requests per second. Connections in use grow linearly with service time: 8 connections for every millisecond.

[click] Healthy: 4 milliseconds times 8,000 per second is 32 connections. Fits, 68 to spare.

[click] Now the origin slows to 40 milliseconds under contention. Nothing about the traffic changed. 8,000 times 40 ms is 320 connections, and the pool caps at 100. The crossing is at 12.5 ms: that is the knee. Below it the pool looked idle, above it everything blocks.

[click] Same load, 98% hit ratio: only 160 per second reach the origin. Even at 40 ms that is 6 connections. The pool never notices the surge. This is why caching is a reliability lever and not just a speed trick.
Time check: 6:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">THE MENTAL MODEL</p>
  <h1>Every request is a bet. The cache changes the odds.</h1>
</div>

<MentalModelDiagram :step="$clicks" />

<!--
Reset to first principles after the intensity of the cascade. One shape, used twice today: a fast layer in front of the expensive dependency.

[click] Ask the cache first. One in-memory lookup, under a millisecond.

[click] Hit: answer straight back. Fast, cheap, and the origin never hears about it.

[click] Miss: do the expensive work once at the origin, remember the answer, return it. The origin is a database today and a model later in the talk; the shape is identical.

[click] The bet. Expected cost per read is hit ratio times cheap plus miss ratio times expensive. At 90% hits the average read drops from 8 ms to 1.3 ms. You own two dials: the odds, which is hit ratio, and the downside, which is staleness, bounded by TTL and invalidation. Every later section is either improving the odds or bounding the downside.
Time check: 7:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">01</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 1</p>
  <h1>Query caching.</h1>
  <p class="section-subtitle">The familiar half: four strategies, one table, and the parts that bite.</p>
</div>

<!--
Query caching is the part most people know, so we go fast but precise, and set the baseline for semantic caching.
Time check: 8:00.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">CACHE-ASIDE · THE WORKHORSE</p>
  <h1>The application owns the decision: ask Valkey, fall back to the database, remember.</h1>
</div>

<TerminalWindow title="cache_aside.py">

```python {all|1-2|4-6|8-9|11-13|all}
cache = valkey.Valkey(host="cache", port=6379)
db = ProductsDatabase(dsn="products-db")

def get_product(product_id: str) -> Product:
    key = f"product:{product_id}"
    cached = cache.get(key)

    if cached is not None:
        return Product.from_json(cached)            # hit: no database work

    product = db.load_product(product_id)           # miss: read the source once
    cache.set(key, product.to_json(), ex=300)       # remember it for 5 minutes
    return product
```

</TerminalWindow>

<div class="code-map">
  <span>1 · clients</span><span>2 · build the key, ask Valkey</span><span>3 · hit</span><span>4 · miss, load, fill with TTL</span>
</div>

<!--
Cache-aside, also called lazy loading. The application owns the logic, and it is the pattern I reach for first.
Follow the highlights: the two clients, the key and the lookup, the hit path, then the miss path that loads once and fills with a TTL.
Three properties worth saying out loud: the cache only holds data someone actually asked for, so memory tracks the working set. A miss costs one extra round trip, so you trade a little miss latency for a lot of hit latency. And the application must handle a cold cache: after a flush or a deploy, the first requests all miss. We come back to that in the stampede slide.
The 300 seconds is a decision, not a default. The TTL slide pays that off.
Time check: 9:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">STRATEGY 2 OF 4 · READ-THROUGH</p>
  <h1>Read-through: the cache tier owns the loader.</h1>
</div>

<StrategyFlow scenario="read-through" :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the trace</p>

<!--
Same read path as cache-aside, different owner. In read-through the cache tier, or a thin adapter in front of it, owns the database call. The application sees one interface and never knows whether a miss happened.

[click] The application asks the cache for product 42.

[click] Miss: the cache tier itself runs the loader against the database.

[click] The value is stored with a TTL. Freshness is still a policy decision.

[click] The cache answers the application, which answers the client.

[click] Warm hit: the next read never reaches the database. Trade-off: simpler application code, but the loader logic now lives in infrastructure you must deploy and version.
Time check: 9:45.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">STRATEGY 3 OF 4 · WRITE-THROUGH</p>
  <h1>Write-through: never stale relative to the database, at the cost of write latency.</h1>
</div>

<StrategyFlow scenario="write-through" :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the trace</p>

<!--
Write-through needs a coordinator: an application-owned adapter that waits for both systems before it reports success.

[click] The client submits v2.

[click] Commit the database first. The two stores do not share a transaction, so the order is a design decision you make explicitly.

[click] Then SET v2 in Valkey and refresh the TTL. There is a short visibility gap between the two writes.

[click] Only after both confirm does the client hear success. Write latency is now database plus cache.

[click] The next reader finds v2. The sharp edge: if the SET fails after the commit, the database has v2 and the cache may still have v1. Record repair work, return a partial or retryable result, never claim clean success. Write-through reduces stale reads; it does not give you cross-store atomicity.
Time check: 10:30.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">STRATEGY 4 OF 4 · WRITE-BEHIND</p>
  <h1>Write-behind: fast writes, and a loss window you must choose on purpose.</h1>
</div>

<StrategyFlow scenario="write-behind" :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the trace</p>

<!--
Write-behind, also called write-back, moves the durability boundary. Acknowledge before the database commit, then drain asynchronously.

[click] The client submits v2.

[click] The adapter records v2 plus flush intent in Valkey. A plain SET is not a write-back pipeline; you need an explicit pending-work protocol.

[click] The client hears success in about a millisecond. The database still has v1.

[click] A background worker drains the batch, commits idempotently, then acknowledges the pending task. A crash between commit and ack causes redelivery, which is why idempotency matters.

[click] The risk. Lose the buffer before the flush and v2 is gone after the client was told success. Ordinary cache eviction does not flush dirty values. Use a durable, replayable log, or only accept this where the loss window is acceptable. This is the sharp knife of the four.
Time check: 11:15.
-->

---
layout: default
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">WHERE QUERY CACHING WINS, AND WHERE IT IS OVERHEAD</p>
  <h1>Hit ratio decides everything. Measure it before you celebrate.</h1>
</div>

<table>
<thead><tr><th>Signal in your workload</th><th>Cache it?</th></tr></thead>
<tbody>
<tr v-click="1"><td>Read-heavy, repeated keys (catalog, config, sessions)</td><td class="hl">Yes, query cache</td></tr>
<tr v-click="2"><td>Expensive aggregations recomputed often</td><td class="hl">Yes, cache the result, not the rows</td></tr>
<tr v-click="3"><td>Low hit ratio, mostly unique reads</td><td class="red">No, the tier is pure overhead</td></tr>
<tr v-click="4"><td>Write-heavy with strict read-after-write</td><td>Only with write-through or careful invalidation</td></tr>
</tbody>
</table>

<div class="thesis" v-click="5">Below the break-even hit ratio, the extra lookup on every miss makes you slower and no cheaper.</div>

<!--
The honest slide. Caching is not free and not always right.

[click] Read-heavy, repeated keys: the classic win.

[click] Expensive aggregations: cache the computed result, not the underlying rows.

[click] Low hit ratio, mostly unique reads: the row people ignore and regret. If most lookups miss, you added a network hop and a second system for nothing.

[click] Write-heavy with strict read-after-write: only with write-through or careful invalidation, and be honest about the partial-failure path we just saw.

[click] Land the point: measure hit ratio first. It decides the economics and the reliability story.
Time check: 12:00.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">TTL AND INVALIDATION · THE PART THAT BITES</p>
  <h1>Time bounds staleness. Events end it early. Jitter keeps the clock from attacking you.</h1>
</div>

<TtlTimeline :step="$clicks" />

<!--
A cache is a second copy of your data. The whole difficulty is keeping that copy honest.

[click] SET product:42 with EX 300. For five minutes the key is fresh.

[click] Reads inside the window are hits. The copy can be up to five minutes stale, and that is a number you chose.

[click] At 300 seconds the key disappears. The next read misses, reloads once, and opens a new window. Short TTLs bound staleness but lower hit ratio; long TTLs raise hit ratio but let stale data linger.

[click] Explicit invalidation: a write deletes the key instead of waiting for the clock. The trap is fan-out keys. A write to product 42 must also invalidate the category list that contains it. Track those dependencies explicitly; do not hope a TTL saves you.

[click] The bottom band. 1,000 keys filled together by a deploy expire together: 1,000 misses in the same second. You built your own stampede.

[click] Jitter. EX 300 plus or minus a random 60 seconds spreads the same misses over two minutes. Cheap insurance; make it the default in your client wrapper.
Time check: 13:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">FAILURE MODE 1 OF 3 · STAMPEDE</p>
  <h1>A hot key expires and everyone recomputes it at once.</h1>
</div>

<FailureModeDiagram mode="stampede" :step="$clicks" />

<!--
Name the three by name; they will hear them in postmortems for the rest of their careers.

[click] While the hot key is fresh, twelve readers are twelve hits and the origin is idle.

[click] The TTL runs out at the busiest moment.

[click] All twelve miss at once and run the same expensive query. Twelve identical answers computed twelve times, and the origin gauge goes red.

[click] The fix: single-flight. The first miss takes a short lock with SET NX EX and recomputes. Everyone else waits a few milliseconds and reads the refilled value. One query instead of twelve. Serve-stale-while-revalidate is the other good answer when a slightly old value is acceptable.
Time check: 14:15.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">SINGLE-FLIGHT · THE WHOLE TRICK IS <code>nx=True</code></p>
  <h1>One caller recomputes the hot key. Everyone else waits a beat.</h1>
</div>

<TerminalWindow title="single_flight.py">

```python {all|2-3|5|6-9|10-12|all}
def get_with_singleflight(key: str, loader, ttl: int = 300):
    value = cache.get(key)
    if value is not None:
        return value                                  # hit

    if cache.set(f"lock:{key}", "1", nx=True, ex=10):  # only one caller wins
        try:
            value = loader()                          # the one expensive call
            cache.set(key, value, ex=ttl)
            return value
        finally:
            cache.delete(f"lock:{key}")

    time.sleep(0.05)                                  # everyone else waits 50 ms
    return get_with_singleflight(key, loader, ttl)    # and reads the refilled key
```

</TerminalWindow>

<!--
The code mirrors the diagram. Normal hit path first. On a miss, SET NX with a ten second expiry: exactly one caller gets True. That caller runs the loader, fills the key, and releases the lock in a finally block so a crash cannot leave the lock behind longer than ten seconds.
Everyone else sleeps 50 milliseconds and retries, which almost always lands on the refilled key.
In production you add a retry budget, use the client library's lock helper if it has one, and consider serving the stale value while one caller refreshes.
Time check: 15:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">FAILURE MODE 2 OF 3 · PENETRATION</p>
  <h1>Keys that do not exist bypass the cache every single time.</h1>
</div>

<FailureModeDiagram mode="penetration" :step="$clicks" />

<!--
Penetration is the quiet one.

[click] A request for product:999, which does not exist. The cache has no entry, the database says no such row, and nothing gets stored.

[click] So the next request repeats the trip, and the one after that. Bad links, scrapers, or an attacker guessing ids turn the origin into the primary path.

[click] Fix A: cache the absence. Store "product:999 = nothing" with a short TTL so repeats stop at the cache.

[click] Fix B: a Bloom filter in front answers "definitely not here" without touching the cache or the origin. False positives are possible, false negatives never, so it is safe as a pre-filter.
Time check: 15:45.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">FAILURE MODE 3 OF 3 · AVALANCHE</p>
  <h1>The whole working set disappears at once.</h1>
</div>

<FailureModeDiagram mode="avalanche" :step="$clicks" />

<!--
Avalanche is the cascade from the opening, triggered by the cache itself.

[click] Every key was filled by the same deploy with the same TTL, so every key expires in the same second. Or a node drops and takes all of them with it.

[click] The origin receives the entire working set as misses at once.

[click] Fixes: TTL jitter spreads the refills over minutes, and a replica in another availability zone takes over when a node is lost, so the keys never vanish together. Part 3 shows the failover.

[click] And cap concurrent refills on the origin side. A cold cache then degrades you to slow, never to down.
Time check: 16:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">02</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 2</p>
  <h1>Semantic caching.</h1>
  <p class="section-subtitle">The new half, for AI and RAG: match on meaning, not on bytes.</p>
</div>

<!--
Transition into the part most of the audience has not built yet. Slow down here.
Time check: 17:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">SEMANTIC CACHE · REQUEST TRACE</p>
  <h1>The nearest safe answer becomes the fast path.</h1>
</div>

<SemanticCacheDiagram :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the semantic trace</p>

<!--
Exact-match caching fails for LLM traffic: "How do I reset my password?" and "I forgot my password, what now?" are different strings and the same intent.

[click] Embed: convert the prompt into a vector. Same embedding model for writes and reads, always, or the vectors are not comparable.

[click] Search: Valkey finds the nearest cached prompt vectors with a KNN query. The index and your existing cache are one tier.

[click] Hit: within the distance limit, return the cached answer. No inference call.

[click] Miss: no safe match, invoke the model once.

[click] Store: save the new embedding and answer with a TTL. Rhyme it with cache-aside: check, hit, do the expensive work on a miss, remember. The embedding call still costs something; the hit avoids the much larger generation call.
Time check: 18:30.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">VALKEY AS THE VECTOR STORE · SAME SHAPE, NEW MATCH FUNCTION</p>
  <h1>Semantic cache in twelve lines. Pause on line one.</h1>
</div>

<TerminalWindow title="semantic_cache.py">

```python {all|1|4-5|6-7|9-11|all}
THRESHOLD = 0.92          # cosine similarity: a correctness decision, not a default

def semantic_get(prompt: str) -> str:
    vector = embed(prompt)                            # same model, always
    hit = vstore.knn(vector, k=1)                     # nearest neighbor in Valkey Search
    if hit and hit.score >= THRESHOLD:
        return hit.answer                             # hit: no inference

    answer = model.complete(prompt)                   # miss: generate once
    vstore.add(vector, answer, ttl=3600)              # remember vector + answer
    return answer
```

</TerminalWindow>

<div class="code-map">
  <span>Valkey Search: FT.CREATE ... VECTOR HNSW ... DISTANCE_METRIC COSINE</span><span>store the answer next to the vector</span><span>TTL + multi-AZ + fail open, same as the query cache</span>
</div>

<!--
One tier for both the classic cache and the vector index is the operational win: you are not running a separate vector database.
The code mirrors the query-cache shape on purpose. Only the match function changed: nearest neighbor above a threshold instead of exact key.
Highlight the threshold constant first and pause there, the next slide is all about it. Then embed plus KNN, the hit branch, and the miss branch that stores vector and answer with a TTL.
Name the metric and direction in code and dashboards: some APIs expose distance, where lower is closer, others expose similarity, where higher is closer.
Time check: 19:30.
-->

---
layout: default
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">THE THRESHOLD IS THE WHOLE GAME</p>
  <h1>Tune hit rate and answer accuracy together.</h1>
</div>

<ThresholdDial :step="$clicks" />

<!--
The threshold is a dial between savings and correctness, and it is your decision, not a default.
Start tight: answer quality protected, few hits, the cache earns little.

[click] Chase hit rate and the dial goes loose: you serve a stored answer to a prompt that was only superficially similar. A close-but-wrong answer to save a fraction of a cent erodes trust.

[click] Settle on a measured operating point, using labeled prompt pairs from your domain, never by feel. Guardrails: scope the cache per intent and tenant, never semantically cache personalized answers unless the key includes the user, log every hit with its score, and exclude freshness or compliance-sensitive answers or gate them behind a very short TTL. "What is my balance?" is not the same question across users even when the vectors are near-identical.
Time check: 20:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">03</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 3</p>
  <h1>Reliability, and the numbers.</h1>
  <p class="section-subtitle">Fail over, fail open, shed load, watch six gauges, then prove it with two case studies.</p>
</div>

<!--
Third act: tie caching back to SRE and then to money, with real case studies.
Time check: 21:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">MULTI-AZ VALKEY · FAIL OVER, AND FAIL OPEN WHILE YOU DO</p>
  <h1>Losing a zone promotes a replica. Losing the cache degrades you to slow, never to down.</h1>
</div>

<FailoverDiagram :step="$clicks" />

<!--
Two ideas on one diagram: multi-AZ so losing a node or a zone does not lose the cache, and fail-open so losing the cache never cascades into a database outage. Multi-AZ, not multi-region, deliberately.

[click] Steady state: hits from the primary in AZ a, replication streaming to AZ b and AZ c, the origin sees only misses.

[click] AZ a is lost. Cache calls time out after a short, deliberate deadline. Set that deadline low; a cache that answers in 3 seconds is worse than no cache.

[click] Fail open: the wrapper swallows the timeout and runs the loader against the origin. Users see slow, not down. The origin must be shielded while this lasts, and that is the next slide.

[click] The replica in AZ b is promoted within seconds. The data was already there. The remaining replica follows the new primary.

[click] Clients reconnect, hits resume, the origin drops back to misses only. AZ a rejoins later as a replica.
Time check: 22:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">NO CACHE FOR A WHILE · THE EDGE MUST SHED LOAD</p>
  <h1>Fail open removed the brake. Rate limit at the API gateway while Valkey recovers.</h1>
</div>

<GatewayShedDiagram :step="$clicks" />

<!--
Fail open has a hidden cost: it sends every read to the origin, and on a surge day that is the exact traffic that broke the database in the opening cascade.

[click] The cache is unavailable: a failover window, a cold restart, a bad config push. 8,000 requests per second now land on a database that sustains 2,000. It saturates in seconds. The outage you avoided arrives through the back door.

[click] Throttle at the edge. The API gateway admits what the origin can serve and sheds the rest with 429 and Retry-After. Users get a fast no instead of a slow timeout, and the database stays busy but healthy.

[click] The cache comes back empty. Every admitted miss refills a key, so the hit ratio climbs toward 98% and the origin load falls with it.

[click] Release: raise the limit as the hit ratio recovers. A token bucket per client, or a global budget, both work. The limiter is the brake you add back on purpose because fail open took the natural one away.
Time check: 23:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">FAIL OPEN IN CODE · SHORT TIMEOUTS, SWALLOWED ERRORS, BEST-EFFORT WRITE-BACK</p>
  <h1>A cache outage must never become a database outage.</h1>
</div>

<TerminalWindow title="fail_open.py">

```python {all|1|3-7|9|10-13|all}
cache = valkey.Valkey(host="cache", socket_timeout=0.05)   # 50 ms, on purpose

def cached_read(key: str, loader, ttl: int = 300):
    try:
        value = cache.get(key)
        if value is not None:
            return value
    except CacheUnavailable:
        pass                                 # fail open: fall through to the origin

    value = loader()                         # the origin call (rate limited upstream)
    try:
        cache.set(key, value, ex=ttl)
    except CacheUnavailable:
        pass                                 # best-effort write-back
    return value
```

</TerminalWindow>

<!--
The wrapper every cache call goes through. A 50 millisecond socket timeout, chosen on purpose. Any cache error on the read path falls through to the loader. The write-back is best effort: if the cache is down, the value is still returned to the user.
Combine this with the gateway limiter from the previous slide. Fail open without a limiter is how you move the outage from the cache to the database.
Time check: 23:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">WHAT TO WATCH · OPERATING TARGETS FOR A READ-HEAVY CACHE TIER</p>
  <h1>Six gauges. Hit ratio is the leading indicator; everything else is confirmation.</h1>
</div>

<MetricGauges :step="$clicks" />

<!--
If you cannot see it you cannot run it. Targets here are for a read-heavy application; adjust for your workload, but do not skip any of them.

[click] Hit ratio, per key class. 90% plus for read-heavy traffic; Amazon-scale catalogs run 95 to 99%. A falling ratio is the early warning that TTLs or invalidation changed the economics.

[click] p99 on the hit path under a millisecond, tracked separately from the origin path, so you can see each one move.

[click] Origin pool in use under 60%. That headroom is what absorbs the surge and a cold cache.

[click] Origin CPU under 50% at steady state. This is the confirmation that the cache is actually shielding the database.

[click] Evictions near zero with memory used under 75%. Evictions mean the working set outgrew the cache and your hit ratio is about to fall.

[click] For semantic caches: accuracy on sampled near-threshold hits at 90% plus. Log every hit with its score, and audit the ones near the line. That is how you catch the threshold drifting into wrong-answer territory.
Time check: 24:30.
-->

---
layout: default
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE NUMBERS · COST PER MILLION READS</p>
  <h1>The 55% is a ceiling you earn through hit ratio, not a given.</h1>
</div>

<div class="numbers-layout">
  <div class="big-stat">
    <small>UP TO</small>
    <strong>55%</strong>
    <span>lower database cost for frequently accessed data</span>
    <em>Workload target, not a benchmark or a guarantee. Needs a measured hit ratio and right-sizing after validation.</em>
  </div>
  <div class="chart-panel">
    <CostPerMillion :step="$clicks" />
  </div>
</div>

<!--
Say it explicitly so nobody quotes the big number as a guarantee: 55% is a ceiling you earn through hit ratio.

[click] Without a cache, all one million reads reach the database. Index that bill at one dollar per million.

[click] At a 90% hit ratio only 100,000 reads reach the origin.

[click] The database line does not fall to 10% because database cost is capacity, not per-read: you still serve writes and you keep headroom. Right-sized, it lands around 45% of the original, which is the 55% saving. Add the Valkey tier and the total bill is about 45% lower. The unit costs here are illustrative; the shape is what matters. Price your own workload with the pricing calculator, then prove it with before-and-after measurements.
Time check: 25:30.
-->

---
layout: default
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">CASE STUDY 1 · AMAZON ADS ON ELASTICACHE FOR VALKEY</p>
  <h1>A query cache at Amazon scale, upgraded with zero downtime.</h1>
</div>

<div class="stat-grid">
  <article class="stat-card stat-card--purple" v-click="1"><span>AUDIENCE</span><strong>300M+</strong><p>people reached in the US alone</p></article>
  <article class="stat-card stat-card--purple" v-click="1"><span>READS</span><strong>10M+ / s</strong><p>tens of millions of reads per second, billions of ad impressions a day</p></article>
  <article class="stat-card stat-card--blue" v-click="2"><span>LATENCY</span><strong>&lt; 5 ms</strong><p>p99, at 99.99% availability, through Prime Day surges</p></article>
  <article class="stat-card stat-card--blue" v-click="2"><span>SCALE-OUT</span><strong>500</strong><p>nodes per cluster, one cluster per retrieval method</p></article>
</div>

<div class="stat-grid">
  <article class="stat-card stat-card--red" v-click="3"><span>INFRASTRUCTURE COST</span><strong>-45%</strong><p>after upgrading to ElastiCache for Valkey 8.0 on Graviton</p></article>
  <article class="stat-card stat-card--red" v-click="3"><span>THROUGHPUT</span><strong>+12%</strong><p>on the same workload</p></article>
  <article class="stat-card" v-click="4"><span>DOWNTIME</span><strong>0</strong><p>dual-write, gradual read shift, live rollback the whole way</p></article>
  <article class="stat-card" v-click="4"><span>CODE CHANGES</span><strong>0</strong><p>Valkey is a drop-in replacement for the Redis OSS API</p></article>
</div>

<p class="source-note">Source: <a href="https://aws.amazon.com/blogs/database/amazon-ads-upgrades-to-amazon-elasticache-for-valkey-to-achieve-12-higher-throughput-and-save-over-45-in-infrastructure-costs/">Amazon Ads upgrades to Amazon ElastiCache for Valkey to achieve 12% higher throughput and save over 45% in infrastructure costs</a> (AWS Database Blog, 2025).</p>

<!--
Real production result at Amazon scale.

[click] Amazon Sponsored Products reaches over 300 million people in the US alone and serves tens of millions of reads per second, billions of ad impressions a day.

[click] p99 under 5 milliseconds at 99.99% availability, through Prime Day and the holidays. The cache management service, Horus, scales a cluster across 500 nodes and isolates each retrieval method in its own cluster.

[click] Upgrading to ElastiCache for Valkey 8.0 on Graviton cut infrastructure cost by more than 45% and raised throughput 12%. Two levers stacked: Valkey efficiency and Graviton pricing; separate them when you model your own case.

[click] Zero downtime and zero code changes: dual-write to both clusters, shift reads gradually, keep live rollback. That migration recipe is reusable for any cache-tier change under load.
Time check: 26:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">CASE STUDY 2 · SEMANTIC CACHE WITH AMAZON BEDROCK, MEASURED</p>
  <h1>Up to 86% lower cost and 88% lower latency. The threshold is where accuracy is won or lost.</h1>
</div>

<ThresholdTradeoffChart :step="$clicks" />

<p class="source-note">63,796 real chatbot queries · Titan Text Embeddings V2 · Claude 3 Haiku · cache.r7g.large. Source: <a href="https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/">Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock</a> (AWS Database Blog). Results depend on model, embedding, data, threshold, and cache.</p>

<!--
The measured proof of the threshold argument. 63,796 real chatbot queries streamed as a day of traffic, Titan Text Embeddings V2, Claude 3 Haiku.

[click] Savings climb as the threshold loosens: 16% at 0.99, 52% at 0.95, 72% at 0.90, 86% at 0.75.

[click] Accuracy of cached answers holds in the low nineties the whole way down to 0.75.

[click] The knee: at 0.75, 86.3% lower cost, 88.3% lower average latency, 91.2% accuracy. Individual hits are up to 59 times faster: seconds become a tenth of a second.

[click] The cliff: loosening to 0.50 buys 1.7 more points of savings and loses 3.7 points of accuracy. That is the single most important chart in the AI half: the dial has a sweet spot, and past it you are paying with trust.
Time check: 27:30.
-->

---
layout: default
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">WHAT YOU TAKE HOME</p>
  <h1>Same lever, two workloads, one discipline: measure hit ratio against cost, bound the staleness.</h1>
</div>

<ImpactBoard :step="$clicks" />

<!--
Close on the numbers, not on bullet points.

[click] Up to 55% lower database cost for frequently read data, earned through hit ratio and right-sizing.

[click] 86% lower inference cost with a semantic cache, at 91% accuracy, in the AWS evaluation.

[click] 88% lower end-to-end latency on AI answers, and up to 59 times faster on a single hit.

[click] 45% lower infrastructure cost for the cache tier itself at Amazon Ads, with 12% more throughput.

[click] And the one for this room: fewer 3 AM pages. The surge stops at the cache, so there is no pool exhaustion, no retry storm, nothing to wake up for.
Time check: 28:30.
-->

---
layout: default
class: closing-slide
---

<div class="closing-grid">
  <div class="closing-copy">
    <p class="eyebrow eyebrow--dark">START MONDAY MORNING</p>
    <h1>Do not pay twice<br><span>for the same work.</span></h1>
    <div class="closing-steps">
      <div><b>01</b>Find the repetition: your hottest read or most repeated prompt. One path, measured.</div>
      <div><b>02</b>Add the tier: query cache for reads, semantic cache for prompts, a TTL you can defend.</div>
      <div><b>03</b>Watch hit ratio against cost and p99. Prove it before you expand.</div>
    </div>
    <div class="closing-presenter">
      <img class="closing-headshot" src="/images/rberoj.jpg" alt="Roberto Luna Rojas" />
      <PresenterIdentity />
    </div>
  </div>
  <a class="qr-card" href="https://www.linkedin.com/in/robertolunarojas/" aria-label="Open Roberto's LinkedIn profile">
    <img src="/qr/qr-linkedin.svg" alt="QR code for Roberto Luna Rojas on LinkedIn" />
    <strong>Let's connect</strong>
    <span>linkedin.com/in/robertolunarojas</span>
  </a>
  <a class="qr-card" href="https://valkey.io" aria-label="Open valkey.io">
    <img src="/qr/qr-valkey.svg" alt="QR code for valkey.io" />
    <strong>Explore Valkey</strong>
    <span>valkey.io</span>
  </a>
</div>

<div class="closing-links">
  <a href="https://valkey.io/">valkey.io</a>
  <a href="https://valkey.io/blog/introducing-valkey-search/">Valkey Search</a>
  <a href="https://aws.amazon.com/blogs/database/amazon-ads-upgrades-to-amazon-elasticache-for-valkey-to-achieve-12-higher-throughput-and-save-over-45-in-infrastructure-costs/">Amazon Ads case study</a>
  <a href="https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/">Bedrock semantic cache evaluation</a>
</div>

<!--
Close with action, not summary. Three concrete steps they can do at their desk on Monday: find one repeated path, cache it, measure it honestly.
Point at the two QR codes: connect on LinkedIn, and explore Valkey. Hold the final frame for Q&A.
Time check: 29:30, then questions.
-->
