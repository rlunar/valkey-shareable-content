# Speaker Script

**Open Source como Base para a Era da IA: da Infraestrutura Essencial às Aplicações Agênticas**

Closing keynote for AWS Community Day Curitiba, September 19, 2026. About 43 minutes of talk plus a short Q&A inside the 45-minute slot, in English with Portuguese lines at the emotional beats.

This file mirrors the speaker notes in `slides.md`, one section per slide, in presentation order. In every section the text above the rule is what is said on stage, and `[click]` marks the moment the next reveal is triggered. The bullets below the rule are delivery comments, evidence caveats, and the cumulative time check; they are not spoken. `slides.md` is the canonical source: when its notes change, update this file to match.

## 1. Open Source como Base para a Era da IA: da Infraestrutura Essencial às Aplicações Agênticas

*Slide 1 of 26 · cover · no clicks*

Boa tarde, Curitiba! Tudo bem?

I am from Mexico, so before anything else, let me say the one thing that will make us friends for the next forty minutes: Pelé is the greatest football player in history. Good. Now we can talk about anything.

It’s the end of a long day, you’ve had a lot of coffee, and I’m the last thing standing between you and the after-party. So let me make it worth your time.

My name is Roberto Luna Rojas. I’m a Sr Open Source Developer Advocate at AWS. I work on the Valkey open source project, and I’m passionate about databases and distributed systems. I grew up in a small town in Mexico, and open source helped me become a global speaker.

This is not a product keynote. It’s a rally for the open source stack beneath AI, and for the people in this room who can help build it.

***

- Open in Portuguese and wait for the room to answer before switching to English.
- Let the Pelé line land; it is the icebreaker, so give the reaction a beat before the after-party joke.
- Time check: 0:45.

## 2. My résumé said less than my commits did.

*Slide 2 of 26 · route `/career-door` · 3 clicks*

I want to start with something personal. My open source journey started back in 2000. For a long time I was mainly a supporter, not a contributor. I made a living helping customers move away from commercial, closed-source software to open source alternatives. I was a developer like many of you in this room. No special title, no platform, no audience. What I had was access to open source. I could read the code that ran the internet, and I could change it.

[click] Then, in 2017, I stopped only supporting and started contributing. Small fixes to Redis in my spare time. Nothing dramatic at first, just fixing things I ran into, improving what I used every day. But that work was public, and it had my name on it.

[click] People noticed. That open source work got me promoted to Staff engineer. It was portable proof of how I thought, how I collaborated, and how I shipped.

[click] And in 2020, it opened the door to a job here at AWS. I did not have a connection or a perfect résumé. I had commits anyone could read. That is the door open source opened for me, and it’s the same door I want to open for every one of you today.

***

- The 2000 supporter era is spoken before the first click; the timeline on the slide starts at 2017, when the contributions began.
- Deliver plainly. This is the real anecdote; do not inflate the causal claim beyond lived experience.
- Time check: 3:00.

## 3. A IA não roda em mágica. Roda em código aberto.

*Slide 3 of 26 · route `/not-magic` · no clicks*

So when everyone tells you the AI revolution is about the models, I want to offer a different view. The models get the headlines. But they don’t run on magic.

A IA não roda em mágica. Roda em código aberto.

They run on open source. And here’s the part that matters for every single person in this room: that open source is built by people. Not just companies. People who decided to show up and contribute.

***

- Say the Portuguese line slowly and pause before the English.
- Time check: 4:15.

## 4. There is a place in this stack for you.

*Slide 4 of 26 · route `/promise` · 3 clicks*

The future of AI is being written right now, in the open, and there is a place in it for you. So here is my promise.

[click] You’ll see the whole stack that AI is built on. From Linux all the way up to agents, not only the model at the top.

[click] You’ll understand how the layers work together: trust, data, inference, memory, retrieval, and durable state.

[click] And you’ll know exactly where you can jump in. One project, one small contribution, one first pull request. Whatever you love, there’s a layer for you.

***

- State the invitation early; the three asks at the close pay off these three promises.
- Time check: 5:00.

## 5. You trust the lock because the lock can be inspected.

*Slide 5 of 26 · route `/trust-anchor` · 3 clicks*

Before I show you the stack, I want to answer a question you should be asking: why does any of this need to be open source at all? The models work whether I can see them or not. Right?

Here’s why it matters.

[click] Think about TLS, the lock icon in your browser, the thing that encrypts your bank login. You trust it every day.

[click] And the reason you can trust it is OpenSSL, the open source library that does the encrypting. Anyone can read it. Anyone can audit it.

[click] When Heartbleed, a serious bug, was found in 2014, the whole world could see it. Openness did not make OpenSSL perfect. But it made the problem visible, and it let researchers, maintainers, and operators coordinate the fix and share it. Now imagine OpenSSL had been a closed black box owned by one company. Would you trust it with your bank password on nothing but their word? Of course not.

Não confiaríamos no TLS se o OpenSSL fosse fechado.

We wouldn’t trust TLS if OpenSSL were closed. So why would we accept a black box making consequential AI decisions?

***

- Pause after the Portuguese line.
- Keep Heartbleed at visibility and shared remediation; do not say “fixed fast because open” as a universal law.
- Reference: heartbleed.com and openssl.org/news/secadv/20140407.txt.
- Time check: 7:00.

## 6. Open the system at three different boundaries.

*Slide 6 of 26 · route `/three-kinds-of-open` · 3 clicks*

AI is making decisions now. Who gets a loan. What medical information you see. What your kids read. If we can’t inspect it, we’re trusting it on a vendor’s promise. And trust on a promise is not trust, it’s hope.

Real trust in AI comes from three things being open.

[click] Open source code, so you can see how the system works: the orchestration, the safety controls, the retrieval, the memory, the application logic around the model.

[click] Open-weight models, so you can inspect, evaluate, and run the model yourself instead of renting a mystery.

[click] And open data, where possible, so you can ask what the model actually learned from. I’ll be honest with you about that last one. Fully open training data is the hardest part. Licensing, privacy, and scale make it genuinely difficult, and a lot of great open-weight models are not fully open-data. So I’m not going to stand here and pretend it’s solved. But the direction is what matters: the more open the code, the weights, and the data, the more we can audit, reproduce, and actually trust what these systems do.

Só podemos confiar na IA se ela for aberta.

We can only trust AI if it’s open. That’s not idealism. It’s the same lesson OpenSSL already taught us.

***

- Pause after the Portuguese line.
- This is a direction and an accountability standard, not a claim that openness alone guarantees safety.
- Time check: 9:30.

## 7. Openness turns flaws into shared work.

*Slide 7 of 26 · route `/open-loop` · 3 clicks*

And openness doesn’t just let us audit. It lets us fix, together. Openness does not eliminate flaws. It changes who can see them, who can help repair them, and who benefits from the repair.

[click] See. Independent people can inspect what the system actually does.

[click] Fix. A problem becomes a reproducible issue and a reviewable patch, and maintainers and users work on it together.

[click] Improve. The repair becomes reusable knowledge for everyone downstream.

That is the open source loop working exactly as it should: something imperfect gets built in the open, and everyone makes it better. A closed black box gives you none of that. You just have to hope the owner noticed.

***

- The OpenClaw and KiroCrew examples follow on the next two slides; this slide sets up the loop they illustrate.
- Time check: 10:30.

## 8. Not perfect. But it started a conversation.

*Slide 8 of 26 · route `/openclaw` · 3 clicks*

Let me show you this loop in practice, with a project most of you saw on your feeds this year.

OpenClaw. An open source personal AI assistant that runs on your own devices. Started by one developer, Peter Steinberger, at the end of 2025.

[click] It went viral almost overnight. Zero to three hundred and forty-six thousand GitHub stars in under five months. It passed React, which took more than ten years to reach two hundred and fifty thousand.

[click] And it was not perfect. It had real security flaws. But because the code was open, the community could see those flaws, report them, and work on them together. That is the loop from the last slide, running in public.

[click] And here is the door part of the story. In February 2026, the creator of OpenClaw joined OpenAI, and the project moved into a foundation so it keeps living as open source. One person, one repository, in the open.

It was not perfect. It started a conversation. That is what open source does.

***

- The numbers are on the chart with their source; star counts keep growing, so do not quote today’s total unless you checked it that morning.
- Keep the security point factual: flaws were found and fixed in the open. Do not name specific CVEs unless you have verified them.
- Sources: github.com/openclaw/openclaw, star-history.com, TechCrunch (February 15, 2026).
- Time check: 11:45.

## 9. KiroCrew: the same idea, rebuilt security first.

*Slide 9 of 26 · route `/kirocrew` · no clicks*

And the conversation did not stop at OpenClaw.

Inside AWS, that same openness let us build our own take on the idea: KiroCrew. A security-first version of OpenClaw, built internally first, and then opened to the world on GitHub.

What you see here is a real KiroCrew session: an agent working through a pull request, with every change, every check, and the merge visible. Security first means that when the safety policy blocks a tool call, the session tells you, right there.

Something imperfect got built in the open. Someone else made it better, in the open. Everyone downstream benefits. That is the loop, closed.

***

- This is the speaker’s own framing of KiroCrew as a security-first take on OpenClaw; keep it to that framing unless you can cite a public statement.
- github.com/kirodotdev/KiroCrew, Apache-2.0, kiro.dev/crew.
- Time check: 12:45.

## 10. Valkey: open source, high performance, forever.

*Slide 10 of 26 · route `/what-is-valkey` · 3 clicks*

One more stop before the whole stack. Let me introduce my home in it. What is Valkey?

[click] Valkey is an open source, high-performance key/value datastore. It handles caching, the classic workload. It handles message queues. And it can act as a primary database.

[click] It is BSD licensed, and the project is backed by the Linux Foundation, which means it will remain open source forever. Nobody can change that license on you.

[click] And here is the community part. In March 2024, Redis changed its license. Eight days later, the community launched Valkey: vendor neutral, under the Linux Foundation. Today the Technical Steering Committee has maintainers from AWS, Google Cloud, Oracle, Alibaba, Tencent, Ericsson, Percona, and Apple®. Eight companies, one project, no single owner.

***

- The icons carry the description; name the workloads instead of reading the tiles.
- The panel shows the seven permitted TSC affiliation logos from MAINTAINERS.md in github.com/valkey-io/valkey; Apple® is rendered as plain text because this presentation does not have permission to use the Apple logo.
- Dates: Redis relicensed on March 20, 2024; the Linux Foundation announced Valkey on March 28, 2024.
- Time check: 14:15.

## 11. Você vem pelo software. Você fica pela comunidade.

*Slide 11 of 26 · route `/community` · no clicks*

That is what those eight days taught me.

Você vem pelo software. Você fica pela comunidade.

You come for the software. You stay for the community. The code brought all of us to Valkey. The people are why we are still there.

***

- Pause after the Portuguese line before translating.
- Time check: 14:45.

## 12. The model is the smallest layer of the story.

*Slide 12 of 26 · route `/open-source-stack` · 4 clicks*

Let me show you what I mean by “the whole stack.” This is the pyramid that every AI application stands on. Let’s walk it from the bottom up, because the bottom is where it all starts.

[click] At the foundation: Linux. The operating system running essentially every server, every container, every cloud instance your AI touches. None of this exists without it.

[click] One layer up: Kubernetes. It schedules and scales all those containers. When your AI app needs to grow from one user to a million, this is the layer that makes it possible.

[click] Above that, the data layer, and this is where state lives. Valkey holds the fast memory and the vectors. OpenSearch handles search and retrieval at scale. PostgreSQL holds the durable, relational truth. Memory, vectors, search, durable state: the things every application needs to remember anything.

[click] And at the top, the AI layer. PyTorch to train the models. vLLM to serve them, to run inference fast and cheap. And Strands to build agents, AWS’s open source SDK for turning a model into something that can reason and act.

Here’s the point I want you to hold onto. Every single layer of this pyramid is open source. Top to bottom. There is no proprietary secret holding it up.

***

- Do not rush the reveal. The pyramid is the recurring spine of the talk and returns on the on-ramp slides.
- Time check: 18:45.

## 13. Se você constrói para a nuvem, você já constrói sobre código aberto.

*Slide 13 of 26 · route `/already-open` · no clicks*

Se você constrói para a nuvem, você já constrói sobre código aberto.

If you build for the cloud, you already build on open source. You just might not have noticed how much.

***

- Pause after the Portuguese line.
- The point is agency, not guilt.
- Time check: 20:15.

## 14. An exact-key cache sees strings. A semantic cache sees meaning.

*Slide 14 of 26 · route `/semantic-intuition` · 4 clicks*

A pyramid is nice, but let me show you these layers actually working together, because that’s where it gets exciting, and where the economics of AI get decided.

Think about an FAQ or support bot. Thousands of users ask the same two hundred questions, just worded differently.

[click] “How do I reset my password?”

[click] “I forgot my password. What now?”

[click] “Password reset steps, please.”

[click] Same question. Same answer. An exact-key cache sees three different strings. A semantic cache sees one intent. Answer it once, and serve everyone else near-instantly, as long as the context and the distance say the answer is safe to reuse.

Second example: a recommendation system. Similar users, in similar contexts, get similar recommendations. Instead of recomputing the whole thing every time, you reuse the result for the near-matches. Same pattern, different shape.

***

- Read each prompt aloud as it appears, so the audience hears the equivalence before you explain embeddings.
- Time check: 22:00.

## 15. The nearest safe answer becomes the fast path.

*Slide 15 of 26 · route `/semantic-cache` · 5 clicks*

Here’s how it works. When a question comes in, you don’t call the expensive model right away.

[click] First you turn the question into a vector, an embedding, a representation of its meaning.

[click] Then you ask the data layer: have I seen anything like this before? That lookup runs on Valkey Search, against the cached prompt vectors.

[click] If there’s a match within the distance threshold, and the context is compatible, you serve the answer you already computed. Milliseconds. No model call, no token cost. That’s a cache hit.

[click] If it’s a genuinely new question, that’s a miss. You call the model once.

[click] Then you store the embedding and the answer, with a TTL, so the next person who asks something close gets it for free.

One honest note. The embedding call still costs something. What you avoid is the much larger generation call. And similarity is a guardrail, not proof of correctness, which is why the threshold matters.

***

- Walk the trace; do not read every label on the diagram.
- Time check: 23:45.

## 16. On repetitive workloads, avoided calls change the economics.

*Slide 16 of 26 · route `/benchmark` · 3 clicks*

And the savings are real. This is one evaluation AWS published: about sixty-four thousand real chatbot queries, Titan Text Embeddings, Claude 3 Haiku, and one ElastiCache instance as the semantic cache.

[click] At a 0.75 similarity threshold, LLM cost dropped 86.3 percent.

[click] Average end-to-end latency dropped 88.3 percent.

[click] And the guardrail beside those numbers: 91.2 percent of the cached answers were correct for the user’s intent. That accuracy tradeoff belongs right next to the savings, not in the fine print.

Cache semântico pode cortar até 86% do custo de inferência.

Semantic caching can cut up to 86 percent of your inference cost. That’s not a rounding error. That’s the difference between an AI feature you can afford to ship and one you can’t.

***

- Emphasize “pode” and “até”. This is one evaluation, not a universal promise; results vary by model, data, threshold, and cache.
- Source: AWS Database Blog, “Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock” (63,796 queries, cache.r7g.large).
- Time check: 25:15.

## 17. An agent is a model surrounded by open source primitives.

*Slide 17 of 26 · route `/agentic-path` · 5 clicks*

Now let me show you the whole picture of a modern agent. In the middle is a Strands agent, a support assistant. Around it are the open source primitives it leans on, every one of them from that pyramid.

[click] Semantic cache on Valkey, so it doesn’t pay twice. Have we already answered this intent?

[click] Conversation memory on Valkey, so it remembers what you said a turn ago.

[click] Retrieval, the R in RAG, on Valkey and OpenSearch together: vectors plus full-text search to find the right knowledge.

[click] Inference on vLLM, fast model serving, and only when a new answer is actually needed.

[click] And durable state on PostgreSQL, the source of truth: tickets, policy, and outcomes that must persist.

That’s the whole picture. Strands writes the agent loop. The open source data layer makes it useful, fast, and affordable.

***

- vLLM can integrate with external KV-cache systems, but keep the spoken claim at “fast model serving” unless you have a verified reference to cite.
- Time check: 26:45.

## 18. Open source makes expensive repetition optional.

*Slide 18 of 26 · route `/two-bills` · 2 clicks*

One more honest word on cost, because these are two different bills.

[click] The 86 percent I mentioned is inference. It comes from the semantic-caching evaluation I just showed you.

[click] Separately, putting an open source cache in front of your database can cut database cost by up to 55 percent for frequently accessed data, when the hit rate is high enough to right-size the database underneath.

Two different bills, one pattern: open source takes the expensive thing and makes it cheap. And every dollar you save on infrastructure is a dollar you can spend on innovation. Just measure first. Benchmark your workload, check correctness, then make the capacity decision.

***

- Never combine the two percentages; they describe different workloads and different evidence.
- Time check: 27:45.

## 19. Your open source work can travel farther than your job title.

*Slide 19 of 26 · route `/career-value` · 3 clicks*

Okay. I’ve shown you the stack. Now let me tell you why it’s the best news you’ll hear all day, especially if you’re early in your career.

Think about where your work lives. Most of what you build at a job is private. It sits behind a login, and when you leave, you leave it behind. You can talk about it in an interview, but you can’t show it.

Open source is the opposite.

[click] Your work is public. People can inspect the actual work: the discussion, the diff, the review, the result. Not a résumé bullet.

[click] It’s permanent. Your contribution stays in the project’s history, with your name on it.

[click] And it’s portable. It follows you to your next job, and the one after that, across teams, companies, and countries. A recruiter can read it. A maintainer can vouch for you. That’s a career asset no NDA can take away.

***

- Do not promise a job. Frame this as durable evidence and relationships built through real work.
- Time check: 30:15.

## 20. Seu próximo emprego pode começar com um único pull request.

*Slide 20 of 26 · route `/one-pull-request` · 2 clicks*

And you don’t need permission to start. You don’t need a senior title. You don’t need someone to pick you. You need one pull request.

[click] Seu próximo emprego pode começar com um único pull request.

Your next job can start with a single pull request. And look back at that pyramid. Every layer of it, Linux, Kubernetes, Valkey, OpenSearch, Postgres, PyTorch, vLLM, Strands, every one was built by people who started exactly where you are right now. First-time contributors who just showed up.

[click] Os mantenedores de amanhã são os contribuidores de primeira vez de hoje.

The maintainers of tomorrow are the first-time contributors of today. That could be someone in this room. It could be you.

***

- Pause after each Portuguese line before translating. “Pode” keeps it a possibility, not a guarantee.
- Time check: 32:45.

## 21. Love systems, infrastructure, and scale?

*Slide 21 of 26 · route `/onramps-foundation` · 2 clicks*

So let’s make this real. I don’t want you to leave with inspiration and no map. Here’s where to jump in, and here’s the beautiful part: whatever you love, there’s a layer for you.

[click] Love operating systems and low-level code? The foundation. Linux. Kernel Newbies is mentorship material built for newcomers, and there is real work in documentation, testing, and drivers. Start with a piece you understand.

[click] Love infrastructure and scale? Orchestration. Kubernetes. It’s organized into Special Interest Groups, SIGs, and they label issues “good first issue” for people exactly like you. Documentation and those issues are often a clearer first door than the core scheduler.

***

- Do not imply every kernel path is beginner-easy; mentorship and review discipline matter.
- The links point to stable roots (kernelnewbies.org, kubernetes.dev/docs/guide), not to a specific current issue.
- Time check: 34:45.

## 22. Love performance, search, memory, or durable truth?

*Slide 22 of 26 · route `/onramps-data` · 3 clicks*

Love data and performance? The data layer. This is my home, so I’ll be specific.

[click] Valkey. Go to GitHub and find the “good first issue” label. The easiest doors in are docs, tests, and the client libraries. Pick a language you already know and improve its client. And come say hi in the community chat.

[click] OpenSearch. GitHub issues, plugins, documentation, and a friendly community forum.

[click] PostgreSQL. It lives on mailing lists. The developer pages explain how proposals and patch review work, and reviewing someone else’s patch counts as contributing.

***

- Keep the invitation balanced across the three projects; Valkey is home, not the only door.
- Entry points change. The links point to stable project or developer roots rather than a specific current issue.
- Time check: 36:30.

## 23. Love models, inference, integrations, or agents?

*Slide 23 of 26 · route `/onramps-ai` · 3 clicks*

Love AI and models directly? The top layer.

[click] PyTorch has good first issues, documentation work, and active forums. Start with a module you already use and understand.

[click] vLLM moves fast and always needs help with model support, compatibility, and docs.

[click] And Strands, the agent SDK, is open on GitHub and needs examples, integrations, and documentation. Build an example. Make the first-agent path clearer for the next person.

That’s eight projects across four layers. You do not have to contribute to all of them.

***

- The map is about choice: whatever they love, there is a layer where their existing curiosity is useful.
- Time check: 38:15.

## 24. Comece pequeno. Comece esta semana.

*Slide 24 of 26 · route `/start-this-week` · no clicks*

Here’s my one rule. Pick one project, at the layer you love, and ship one small thing this month.

Comece pequeno. Comece esta semana.

Start small. Start this week. Small and shipped beats big and imaginary every single time.

***

- Pause after the Portuguese line.
- Time check: 39:15.

## 25. Leave with three commitments.

*Slide 25 of 26 · route `/three-asks` · 3 clicks*

Let me bring this back to where I started. Open source built my career. It gave a developer with no title and no platform a way to do work that mattered and put his name on it. And today, that same open source, every layer of that pyramid, is the foundation the entire AI era is being built on.

But a foundation isn’t finished. It’s being poured right now, by people. And it needs more hands. So I’m going to leave you with three asks.

[click] One: pick a project. Any layer of the pyramid, whatever you love.

[click] Two: ship one contribution this month. One issue, one doc fix, one test, one review.

[click] Three: bring one other person in. Find someone who thinks they’re not ready, and help them make a first move.

And if you don’t know where to start, come find me after this talk. I will personally help you find and land your first pull request, at any layer, not just my own. I mean that.

***

- Make the offer personal, and mean it.
- Time check: 41:45.

## 26. O futuro da IA é aberto. E ele precisa de você.

*Slide 26 of 26 · route `/close` · no clicks*

Because here’s what I know for sure. The future of AI is not going to be handed to us. It’s going to be built, in the open, by the people who show up.

O futuro da IA é aberto. E ele precisa de você.

The future of AI is open. And it needs you.

The QR code on the screen is my LinkedIn. Scan it, connect, and tell me what you are going to contribute.

Thank you, Curitiba. Obrigado.

***

- Let the Portuguese line land before translating. Leave the QR on screen through the Q&A. Pause after “Obrigado” before inviting questions.
- Time check: 43:15, then the remaining time (about 2 minutes) for Q&A and the contribution conversation, inside the 45-minute slot.

## Time checks

Cumulative targets at the end of each slide. The final slide lands at 43:15, leaving about 2 minutes for Q&A and the contribution conversation inside the 45-minute slot.

| Slide | Title | Cumulative time |
|---:|---|---|
| 1 | Open Source como Base para a Era da IA: da Infraestrutura Essencial às Aplicações Agênticas | 0:45 |
| 2 | My résumé said less than my commits did. | 3:00 |
| 3 | A IA não roda em mágica. Roda em código aberto. | 4:15 |
| 4 | There is a place in this stack for you. | 5:00 |
| 5 | You trust the lock because the lock can be inspected. | 7:00 |
| 6 | Open the system at three different boundaries. | 9:30 |
| 7 | Openness turns flaws into shared work. | 10:30 |
| 8 | Not perfect. But it started a conversation. | 11:45 |
| 9 | KiroCrew: the same idea, rebuilt security first. | 12:45 |
| 10 | Valkey: open source, high performance, forever. | 14:15 |
| 11 | Você vem pelo software. Você fica pela comunidade. | 14:45 |
| 12 | The model is the smallest layer of the story. | 18:45 |
| 13 | Se você constrói para a nuvem, você já constrói sobre código aberto. | 20:15 |
| 14 | An exact-key cache sees strings. A semantic cache sees meaning. | 22:00 |
| 15 | The nearest safe answer becomes the fast path. | 23:45 |
| 16 | On repetitive workloads, avoided calls change the economics. | 25:15 |
| 17 | An agent is a model surrounded by open source primitives. | 26:45 |
| 18 | Open source makes expensive repetition optional. | 27:45 |
| 19 | Your open source work can travel farther than your job title. | 30:15 |
| 20 | Seu próximo emprego pode começar com um único pull request. | 32:45 |
| 21 | Love systems, infrastructure, and scale? | 34:45 |
| 22 | Love performance, search, memory, or durable truth? | 36:30 |
| 23 | Love models, inference, integrations, or agents? | 38:15 |
| 24 | Comece pequeno. Comece esta semana. | 39:15 |
| 25 | Leave with three commitments. | 41:45 |
| 26 | O futuro da IA é aberto. E ele precisa de você. | 43:15 |
