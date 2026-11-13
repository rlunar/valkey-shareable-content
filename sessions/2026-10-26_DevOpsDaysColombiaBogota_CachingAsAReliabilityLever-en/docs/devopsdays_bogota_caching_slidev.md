---
theme: default
title: Caching as a Reliability Lever
info: |
  Caching as a Reliability Lever — DevOpsDays Bogotá 2026
  Roberto Luna Rojas · Valkey project, AWS
class: text-left
transition: slide-left
mdc: true
colorSchema: light
---

<style>
:root {
  --vk-purple: #30176E;
  --vk-red: #642637;
  --vk-blue: #6983FF;
  --vk-black: #1A2026;
  --vk-pink: #E0A2AF;
  --vk-lav: #BCB5E7;
  --vk-white3: #F7FBFE;
}
.slidev-layout {
  background: var(--vk-white3);
  color: var(--vk-black);
}
.slidev-layout h1 { color: var(--vk-purple); font-weight: 800; }
.slidev-layout h2 { color: var(--vk-red); }
.slidev-layout strong { color: var(--vk-purple); }
.slidev-layout a { color: var(--vk-blue); }
.slidev-layout code { color: var(--vk-purple); }
.cover { background: var(--vk-purple) !important; color: #FFFDFA !important; }
.cover h1, .cover h2, .cover strong { color: #FFFDFA !important; }
.cover .accent { color: var(--vk-pink) !important; }
.lav { background: var(--vk-lav) !important; }
.card {
  background: var(--vk-white3);
  border: 1px solid var(--vk-lav);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 6px rgba(48,23,110,0.15);
}
.codeblk { background: var(--vk-black); color: #FFFDFA; border-radius: 10px; padding: 0.5rem 1rem; }
table { border-color: var(--vk-purple); }
.hl { color: var(--vk-blue); font-weight: 700; }
.red { color: var(--vk-red); font-weight: 700; }
</style>

<div class="cover" style="position:absolute; inset:0; padding:3rem 3.5rem; display:flex; flex-direction:column; justify-content:center;">

<div class="accent" style="font-size:0.9rem; letter-spacing:3px; font-weight:700;">DEVOPSDAYS BOGOTÁ 2026</div>

# Caching as a Reliability Lever

<div style="font-size:1.4rem; font-style:italic; color:#BCB5E7; margin-top:0.5rem;">Cut DB spend and tame latency with query & semantic caching</div>

<div style="margin-top:2rem; font-size:1rem;">
<strong style="color:#FFFDFA;">Roberto Luna Rojas</strong><br>
<span style="color:#BCB5E7;">Valkey project · AWS</span>
</div>

<div style="margin-top:1.5rem; font-size:0.85rem; color:#E0A2AF;">30 min · L300 technical · SRE / Cloud / Platform track · Oct 23, 2026</div>

</div>

<!--
Opening, say it plainly: your database is doing the same expensive work over and over.
That is the whole talk in one sentence. I am Roberto, I work on the Valkey project at AWS.
This is L300, so we move fast past the basics into architecture, code, and real numbers.
I will be honest about where caching helps and where it bites back.

ANIMATION: title slide is static. Let the subtitle sit for a beat before you start talking.
-->

---
layout: default
---

# Who this is for

<v-clicks>

- You run services with a database behind them
- You have felt a read path fall over under load
- Your cloud bill climbs faster than your traffic
- Your LLM feature costs more per request than you want to admit

</v-clicks>

<div v-click class="card" style="margin-top:1.5rem;">
<strong>Prerequisites:</strong> comfortable with databases, cloud deployment, and basic distributed-systems vocabulary (TTL, replication, consistency). No prior caching experience required, but we move fast.
</div>

<!--
Quick hands: who here has been paged for a database that fell over under load? Good, keep that
memory, we are going to explain exactly why it happened.

ANIMATION: the four pains reveal one at a time (v-clicks) so each lands as its own nod of
recognition. Then the prerequisites card fades in last. Pace: about one click per sentence.
-->

---
layout: default
---

# The problem, stated precisely

Your database does the same expensive work over and over. Three failure modes, each with a signature on your dashboards.

<div class="grid grid-cols-3 gap-4 mt-6">
<div v-click class="card">
<div class="red" style="font-size:1.6rem;">1</div>
<strong>Latency spikes</strong><br>
Heavy reads repeat and queue. p50 looks fine, p99 climbs, worst exactly when traffic peaks.
</div>
<div v-click class="card">
<div class="red" style="font-size:1.6rem;">2</div>
<strong>Pager noise</strong><br>
Repeated reads saturate the origin. Pools exhaust, CPU pins, on-call pays for work already done.
</div>
<div v-click class="card">
<div class="red" style="font-size:1.6rem;">3</div>
<strong>Spend outpaces traffic</strong><br>
Every repeated query is billed compute. Every repeated prompt is billed inference. You pay again.
</div>
</div>

<div v-click class="card lav" style="margin-top:1.5rem;">
A cache tier is the lever that addresses all three at once. The rest of this talk is how to pull it without creating new problems.
</div>

<!--
Three failure modes. The important thing is they share one root cause, which is the next section.
Do not let the audience treat these as three separate problems, they are three faces of one thing:
repeated work with nowhere to remember the answer.

ANIMATION: three cards reveal left to right (v-click), then the lavender summary bar reveals last.
If presenting live, click card 1 while you say "latency", card 2 on "pager", card 3 on "spend".
-->

---
layout: default
---

# Why an uncached app degrades
## An Amazon retail example

A product detail page fans out into many backend reads: <span class="hl">price, availability, buy-box, ratings, recommendations</span>. Most are the same answer for every shopper looking at that product in that minute.

<div v-click class="card" style="margin-top:1rem;">
Picture a Prime Day lightning deal. A few hundred thousand shoppers hit the <strong>same product</strong> in the same window. Without a cache, every page view runs the full fan-out against the origin databases.
</div>

<div v-click style="margin-top:1rem;">
That is where the cascade starts. <span class="red">Next slide: watch it unfold.</span>
</div>

<!--
This is the heart of the "why". Anchor it in something everyone has seen: an Amazon product page.
One page view is not one query, it is a fan-out of many reads, and under a surge they are almost
all identical across shoppers. Set this up carefully because the next slide pays it off.

ANIMATION: reveal the setup card, then the "watch it unfold" teaser. Keep it slow, you are loading
the gun that the cascade slide fires.
-->

---
layout: default
---

# The degradation cascade

<div class="grid grid-cols-2 gap-6">

<div>
<div style="font-weight:700; color:#642637; margin-bottom:0.5rem;">WITHOUT CACHE</div>
<div v-click="1" class="card" style="margin-bottom:0.4rem;">1 · Page fan-out: many reads per view</div>
<div v-click="2" class="card" style="margin-bottom:0.4rem;">2 · Redundant DB work: identical answers recomputed 200k×</div>
<div v-click="3" class="card" style="margin-bottom:0.4rem;">3 · Connection pool drains <span style="opacity:0.7;">(Little's Law)</span></div>
<div v-click="4" class="card" style="margin-bottom:0.4rem;">4 · Queues form, p99/p999 blow out <span style="opacity:0.7;">(the knee)</span></div>
<div v-click="5" class="card" style="margin-bottom:0.4rem; border-color:#642637;">5 · Origin contends: CPU pins, locks <span class="red">↺ feeds back into 3</span></div>
<div v-click="6" class="card" style="background:#642637; color:#FFFDFA;">6 · Timeouts → retry storm → <strong style="color:#FFFDFA;">DOWN</strong> (on-call paged)</div>
</div>

<div>
<div style="font-weight:700; color:#30176E; margin-bottom:0.5rem;">WITH CACHE</div>
<div v-click="7" class="card lav">
<strong>Valkey cache tier</strong><br>
1 origin read + TTL refreshes, served hot.<br><br>
Fan-out never reaches the DB at surge volume.<br><br>
Pool healthy · no queue · no contention · nothing to retry against.<br><br>
<strong>Same traffic, no degradation.</strong>
</div>
</div>

</div>

<!--
This is the payoff slide. Walk DOWN the left column one box at a time, and crucially, when you hit
box 5, point out the feedback arrow back to box 3: slower service time means connections are held
longer, which drains the pool faster, which slows things more. That loop is why it is a cliff, not
a slope. Then reveal the right column as a single calm block: the cache cuts the chain at step 1.

ANIMATION (Slidev v-click order encoded):
- Clicks 1-6 reveal the left cascade top to bottom, one box per beat.
- Box 5 has a red "feeds back into 3" marker; when it appears, trace the loop with your hand/laser.
- Box 6 flips to solid Valkey red to signal the outage.
- Click 7 reveals the entire right-hand WITH CACHE panel at once, as the resolution.
Suggested enhancement: add v-motion to slide box 6 up slightly on reveal for emphasis, and a
fade+scale on the click-7 panel. If you want the feedback loop to literally draw, overlay an SVG
arrow from box 5 to box 3 and wrap it in <v-click> at 5.

--- D3 SPEC (CascadeFlow.vue) ---
Diagram: D3 directed flow, 6 stage nodes top-to-bottom + one feedback arc.
Nodes: rounded rects per cascade stage; fill ValkeyWhite3 #F7FBFE, stroke ValkeyPurple #30176E;
  stage 6 fill ValkeyRed #642637 with white text.
Edges: straight purple connectors down the chain; ONE curved feedback arc from stage 5 back to
  stage 3 in ValkeyRed with an arrowhead marker + label "slower service time".
Animation (gate on Slidev $clicks 1-6): each node fades + slides in (translateY 20->0, opacity
  0->1, ~400ms ease) on its click. Click 5: draw the feedback arc via stroke-dasharray /
  stroke-dashoffset tween so the loop visibly closes. Click 6: fade in the WITH-CACHE panel and dim
  the left column to ~40%.
D3 specifics: d3.line().curve(d3.curveBasis) for the arc; <marker> def for the arrowhead;
  d3.transition().duration(400) keyed on a watch($clicks). Set slide frontmatter clicks: 6 (7 if the
  WITH-CACHE panel is its own step).
-->

---
layout: default
---

# The pool math, with numbers

Little's Law: in-flight requests = arrival rate × service time. <code>L = λ × W</code>.
Max a pool can sustain before it drains: <code>λ_max = pool_size / W</code>. One app server, 100-connection pool:

<table class="mt-4">
<thead>
<tr><th>State</th><th>Service time (W)</th><th>Load (λ)</th><th>In-flight (L)</th><th>Pool of 100</th></tr>
</thead>
<tbody>
<tr v-click><td>Healthy</td><td>4 ms</td><td>8,000 rps</td><td>32</td><td>fits, 68 spare</td></tr>
<tr v-click><td>Origin slowed 10×</td><td>40 ms</td><td>8,000 rps</td><td class="red">320</td><td class="red">exhausted 3.2× over</td></tr>
<tr v-click><td>Cache at 98% hit</td><td>4 ms</td><td>160 rps to origin</td><td class="hl">0.6</td><td class="hl">barely touched</td></tr>
</tbody>
</table>

<div v-click class="card" style="margin-top:1rem;">
Nothing about the <strong>load</strong> changed in the middle row, only service time. 4 ms → 40 ms drives in-flight from 32 to 320 against a cap of 100. That is why degradation is a <span class="red">knee, not a slope</span>: 68% idle until service time crossed the line, then off a cliff.
</div>

<!--
This is the quantitative backbone of the whole "why". The middle row is the punchline: hold load
constant, change only service time, and the pool requirement goes from comfortable to 3.2x over
capacity. At 4 ms the pool sustains 25,000 rps; at 40 ms only 2,500, below the offered 8,000.
The cache row collapses origin load to 160 rps, needing under one connection.

ANIMATION: reveal the three table rows one at a time so the 320 lands as a shock after the 32.
Highlight the middle row's 320 in red on reveal. Then the takeaway card. If you can, animate the
number 320 counting up from 32 (CSS/JS) for drama, optional.

--- D3 SPEC (PoolKneeChart.vue) ---
Diagram: 2D line chart (the pool-saturation knee).
Axes: x = DB service time 0-60 ms; y = max sustainable throughput 0-26,000 rps. ValkeyBlack axes,
  muted gridlines.
Curve: lambda_max = pool / W, pool=100 -> y = 100000 / x (hyperbola). ValkeyPurple, 3px.
Markers: healthy dot (4 ms, 25,000 rps) ValkeyBlue; slowed dot (40 ms, 2,500 rps) ValkeyRed;
  dashed horizontal line at 8,000 rps offered load so the crossing reads as the knee/cliff.
Animation (gate on $clicks): 1 draw axes; 2 tween curve left-to-right via stroke-dashoffset;
  3 drop healthy dot + callout; 4 drop red slowed dot + flash the 8,000 line; 5 shade the region
  where curve < offered load (danger zone) translucent ValkeyRed.
D3 specifics: d3.scaleLinear both axes; d3.line() sampled ~120 pts; d3.area() for the danger zone.
  Data anchors: (4,25000),(40,2500), offered=8000. Set slide clicks: 5.
-->

---
layout: default
---

# The mental model

<div class="codeblk" style="margin-top:1rem; font-size:1.1rem;">
<pre style="background:transparent; color:#FFFDFA; margin:0;">
             miss
  client ───────▶ cache ───────▶ origin (DB or model)
         ◀───────       ◀───────
            hit                 slow, expensive
       (fast, cheap)
</pre>
</div>

<div v-click class="card" style="margin-top:1.5rem;">
Every request is a <strong>bet</strong>: is the cost of a cache lookup plus the risk of staleness lower than the cost of recomputing at the origin? For read-heavy and repetition-heavy workloads the bet pays. The engineering is in measuring the bet honestly and bounding the staleness.
</div>

<!--
Reset to first principles after the intensity of the cascade. Caching is just a bet on every
request. The two things we control are the odds (hit ratio) and the downside (staleness). Hold
this frame, every later section is either improving the odds or bounding the downside.

ANIMATION: diagram static, then reveal the "bet" card. Optionally animate the hit arrow (ValkeyBlue)
drawing back from cache to client to emphasize the fast path.
-->

---
layout: section
class: lav
---

# Part 1 — Query caching
## The familiar half

<!--
Section divider. Query caching is the part most people know, so we go fast but precise, and set the
baseline for semantic caching which is the new idea.

ANIMATION: section transition. Use the lavender background as the visual cue for "new part".
-->

---
layout: default
---

# Cache-aside (lazy loading)

The application owns the logic. The pattern I reach for first.

```python {all|2-4|5-7|all}
def get_product(product_id):
    key = f"product:{product_id}"
    val = cache.get(key)
    if val is not None:
        return deserialize(val)          # hit
    row = db.query("SELECT ... WHERE id = %s", product_id)  # miss
    cache.set(key, serialize(row), ex=300)   # populate, 5 min TTL
    return row
```

<v-clicks>

- The cache holds only data someone asked for. Memory tracks the working set, not the whole table
- A miss costs one extra round trip. Trade a little miss latency for a lot of hit latency
- The app must handle a cold cache. After a flush or deploy, the first requests all miss

</v-clicks>

<!--
Cache-aside is the workhorse. The code uses Slidev line-highlighting: first the lookup, then the
hit path, then the miss-and-populate. Call out the TTL on the set, we will come back to why 300
seconds is a decision, not a default.

ANIMATION: the code block steps through line groups (click: all → lines 2-4 → lines 5-7 → all).
Then the three properties reveal as bullets. Sync your narration to the highlighted lines.
-->

---
layout: default
---

# Read-through, write-through, write-behind

<div class="grid grid-cols-1 gap-3 mt-4">
<div v-click class="card"><strong>Read-through:</strong> on a miss the cache loads from the DB itself and returns it. The app sees one interface.</div>
<div v-click class="card"><strong>Write-through:</strong> writes go to the cache, which synchronously writes the DB. Never stale relative to the DB, at the cost of write latency.</div>
<div v-click class="card"><strong>Write-behind:</strong> the cache acks the write and flushes to the DB asynchronously. Fast writes, but you can lose data in a crash window. Use only where that loss is acceptable.</div>
</div>

<!--
The trade is always the same: who owns the origin call, and how much staleness or data-loss risk
you accept for speed. Write-behind is the sharp knife, be explicit that it trades durability.

ANIMATION: three cards reveal top to bottom. Keep it quick, this is reference material, not the
climax.
-->

---
layout: default
---

# Where query caching wins

<table class="mt-2">
<thead><tr><th>Signal</th><th>Cache it?</th></tr></thead>
<tbody>
<tr v-click><td>Read-heavy, repeated keys (catalog, config, sessions)</td><td class="hl">Yes, query cache</td></tr>
<tr v-click><td>Expensive aggregations recomputed often</td><td class="hl">Yes, cache the result not the rows</td></tr>
<tr v-click><td>Low hit ratio, mostly unique reads</td><td class="red">No, the tier is overhead</td></tr>
<tr v-click><td>Write-heavy with strict read-after-write</td><td>Only with write-through or careful invalidation</td></tr>
</tbody>
</table>

<div v-click class="card" style="margin-top:1rem;">
Economics are governed by <strong>hit ratio</strong>. Below a break-even ratio, the extra lookup on every miss makes you slower and no cheaper. <span class="red">Measure it before you celebrate.</span>
</div>

<!--
The honest slide. Caching is not free and not always right. The low-hit-ratio row is the one people
ignore and regret. Land the point: measure hit ratio first, it decides everything.

ANIMATION: rows reveal one at a time, with the "No" row in red. Then the hit-ratio caveat card.
-->

---
layout: default
---

# TTL and invalidation: the part that bites

A cache is a second copy of your data. The whole difficulty is keeping that copy honest. Two tools: <span class="hl">time (TTL)</span> and <span class="hl">events (invalidation)</span>.

<div class="grid grid-cols-2 gap-4 mt-4">
<div v-click class="card">
<strong>TTL strategy</strong>
<ul>
<li>Short: bounds staleness, lower hit ratio, more origin load</li>
<li>Long: high hit ratio, big savings, stale data lingers</li>
<li><strong>Jitter:</strong> never expire a big batch in the same second</li>
</ul>
</div>
<div v-click class="card">
<strong>Explicit invalidation</strong>
<div class="codeblk" style="margin-top:0.4rem; font-size:0.8rem;">
<pre style="background:transparent;color:#FFFDFA;margin:0;">def update_product(id, changes):
    db.update(id, changes)
    cache.delete(f"product:{id}")
    # fan-out keys too!</pre>
</div>
The hard case is derived and fan-out keys. Track dependencies explicitly, do not hope a TTL saves you.
</div>
</div>

<!--
TTL and invalidation are where caches turn into bugs. Jitter is the cheap insurance against
synchronized expiry. The real trap is fan-out keys: a write to product 42 must also invalidate the
category list that contains it. Document those relationships, do not rely on luck.

ANIMATION: reveal TTL card, then invalidation card. If live, highlight the "fan-out keys too!"
comment as the thing people forget.
-->

---
layout: default
---

# Three classic failure modes

<div class="grid grid-cols-3 gap-3 mt-4">
<div v-click class="card">
<strong class="red">Stampede</strong><br>
Hot key expires, thousands miss at once, all hit the DB. <br><em>Fix:</em> per-key lock (single-flight) or serve-stale-while-revalidate.
</div>
<div v-click class="card">
<strong class="red">Penetration</strong><br>
Requests for keys that do not exist bypass the cache every time. <br><em>Fix:</em> cache the negative result, or a Bloom filter in front.
</div>
<div v-click class="card">
<strong class="red">Avalanche</strong><br>
A big set of keys expires at once, or the node drops. <br><em>Fix:</em> TTL jitter, multi-AZ, origin-side rate limiting.
</div>
</div>

<div v-click class="codeblk" style="margin-top:1rem; font-size:0.78rem;">
<pre style="background:transparent;color:#FFFDFA;margin:0;">def get_with_singleflight(key, loader, ttl=300):
    val = cache.get(key)
    if val is not None: return val
    if cache.set(f"lock:{key}", "1", nx=True, ex=10):   # won the lock
        try:    val = loader(); cache.set(key, val, ex=ttl); return val
        finally: cache.delete(f"lock:{key}")
    else:   time.sleep(0.05); return get_with_singleflight(key, loader, ttl)  # wait</pre>
</div>

<!--
Name the three by name, they will hear them in postmortems for the rest of their careers. The
single-flight code is the one to linger on: only one caller recomputes a hot key, everyone else
waits a beat. That one pattern prevents most stampedes.

ANIMATION: three failure cards reveal left to right, then the single-flight code block fades in
below. If you have time, highlight the nx=True line, that is the whole trick.
-->

---
layout: section
class: lav
---

# Part 2 — Semantic caching
## The new half, for AI and RAG

<!--
Transition into the part most of the audience has not built yet. This is the differentiated content,
slow down here.

ANIMATION: section transition, lavender cue again.
-->

---
layout: default
---

# Semantic caching: how it works

Exact-match caching fails for LLM traffic. No two prompts are byte-identical. <span class="hl">Match on meaning, not bytes.</span>

<div class="mt-4" style="font-family:monospace; line-height:2;">
<span v-mark.circle.red="4">prompt</span> <span v-click="1">──▶ embed ──▶ vector</span> <span v-click="2">──▶ nearest-neighbor search in cache</span>
<div v-click="3" style="margin-top:0.5rem;">&nbsp;&nbsp;&nbsp;&nbsp;sim ≥ threshold ──▶ <span class="hl">return cached answer (hit, no inference)</span></div>
<div v-click="4" style="margin-top:0.3rem;">&nbsp;&nbsp;&nbsp;&nbsp;sim &lt; threshold ──▶ <span class="red">call model, store (vector, answer)</span></div>
</div>

<v-clicks at="5">

- Embed the prompt with the **same** model every time
- Search the cache for the nearest stored prompt vector (cosine similarity)
- At or above threshold, return the stored answer. That is a hit, you skipped an inference call
- Otherwise call the model, then store the new pair

</v-clicks>

<!--
The core mechanic. The leap from "same string" to "same meaning" is the whole idea. Emphasize that
the embedding model must be identical for writes and reads, or your vectors are not comparable.

ANIMATION: build the flow left to right (embed, then vector, then search), then reveal the two
branches (hit in blue, miss in red). The v-mark circles the word "prompt" when the miss branch
appears to tie it back. Then the four bullets reinforce. This is the slide to rehearse the clicks on.

--- D3 SPEC (SemanticFlowDiagram.vue) ---
Diagram: D3 left-to-right flow with a decision branch (the semantic-cache request path).
Nodes (left to right): "prompt" → "embed" → "vector" → "kNN search in cache" → decision diamond
  "sim ≥ threshold?". From the diamond: HIT branch (up/right) → "return cached answer · no inference"
  in ValkeyBlue #6983FF; MISS branch (down/right) → "call model → store (vector, answer)" in
  ValkeyRed #642637, with a dashed return arrow from the store step back to the cache node.
Nodes rounded rects, ValkeyWhite3 #F7FBFE fill, ValkeyPurple #30176E stroke; the diamond stroked in
  ValkeyPurple. Edges purple with arrowhead markers.
Animation (gate on Slidev $clicks 1-5): 1 reveal prompt→embed→vector left to right (staggered
  fade+slideX ~350ms); 2 reveal the kNN node + the decision diamond; 3 reveal the HIT branch (blue)
  and pulse it once; 4 reveal the MISS branch (red) + the dashed store→cache return arrow; 5 a
  d3 v-mark-style circle (stroke-dashoffset draw-on) around the "prompt" node to tie the stored pair
  back to a future prompt.
D3 specifics: position nodes on a manual x-grid; d3.line().curve(d3.curveStep) for the branch edges;
  <marker> arrowheads; stroke-dashoffset tweens for edge draw-in and the circle; transitions keyed on
  watch($clicks). Set slide frontmatter clicks: 5. Keep the existing text bullets as the fallback if
  the component is not mounted.
-->

---
layout: default
---

# Valkey as the vector store

<v-clicks>

- Valkey holds the prompt vectors and does vector similarity search, so the index and your existing cache are <strong>one tier</strong>
- Store the answer alongside the vector, set a TTL, deploy across AZs
- Same reliability story as the query cache: fail open, multi-AZ, bounded staleness

</v-clicks>

```python {all|1|3-6|7-9}
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

<!--
One tier for both the classic cache and the vector index is the operational win: you are not running
a separate vector database. The code mirrors the query-cache shape on purpose, the structure is
identical, only the match function changed.

ANIMATION: bullets first, then step the code by line groups: the threshold constant, the embed+knn,
then the hit/miss branch. Pause on the THRESHOLD line, next slide is all about it.
-->

---
layout: default
---

# The threshold is the whole game

<div class="grid grid-cols-2 gap-4 mt-2">
<div v-click class="card">
<strong class="red">Too loose (low threshold)</strong><br>
You serve a stored answer to a prompt that was only superficially similar. A close-but-wrong answer to save a fraction of a cent. This erodes trust.
</div>
<div v-click class="card">
<strong class="red">Too tight (high threshold)</strong><br>
Almost everything misses, you call the model anyway, the cache earns nothing.
</div>
</div>

<div v-click class="card lav" style="margin-top:1rem;">
<strong>Guardrails:</strong> scope the cache per intent/namespace · never semantically cache personalized answers unless the key includes the user/tenant · log every hit with its score · exclude freshness or compliance-sensitive answers, or gate behind a very short TTL
</div>

<div v-click style="margin-top:0.75rem;" class="red">Tune against labeled prompt pairs, not by feel. Next slide: the measured proof.</div>

<!--
This is the intellectual core of the AI half. The threshold is a dial between savings and
correctness, and it is YOUR decision, not a default. Hammer the personalization guardrail: "what is
my balance?" is not the same question across users even when the vectors are near-identical.

ANIMATION: reveal the two failure modes side by side, then the guardrails bar, then the teaser to
the case-study table. Keep the two red cards visually balanced so the "dial" metaphor reads.
-->

---
layout: section
class: lav
---

# Part 3 — Reliability & the numbers

<!--
Third act: tie caching back to SRE and then to money, with real case studies.

ANIMATION: section transition.
-->

---
layout: default
---

# Multi-AZ Valkey, fail open

<div class="grid grid-cols-2 gap-6 mt-2">
<div>
<div style="font-family:monospace; font-size:0.8rem; line-height:1.5;">
<div v-click="1" class="card" style="margin-bottom:0.3rem;">AZ a · <strong>primary</strong> ◀── reads/writes</div>
<div v-click="2" class="card" style="margin-bottom:0.3rem;">AZ b · replica <span style="opacity:0.7;">(promote on failover)</span></div>
<div v-click="3" class="card">AZ c · replica <span style="opacity:0.7;">(read scaling)</span></div>
<div v-click="4" class="red" style="margin-top:0.5rem; text-align:center;">lose an AZ → replica promotes → cache stays up</div>
</div>
</div>
<div>
<div v-click="5" class="card">
<strong>Fail open, not closed.</strong> If the cache is unreachable, fall back to the origin, do not error. A cache outage degrades you to "slow", never to "down". Rate-limit the origin so a cold cache cannot take the DB with it.
</div>
</div>
</div>

```python {none|all}
def cached_read(key, loader, ttl=300):
    try:
        val = cache.get(key)            # short timeout
        if val is not None: return val
    except CacheUnavailable:
        pass                            # fail open: fall through
    val = loader()
    try: cache.set(key, val, ex=ttl)
    except CacheUnavailable: pass       # best-effort write-back
    return val
```

<!--
Two ideas: multi-AZ so losing a node or a zone does not lose the cache, and fail-open so losing the
cache never cascades into a DB outage. Note we say multi-AZ, not multi-region, deliberately.

ANIMATION: build the three AZ nodes top to bottom (clicks 1-3), then the failover line (click 4) in
red, then the fail-open card (click 5). The code block is hidden until the final click (none|all);
reveal it as you explain the try/except fall-through.
-->

---
layout: default
---

# What to watch

<div class="grid grid-cols-2 gap-3 mt-4">
<div v-click class="card"><strong>Hit ratio</strong> per key class. A falling ratio is your early warning that the economics changed.</div>
<div v-click class="card"><strong>p99 / p999</strong> read latency, cache vs origin path, tracked separately.</div>
<div v-click class="card"><strong>Origin DB connection saturation and CPU</strong>, to confirm the cache is actually shielding it.</div>
<div v-click class="card"><strong>Eviction rate and memory pressure.</strong> High evictions mean the working set outgrew the cache.</div>
<div v-click class="card"><strong>Semantic:</strong> hit similarity distribution, plus a sampled audit of near-threshold hits for correctness.</div>
</div>

<!--
If you cannot see it you cannot run it. Hit ratio is the leading indicator, everything else is
confirmation. For semantic caches, the similarity-distribution audit is how you catch the threshold
drifting into wrong-answer territory.

ANIMATION: five metric cards reveal in sequence. Quick pace.
-->

---
layout: default
---

# The numbers

<div class="grid grid-cols-2 gap-6 mt-2">
<div v-click class="card" style="text-align:center; background:#30176E; color:#FFFDFA;">
<div style="font-size:0.9rem; color:#BCB5E7;">up to</div>
<div style="font-size:4rem; font-weight:800; line-height:1;">55%</div>
<div style="font-size:0.9rem; color:#F7FBFE;">DB cost savings for frequently accessed data</div>
</div>
<div v-click class="card">
<strong>Break-even view:</strong> plot cost against hit ratio. Below break-even the extra lookup on every miss is pure overhead. Above it, savings grow with hit ratio until they flatten near the ceiling. <span class="red">Know where your workload sits before you commit.</span>
</div>
</div>

<div v-click class="card" style="margin-top:1rem;">
<strong>Worked example, query cache:</strong> 10k rps, 8 ms DB read, 0.5 ms cache GET, 85% hit → avg latency 8 ms → 1.7 ms (79% drop), DB volume 10k → 1.5k rps (85% cut).
</div>

<!--
The 55% is a ceiling you earn through hit ratio, not a given. Say that explicitly so nobody quotes
it as a guarantee. The worked example makes it tangible with one honest set of assumptions.

ANIMATION: the big 55% stat lands first (consider a count-up animation on the number), then the
break-even card, then the worked-example strip.
-->

---
layout: default
---

# Case study — Amazon Ads

<div class="card" style="margin-top:1rem;">
Amazon Sponsored Products: billions of impressions/day, tens of millions of reads/sec, p99 under 5 ms, 99.99% availability. Multi-cluster ElastiCache (service called Horus), each workload isolated in its own cluster.
</div>

<div class="grid grid-cols-2 gap-4 mt-4">
<div v-click class="card" style="text-align:center;">
<div class="hl" style="font-size:2.5rem; font-weight:800;">45%+</div>
lower infrastructure cost
</div>
<div v-click class="card" style="text-align:center;">
<div class="hl" style="font-size:2.5rem; font-weight:800;">12%</div>
higher throughput
</div>
</div>

<div v-click style="margin-top:1rem;">
Upgraded ElastiCache for Redis to Valkey 8.0 on Graviton. <strong>Zero downtime, no code changes</strong> (drop-in). Dual-write, gradual read-shift, live rollback the whole way.
</div>

<!--
Real production result at Amazon scale. Two levers stacked: Valkey efficiency plus Graviton pricing,
tell people to separate those when modeling their own case. The migration recipe (dual-write,
gradual read-shift, live rollback) is reusable for any cache-tier change under load.

Source: AWS Database Blog, Nov 2025, Amazon Ads upgrades to ElastiCache for Valkey.

ANIMATION: context card first, then the two big stats reveal side by side, then the migration recipe
line. Let the 45% and 12% sit.
-->

---
layout: default
---

# Case study — semantic cache with Bedrock

63,796 real chatbot queries · Titan V2 embeddings (1024-dim, HNSW + cosine) · Claude 3 Haiku. <span class="hl">Up to 86% cost cut, 88% latency reduction.</span> The threshold is a dial:

<table class="mt-2" style="font-size:0.85rem;">
<thead><tr><th>Threshold</th><th>Hit ratio</th><th>Accuracy</th><th>Cost savings</th><th>Latency ↓</th></tr></thead>
<tbody>
<tr v-click><td>0.99</td><td>23.5%</td><td>92.1%</td><td>15.8%</td><td>17.1%</td></tr>
<tr v-click><td>0.95</td><td>56.0%</td><td>92.6%</td><td>51.9%</td><td>57.7%</td></tr>
<tr v-click><td>0.90</td><td>74.5%</td><td>92.3%</td><td>72.5%</td><td>72.2%</td></tr>
<tr v-click><td class="hl">0.75</td><td class="hl">90.3%</td><td class="hl">91.2%</td><td class="hl">86.3%</td><td class="hl">88.3%</td></tr>
<tr v-click><td class="red">0.50</td><td>94.3%</td><td class="red">87.5%</td><td>88.0%</td><td>89.3%</td></tr>
</tbody>
</table>

<div v-click class="card" style="margin-top:0.75rem;">
Accuracy holds in the low 90s until ~0.75, then falls off at 0.50. <strong>0.75 is the knee:</strong> 86% savings at 91% accuracy. Pushing to 0.50 adds 2 points of savings but gives back ~4 points of accuracy.
</div>

<!--
This table is the measured proof of the threshold argument from Part 2. Walk down it: as you loosen
the threshold, savings climb, but watch accuracy. The 0.75 row is highlighted because it is the
sweet spot. The 0.50 row shows the cliff. This is the single most important evidence slide in the
deck for the AI half.

Source: AWS Database Blog, Nov 2025, Lower cost and latency for AI using ElastiCache as a semantic
cache with Bedrock.

ANIMATION: reveal rows one at a time so the audience watches accuracy hold then break. Highlight the
0.75 row in blue as the sweet spot, the 0.50 accuracy cell in red as the warning. Then the takeaway.

--- D3 SPEC (ThresholdTradeoffChart.vue) ---
Diagram: dual-y-axis line chart (threshold tradeoff, the semantic-cache proof).
Axes: x = similarity threshold 0.50 -> 0.99 (reversed so "looser" reads left-to-right); left y =
  cost savings % 0-100; right y = accuracy % 80-100 (zoomed so the cliff shows).
Series: cost-savings line ValkeyBlue (climbs as threshold loosens); accuracy line ValkeyRed (flat in
  low 90s, drops sharply at 0.50). Plot the five real Bedrock points as dots on each line.
Payoff marker: vertical ValkeyPurple band at 0.75 labeled "the knee — 86% savings at 91% accuracy";
  red shaded zone below 0.75 where accuracy falls off.
Animation (gate on $clicks): 1 axes; 2 draw savings line (blue) rising; 3 draw accuracy line (red),
  hold, then dip at 0.50; 4 drop the 0.75 knee band + label; 5 shade the accuracy-cliff zone.
D3 specifics: two d3.scaleLinear y-scales; d3.line() per series; stroke-dashoffset draw-in; <rect>
  for the knee band. Data [threshold,savings,accuracy]:
  [[0.99,15.8,92.1],[0.95,51.9,92.6],[0.90,72.5,92.3],[0.75,86.3,91.2],[0.50,88.0,87.5]]. clicks: 5.

Shared: build each as a Slidev Vue component in components/ (auto-imported), npm i d3. Palette —
ValkeyPurple #30176E, ValkeyRed #642637, ValkeyBlue #6983FF, ValkeyBlack #1A2026, ValkeyLavender
#BCB5E7, ValkeyWhite3 #F7FBFE. Read $clicks (or useSlideContext) and gate each transition on it so
the D3 build and the slide click count stay in lockstep.
-->

---
layout: default
---

# What the two cases prove together

<div class="grid grid-cols-2 gap-4 mt-4">
<div v-click class="card">
<strong>Query cache (Amazon Ads)</strong><br>
A reliability and cost story at massive read scale. The cache shields the origin and the tier itself got 45% cheaper to run.
</div>
<div v-click class="card">
<strong>Semantic cache (Bedrock)</strong><br>
The AI cost story with the honest caveat attached. Big savings are real, and the threshold that unlocks them is exactly where correctness is won or lost.
</div>
</div>

<div v-click class="card lav" style="margin-top:1.5rem; text-align:center; font-size:1.1rem;">
Same lever, two workloads, one discipline: <strong>measure hit ratio against cost, and bound the staleness.</strong>
</div>

<!--
Synthesis. Do not let them walk away thinking query and semantic caching are two unrelated tricks.
They are the same lever applied to two workloads, governed by the same discipline. That one-liner is
the sentence I want them to remember.

ANIMATION: two cards reveal, then the lavender synthesis bar lands as the thesis.
-->

---
layout: default
---

# Takeaways

<v-clicks>

1. A practical model for **query vs. semantic caching** and when each fits
2. How to **quantify** DB cost savings and tail-latency improvement, governed by hit ratio
3. **Invalidation and TTL** patterns (stampede, penetration, avalanche) that keep caches reliable
4. A **multi-AZ Valkey** reference architecture that fails open and shields the origin

</v-clicks>

<!--
Four takeaways, mapped to the three parts plus the reliability spine. Keep these on screen while you
breathe before the close.

ANIMATION: reveal one at a time, then hold.
-->

---
layout: center
class: cover
---

<div style="text-align:center;">

# Start Monday morning

<div class="grid grid-cols-3 gap-4 mt-6" style="text-align:left;">
<div v-click class="card" style="background:#1A2026; color:#FFFDFA; border:none;">
<div class="hl" style="font-size:1.8rem;">1</div>
<strong style="color:#FFFDFA;">Find the repetition</strong><br>
Your hottest read or most-repeated prompt. One path, measured.
</div>
<div v-click class="card" style="background:#1A2026; color:#FFFDFA; border:none;">
<div class="hl" style="font-size:1.8rem;">2</div>
<strong style="color:#FFFDFA;">Add the tier</strong><br>
Query cache for reads, semantic for prompts. A TTL you can defend.
</div>
<div v-click class="card" style="background:#1A2026; color:#FFFDFA; border:none;">
<div class="hl" style="font-size:1.8rem;">3</div>
<strong style="color:#FFFDFA;">Watch hit ratio vs cost</strong><br>
Prove the savings and the p99 drop before you expand. Honest numbers only.
</div>
</div>

<div v-click style="margin-top:2rem; color:#E0A2AF; font-size:1.2rem;">
Thank you · Roberto Luna Rojas · Valkey project, AWS
</div>

</div>

<!--
Close with action, not summary. Three concrete steps they can do at their desk tomorrow. The whole
talk condenses to: find one repeated path, cache it, measure it honestly. End warm, invite questions.

ANIMATION: three step cards reveal left to right on the dark cover background, then the thank-you line
in Valkey pink. Hold the final frame for Q&A.
-->
