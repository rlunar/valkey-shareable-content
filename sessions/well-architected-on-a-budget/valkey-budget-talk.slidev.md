---
theme: default
title: "Well-Architected on a Budget: Cutting Database and AI Inference Cost with Valkey"
info: |
  AWS Community Day Argentina 2026
  Roberto Luna Rojas, Sr. Developer Advocate, Valkey @ AWS
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: light
---

<!--
============================================================
SLIDEV DECK  —  Well-Architected on a Budget
============================================================
Run with:  npx @slidev/cli valkey-budget-talk.slidev.md
Present:   press `p` for presenter mode (speaker notes below each slide)
  - Slide separator: `---`
  - Speaker notes: HTML comment `<!-- ... -->` at the END of a slide
  - Click animations: `v-click`, `v-clicks`, `v-after`
  - Code line-highlight steps: ```python {all|3|7-10} ```
  (A MARP-specific version of this deck lives in valkey-budget-talk.marp.md)

BRAND COLORS (Valkey official):
  ValkeyBlue    #6983FF   (primary accent, highlights, arrows)
  ValkeyBlack   #1A2026   (background / dark text)
  ValkeyRed     #642637   (cost / expensive / "before")
  ValkeyPurple  #30176E   (secondary accent)
  ValkeyPink    #E0A2AF   (soft highlight)
  ValkeyLavender#BCB5E7   (background tint, muted)
  ValkeyWhite   #FFFDFA   (text on dark)
  ValkeyWhite2  #D3DDE7   (muted text)
  ValkeyWhite3  #F7FBFE   (light background)

DIAGRAM / ANIMATION legend used in notes below:
  [DIAGRAM] = what to draw on the slide
  [ANIM]    = how it should animate / reveal
============================================================
-->

<style>
:root {
  --slidev-theme-primary: #30176E;
}
.slidev-layout {
  background: #BCB5E7;
  color: #1A2026;
}
.slidev-layout h1 { color: #30176E; }
.slidev-layout h2 { color: #30176E; }
.slidev-layout a { color: #6983FF; }
.slidev-layout code { background: #1A2026; color: #FFFDFA; }
.slidev-layout.section { background: #30176E; color: #FFFDFA; }
.slidev-layout.section h1, .slidev-layout.section h2 { color: #FFFDFA; }
</style>

# Well-Architected on a Budget

## Cutting Database and AI Inference Cost with Valkey

<div class="pt-8 opacity-80">
Roberto Luna Rojas · Sr. Developer Advocate, Valkey @ AWS
<br>
AWS Community Day Argentina 2026
</div>

<!--
[DIAGRAM] Title slide. Valkey logo top-left, AWS Community Day Argentina lockup bottom-right. Dark background (ValkeyBlack #1A2026), title in ValkeyWhite, subtitle accent in ValkeyBlue.
[ANIM] Title fades in first, then subtitle slides up from below (200ms delay). Keep it calm — no bouncing.

SPEAKER NOTES:
Open with energy but no fluff. "Every millisecond and every dollar counts when you scale an app. Today I'll show you two patterns that cut cost on the two most expensive layers of your stack — your database and your AI inference — using one tool: Valkey." Set the promise: they leave with patterns they can apply the same afternoon.
Time check: 0:00
-->

---

# The bill, not the buzzwords

When you scale, two layers dominate your cost:

<v-clicks>

- **Your database** — read-heavy traffic pushes you to bigger instances and more read replicas. You pay for provisioned capacity, not value per query.
- **Your AI inference** — every LLM call costs money and time. Users ask similar questions, and you pay full price to regenerate answers you already have.

</v-clicks>

<v-click>

<div class="mt-8 text-2xl" style="color:#6983FF">
The idea: put a fast, cheap layer <em>in front of</em> the expensive layer.
</div>

</v-click>

<!--
[DIAGRAM] Two stacked "cost bars" — one labeled DATABASE, one labeled AI INFERENCE. Both drawn tall and in ValkeyRed (#642637) to signal "expensive". Optional dollar-sign icons.
[ANIM] v-clicks reveal the two bullets one at a time. On the final v-click, a thin ValkeyBlue (#6983FF) bar slides in FRONT of both red bars — foreshadowing the cache layer. The blue bar visually "shrinks" the red ones (they get shorter as the blue slides in).

SPEAKER NOTES:
Frame everything in dollars, not features. The audience cares about their bill and their latency. Don't pitch Valkey yet — pitch the shape of the solution: a cheap fast layer absorbing repetitive work. "You don't rewrite your app. You don't switch databases. You put something in front."
Time check: ~2:00
-->

---

# What is Valkey

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

- Open source, community-driven, **in-memory** data store
- A **Linux Foundation** project, broad community
- If you know Redis, you know the API
- Answers requests in **microseconds**

</div>
<div class="text-xl leading-relaxed" style="color:#30176E">

What matters for this talk:

<span style="color:#6983FF">It holds data in memory and answers at a fraction of the cost of the systems it sits in front of.</span>

</div>
</div>

<!--
[DIAGRAM] Valkey logo centered-left. Right side: a simple "microseconds" latency chip vs a "milliseconds" chip to anchor the speed intuition.
[ANIM] Minimal. Logo fades in. The two latency chips pop in sequence (microseconds highlighted in ValkeyBlue, milliseconds muted in ValkeyWhite2).

SPEAKER NOTES:
Keep this SHORT — 30 seconds max. Don't sell the product, frame it as a cost lever. One line: "It's open source, it's in memory, it's fast, and it's cheap relative to what it sits in front of. That's all you need to know for the next 30 minutes."
Time check: ~3:00
-->

---
layout: section
---

# Layer One
## The Database

<!--
[DIAGRAM] Section divider. Large "01" in ValkeyLavender behind the text. Dark background.
[ANIM] Number "01" scales up subtly from 90% to 100% as the slide enters.

SPEAKER NOTES:
Transition. "Let's start with the layer almost every app has: the database."
Time check: ~3:30
-->

---

# The cache-aside pattern

<div class="grid grid-cols-2 gap-4 mt-4">
<div>

<v-clicks>

1. App needs data → **ask Valkey first**
2. **Cache hit** → return in microseconds ✅
3. **Cache miss** → read DB, write to Valkey, return
4. Next request for that data is a **hit**

</v-clicks>

</div>
<div class="text-lg" style="color:#30176E">

<v-click>

Your app controls the cache directly.
You decide **what** to cache, **how long**, and **when** it expires.

Nothing is hidden.

</v-click>

</div>
</div>

<!--
[DIAGRAM] Flow diagram, left-to-right:
  [ App ] --(1) GET key--> [ Valkey ]
  Valkey has two exit paths:
    HIT  --> returns value straight back to App (green/ValkeyBlue path)
    MISS --> [ Database ] --> value flows back INTO Valkey (write) --> then to App (ValkeyRed path)
[ANIM] Reveal in lockstep with the v-clicks:
  - Click 1: draw App → Valkey arrow.
  - Click 2: HIT path lights up ValkeyBlue, a "µs" badge pops on the return arrow.
  - Click 3: MISS path draws down to Database in ValkeyRed, then animate the value traveling Database → Valkey (write-back) → App. Slow this arrow down so people SEE the write-back.
  - Click 4: replay the HIT path once more (quick pulse) to show "now it's a hit."

SPEAKER NOTES:
This is the workhorse. Walk the flow physically with your hand across the diagram. Emphasize the write-back on miss — that's the part people forget. "The first request pays the database cost. Every request after that is free-ish, served from memory." The point of the animation replay on click 4 is to show the state changed: same request, now a hit.
Time check: ~5:30
-->

---

# Why cache-aside is a cost lever

<v-clicks>

- Most apps are **read-heavy** — same rows read thousands of times between writes
- Without a cache, every read hits the DB → you scale the DB to peak → **bigger instances + read replicas**
- A single Valkey node absorbs **hundreds of thousands of req/sec**
- Take the read load off the DB → **shrink the primary, drop replicas** you only added to survive reads

</v-clicks>

<div class="grid grid-cols-2 gap-8 mt-8">
<v-click>
<div class="text-center p-4 rounded-lg" style="background:#30176E">
<div class="text-5xl font-bold" style="color:#FFFDFA">80x</div>
<div style="color:#30176E">faster reads from memory</div>
</div>
</v-click>
<v-click>
<div class="text-center p-4 rounded-lg" style="background:#6983FF">
<div class="text-5xl font-bold" style="color:#1A2026">55%</div>
<div style="color:#1A2026">lower cost for frequently accessed data</div>
</div>
</v-click>
</div>

<!--
[DIAGRAM] Two "before/after" DB topologies at the top OR the two big stat cards at the bottom (shown here). Before: Primary + 3 read replicas (all ValkeyRed). After: Primary + 1 Valkey node in front, replicas greyed out / crossed.
[ANIM]
  - Bullets reveal via v-clicks.
  - Big number cards: "80x" card scales/counts up from 1x to 80x (number ticker). "55%" card fills a horizontal bar from 0 to 55% in ValkeyBlue.
  - If using the topology version: on the last bullet, animate the read replicas fading out one by one as the Valkey node "absorbs" the read arrows.

SPEAKER NOTES:
CRITICAL WORDING: say "up to 80x faster reads" and "up to 55% lower cost FOR FREQUENTLY ACCESSED DATA." Do NOT say "Valkey makes your database 55% cheaper." The claim is: for the data you read constantly, serving it from Valkey costs about half of provisioning DB capacity for it. This precision matters and protects your credibility.
Time check: ~8:00
-->

---

# Cache-aside in code

```python
import valkey, json

client = valkey.Valkey(host="my-cache", port=6379)

def get_product(product_id):
    key = f"product:{product_id}"
    # 1. Ask Valkey first
    cached = client.get(key)
    if cached:
        return json.loads(cached)        # HIT - microseconds

    # 2. Miss - read the database once
    row = db.query("SELECT * FROM products WHERE id = %s", product_id)

    # 3. Write it back with a TTL, then return
    client.set(key, json.dumps(row), ex=300)   # 5-min TTL
    return row
```

<!--
[DIAGRAM] Single code block, syntax-highlighted. The code IS the visual - it maps 1:1 to the flow diagram on the previous slide (same three numbered steps).
[ANIM] In Slidev, add a line-highlight step header to the code fence, e.g. ```python {all|3|7-10|12-13|15-16} ``` to reveal: (1) whole block, (2) client connection, (3) ask-Valkey-first + HIT return, (4) DB read on miss, (5) write-back with TTL. In MARP, split into separate slides or use a static highlight - MARP has no line-step animation.

SPEAKER NOTES:
Show how little code this is. Walk the three numbered comments in order - they map exactly to the flow diagram: ask Valkey first, return on hit, read DB on miss, write back with a TTL. Callback to the freshness slide: "there's the TTL, 5 minutes, tune per data type." Emphasize the API is Redis-compatible, so most clients and ORMs already speak it. Don't read every line.
Time check: ~9:00
-->

---

# One question you must answer: freshness

<div class="grid grid-cols-2 gap-8 mt-8">
<v-click>
<div class="p-6 rounded-lg" style="background:#F7FBFE;border:2px solid #6983FF">
<div class="text-2xl font-bold" style="color:#6983FF">TTL</div>
<div class="mt-2" style="color:#30176E">Set an expiry. Simple. Good for data that tolerates slight staleness — catalogs, config, reference data.</div>
</div>
</v-click>
<v-click>
<div class="p-6 rounded-lg" style="background:#F7FBFE;border:2px solid #E0A2AF">
<div class="text-2xl font-bold" style="color:#E0A2AF">Explicit invalidation</div>
<div class="mt-2" style="color:#30176E">On DB write, delete/update the cache entry. More work, correct for data that must be fresh.</div>
</div>
</v-click>
</div>

<v-click>
<div class="mt-8 text-center text-xl" style="color:#30176E">
Most apps: TTL for the majority, explicit invalidation for the few things that must be current.
</div>
</v-click>

<!--
[DIAGRAM] Two cards side by side (as laid out). Optional: a small timeline showing a TTL bar draining to empty then re-fetching.
[ANIM] Cards flip/fade in one at a time (v-click). The TTL card can show a small countdown bar draining. Final line fades in centered.

SPEAKER NOTES:
Don't skip this. The #1 objection to caching is "but stale data." Answer it head-on. Give the practical default: TTL for most things, explicit invalidation for the handful that must be correct (balances, inventory). Match the approach to your staleness tolerance.
Time check: ~9:30
-->

---
layout: section
---

# Layer Two
## AI Inference

<!--
[DIAGRAM] Section divider. Large "02" in ValkeyLavender behind text.
[ANIM] Same treatment as section 01 for consistency.

SPEAKER NOTES:
Transition and re-hook: "Now take the exact same instinct — a cheap fast layer in front of an expensive one — and point it at the most expensive operation in a modern app: the LLM call."
Time check: ~10:00
-->

---

# Your users ask the same thing, differently

<div class="mt-8 space-y-4 text-2xl">
<v-click><div style="color:#30176E">"How do I reset my password?"</div></v-click>
<v-click><div style="color:#30176E">"I forgot my password, what do I do?"</div></v-click>
<v-click><div style="color:#30176E">"password reset steps please"</div></v-click>
</div>

<v-click>
<div class="mt-10 text-3xl text-center">
<span style="color:#642637">3 different strings.</span>
<span style="color:#6983FF"> 1 answer.</span>
</div>
</v-click>

<v-click>
<div class="mt-6 text-center text-xl" style="color:#30176E">
A normal cache keys on the exact string — it misses all three.
<br>A <strong style="color:#6983FF">semantic cache</strong> keys on <em>meaning</em>.
</div>
</v-click>

<!--
[DIAGRAM] Three chat-bubble prompts stacked. Then a visual "collapse" where all three bubbles converge with arrows into a single answer node.
[ANIM]
  - Reveal the three prompts one at a time (v-click), each in a chat bubble.
  - On "3 different strings / 1 answer": animate all three bubbles' arrows converging into one glowing ValkeyBlue answer node in the center.
  - Contrast beat: briefly show a string-match cache "X" rejecting bubbles 2 and 3 (they don't match bubble 1 exactly), then the semantic cache "✓" accepting all three.

SPEAKER NOTES:
This is the intuition slide — land it BEFORE any numbers. Read the three prompts out loud in slightly different tones so the audience hears they're the same intent. "A dumb cache sees three different strings. A semantic cache sees one question." Set up the mechanism on the next slide.
Time check: ~11:30
-->

---

# Semantic caching with Valkey vector search

<div class="grid grid-cols-2 gap-4">
<div>

<v-clicks>

1. Prompt in → convert to an **embedding** (a vector of its meaning)
2. Search Valkey for stored prompts with **nearby vectors**
3. **Semantic hit** (above threshold) → return cached answer. **No LLM call.**
4. **Semantic miss** → call the LLM, then **store** the new embedding + answer

</v-clicks>

</div>
<div class="text-lg mt-4" style="color:#30176E">

<v-click>

You cache answers by what they **mean**, not by the exact words used to ask.

Valkey does the vector similarity search **natively**.

</v-click>

</div>
</div>

<!--
[DIAGRAM] Flow, left-to-right:
  [ Prompt ] --> [ Embedding model ] --(vector)--> [ Valkey vector search ]
  Valkey branches:
    HIT  --> cached answer returns directly (ValkeyBlue, "no LLM" badge)
    MISS --> [ LLM ] --> answer --> written back into Valkey (ValkeyRed path) --> returns
  Draw a small vector space inset: dots clustered; the incoming query dot lands near a cluster = hit.
[ANIM]
  - Steps 1–4 reveal with v-clicks, mirroring the cache-aside diagram DELIBERATELY (same left-to-right shape) so the audience sees it's the same pattern.
  - Step 2: animate the query vector as a dot flying into the "vector space" inset and snapping to the nearest cluster.
  - Step 3 (HIT): the matched dot pulses ValkeyBlue, answer returns fast, "$0 / no LLM" badge pops.
  - Step 4 (MISS): dot lands in empty space (no cluster), path extends down to LLM in ValkeyRed, answer generates (slower), then write-back animates the new dot appearing in the vector space for next time.
[CALLBACK] Visually rhyme this with the cache-aside slide — same arrows, same colors, same write-back motion. That parallel is the whole point of the talk.

SPEAKER NOTES:
Explicitly call back to cache-aside: "Notice this is the exact same shape as the database pattern. Ask the cheap layer first. Hit? Done. Miss? Do the expensive thing once, then remember it." The only new mechanism is vector similarity instead of exact-key lookup. Keep the embedding explanation to one sentence — don't rathole on embeddings.
Time check: ~14:00
-->

---

# Why semantic caching is a cost lever

<v-clicks>

- Every **semantic hit** is an LLM call you did not make, and did not pay for
- Repetitive workloads (support, internal knowledge, FAQ assistants) hit the cache **a lot**

</v-clicks>

<div class="grid grid-cols-2 gap-8 mt-10">
<v-click>
<div class="text-center p-6 rounded-lg" style="background:#30176E">
<div class="text-6xl font-bold" style="color:#FFFDFA">86%</div>
<div style="color:#30176E">lower inference cost</div>
</div>
</v-click>
<v-click>
<div class="text-center p-6 rounded-lg" style="background:#6983FF">
<div class="text-6xl font-bold" style="color:#1A2026">88%</div>
<div style="color:#1A2026">lower end-to-end latency</div>
</div>
</v-click>
</div>

<!--
[DIAGRAM] Two big stat cards (as laid out). Optional: a cost bar comparing "no cache" vs "semantic cache" spend over a day of traffic.
[ANIM] Numbers count up (ticker) from 0 to 86% and 0 to 88%. If using the cost-bar, animate the "with cache" bar shrinking dramatically next to the "no cache" bar.

SPEAKER NOTES:
Say "up to 86%" and "up to 88%." Give the one-liner intuition first, numbers second: "You already paid to answer this question once. Why pay again?" These are the headline numbers of the whole talk — pause after them. Let it land.
Time check: ~16:00
-->

---

# Semantic cache in code

```python
import valkey, numpy as np
from valkey.commands.search.query import Query

client = valkey.Valkey(host="my-cache", port=6379)

def answer(prompt):
    vec = embed(prompt)                       # prompt -> embedding

    # 1. Vector similarity search in Valkey (KNN, nearest 1)
    q = (Query("*=>[KNN 1 @vec $v AS score]")
         .sort_by("score").dialect(2))
    hit = client.ft("cache_idx").search(
        q, query_params={"v": vec.astype(np.float32).tobytes()})

    # 2. Semantic HIT - close enough? reuse the cached answer
    if hit.docs and float(hit.docs[0].score) <= 0.15:   # threshold
        return hit.docs[0].answer              # no LLM call

    # 3. Semantic MISS - call the LLM once, then store for next time
    resp = llm(prompt)
    store(client, vec, prompt, resp)           # HSET vec + answer
    return resp
```

<!--
[DIAGRAM] Single code block. Same shape as the cache-aside code slide on purpose - put them side by side mentally. The only new idea is the KNN vector query replacing a plain GET.
[ANIM] Slidev line-highlight header, e.g. ```python {all|7|9-13|15-17|19-22} ```: (1) whole block, (2) embed the prompt, (3) the KNN vector search, (4) the threshold check + HIT return with "no LLM call", (5) the MISS path calling the LLM and storing. In MARP, split or static-highlight.

SPEAKER NOTES:
Deliberately mirror the cache-aside code: "same three steps - ask the cheap layer, return on hit, do the expensive thing once on miss, then remember it." The one new line is the KNN query. Point at the threshold (0.15 here) and callback to the threshold-tuning slide: "this number is the dial - lower is stricter." Note the score direction depends on your distance metric (cosine here, lower = closer). Keep embeddings to one sentence.
Time check: ~15:00
-->

---

# Setting up the vector index

```bash {all|2-6|9-10}
# 1. Create the vector index (run once at setup)
FT.CREATE cache_idx ON HASH PREFIX 1 prompt:
  SCHEMA
    vec  VECTOR HNSW 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
    answer TEXT

# 2. Store a prompt embedding + its answer (on every semantic MISS)
HSET prompt:8f2a  vec <1536-float32 blob>  answer "To reset your password..."
```

<div class="mt-4" style="color:#30176E">
One-time setup. <strong>HNSW</strong> gives fast approximate nearest-neighbor search; <strong>DIM</strong> must match your embedding model (1536 here); <strong>COSINE</strong> is the distance metric the threshold reads.
</div>

<!--
[DIAGRAM] Single code block (Valkey CLI / RESP commands). Optional tiny inset: a grid of vectors with an HNSW graph overlay (nodes linked to nearest neighbors) to hint at how HNSW navigates.
[ANIM] Slidev line-highlight steps via the fence header {all|2-6|9-10}: (1) whole block, (2) the FT.CREATE index definition, (3) the HSET write-back. Highlight DIM and DISTANCE_METRIC verbally when you reach step 2.

SPEAKER NOTES:
This is the "how do I actually stand it up" slide - keep it quick, it's a reference. Three things to say: (1) FT.CREATE runs ONCE, it defines the index; (2) DIM must match your embedding model exactly or search fails; (3) DISTANCE_METRIC COSINE is what the 0.15 threshold on the previous code slide compares against - lower = more similar. The HSET is the write-back you already saw in the semantic-cache code (the store() call). Don't dwell - point them to valkey.io docs for the full vector search reference.
Time check: ~15:45
-->

---

# The one dial that matters: similarity threshold

<div class="grid grid-cols-2 gap-8 mt-8">
<v-click>
<div class="p-6 rounded-lg" style="background:#F7FBFE;border:2px solid #642637">
<div class="text-2xl font-bold" style="color:#E0A2AF">Too loose</div>
<div class="mt-2" style="color:#30176E">You return cached answers for prompts that aren't really the same. Users get wrong or off-target responses.</div>
</div>
</v-click>
<v-click>
<div class="p-6 rounded-lg" style="background:#F7FBFE;border:2px solid #642637">
<div class="text-2xl font-bold" style="color:#E0A2AF">Too tight</div>
<div class="mt-2" style="color:#30176E">You rarely get a hit. You barely save anything.</div>
</div>
</v-click>
</div>

<v-click>
<div class="mt-8 text-center text-xl" style="color:#6983FF">
Start conservative → measure hit rate + answer quality → loosen carefully.
</div>
</v-click>

<!--
[DIAGRAM] A horizontal slider labeled "similarity threshold" with a draggable knob. Left end = "loose" (wrong answers zone, ValkeyRed), right end = "tight" (few hits zone, muted). A green "sweet spot" band sits right-of-center.
[ANIM]
  - Reveal the two failure-mode cards (v-click).
  - Final beat: animate the slider knob sweeping from loose → tight, showing the tradeoff, then settling into the ValkeyBlue "sweet spot" band. The knob should overshoot slightly then settle to feel like tuning.

SPEAKER NOTES:
This is the practical gotcha — be honest about it (matches your voice: honest about limitations). "This is the one thing you have to get right." Give the operational recipe: start conservative, measure BOTH hit rate and answer quality, then loosen. Quality is the guardrail; don't chase hit rate blindly.
Time check: ~17:30
-->

---
layout: section
---

# It all maps to
## Well-Architected

<!--
[DIAGRAM] Section divider "03". Optionally show the three relevant pillar icons faintly in the background: Cost Optimization, Performance Efficiency, Reliability.
[ANIM] Pillar icons fade up behind the title.

SPEAKER NOTES:
This is what makes the talk stick. "These aren't just clever performance tricks. They pull three Well-Architected levers at the same time."
Time check: ~18:30
-->

---

# Two patterns, three pillars

<div class="mt-4">

| Pattern | Cost Optimization | Performance Efficiency | Reliability |
|---|---|---|---|
| **Cache-aside** (database) | Shrink / drop read replicas; serve hot data cheaply | Up to **80x** faster reads | Shields DB from read spikes |
| **Semantic cache** (AI) | Up to **86%** fewer LLM calls | Up to **88%** lower latency | Buffers a rate-limited model endpoint |

</div>

<v-click>
<div class="mt-10 text-2xl text-center" style="color:#6983FF">
Usually you trade cost against performance.<br>
These patterns give you both — and make you more reliable on the way.
</div>
</v-click>

<!--
[DIAGRAM] The 2x3 table (patterns x pillars). Consider color-coding columns by pillar: Cost = ValkeyBlue, Performance = ValkeyPurple, Reliability = ValkeyPink.
[ANIM]
  - Table draws in row by row, or column by column (column-by-column reinforces "three pillars").
  - Highlight each column header as you speak to it.
  - Final line fades in and gets a subtle glow — this is the money quote of the talk.

SPEAKER NOTES:
Walk the three columns. Cost: stop paying for repeated work. Performance: memory beats disk, a cache hit beats an LLM call. Reliability: a cache is also a shock absorber — when the DB spikes or the model throttles, the cache keeps serving. Close with the one-liner (on the last click): "Usually you trade cost against performance. These give you both, and make you more reliable on the way." That's the sentence you want them to tweet.
Time check: ~21:00
-->

---

# Apply it this afternoon

<div class="grid grid-cols-2 gap-8 mt-6">
<v-click>
<div class="p-6 rounded-lg" style="background:#30176E">
<div class="text-2xl font-bold" style="color:#FFFDFA">1 · Start with the database</div>
<div class="mt-3" style="color:#30176E">
Find your most-read, least-changed data. Put Valkey in front, set a TTL, measure the drop in DB load. Low-risk, shippable this week.
</div>
</div>
</v-click>
<v-click>
<div class="p-6 rounded-lg" style="background:#6983FF">
<div class="text-2xl font-bold" style="color:#1A2026">2 · Then your AI features</div>
<div class="mt-3" style="color:#1A2026">
Got an LLM feature with repetitive prompts? Prototype a semantic cache. Start conservative on the threshold, measure hit rate + quality, tune.
</div>
</div>
</v-click>
</div>

<v-click>
<div class="mt-8 text-center text-xl" style="color:#30176E">
Both patterns share one shape: a cheap, fast layer in front of an expensive one, absorbing work you'd otherwise pay for twice.
</div>
</v-click>

<!--
[DIAGRAM] Two action cards side by side. Optional: a tiny "this week" calendar chip on card 1 and a "prototype" beaker chip on card 2.
[ANIM] Cards reveal one at a time. Final shared-shape line fades in and, if you want a nice callback, briefly re-show the generic "cheap layer in front of expensive layer" glyph from slide 2.

SPEAKER NOTES:
Make it concrete and low-pressure. Card 1 is the safe first step everyone can do this week. Card 2 is the higher-upside experiment. Then unify: it's ONE idea applied twice. Reinforce the through-line so they remember the shape, not just two disconnected tricks.
Time check: ~23:00
-->

---

# Resources & thank you

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

- **valkey.io** — project, docs, downloads
- Open source, community-driven, under the **Linux Foundation**
- Run it locally or use a managed option
- Put it in front of **one read path** today

</div>
<div class="text-lg" style="color:#30176E">

<div class="text-2xl mb-4" style="color:#6983FF">Roberto Luna Rojas</div>
Sr. Developer Advocate, Valkey @ AWS

<div class="mt-6 text-xl" style="color:#30176E">
"Well-Architected on a budget isn't about doing less. It's about not paying twice for the same work. Valkey is how you stop."
</div>

</div>
</div>

<!--
[DIAGRAM] Left: resource list with valkey.io prominent + a QR code to valkey.io (or to your slides/repo). Right: speaker contact + the closing quote. Valkey logo + AWS Community Day Argentina lockup.
[ANIM] QR code pops in (scale). Closing quote fades in last and holds. Keep this slide up during Q&A.

SPEAKER NOTES:
Close on the quote — say it, then stop talking (let silence land it). Point them at valkey.io and the QR. Invite them to try the database pattern first because it's the low-risk win. Then open for Q&A. Have a backup answer ready for the most likely question: "how do you handle stale semantic-cache answers?" (answer: threshold tuning + TTL on cached answers + periodic eviction).
Time check: ~25:00, then Q&A
-->
