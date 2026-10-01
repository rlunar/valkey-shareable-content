# Well-Architected on a Budget: Cutting Database and AI Inference Cost with Valkey

**AWS Community Day Argentina 2026**
Speaker: Roberto Luna Rojas, Sr. Developer Advocate, Valkey @ AWS

---

## Session Abstract

Every millisecond and every dollar counts when you scale an application. This session shows how Valkey, the open source, community-driven in-memory data store, becomes a cost lever across the two most expensive layers of a modern architecture: your database and your AI inference.

We put the cache-aside pattern in front of an RDBMS, offloading read-heavy traffic so you can shrink or remove read replicas. A single Valkey node absorbs hundreds of thousands of requests per second, delivering up to 80x faster reads and up to 55% lower cost for frequently accessed data. Then we turn to generative AI, building a semantic cache with Valkey vector search in front of an LLM so semantically similar prompts reuse cached answers instead of re-invoking the model. That cuts inference cost by up to 86% and end-to-end latency by up to 88%.

Every decision maps to the AWS Well-Architected pillars of Cost Optimization, Performance Efficiency, and Reliability, so you leave with patterns you can apply the same afternoon.

---

## Talk at a Glance

- **Level:** 200-300 (intermediate, some architecture background assumed)
- **Duration:** ~30-40 minutes + Q&A
- **Audience takeaway:** Two concrete, ready-to-apply patterns that lower cost without lowering performance
- **Through-line:** Well-Architected is not a compliance checklist. It is a set of levers, and Valkey pulls three of them at once.

---

## Section 1: The Problem, Framed in Dollars

Scaling an application usually means one of two things happened. Traffic grew, or you added AI features. Both hit your budget in the same place: the parts of your stack that do expensive work over and over.

Two layers dominate that bill.

- **Your database.** Read-heavy traffic pushes you toward bigger instances and more read replicas. You pay for capacity you provision, not the value each query returns.
- **Your AI inference.** Every call to an LLM costs money and time. When your users ask similar questions, you pay full price to generate an answer you already generated.

Here is the idea for the next 30 minutes. You do not need to rewrite your application or move to a different database to fix this. You put a fast, cheap layer in front of the expensive layer and let it absorb the repetitive work. That layer is Valkey.

**What is Valkey.** Valkey is an open source, community-driven, in-memory data store. It is a Linux Foundation project, backed by a broad community and adopted across the industry. If you know Redis, you already know the API. What matters for this talk is what it does: it holds data in memory and answers requests in microseconds, at a fraction of the cost of the systems it sits in front of.

> **Speaker framing:** Do not sell Valkey as a product. Frame it as a cost lever. The audience cares about their bill and their latency, not about a logo.

---

## Section 2: Layer One, The Database

### The pattern: cache-aside

The cache-aside pattern is the workhorse of caching. It is simple, and that is why it works.

1. Your application needs data. It asks Valkey first.
2. **Cache hit:** Valkey has the data. Return it. Done in microseconds.
3. **Cache miss:** Valkey does not have it. The application reads from the database, writes the result into Valkey, and returns it. The next request for that data is a hit.

Your application controls the cache directly, which means you decide what gets cached, for how long, and when it expires. Nothing is hidden.

### Why this is a cost lever

Most applications are read-heavy. The same rows get read thousands of times between writes. Without a cache, every one of those reads hits your database, and you scale the database to handle the peak. That usually means larger instances and read replicas, each one a full copy of your data that you pay for around the clock.

A single Valkey node absorbs hundreds of thousands of requests per second. When it takes the read load, your database stops being the bottleneck. You can shrink your primary instance or remove read replicas you only added to survive read traffic.

The numbers that matter for the audience:

- **Up to 80x faster reads** from memory versus disk-backed database queries.
- **Up to 55% lower cost** for frequently accessed data, because you serve it from a cheap in-memory layer instead of provisioning database capacity for it.

> **Speaker note:** The "55% lower cost" claim is specifically about frequently accessed data. Say it that way. It is not "Valkey makes your database 55% cheaper." It is "for the data you read constantly, serving it from Valkey costs about half of serving it from the database tier you would otherwise provision."

### A note on correctness

Caching introduces one question you have to answer: what happens when the underlying data changes? Two common approaches:

- **TTL (time to live):** Set an expiry on cached entries. Simple, and good enough for data that can be slightly stale (product catalogs, config, reference data).
- **Explicit invalidation:** When you write to the database, delete or update the cache entry. More work, but correct for data that must be fresh.

Pick the one that matches your tolerance for staleness. Most applications use TTL for the majority of data and explicit invalidation for the few things that must be current.

---

## Section 3: Layer Two, AI Inference

### The pattern: semantic caching

Now apply the same instinct to generative AI. An LLM call is the most expensive operation in a modern app: it costs money per token and it is slow. And here is the thing your users do not realize they are doing: they ask the same questions in different words.

"How do I reset my password?"
"I forgot my password, what do I do?"
"password reset steps please"

Three different strings. One answer. A normal cache keys on the exact string, so it misses all three. A **semantic cache** keys on *meaning*.

### How it works with Valkey vector search

1. A prompt comes in. You convert it to an embedding, a vector that represents its meaning.
2. You search Valkey for stored prompts whose vectors are close to this one. This is vector similarity search, and Valkey does it natively.
3. **Semantic hit:** A stored prompt is close enough (above your similarity threshold). Return its cached answer. No LLM call.
4. **Semantic miss:** Nothing is close enough. Call the LLM, then store the new prompt embedding and its answer in Valkey for next time.

You are caching answers by what they mean, not by the exact words used to ask.

### Why this is a cost lever

Every semantic hit is an LLM call you did not make and did not pay for. On workloads with repetitive questions (support, internal knowledge, FAQ-style assistants), a large share of traffic hits the cache.

The numbers that matter for the audience:

- **Up to 86% lower inference cost**, because you skip the model call on cache hits.
- **Up to 88% lower end-to-end latency**, because returning a cached answer from memory is far faster than generating a fresh one.

> **Speaker note:** Land the intuition before the numbers. "You already paid to answer this question once. Why pay again?" The vector search is the mechanism that lets you recognize you already answered it, even when the words are different.

### Tuning the threshold

The one dial that matters is the similarity threshold.

- **Too loose:** You return cached answers for prompts that are not really the same. Users get wrong or off-target responses.
- **Too tight:** You rarely get a hit, so you barely save anything.

Start conservative, measure your hit rate and your answer quality, then loosen carefully. This is the single most important thing to get right, and it is worth saying out loud to the audience.

---

## Section 4: Mapping to Well-Architected

This is the part that makes the talk stick. Both patterns are not just "nice performance tricks." They pull three Well-Architected levers at the same time.

| Pattern | Cost Optimization | Performance Efficiency | Reliability |
|---|---|---|---|
| **Cache-aside (database)** | Shrink or remove read replicas; serve hot data cheaply | Up to 80x faster reads from memory | Shields the database from read spikes; the primary stays healthy |
| **Semantic cache (AI)** | Up to 86% fewer LLM calls | Up to 88% lower end-to-end latency | Fewer calls to a rate-limited, sometimes-flaky model endpoint |

**Cost Optimization:** You stop paying for repeated work. Reads served from memory, answers served from cache.

**Performance Efficiency:** Memory is faster than disk, and a cache hit is faster than an LLM call. You get better latency at the same time as lower cost, which is rare.

**Reliability:** A cache in front of a dependency is also a shock absorber. When your database gets a read spike or your model endpoint throttles you, the cache keeps serving. You reduce load on the fragile, expensive component.

> **Speaker framing:** The one-liner to close this section: "Usually you trade cost against performance. These patterns give you both, and they make you more reliable on the way."

---

## Section 5: Apply It This Afternoon

Keep the closing concrete. The audience should leave knowing exactly where to start.

**Start with the database.** Find your most-read, least-changed data. That is your first cache-aside candidate. Put Valkey in front of it, set a TTL, measure the drop in database load. This is a low-risk change you can ship this week.

**Then look at your AI features.** If you have an LLM-backed feature with repetitive prompts, prototype a semantic cache. Start with a conservative similarity threshold, measure your hit rate and answer quality, and tune from there.

**Both patterns share one shape:** a cheap, fast layer in front of an expensive one, absorbing the work you would otherwise pay for twice.

### Resources

- Valkey project and docs: valkey.io
- Valkey is open source and community-driven, under the Linux Foundation
- Try it: run Valkey locally, or use a managed option, and put it in front of one read path today

---

## Closing Line

"Well-Architected on a budget is not about doing less. It is about not paying twice for the same work. Valkey is how you stop."
