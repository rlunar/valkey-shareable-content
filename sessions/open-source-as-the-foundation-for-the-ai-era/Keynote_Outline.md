# Keynote Outline: Open Source as the Foundation for the AI Era

**Speaker:** Roberto Luna Rojas, Sr. Developer Advocate (Valkey), AWS **Event:** AWS Community Day — Curitiba/PR (Aldeia Estação), Sep 19, 2026 **Slot:** Closing keynote, 16:45–17:30 (45 min, ~40 min talk + 5 min Q&A/CTA) **Audience:** Mixed-level Brazilian developers (beginner to expert) **Language:** English narration with Portuguese key lines at emotional beats **Goal:** Motivational. Rally the whole room to help shape the future of AI by contributing to the open source projects at every layer of the stack. Valkey is the speaker's home, but the talk champions the entire stack.

---

## Narrative Arc

Hook (career door OSS opened) → why AI must be open to be trusted (OpenSSL analogy) → AI's real foundation is open source, at every layer → the pyramid (Linux → K8s → data → AI apps) → how the layers work together (semantic caching, agentic path) → what this means for YOUR career → concrete on-ramps at EVERY layer → call to action: shape the future of AI.

---

## The Master Visual: The Pyramid

Recurring spine of the talk. Built bottom-up:

- **Foundation:** Linux
- **Orchestration:** Kubernetes
- **Data / State:** Valkey · OpenSearch · PostgreSQL
- **Application / AI:** PyTorch (train) · vLLM (inference) · Strands (agents) Show it once in full, then highlight each tier as we discuss it.

---

### Act 1 — Hook & Frame (~5 min, 16:45–16:50)

- **Open personal:** the moment open source opened a career door (PLACEHOLDER — real story to be added).
- **Reframe:** everyone talks about the models. The real story is the open source stack underneath, and it's built by people, not companies alone.
- **Thesis (PT):** *"A IA não roda em mágica. Roda em código aberto."*
- **The invitation, stated early:** the future of AI is being built in the open, right now, and there's a place in it for everyone in this room.
- **Promise:** by the end you'll see the whole stack, and you'll know exactly where you can jump in.

### Act 2 — Why AI Has to Be Open to Be Trusted (~6 min, NEW)

- The "why open source at all" argument, set up before the "what".
- **The OpenSSL/TLS analogy (anchor):** you trust TLS because OpenSSL is open and auditable. Heartbleed (2014) got fixed fast *because* the code was open. You wouldn't trust a closed black box with your bank password.
- **PT beat:** *"Não confiaríamos no TLS se o OpenSSL fosse fechado."*
- AI now makes real decisions (loans, medical info, what kids read). A black box asks for trust on a vendor's promise, and that's just hope.
- **Trust needs three things open:** open source code (see how it works), open-weight models (inspect/run it yourself), open data where possible (know what it learned).
- **Honest caveat:** fully open training data is the hardest part (licensing, privacy, scale). Frame as direction, not solved.
- **PT beat:** *"Só podemos confiar na IA se ela for aberta."*

### Act 3 — The Foundation of the AI Era Is Open Source (~7 min)

- Show the **pyramid diagram** in full.
- Walk it bottom to top: Linux is the ground. Kubernetes schedules and scales. The data layer (Valkey, OpenSearch, PostgreSQL) holds memory, vectors, search, and durable state. The AI layer (PyTorch, vLLM, Strands) trains, serves, and builds.
- Key point: no AI app exists without this whole pyramid. It's ALL open source, top to bottom.
- **PT beat:** *"Se você constrói para a nuvem, você já constrói sobre código aberto."*

### Act 4 — How the Layers Work Together (~9 min)

- **Semantic caching** (show the **semantic-cache diagram**): the pattern that makes AI affordable.- Two concrete examples: an **FAQ / support bot** (same 200 questions, asked thousands of ways — answer once, serve from cache) and a **recommendation system** (reuse computed results for near-matches).
- The payoff: up to 86% lower inference cost on repetitive workloads.
- **The agentic data path** (show the **agent-path diagram**): a Strands agent surrounded by the OSS primitives it calls — semantic cache (Valkey), memory (Valkey), retrieval (Valkey + OpenSearch), inference (vLLM), durable state (PostgreSQL).
- Honest cost framing: 86% on inference (semantic caching), up to 55% on database cost (caching frequently accessed data). Two different bills, same pattern: open source takes the expensive thing and makes it cheap.

### Act 5 — What This Means for YOUR Career (~6 min)

- The motivational core.
- OSS is the one place your work is public, permanent, and portable. Your commits follow you across every job.
- You don't need permission or a title. You need a first pull request.
- Every layer of that pyramid was built by people who started exactly where you are.
- **PT beat:** *"Seu próximo emprego pode começar com um único pull request."*
- **PT beat:** *"Os mantenedores de amanhã são os contribuidores de primeira vez de hoje."*

### Act 6 — Where to Jump In: On-Ramps at Every Layer (~7 min)

- The whole point: whatever you love, there's a layer for you.
- **Linux:** kernel newbies, documentation, drivers; the kernel mentorship program and good-first-issue trackers.
- **Kubernetes:** SIGs (Special Interest Groups), docs, the `good first issue` label, K8s mentoring cohorts.
- **Data layer:**- **Valkey:** `good first issue` on GitHub, docs, tests, client libraries, community chat.
- **OpenSearch:** GitHub issues, plugins, docs, the community forum.
- **PostgreSQL:** TODO list on the wiki, hackers mailing list, patch review, docs.
- **AI layer:**- **PyTorch:** `good first issue`, docs, the PyTorch forums, module maintainers.
- **vLLM:** fast-moving GitHub repo, good-first-issues, model support, docs.
- **Strands:** open source SDK on GitHub, examples, integrations, docs.
- The rule: pick ONE project at the layer you love. Ship one small thing this month.
- **PT beat:** *"Comece pequeno. Comece esta semana."*

### Act 7 — Close: Shape the Future of AI (~4 min)

- Tie back: the future of AI is being written in open source, at every layer, and it needs more hands.
- Three asks: (1) pick a project at any layer, (2) ship one contribution this month, (3) bring one other person in.
- Offer help: find me after, I'll help you land your first PR, at any layer, not just Valkey.
- **Closing line (PT):** *"O futuro da IA é aberto. E ele precisa de você."*

### Q&A / Buffer (~5 min, 17:25–17:30)

---

## Diagrams (embedded in the deck)

1. **Pyramid** — the master stack visual (Linux → K8s → data → AI). Recurring spine.
2. **Semantic caching flow** — user → embed → Valkey lookup → hit/miss, plus FAQ-bot and recommendation-system examples.
3. **Agentic data path** — a Strands FAQ bot traced through the 5 OSS primitives (semantic cache → memory → retrieval → inference → durable state), with the concrete support-question example at each step.

