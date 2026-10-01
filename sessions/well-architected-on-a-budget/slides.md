---
theme: default
title: Well-Architected on a Budget — Valkey
titleTemplate: '%s · Valkey'
info: |
  Cutting database and AI inference cost with Valkey.
  AWS Community Day Argentina 2026.
canvasWidth: 1200
aspectRatio: 16/9
colorSchema: light
transition: fade-out
clickAnimation: fade
highlighter: shiki
lineNumbers: false
codeCopy: false
layout: cover
class: budget-cover
---

<div class="cover-content">
  <BrandLogo tone="dark" class="cover-logo" />

  <p class="eyebrow eyebrow--dark">AWS COMMUNITY DAY ARGENTINA · 2026</p>
  <h1>Well-Architected<br><span>on a Budget.</span></h1>
  <p class="cover-deck">Cutting database and AI inference cost with Valkey.</p>

  <PresenterIdentity class="cover-presenter" />

  <div class="cover-meta">
    <span>DATABASE</span><span>GENAI</span><span>VALKEY</span>
  </div>
</div>

<!--
Open with the promise, not the product.
"Today we will use one architectural shape twice: a fast layer in front of expensive repeated work."
The audience should leave with two patterns and one deployment checklist they can apply this week.
Time check: 0:00.
-->

---
layout: default
class: cost-centers-slide
routeAlias: cost-problem
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE BILL · NOT THE BUZZWORDS</p>
  <h1>Repeated work becomes expensive work at scale.</h1>
  <p class="slide-lead">Two common cost centers grow faster than the value each request delivers.</p>
</div>

<div class="cost-grid">
  <article class="cost-card" v-click.fade.right="1">
    <span>DATABASE READS</span>
    <strong>Provision for the peak.</strong>
    <p>Repeated reads push capacity, connection counts, and read-scaling infrastructure upward.</p>
  </article>
  <article class="cost-card" v-click.fade.right="2">
    <span>AI INFERENCE</span>
    <strong>Pay for every generation.</strong>
    <p>Similar prompts trigger embedding, retrieval, token generation, and model latency again.</p>
  </article>
</div>

<div class="cost-thesis" v-click.fade.up="3">
  <strong>The cost lever:</strong> recognize repeated work before the expensive dependency does it again.
</div>

<SlideFooter />

<!--
Reveal database, then AI, then the shared thesis.
Avoid claiming these are universally the two largest costs. Say they are common, high-leverage cost centers.
Time check: 2:00.
-->

---
layout: default
class: one-shape-slide
routeAlias: one-shape
clicks: 2
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">ONE SHAPE · TWO SYSTEMS</p>
  <h1>Put the fast path before the expensive path.</h1>
</div>

<div class="shape-stage">
  <div class="shape-system" v-click.fade.right="1">
    <span>APP</span><b>→</b><span>DATABASE</span>
  </div>

  <div class="shape-cache">
    <BrandLogo compact tone="dark" />
    VALKEY
  </div>

  <div class="shape-system" v-click.fade.left="2">
    <span>PROMPT</span><b>→</b><span>LLM</span>
  </div>
</div>

<p class="shape-caption">Ask the cheap layer first. On a safe hit, stop. On a miss, do the expensive work once and remember it.</p>

<SlideFooter />

<!--
This is the talk's visual anchor. Return to this shape at every section transition.
The cache does not make the expensive dependency disappear. It changes how often you need it.
Time check: 3:00.
-->

---
layout: default
class: valkey-intro-slide
routeAlias: valkey
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">THE FAST PATH</p>
  <h1>Valkey is an open, in-memory data structure server.</h1>
</div>

<div class="valkey-intro-grid">
  <div class="fact-stack">
    <div class="fact-card" v-click.fade.right="1"><span>01</span><strong>Open source under Linux Foundation governance</strong></div>
    <div class="fact-card" v-click.fade.right="2"><span>02</span><strong>Familiar APIs for caching and real-time data</strong></div>
    <div class="fact-card" v-click.fade.right="3"><span>03</span><strong>Low-latency operations from memory</strong></div>
  </div>

  <div class="intro-thesis">
    <div class="intro-logo-lockup">
      <BrandLogo compact tone="light" />
      <span class="intro-logo-lockup__plus">×</span>
      <img src="/logos/linux-foundation.svg" alt="The Linux Foundation" class="linux-foundation-logo" />
    </div>
    <span>WHAT MATTERS TODAY</span>
    <strong>Valkey absorbs work that should not reach a slower or costlier dependency twice.</strong>
  </div>
</div>

<SlideFooter />

<!--
Keep this under one minute. This is context, not a product tour.
If people know Redis APIs, the programming model will feel familiar, but avoid making compatibility the main story.
Time check: 4:00.
-->

---
layout: section
class: budget-section
routeAlias: database
---

<div class="section-number">01</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">LAYER ONE</p>
  <h1>The database.</h1>
  <p class="section-subtitle">Use cache-aside to reduce repeated reads while keeping the database as the source of truth.</p>
</div>

<!--
Transition: "Start with the dependency almost every application already has."
Time check: 4:30.
-->

---
layout: default
class: database-savings-slide
routeAlias: database-savings
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">THREE DATABASES · ONE FAST PATH</p>
  <h1>Use Valkey alongside each database, then right-size the source.</h1>
</div>

<div class="database-logo-grid">
  <article class="database-logo-card" v-click.fade.right="1">
    <img src="/logos/mariadb.svg" alt="MariaDB logo" />
    <strong>MariaDB</strong>
    <b>&gt;55%</b>
    <p>potential cost savings using Valkey alongside*</p>
  </article>
  <article class="database-logo-card database-logo-card--postgres" v-click.fade.right="2">
    <img src="/logos/postgresql.svg" alt="PostgreSQL logo" />
    <strong>PostgreSQL</strong>
    <b>&gt;55%</b>
    <p>potential cost savings using Valkey alongside*</p>
  </article>
  <article class="database-logo-card database-logo-card--documentdb" v-click.fade.right="3">
    <img src="/logos/documentdb-project.png" alt="DocumentDB project logo" />
    <strong>DocumentDB</strong>
    <b>&gt;55%</b>
    <p>potential cost savings using Valkey alongside*</p>
  </article>
</div>

<p class="source-note">*Workload target, not a universal benchmark or guarantee. Requires a high measured cache-hit rate and database right-sizing after validation.</p>

<SlideFooter />

<!--
Reveal one database at a time. The architecture applies to relational and document databases because the cost mechanism is repeated reads.
Be precise: greater than 55 percent is presented as a potential workload target. It must be proven with before-and-after measurements for the audience's workload.
Time check: 5:30.
-->

---
layout: default
class: cache-aside-slide
routeAlias: cache-aside
clicks: 5
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">CACHE-ASIDE · REQUEST TRACE</p>
  <h1>The application asks Valkey first.</h1>
</div>

<CacheAsideDiagram :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the request trace</p>

<SlideFooter />

<!--
Advance five times: check, hit, miss, load, fill.
Clarify that HIT and MISS are alternative paths. The animation shows both to teach the decision.
A filled entry can still expire, be evicted, or be invalidated later.
Time check: 7:00.
-->

---
layout: default
class: economics-slide
routeAlias: database-economics
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE ECONOMICS · MEASURED, NOT MAGICAL</p>
  <h1>Database read load follows the miss rate.</h1>
  <p class="slide-lead">A simple model makes the cost mechanism visible before you benchmark your own workload.</p>
</div>

<div class="economics-layout">
  <div class="load-equation">
    <span>READ-LOAD MODEL</span>
    <strong>DB reads ≈ requests × miss rate</strong>
    <p>Connection pressure, CPU, I/O, and read-scaling needs can fall when repeated reads stop at Valkey.</p>
  </div>

  <div class="example-stack">
    <div class="example-row" v-click.fade.right="1"><span>TRAFFIC</span><strong>100,000 reads / second</strong></div>
    <div class="example-row" v-click.fade.right="2"><span>MISS RATE</span><strong>10% after warm-up</strong></div>
    <div class="example-row example-row--result" v-click.fade.right="3"><span>DB LOAD</span><strong>≈ 10,000 reads / second</strong></div>
  </div>
</div>

<p class="source-note">Illustrative arithmetic, not a performance claim. Benchmark hit rate, latency, database load, and total cost using your workload.</p>

<SlideFooter />

<!--
The example is intentionally arithmetic, not a vendor benchmark.
The correct sequence is measure, cache, measure again, then right-size. Never shrink capacity because a slide says you can.
Time check: 9:00.
-->

---
layout: default
class: code-slide code-slide--light
routeAlias: database-code
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">CACHE-ASIDE · PYTHON</p>
  <h1>The implementation is a small decision tree.</h1>
</div>

```python {1-2|5-7|9-10|12-13|all}{lines:true}
valkey_client = valkey.Valkey(host="cache", port=6379)
rdbms_client = RdbmsClient(dsn="products-db")

def get_product(product_id):
    key = f"product:{product_id}"
    cached = valkey_client.get(key)

    if cached is not None:
        return json.loads(cached)

    product = rdbms_client.load_product(product_id)

    valkey_client.set(key, json.dumps(product), ex=300)
    return product
```

<div class="code-map code-map--light">
  <span>1 · clients</span><span>2 · Valkey lookup</span><span>3 · safe hit</span><span>4 · RDBMS read</span><span>5 · fill + TTL</span>
</div>

<SlideFooter />

<!--
Follow the line highlights. Do not read the code line by line.
Call out that production code needs serialization rules, error handling, observability, and stampede protection.
Time check: 10:30.
-->

---
layout: default
class: guardrails-slide
routeAlias: database-guardrails
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">CORRECTNESS · RESILIENCE · OPERATIONS</p>
  <h1>A cache moves risk; it does not erase it.</h1>
</div>

<div class="guardrail-grid">
  <article class="guardrail-card" v-click.fade.right="1">
    <span>FRESHNESS</span>
    <strong>TTL or invalidation</strong>
    <p>Match expiration to staleness tolerance. Update or delete entries when correctness requires it.</p>
  </article>
  <article class="guardrail-card" v-click.fade.right="2">
    <span>STAMPEDES</span>
    <strong>Protect the miss path</strong>
    <p>Add TTL jitter, request coalescing, and load shedding so an expiry does not become a database spike.</p>
  </article>
  <article class="guardrail-card" v-click.fade.right="3">
    <span>FAILURE</span>
    <strong>Define degraded behavior</strong>
    <p>Decide whether to fail closed, serve stale data, bypass the cache, or return a partial response.</p>
  </article>
</div>

<SlideFooter />

<!--
This is the reliability correction: a cache serves only what it has.
A miss still depends on the database, and an unhealthy cache can become a new failure mode.
Time check: 12:00.
-->

---
layout: section
class: budget-section
routeAlias: ai
---

<div class="section-number">02</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">LAYER TWO</p>
  <h1>AI inference.</h1>
  <p class="section-subtitle">Use semantic caching to recognize equivalent intent before paying to generate the answer again.</p>
</div>

<!--
Transition: "Now point the same architecture at a model call."
Time check: 12:30.
-->

---
layout: default
class: prompts-slide
routeAlias: semantic-intuition
clicks: 4
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">SAME INTENT · DIFFERENT WORDS</p>
  <h1>An exact-key cache sees strings. A semantic cache sees meaning.</h1>
</div>

<div class="prompt-stage">
  <div class="prompt-list">
    <div class="prompt-bubble" v-click.fade.right="1">“How do I reset my password?”</div>
    <div class="prompt-bubble" v-click.fade.right="2">“I forgot my password. What now?”</div>
    <div class="prompt-bubble" v-click.fade.right="3">“Password reset steps, please.”</div>
  </div>
  <div class="prompt-arrow" v-click.fade="4">→</div>
  <div class="answer-card" v-click.fade.left="4">
    <span>ONE STABLE INTENT</span>
    <strong>Reuse one validated answer.</strong>
    <p>Only when the prompt is close enough and the context is compatible.</p>
  </div>
</div>

<SlideFooter />

<!--
Read the prompts aloud. The audience should hear the equivalence before you explain embeddings.
Do not call exact-key caching "dumb". It is precise; it simply cannot match paraphrases.
Time check: 14:00.
-->

---
layout: default
class: semantic-flow-slide
routeAlias: semantic-cache
clicks: 5
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">SEMANTIC CACHE · REQUEST TRACE</p>
  <h1>The nearest safe answer becomes the fast path.</h1>
</div>

<SemanticCacheDiagram :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> advance the semantic trace</p>

<SlideFooter />

<!--
Advance five times: embed, search, hit, miss, store.
Explicitly rhyme this with cache-aside: check, hit, do the expensive work on miss, remember.
The embedding call still has cost and latency; the semantic hit avoids the larger generation call.
Time check: 16:30.
-->

---
layout: default
class: distance-metrics-slide
routeAlias: knn-distance
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">KNN · DISTANCE METRICS</p>
  <h1>“Nearest” depends on how you measure distance.</h1>
  <p class="slide-lead">Choose the metric that matches how your embedding model represents similarity.</p>
</div>

<DistanceMetricTiles :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> reveal each distance metric</p>

<SlideFooter />

<!--
Reveal Euclidean, cosine, then inner product.
Euclidean measures absolute separation. Cosine compares direction. Inner product combines alignment and magnitude.
Normalize vectors when the selected metric or embedding-model guidance requires it, and validate retrieval quality on domain data.
Time check: 17:30.
-->

---
layout: default
class: benchmark-slide valkey-indigo
routeAlias: benchmark
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow eyebrow--dark">ONE AWS EVALUATION · NOT A GUARANTEE</p>
  <h1>Semantic caching traded a small accuracy change for large savings.</h1>
</div>

<div class="benchmark-grid">
  <article class="benchmark-card" v-click.fade.right="1"><span>LLM COST SAVINGS</span><strong>86.3%</strong><p>At a 0.75 similarity threshold.</p></article>
  <article class="benchmark-card" v-click.fade.right="2"><span>LATENCY REDUCTION</span><strong>88.3%</strong><p>Average end-to-end latency.</p></article>
  <article class="benchmark-card" v-click.fade.right="3"><span>CACHED-ANSWER ACCURACY</span><strong>91.2%</strong><p>The guardrail beside the savings.</p></article>
</div>

<div class="benchmark-context">
  <span>63,796 QUERIES</span><span>TITAN TEXT EMBEDDINGS V2</span><span>CLAUDE 3 HAIKU</span><span>CACHE.R7G.LARGE</span>
</div>

<p class="source-note source-note--dark">Source: AWS Database Blog, “Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock.” Results depend on model, embedding, data, threshold, and cache.</p>

<SlideFooter tone="dark" />

<!--
Say the accuracy number with the savings numbers. That is the honest tradeoff.
The source reports 86.3% cost savings and 88.3% latency reduction at threshold 0.75 with 91.2% cached-answer accuracy.
Time check: 18:00.
-->

---
layout: default
class: code-slide valkey-dark
routeAlias: semantic-code
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow eyebrow--dark">SEMANTIC CACHE · PYTHON</p>
  <h1>Use distance as a guardrail, not just a ranking.</h1>
</div>

```python {2-3|5-8|10-12|14-17|19-21|all}{lines:true}
def answer(prompt, max_distance=0.15):
    vector = embed(prompt).astype(np.float32).tobytes()

    query = (Query("*=>[KNN 1 @embedding $vector AS distance]")
             .sort_by("distance")
             .return_fields("answer", "distance")
             .dialect(2))

    result = client.ft("semantic_cache").search(
        query, query_params={"vector": vector})

    if result.docs:
        nearest = result.docs[0]
        if float(nearest.distance) <= max_distance:
            return nearest.answer

    generated = call_model(prompt)
    store_with_ttl(prompt, vector, generated)
    return generated
```

<div class="code-map">
  <span>1 · embed</span><span>2 · KNN search</span><span>3 · distance</span><span>4 · safe hit</span><span>5 · miss + store</span>
</div>

<SlideFooter tone="dark" />

<!--
For cosine distance, lower is closer in this raw query example. That is why the test uses <= max_distance.
Some higher-level APIs expose similarity instead, where higher is better. Name the metric and direction in code and dashboards.
Time check: 19:30.
-->

---
layout: default
class: module-slide
routeAlias: vector-index
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">VALKEY SEARCH · INDEX SETUP</p>
  <h1>Vector search is a capability you must deploy.</h1>
</div>

<div class="module-layout">

```bash {1-5|7-8|all}{lines:true}
FT.CREATE semantic_cache ON HASH PREFIX 1 prompt:
  SCHEMA
    embedding VECTOR HNSW 6
      TYPE FLOAT32 DIM 1024 DISTANCE_METRIC COSINE
    answer TEXT

HSET prompt:8f2a \
  embedding <float32-blob> answer "Reset steps…"
```

  <aside class="module-card">
    <span>DEPLOYMENT PREREQUISITE</span>
    <strong>Plain Valkey does not imply that the search module is loaded.</strong>
    <p>Use a distribution or managed service version that supports Valkey Search. Match DIM to the embedding model and verify supported commands before rollout.</p>
    <code>Valkey Search: official module · Valkey 8.1.1+</code>
  </aside>
</div>

<p class="source-note">Source: valkey.io/blog/introducing-valkey-search/ · Managed-service version requirements may differ.</p>

<SlideFooter />

<!--
FT.CREATE defines the index. HSET supplies records that match the indexed prefix.
The example uses 1024 dimensions only as an example. The real dimension must match the selected embedding model.
Your deployment must include the required search capability and support the commands shown here.
Time check: 21:00.
-->

---
layout: default
class: threshold-slide
routeAlias: threshold
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">THE DIAL THAT MATTERS</p>
  <h1>Tune hit rate and answer accuracy together.</h1>
</div>

<ThresholdDial :step="$clicks" />

<SlideFooter />

<!--
Start tight. Click once to show the danger of chasing hit rate. Click again to settle on a measured operating point.
Use a labeled evaluation set from your domain. Global averages can hide harmful false matches.
Time check: 22:30.
-->

---
layout: default
class: context-slide
routeAlias: semantic-guardrails
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">CACHE ONLY SAFE, STABLE WORK</p>
  <h1>Meaning alone is not enough context.</h1>
</div>

<div class="context-grid">
  <article class="context-card" v-click.fade.right="1"><span>FRESHNESS</span><strong>Expire changing answers</strong><p>Use TTLs tied to policy, pricing, product, or model changes. Add jitter to avoid synchronized refreshes.</p></article>
  <article class="context-card" v-click.fade.right="2"><span>SCOPING</span><strong>Filter before matching</strong><p>Include tenant, locale, product, permissions, and conversation context where they change the answer.</p></article>
  <article class="context-card" v-click.fade.right="3"><span>ELIGIBILITY</span><strong>Bypass unsafe prompts</strong><p>Do not cache real-time, personalized, sensitive, or nondeterministic responses without an explicit policy.</p></article>
</div>

<SlideFooter />

<!--
This is where semantic caching becomes production architecture rather than a demo.
A close vector from the wrong tenant or product is not a hit.
Time check: 24:00.
-->

---
layout: section
class: budget-section
routeAlias: well-architected
---

<div class="section-number">03</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">THE ARCHITECTURE REVIEW</p>
  <h1>Three pillars.</h1>
  <p class="section-subtitle">Cost Optimization, Performance Efficiency, and Reliability improve together only when the guardrails are part of the design.</p>
</div>

<!--
Transition: "Now map the implementation decisions back to the Well-Architected outcomes."
Time check: 24:30.
-->

---
layout: default
class: matrix-slide
routeAlias: pillar-matrix
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">TWO PATTERNS · THREE PILLARS</p>
  <h1>The optimization is the whole system—not the cache alone.</h1>
</div>

<WellArchitectedMatrix :step="$clicks" />

<p class="interaction-hint"><kbd>→</kbd> reveal each pillar</p>

<SlideFooter />

<!--
Reveal Cost Optimization, Performance Efficiency, then Reliability.
Emphasize the final guardrail: reliability requires topology and failure behavior, not simply adding a cache.
Time check: 26:00.
-->

---
layout: default
class: action-slide
routeAlias: takeaways
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">APPLY IT THIS WEEK</p>
  <h1>Start with one path and one measurable hypothesis.</h1>
</div>

<div class="action-grid action-grid--two">
  <article class="action-card" v-click.fade.right="1"><span>01 · DATABASE</span><strong>Pick hot, stable reads</strong><p>Add cache-aside with a TTL. Compare database load, p95 latency, hit rate, and total cost before right-sizing.</p><code>hypothesis: fewer repeated reads</code></article>
  <article class="action-card" v-click.fade.right="2"><span>02 · AI</span><strong>Build an evaluation set</strong><p>Prototype semantic caching on eligible prompts. Tune distance against answer accuracy—not hit rate alone.</p><code>hypothesis: safe avoided calls</code></article>
</div>

<SlideFooter />

<!--
Make the call to action measurable. No broad rewrite is required.
The sequence is observe, change one path, compare, then scale the pattern.
Time check: 27:30.
-->

---
layout: end
class: budget-end
routeAlias: resources
---

<div class="end-content">
  <BrandLogo tone="dark" class="end-logo" />
  <p class="eyebrow eyebrow--dark">THE CLOSING IDEA</p>
  <h1>Do not pay twice<br><span>for the same work.</span></h1>
  <p>Well-Architected on a budget is not about doing less. It is about recognizing repeated work early—and preserving correctness while you avoid it.</p>

  <PresenterIdentity class="end-presenter" />
</div>

<a href="https://valkey.io" class="end-qr" aria-label="Open valkey.io">
  <img src="/qr-valkey.svg" alt="QR code pointing to valkey.io" />
  <strong>Explore Valkey</strong>
  <span>valkey.io</span>
</a>

<div class="end-links">
  <a href="https://valkey.io/">valkey.io</a>
  <a href="https://valkey.io/blog/introducing-valkey-search/">Valkey Search</a>
  <a href="https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/">AWS benchmark</a>
</div>

<!--
Deliver the closing line and pause.
Invite questions about freshness, thresholds, reliability, and measuring total cost.
Time check: 28:00, then Q&A.
-->
