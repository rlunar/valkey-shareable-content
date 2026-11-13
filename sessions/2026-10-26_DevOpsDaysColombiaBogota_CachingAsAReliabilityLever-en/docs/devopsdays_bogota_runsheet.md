# Speaker run-sheet — Caching as a Reliability Lever

**DevOpsDays Bogotá 2026 · Fri Oct 23 · Centro de Convenciones Compensar**
Roberto Luna Rojas · Valkey project, AWS · 30 min talk, L300

---

## At a glance

| Block | Time | Minutes | Slides |
|-------|------|---------|--------|
| Open + who this is for | 0:00–3:00 | 3 | Cover, Who this is for |
| The problem + Amazon retail cascade | 3:00–9:00 | 6 | Problem, Why it degrades, Cascade, Pool math, Mental model |
| Part 1 — Query caching | 9:00–15:00 | 6 | Cache-aside, R/W-through, Where it wins, TTL, Failure modes |
| Part 2 — Semantic caching | 15:00–21:00 | 6 | How it works, Valkey vector store, Threshold |
| Part 3 — Reliability + numbers | 21:00–27:00 | 6 | Multi-AZ, What to watch, Numbers, Both case studies, Synthesis |
| Takeaways + Monday-morning close | 27:00–30:00 | 3 | Takeaways, Start Monday morning |

Total 30 min. Leave 2 min of the Part 3 block as buffer if you are running long; the case studies compress well, the threshold table does not.

---

## Cue reminders (where the demos/animations land)

- **Cascade slide (3:00):** walk DOWN the 6 stages one at a time. At stage 5, trace the feedback arc back to stage 3 with your hand. Reveal the WITH-CACHE panel last, as the resolution.
- **Pool math (5:00):** reveal the rows one at a time. Let the red **320** sit a beat after the **32** before you speak. The point: only service time changed.
- **Semantic flow (16:00):** build left to right, then the HIT (blue) and MISS (red) branches. Say the embedding model must be identical for writes and reads.
- **Threshold table (24:00):** reveal rows top to bottom. Pause on **0.75** (the knee), then let **0.50** land as the accuracy cliff.

---

## Numbers to say out loud (keep them exact)

- Up to **55%** DB cost savings for frequently accessed data.
- Pool math: **32** in-flight healthy, **320** when service time goes 4 ms → 40 ms, against a pool of **100**.
- Amazon Ads: **45%+** lower infra cost, **12%** higher throughput, zero downtime.
- Bedrock semantic cache: up to **86%** cost cut, **88%** latency reduction. Sweet spot **0.75** = 86% savings at 91% accuracy.

---

## The close (say it warm, then stop)

Start Monday morning:
1. **Find the repetition** — your hottest read or most-repeated prompt. One path, measured.
2. **Add the tier** — query cache for reads, semantic for prompts. A TTL you can defend.
3. **Watch hit ratio vs cost** — prove the savings and the p99 drop before you expand. Honest numbers only.

Last line: *"Same lever, two workloads, one discipline: measure hit ratio against cost, and bound the staleness. Thank you."*

---

## If asked (quick Q&A anchors)

- **"Which cache?"** Valkey, multi-AZ, fail open. One tier for both the query cache and the semantic vector index.
- **"Is 55% guaranteed?"** No. It is a ceiling you earn through hit ratio. Below break-even, caching is overhead.
- **"Isn't semantic caching risky?"** Yes if the threshold is loose. That is why you tune against labeled pairs and never cache personalized answers unkeyed.
- **"Redis?"** Valkey is a drop-in replacement, no code changes. Amazon Ads did it with zero downtime.

---

## Pre-talk checklist

- [ ] Laptop + presenter mode (speaker notes visible), clicker tested
- [ ] Deck exported as backup PDF on a USB stick (AV fallback)
- [ ] Water, timer visible, phone on Do Not Disturb
- [ ] First line ready cold: *"Your database is doing the same expensive work over and over."*
