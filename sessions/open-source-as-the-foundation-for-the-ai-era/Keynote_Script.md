# Keynote Script: Open Source as the Foundation for the AI Era
### From Core Infrastructure to Agentic Applications

**Speaker:** Roberto Luna Rojas — Sr. Developer Advocate (Valkey), AWS
**Event:** AWS Community Day Curitiba — Sep 19, 2026, closing keynote 16:45–17:30
**Format:** ~40 min spoken + Q&A. English narration, Portuguese key lines marked **[PT]**.

> Delivery notes: The **[PT]** lines are the emotional beats. Say them in Portuguese, let them land, then continue in English. Pause markers are `//`. Diagram cues marked **[DIAGRAM]**. This talk is a rally for the whole open source AI stack, not just Valkey.

---

## ACT 1 — HOOK & FRAME (~5 min)

Good afternoon, Curitiba. // It's the end of a long day, you've had a lot of coffee, and I'm the last thing standing between you and the after-party. So let me make it worth your time.

I want to start with something personal. Years ago I was a developer like many of you in this room. No special title, no platform, no audience. What I had was access to open source. I could read the code that ran the internet, and I could change it.

Here's the moment it became real for me. Back in 2017 I started contributing to Redis, the open source project, in my spare time. Nothing dramatic at first, just fixing things I ran into, improving what I used every day. But that work was public, it had my name on it, and people noticed. That open source work got me promoted to Staff engineer. And in 2020, it opened the door to a job here at AWS. I did not have a connection or a perfect resume. I had commits anyone could read. That is the door open source opened for me, and it is the same door I want to open for every one of you today.

So when everyone tells you the AI revolution is about the models, I want to offer a different view. The models get the headlines. But they don't run on magic.

**[PT]** *A IA não roda em mágica. Roda em código aberto.*

They run on open source. And here's the part that matters for every single person in this room: that open source is built by people. Not just companies. People who decided to show up and contribute. The future of AI is being written right now, in the open, and there is a place in it for you.

By the time I walk off this stage, you'll see the whole stack that AI is built on, and you'll know exactly where you can jump in. Whatever you love, there's a layer for you.

---

## ACT 2 — WHY AI HAS TO BE OPEN TO BE TRUSTED (~6 min)

Before I show you the stack, I want to answer a question you should be asking: why does any of this need to be open source at all? The models work whether I can see them or not. Right?

Here's why it matters. Think about TLS, the lock icon in your browser, the thing that encrypts your bank login. You trust it every day. And the reason you can trust it is OpenSSL, the open source library that does the encrypting. Anyone can read it. Anyone can audit it. When Heartbleed, a serious bug, was found in 2014, the whole world could see it, and it got fixed fast, precisely because the code was open. Now imagine if OpenSSL had been a closed black box owned by one company. Would you trust it with your bank password on nothing but their word? Of course not.

**[PT]** *Não confiaríamos no TLS se o OpenSSL fosse fechado.*

We wouldn't trust TLS if OpenSSL were closed. So why would we trust AI that's a black box?

And openness doesn't just let us audit, it lets us fix, together. Look at what happened with OpenClaw. It was an open source AI project that went viral almost overnight. It was not perfect. It had real security flaws. But because it was open, the community could see those flaws and work together to fix them. And here at AWS, that same openness let us build a security-first version, KiroCrew. That is the open source loop working exactly as it should: something imperfect gets built in the open, and everyone makes it better. A closed black box gives you none of that. You just have to hope the vendor noticed.


AI is making decisions now. Who gets a loan. What medical information you see. What your kids read. If we can't inspect it, we're trusting it on a vendor's promise. And trust on a promise is not trust, it's hope.

Real trust in AI comes from three things being open. Open source code, so you can see how the system works. Open weight models, so you can inspect and run the model yourself instead of renting a mystery. And open data where possible, so you can ask what the model actually learned from.

I'll be honest with you about that last one. Fully open training data is the hardest part. Licensing, privacy, and scale make it genuinely difficult, and a lot of great open-weight models are not fully open-data. So I'm not going to stand here and pretend it's solved. But the direction is what matters: the more open the code, the weights, and the data, the more we can audit, reproduce, and actually trust what these systems do.

**[PT]** *Só podemos confiar na IA se ela for aberta.*

We can only trust AI if it's open. That's not idealism. It's the same lesson OpenSSL taught us twenty years ago. And it's why the open source stack I'm about to show you isn't just cheaper or faster. It's the only foundation we can actually trust.

---

## ACT 3 — THE FOUNDATION OF THE AI ERA IS OPEN SOURCE (~7 min)

Let me show you what I mean by "the whole stack."

**[DIAGRAM: pyramid — reveal in full]**

This is the pyramid that every AI application stands on. Let's walk it from the bottom up, because the bottom is where it all starts.

At the foundation: Linux. The operating system running essentially every server, every container, every cloud instance your AI touches. None of this exists without it.

One layer up: Kubernetes. It schedules and scales all those containers. When your AI app needs to grow from one user to a million, this is the layer that makes it possible.

Above that, the data layer, and this is where state lives. Valkey holds the fast memory and the vectors. OpenSearch handles search and retrieval at scale. PostgreSQL holds the durable, relational truth. Memory, vectors, search, durable state, the things every application needs to remember anything.

And at the top, the AI layer. PyTorch to train the models. vLLM to serve them, to run inference fast and cheap. And Strands to build agents, AWS's open source SDK for turning a model into something that can reason and act.

Here's the point I want you to hold onto. Every single layer of this pyramid is open source. Top to bottom. There is no proprietary secret holding it up.

**[PT]** *Se você constrói para a nuvem, você já constrói sobre código aberto.*

If you build for the cloud, you already build on open source. You just might not have noticed how much.

---

## ACT 4 — HOW THE LAYERS WORK TOGETHER (~9 min)

A pyramid is nice, but let me show you these layers actually working together, because that's where it gets exciting, and where the economics of AI get decided.

Let's start with the pattern that makes AI affordable at all: semantic caching.

**[DIAGRAM: semantic-cache flow]**

Here's the idea. When a question comes in, you don't call the expensive model right away. First you turn the question into a vector, an embedding, and you ask the data layer: have I seen anything like this before? That lookup runs on Valkey. If there's a close enough match, you serve the answer you already computed, in milliseconds, with no model call and no token cost. That's a cache hit. If it's a genuinely new question, that's a miss: you call the model once, then store the answer so the next person who asks gets it for free.

Where does this pay off? Two examples you'll recognize.

First, an FAQ or support bot. Thousands of users ask the same two hundred questions, just worded differently. "How do I reset my password?" "I forgot my password, help." "Password reset?" Same question, same answer. Answer it once, and semantic caching serves everyone else near-instantly.

Second, a recommendation system. Similar users, in similar contexts, get similar recommendations. Instead of recomputing the whole thing every time, you reuse the result for the near-matches. Same pattern, different shape.

And the savings are real. On repetitive workloads like these, semantic caching can cut LLM inference cost by up to 86%, with latency dropping just as hard.

**[PT]** *Cache semântico pode cortar até 86% do custo de inferência.*

Semantic caching can cut up to 86% of your inference cost. That's not a rounding error. That's the difference between an AI feature you can afford to ship and one you can't.

Now let me show you the whole picture of a modern agent.

**[DIAGRAM: agentic data path]**

In the middle is a Strands agent. Around it are the open source primitives it leans on, every one of them from that pyramid. Semantic caching on Valkey, so it doesn't pay twice. Conversation memory on Valkey, so it remembers what you said a turn ago. Retrieval, the R in RAG, on Valkey and OpenSearch together, vectors plus full-text search. Inference on vLLM, which can even offload its KV cache to Valkey so work done on one machine speeds up the whole fleet. And durable state on PostgreSQL, the source of truth.

That's the whole picture. Strands writes the agent. The open source data layer makes it fast and affordable.

One more honest word on cost. The 86% I mentioned is inference. Separately, putting an open source cache in front of your database can cut database cost by up to 55% for frequently accessed data. Two different bills, one pattern: open source takes the expensive thing and makes it cheap. And every dollar you save on infrastructure is a dollar you can spend on innovation.

---

## ACT 5 — WHAT THIS MEANS FOR YOUR CAREER (~6 min)

Okay. I've shown you the stack. Now let me tell you why it's the best news you'll hear all day, especially if you're early in your career.

Think about where your work lives. Most of what you build at a job is private. It sits behind a login, and when you leave, you leave it behind. You can talk about it in an interview, but you can't show it.

Open source is the opposite. Your work is public, it's permanent, and it's portable. Every commit you make has your name on it. It follows you to your next job, and the one after that. A recruiter can read it. A maintainer can vouch for you. That's a career asset no NDA can take away.

And you don't need permission to start. You don't need a senior title. You don't need someone to pick you. You need one pull request.

**[PT]** *Seu próximo emprego pode começar com um único pull request.*

Your next job can start with a single pull request. And look back at that pyramid. Every layer of it, Linux, Kubernetes, Valkey, OpenSearch, Postgres, PyTorch, vLLM, Strands, every one was built by people who started exactly where you are right now. First-time contributors who just showed up.

**[PT]** *Os mantenedores de amanhã são os contribuidores de primeira vez de hoje.*

The maintainers of tomorrow are the first-time contributors of today. That could be someone in this room. It could be you.

---

## ACT 6 — WHERE TO JUMP IN: ON-RAMPS AT EVERY LAYER (~7 min)

So let's make this real. I don't want you to leave with inspiration and no map. Here's where to jump in, and here's the beautiful part: whatever you love, there's a layer for you.

**[DIAGRAM: pyramid — highlight each layer as you go]**

Love operating systems and low-level code? The foundation. Linux. The kernel has a mentorship program built for newcomers, and there's endless work in documentation and drivers. Start there.

Love infrastructure and scale? Orchestration. Kubernetes. It's organized into Special Interest Groups, SIGs, and they mark issues with a `good first issue` label specifically for people like you. There are mentoring cohorts that walk you through your first contribution.

Love data and performance? The data layer. This is my home, so I'll be specific. Valkey: go to GitHub, find the `good first issue` label, and the easiest doors in are docs, tests, and the client libraries. Pick a language you know and improve its client. OpenSearch: GitHub issues, plugins, and a friendly community forum. PostgreSQL: it lives on mailing lists, the TODO list on the wiki and the hackers list are the front door, and reviewing someone else's patch counts as contributing.

Love AI and models directly? The top layer. PyTorch has good-first-issues and active forums. vLLM moves fast and always needs help with model support and docs. And Strands, the agent SDK, is open on GitHub and needs examples, integrations, and documentation.

That's seven, eight projects across four layers. You do not have to contribute to all of them. Here's my one rule.

Pick ONE project, at the layer you love, and ship ONE small thing this month.

**[PT]** *Comece pequeno. Comece esta semana.*

Start small. Start this week. Small and shipped beats big and imaginary every single time.

---

## ACT 7 — CLOSE: SHAPE THE FUTURE OF AI (~4 min)

Let me bring this back to where I started.

Open source built my career. It gave a developer with no title and no platform a way to do work that mattered and put his name on it. And today, that same open source, every layer of that pyramid, is the foundation the entire AI era is being built on.

But a foundation isn't finished. It's being poured right now, by people. And it needs more hands.

So I'm going to leave you with three asks.

One: pick a project. Any layer of the pyramid, whatever you love.
Two: ship one contribution this month. One issue, one doc fix, one review.
Three: bring one other person in. Find someone who thinks they're not ready, and prove them wrong.

And if you don't know where to start, come find me after this talk. I will personally help you land your first pull request, at any layer, not just my own. I mean that.

Because here's what I know for sure. The future of AI is not going to be handed to us. It's going to be built, in the open, by the people who show up.

**[PT]** *O futuro da IA é aberto. E ele precisa de você.*

The future of AI is open. And it needs you.

Thank you, Curitiba. // *Obrigado.*

---

## APPENDIX — Delivery Cheat Sheet

**Portuguese key lines, in order:**
1. *A IA não roda em mágica. Roda em código aberto.* (AI doesn't run on magic. It runs on open source.)
2. *Se você constrói para a nuvem, você já constrói sobre código aberto.* (If you build for the cloud, you already build on open source.)
3. *Não confiaríamos no TLS se o OpenSSL fosse fechado.* (We wouldn't trust TLS if OpenSSL were closed.)
4. *Só podemos confiar na IA se ela for aberta.* (We can only trust AI if it's open.)
5. *Cache semântico pode cortar até 86% do custo de inferência.* (Semantic caching can cut up to 86% of inference cost.)
6. *Seu próximo emprego pode começar com um único pull request.* (Your next job can start with a single pull request.)
7. *Os mantenedores de amanhã são os contribuidores de primeira vez de hoje.* (The maintainers of tomorrow are the first-time contributors of today.)
8. *Comece pequeno. Comece esta semana.* (Start small. Start this week.)
9. *O futuro da IA é aberto. E ele precisa de você.* (The future of AI is open. And it needs you.)

**Diagram cues:**
- Act 2: pyramid, full reveal.
- Act 3: semantic-cache flow, then agentic data path.
- Act 5: pyramid again, highlight each layer as you name its on-ramps.

**Things to verify / swap before you deliver:**
- Swap in your real career-door anecdote in Act 1.
- The OpenSSL/Heartbleed reference (2014) is real and load-bearing for the trust argument. Keep the 'open data is the hardest part' honesty caveat in.
- [VERIFY before stage] OpenClaw / KiroCrew example: confirm the project names, the security-flaw specifics, and that KiroCrew is accurately described as a security-first version. This is speaker-owned; the audience may look it up live.
- The 86% inference figure is an AWS ElastiCache + Bedrock semantic-caching benchmark (Nov 2025), framed as "up to 86%". The 55% is database cost for frequently accessed data. Keep them distinct.
- Confirm the current contribution entry points (labels, mailing lists, mentorship programs) for each project before you put URLs on slides.

**Timing check:** 5 + 6 + 7 + 9 + 6 + 7 + 4 = 44 min talk. Tighten Acts 4/6 by ~2 min each for a hard 40, or trim on stage.
