---
theme: default
title: 'Open Source como Base para a Era da IA: da Infraestrutura Essencial às Aplicações Agênticas'
titleTemplate: '%s · Valkey'
info: |
  Da infraestrutura essencial às aplicações agênticas.
  Closing keynote for AWS Community Day Curitiba, September 19, 2026.
canvasWidth: 1200
aspectRatio: 16/9
colorSchema: light
transition: fade-out
clickAnimation: fade
highlighter: shiki
lineNumbers: false
codeCopy: false
layout: cover
class: keynote-cover
---

<div class="cover-content">
  <AwsOpenSourceLogo tone="dark" class="cover-logo" />
  <p class="eyebrow eyebrow--dark">AWS COMMUNITY DAY CURITIBA · SEP 19, 2026</p>
  <h1 class="cover-title-long">Open Source como Base<br><span>para a Era da IA:<br>da Infraestrutura Essencial<br>às Aplicações Agênticas</span></h1>
  <PresenterIdentity class="cover-presenter" />
  <div class="cover-meta"><span>TRUST</span><span>INFRASTRUCTURE</span><span>AI</span><span>CONTRIBUTION</span></div>
</div>

<!--
Boa tarde, Curitiba! Tudo bem?

I am from Mexico, so before anything else, let me say the one thing that will make us friends for the next forty minutes: Pelé is the greatest football player in history. Good. Now we can talk about anything.

It’s the end of a long day, you’ve had a lot of coffee, and I’m the last thing standing between you and the after-party. So let me make it worth your time.

My name is Roberto Luna Rojas. I’m a Sr Open Source Developer Advocate at AWS. I work on the Valkey open source project, and I’m passionate about databases and distributed systems. I grew up in a small town in Mexico, and open source helped me become a global speaker.

This is not a product keynote. It’s a rally for the open source stack beneath AI, and for the people in this room who can help build it.

***

- Open in Portuguese and wait for the room to answer before switching to English.
- Let the Pelé line land; it is the icebreaker, so give the reaction a beat before the after-party joke.
- Time check: 0:45.
-->

---
layout: default
class: career-door-slide
routeAlias: career-door
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE DOOR OPEN SOURCE OPENED</p>
  <h1>My résumé said less than my commits did.</h1>
  <p class="slide-lead">Public work gave people evidence they could inspect, not a promise they had to trust.</p>
</div>

<div class="career-timeline">
  <article v-click.fade.right="1"><span>2017</span><strong>Started contributing</strong><p>Small Redis fixes in my spare time. Useful work, in public, with my name on it.</p></article>
  <div class="career-arrow" v-click.fade="2">→</div>
  <article v-click.fade.right="2"><span>NEXT</span><strong>Promoted to Staff</strong><p>The work was portable proof of how I thought, collaborated, and shipped.</p></article>
  <div class="career-arrow" v-click.fade="3">→</div>
  <article v-click.fade.right="3"><span>2020</span><strong>Joined AWS</strong><p>No perfect résumé. No special connection. Commits anyone could read.</p></article>
</div>

<SlideFooter />

<!--
I want to start with something personal. My open source journey started back in 2000. For a long time I was mainly a supporter, not a contributor. I made a living helping customers move away from commercial, closed-source software to open source alternatives. I was a developer like many of you in this room. No special title, no platform, no audience. What I had was access to open source. I could read the code that ran the internet, and I could change it.

[click] Then, in 2017, I stopped only supporting and started contributing. Small fixes to Redis in my spare time. Nothing dramatic at first, just fixing things I ran into, improving what I used every day. But that work was public, and it had my name on it.

[click] People noticed. That open source work got me promoted to Staff engineer. It was portable proof of how I thought, how I collaborated, and how I shipped.

[click] And in 2020, it opened the door to a job here at AWS. I did not have a connection or a perfect résumé. I had commits anyone could read. That is the door open source opened for me, and it’s the same door I want to open for every one of you today.

***

- The 2000 supporter era is spoken before the first click; the timeline on the slide starts at 2017, when the contributions began.
- Deliver plainly. This is the real anecdote; do not inflate the causal claim beyond lived experience.
- Time check: 3:00.
-->

---
layout: center
class: statement-slide statement-slide--dark
routeAlias: not-magic
---

<div class="statement-lockup">
  <p class="eyebrow eyebrow--dark">THE MODELS GET THE HEADLINES</p>
  <h1>A IA não roda em mágica.<br><span>Roda em código aberto.</span></h1>
  <p>AI does not run on magic. It runs on open source.</p>
</div>

<!--
So when everyone tells you the AI revolution is about the models, I want to offer a different view. The models get the headlines. But they don’t run on magic.

A IA não roda em mágica. Roda em código aberto.

They run on open source. And here’s the part that matters for every single person in this room: that open source is built by people. Not just companies. People who decided to show up and contribute.

***

- Say the Portuguese line slowly and pause before the English.
- Time check: 4:15.
-->

---
layout: default
class: promise-slide
routeAlias: promise
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE PROMISE</p>
  <h1>There is a place in this stack for you.</h1>
</div>

<div class="promise-grid">
  <article v-click.fade.right="1"><span>01</span><strong>See the whole stack</strong><p>From Linux to agents, not only the model at the top.</p></article>
  <article v-click.fade.right="2"><span>02</span><strong>See how it works</strong><p>Trust, data, inference, memory, retrieval, and durable state.</p></article>
  <article v-click.fade.right="3"><span>03</span><strong>Find your on-ramp</strong><p>One project. One small contribution. One first pull request.</p></article>
</div>

<SlideFooter />

<!--
The future of AI is being written right now, in the open, and there is a place in it for you. So here is my promise.

[click] You’ll see the whole stack that AI is built on. From Linux all the way up to agents, not only the model at the top.

[click] You’ll understand how the layers work together: trust, data, inference, memory, retrieval, and durable state.

[click] And you’ll know exactly where you can jump in. One project, one small contribution, one first pull request. Whatever you love, there’s a layer for you.

***

- State the invitation early; the three asks at the close pay off these three promises.
- Time check: 5:00.
-->

---
layout: default
class: trust-anchor-slide
routeAlias: trust-anchor
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">WHY OPEN · THE TRUST ANCHOR</p>
  <h1>You trust the lock because the lock can be inspected.</h1>
</div>

<div class="trust-sequence">
  <article v-click.fade.right="1"><span>TLS</span><strong>Your bank login</strong><p>A security boundary you depend on every day.</p></article>
  <div class="trust-link" v-click.fade="2">runs through</div>
  <article v-click.fade.right="2"><span>OPENSSL</span><strong>Open and auditable</strong><p>Researchers, maintainers, and operators can inspect the implementation.</p></article>
  <div class="trust-link" v-click.fade="3">2014</div>
  <article class="trust-alert" v-click.fade.right="3"><span>HEARTBLEED</span><strong>Visible. Fixable. Shared.</strong><p>Openness did not prevent the flaw; it made coordinated scrutiny and repair possible.</p></article>
</div>

<div class="pt-callout">Não confiaríamos no TLS se o OpenSSL fosse fechado.</div>
<p class="source-note">Reference: heartbleed.com · openssl.org/news/secadv/20140407.txt</p>
<SlideFooter />

<!--
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
-->

---
layout: default
class: openness-slide
routeAlias: three-kinds-of-open
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">TRUST NEEDS MORE THAN A PROMISE</p>
  <h1>Open the system at three different boundaries.</h1>
</div>

<div class="openness-grid">
  <article v-click.fade.right="1"><span>OPEN CODE</span><strong>See how it works.</strong><p>Inspect orchestration, safety controls, retrieval, memory, and application logic.</p></article>
  <article v-click.fade.right="2"><span>OPEN WEIGHTS</span><strong>Run and inspect it.</strong><p>Evaluate the model yourself instead of renting an unexplained mystery.</p></article>
  <article class="openness-caveat" v-click.fade.right="3"><span>OPEN DATA · WHERE POSSIBLE</span><strong>Ask what it learned.</strong><p>Licensing, privacy, and scale make this the hardest boundary. Direction, not a solved problem.</p></article>
</div>

<div class="pt-callout pt-callout--bottom">Só podemos confiar na IA se ela for aberta.</div>
<SlideFooter />

<!--
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
-->

---
layout: default
class: audit-loop-slide valkey-indigo
routeAlias: open-loop
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow eyebrow--dark">THE OPEN SOURCE LOOP</p>
  <h1>Openness turns flaws into shared work.</h1>
</div>

<div class="audit-loop">
  <article v-click.fade.right="1"><span>01</span><strong>SEE</strong><p>Independent people can inspect what the system actually does.</p></article>
  <div v-click.fade="2">→</div>
  <article v-click.fade.right="2"><span>02</span><strong>FIX</strong><p>Maintainers and users can collaborate on a concrete patch.</p></article>
  <div v-click.fade="3">→</div>
  <article v-click.fade.right="3"><span>03</span><strong>IMPROVE</strong><p>The repair becomes reusable knowledge for everyone downstream.</p></article>
</div>

<p class="audit-coda">A closed black box asks you to hope the owner noticed.</p>
<SlideFooter tone="dark" />

<!--
And openness doesn’t just let us audit. It lets us fix, together. Openness does not eliminate flaws. It changes who can see them, who can help repair them, and who benefits from the repair.

[click] See. Independent people can inspect what the system actually does.

[click] Fix. A problem becomes a reproducible issue and a reviewable patch, and maintainers and users work on it together.

[click] Improve. The repair becomes reusable knowledge for everyone downstream.

That is the open source loop working exactly as it should: something imperfect gets built in the open, and everyone makes it better. A closed black box gives you none of that. You just have to hope the owner noticed.

***

- The OpenClaw and KiroCrew examples follow on the next two slides; this slide sets up the loop they illustrate.
- Time check: 10:30.
-->

---
layout: default
class: openclaw-slide valkey-dark
routeAlias: openclaw
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow eyebrow--dark">THE LOOP IN PRACTICE · VIRAL OPEN SOURCE</p>
  <h1>Not perfect. But it started a conversation.</h1>
</div>

<div class="openclaw-layout">
  <img class="openclaw-chart" src="./assets/images/2026-09-19_openclaw-github-stars.png" alt="GitHub star growth chart: OpenClaw went from 0 to 346K stars in under five months, passing React on March 3, 2026" />
  <div>
    <img class="openclaw-banner" src="./assets/images/openclaw-banner-dark.png" alt="OpenClaw banner: your personal AI assistant, running on your own devices" />
    <div class="openclaw-facts">
      <article v-click.fade.right="1"><span>01 · VIRAL</span><strong>0 to 346K stars in under five months.</strong><p>Passed React on March 3, 2026. Peak: 34,168 stars in 48 hours.</p></article>
      <article v-click.fade.right="2"><span>02 · IMPERFECT, IN PUBLIC</span><strong>Real security flaws, found in the open.</strong><p>Open code meant the community could see them, report them, and fix them together.</p></article>
      <article v-click.fade.right="3"><span>03 · THE DOOR</span><strong>The creator joined OpenAI.</strong><p>Peter Steinberger, February 2026. The project lives on in a foundation.</p></article>
    </div>
  </div>
</div>

<p class="source-note source-note--dark">Sources: github.com/openclaw/openclaw · star-history.com · TechCrunch, February 15, 2026</p>
<SlideFooter tone="dark" />

<!--
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
-->

---
layout: default
class: kirocrew-slide valkey-dark
routeAlias: kirocrew
---

<div class="kirocrew-header">
  <div>
    <p class="eyebrow eyebrow--dark">THE LOOP, CLOSED · SECURITY FIRST · BUILT INSIDE AWS, OPENED TO THE WORLD</p>
    <h1>KiroCrew: the same idea, rebuilt security first.</h1>
  </div>
  <a class="kirocrew-link" href="https://github.com/kirodotdev/KiroCrew">github.com/kirodotdev/KiroCrew</a>
</div>

<img class="kirocrew-shot" src="./assets/images/kirocrew-session-pr.png" alt="KiroCrew desktop session: an agent working through pull request #842, with the changed files, passing checks, and the merged pull request visible" />

<!--
And the conversation did not stop at OpenClaw.

Inside AWS, that same openness let us build our own take on the idea: KiroCrew. A security-first version of OpenClaw, built internally first, and then opened to the world on GitHub.

What you see here is a real KiroCrew session: an agent working through a pull request, with every change, every check, and the merge visible. Security first means that when the safety policy blocks a tool call, the session tells you, right there.

Something imperfect got built in the open. Someone else made it better, in the open. Everyone downstream benefits. That is the loop, closed.

***

- This is the speaker’s own framing of KiroCrew as a security-first take on OpenClaw; keep it to that framing unless you can cite a public statement.
- github.com/kirodotdev/KiroCrew, Apache-2.0, kiro.dev/crew.
- Time check: 12:45.
-->

---
layout: default
class: valkey-profile-slide
routeAlias: what-is-valkey
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">MY HOME IN THE STACK · WHAT IS VALKEY</p>
  <h1>Valkey: open source, high performance, forever.</h1>
</div>

<ValkeyProfile :step="$clicks" />
<p class="interaction-hint"><kbd>→</kbd> workloads, backing, community</p>
<SlideFooter />

<!--
One more stop before the whole stack. Let me introduce my home in it. What is Valkey?

[click] Valkey is an open source, high-performance key/value datastore. It handles caching, the classic workload. It handles message queues. And it can act as a primary database.

[click] It is BSD licensed, and the project is backed by the Linux Foundation, which means it will remain open source forever. Nobody can change that license on you.

[click] And here is the community part. In March 2024, Redis changed its license. Eight days later, the community launched Valkey: vendor neutral, under the Linux Foundation. Today the Technical Steering Committee has maintainers from AWS, Google Cloud, Oracle, Alibaba, Tencent, Ericsson, Percona, and Apple®. Eight companies, one project, no single owner.

***

- The icons carry the description; name the workloads instead of reading the tiles.
- The panel shows the seven permitted TSC affiliation logos from MAINTAINERS.md in github.com/valkey-io/valkey; Apple® is rendered as plain text because this presentation does not have permission to use the Apple logo.
- Dates: Redis relicensed on March 20, 2024; the Linux Foundation announced Valkey on March 28, 2024.
- Time check: 14:15.
-->

---
layout: center
class: statement-slide statement-slide--dark community-slide
routeAlias: community
---

<div class="statement-lockup">
  <p class="eyebrow eyebrow--dark">WHY PROJECTS OUTLIVE LICENSES</p>
  <h1>Você vem pelo software.<br><span>Você fica pela comunidade.</span></h1>
  <p>You come for the software. You stay for the community.</p>
</div>

<!--
That is what those eight days taught me.

Você vem pelo software. Você fica pela comunidade.

You come for the software. You stay for the community. The code brought all of us to Valkey. The people are why we are still there.

***

- Pause after the Portuguese line before translating.
- Time check: 14:45.
-->

---
layout: default
class: pyramid-slide
routeAlias: open-source-stack
clicks: 4
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">THE FOUNDATION OF THE AI ERA</p>
  <h1>The model is the smallest layer of the story.</h1>
</div>

<OpenSourcePyramid :step="$clicks" />
<p class="interaction-hint"><kbd>→</kbd> build the stack from the ground up</p>
<SlideFooter />

<!--
Let me show you what I mean by “the whole stack.” This is the pyramid that every AI application stands on. Let’s walk it from the bottom up, because the bottom is where it all starts.

[click] At the foundation: Linux. The operating system running essentially every server, every container, every cloud instance your AI touches. None of this exists without it.

[click] One layer up: Kubernetes. It schedules and scales all those containers. When your AI app needs to grow from one user to a million, this is the layer that makes it possible.

[click] Above that, the data layer, and this is where state lives. Valkey holds the fast memory and the vectors. OpenSearch handles search and retrieval at scale. PostgreSQL holds the durable, relational truth. Memory, vectors, search, durable state: the things every application needs to remember anything.

[click] And at the top, the AI layer. PyTorch to train the models. vLLM to serve them, to run inference fast and cheap. And Strands to build agents, AWS’s open source SDK for turning a model into something that can reason and act.

Here’s the point I want you to hold onto. Every single layer of this pyramid is open source. Top to bottom. There is no proprietary secret holding it up.

***

- Do not rush the reveal. The pyramid is the recurring spine of the talk and returns on the on-ramp slides.
- Time check: 18:45.
-->

---
layout: center
class: statement-slide statement-slide--light
routeAlias: already-open
---

<div class="statement-lockup">
  <div class="stack-logo-strip">
    <img src="/logos/linux.svg" alt="Linux" /><img src="/logos/kubernetes.svg" alt="Kubernetes" /><BrandLogo compact tone="light" /><img src="/logos/opensearch.svg" alt="OpenSearch" /><img src="/logos/postgresql.svg" alt="PostgreSQL" /><img src="/logos/pytorch.svg" alt="PyTorch" /><img src="/logos/vllm.svg" alt="vLLM" /><img src="/logos/strands.svg" alt="Strands" />
  </div>
  <h1>Se você constrói para a nuvem,<br><span>você já constrói sobre código aberto.</span></h1>
  <p>If you build for the cloud, you already build on open source.</p>
</div>

<!--
Se você constrói para a nuvem, você já constrói sobre código aberto.

If you build for the cloud, you already build on open source. You just might not have noticed how much.

***

- Pause after the Portuguese line.
- The point is agency, not guilt.
- Time check: 20:15.
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
  <div class="answer-card" v-click.fade.left="4"><span>ONE STABLE INTENT</span><strong>Answer once.</strong><p>Serve near-matches only when context and distance say the answer is safe to reuse.</p></div>
</div>

<SlideFooter />

<!--
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
-->

---
layout: default
class: benchmark-slide valkey-indigo
routeAlias: benchmark
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow eyebrow--dark">ONE AWS EVALUATION · NOT A GUARANTEE</p>
  <h1>On repetitive workloads, avoided calls change the economics.</h1>
</div>

<div class="benchmark-grid">
  <article class="benchmark-card" v-click.fade.right="1"><span>LLM COST SAVINGS</span><strong>86.3%</strong><p>At a 0.75 similarity threshold.</p></article>
  <article class="benchmark-card" v-click.fade.right="2"><span>LATENCY REDUCTION</span><strong>88.3%</strong><p>Average end-to-end latency.</p></article>
  <article class="benchmark-card" v-click.fade.right="3"><span>CACHED-ANSWER ACCURACY</span><strong>91.2%</strong><p>The guardrail beside the savings.</p></article>
</div>

<div class="benchmark-context"><span>63,796 QUERIES</span><span>TITAN TEXT EMBEDDINGS V2</span><span>CLAUDE 3 HAIKU</span><span>CACHE.R7G.LARGE</span></div>
<div class="pt-callout pt-callout--benchmark">Cache semântico pode cortar até 86% do custo de inferência.</div>
<p class="source-note source-note--dark">Source: AWS Database Blog, “Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock.” Results vary by model, data, threshold, and cache.</p>
<SlideFooter tone="dark" />

<!--
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
-->

---
layout: default
class: agent-path-slide
routeAlias: agentic-path
clicks: 5
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">THE AGENTIC DATA PATH</p>
  <h1>An agent is a model surrounded by open source primitives.</h1>
</div>

<AgenticDataPath :step="$clicks" />
<p class="interaction-hint"><kbd>→</kbd> trace the support agent’s tools</p>
<SlideFooter />

<!--
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
-->

---
layout: default
class: two-bills-slide
routeAlias: two-bills
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">TWO DIFFERENT BILLS · ONE REUSE PATTERN</p>
  <h1>Open source makes expensive repetition optional.</h1>
</div>

<div class="bill-grid">
  <article v-click.fade.right="1"><span>AI INFERENCE</span><strong>up to 86%</strong><p>Lower inference cost in the cited semantic-cache evaluation.</p><small>reuse a safe answer</small></article>
  <article v-click.fade.right="2"><span>DATABASE ACCESS</span><strong>up to 55%</strong><p>Potential savings for frequently accessed data when cache hit rate enables right-sizing.</p><small>reuse hot data</small></article>
</div>

<p class="bill-coda">Different workloads. Different evidence. Same idea: do the expensive thing once.</p>
<p class="source-note">Do not combine these percentages. Benchmark the eligible workload, correctness, hit rate, latency, and total cost before making a capacity decision.</p>
<SlideFooter />

<!--
One more honest word on cost, because these are two different bills.

[click] The 86 percent I mentioned is inference. It comes from the semantic-caching evaluation I just showed you.

[click] Separately, putting an open source cache in front of your database can cut database cost by up to 55 percent for frequently accessed data, when the hit rate is high enough to right-size the database underneath.

Two different bills, one pattern: open source takes the expensive thing and makes it cheap. And every dollar you save on infrastructure is a dollar you can spend on innovation. Just measure first. Benchmark your workload, check correctness, then make the capacity decision.

***

- Never combine the two percentages; they describe different workloads and different evidence.
- Time check: 27:45.
-->

---
layout: default
class: career-value-slide
routeAlias: career-value
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">WHAT THIS MEANS FOR YOUR CAREER</p>
  <h1>Your open source work can travel farther than your job title.</h1>
</div>

<div class="career-value-grid">
  <article v-click.fade.right="1"><span>PUBLIC</span><strong>People can inspect it.</strong><p>Not a résumé bullet, a discussion, diff, review, and result.</p></article>
  <article v-click.fade.right="2"><span>PERMANENT</span><strong>It keeps your name.</strong><p>Your contribution remains part of the project’s history.</p></article>
  <article v-click.fade.right="3"><span>PORTABLE</span><strong>It follows you.</strong><p>Across teams, companies, countries, and the next opportunity.</p></article>
</div>

<SlideFooter />

<!--
Okay. I’ve shown you the stack. Now let me tell you why it’s the best news you’ll hear all day, especially if you’re early in your career.

Think about where your work lives. Most of what you build at a job is private. It sits behind a login, and when you leave, you leave it behind. You can talk about it in an interview, but you can’t show it.

Open source is the opposite.

[click] Your work is public. People can inspect the actual work: the discussion, the diff, the review, the result. Not a résumé bullet.

[click] It’s permanent. Your contribution stays in the project’s history, with your name on it.

[click] And it’s portable. It follows you to your next job, and the one after that, across teams, companies, and countries. A recruiter can read it. A maintainer can vouch for you. That’s a career asset no NDA can take away.

***

- Do not promise a job. Frame this as durable evidence and relationships built through real work.
- Time check: 30:15.
-->

---
layout: center
class: pr-slide
routeAlias: one-pull-request
clicks: 2
---

<div class="pr-lockup">
  <p class="eyebrow">YOU DO NOT NEED PERMISSION OR A TITLE</p>
  <h1 v-click.fade.up="1">Seu próximo emprego pode começar<br><span>com um único pull request.</span></h1>
  <div class="maintainer-line" v-click.fade.up="2">Os mantenedores de amanhã são os contribuidores de primeira vez de hoje.</div>
</div>

<!--
And you don’t need permission to start. You don’t need a senior title. You don’t need someone to pick you. You need one pull request.

[click] Seu próximo emprego pode começar com um único pull request.

Your next job can start with a single pull request. And look back at that pyramid. Every layer of it, Linux, Kubernetes, Valkey, OpenSearch, Postgres, PyTorch, vLLM, Strands, every one was built by people who started exactly where you are right now. First-time contributors who just showed up.

[click] Os mantenedores de amanhã são os contribuidores de primeira vez de hoje.

The maintainers of tomorrow are the first-time contributors of today. That could be someone in this room. It could be you.

***

- Pause after each Portuguese line before translating. “Pode” keeps it a possibility, not a guarantee.
- Time check: 32:45.
-->

---
layout: default
class: onramp-slide
routeAlias: onramps-foundation
clicks: 2
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">WHERE TO JUMP IN · FOUNDATION + ORCHESTRATION</p>
  <h1>Love systems, infrastructure, and scale?</h1>
</div>

<div class="onramp-layout">
  <OpenSourcePyramid compact :step="4" focus="foundation,orchestration" />
  <div class="onramp-cards">
    <article v-click.fade.right="1"><img src="/logos/linux.svg" alt="" /><span>LINUX</span><strong>Kernel Newbies · docs · drivers</strong><p>Start with mentorship material, documentation, testing, or a driver you understand.</p><small>kernelnewbies.org</small></article>
    <article v-click.fade.right="2"><img src="/logos/kubernetes.svg" alt="" /><span>KUBERNETES</span><strong>SIGs · docs · good first issue</strong><p>Join a Special Interest Group and contribute where the work is already organized.</p><small>kubernetes.dev/docs/guide</small></article>
  </div>
</div>

<SlideFooter />

<!--
So let’s make this real. I don’t want you to leave with inspiration and no map. Here’s where to jump in, and here’s the beautiful part: whatever you love, there’s a layer for you.

[click] Love operating systems and low-level code? The foundation. Linux. Kernel Newbies is mentorship material built for newcomers, and there is real work in documentation, testing, and drivers. Start with a piece you understand.

[click] Love infrastructure and scale? Orchestration. Kubernetes. It’s organized into Special Interest Groups, SIGs, and they label issues “good first issue” for people exactly like you. Documentation and those issues are often a clearer first door than the core scheduler.

***

- Do not imply every kernel path is beginner-easy; mentorship and review discipline matter.
- The links point to stable roots (kernelnewbies.org, kubernetes.dev/docs/guide), not to a specific current issue.
- Time check: 34:45.
-->

---
layout: default
class: onramp-slide
routeAlias: onramps-data
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">WHERE TO JUMP IN · DATA / STATE</p>
  <h1>Love performance, search, memory, or durable truth?</h1>
</div>

<div class="onramp-layout">
  <OpenSourcePyramid compact :step="4" focus="data" />
  <div class="onramp-cards onramp-cards--three">
    <article v-click.fade.right="1"><BrandLogo compact tone="light" /><span>VALKEY</span><strong>Docs · tests · clients</strong><p>Find a `good first issue`, improve a client in a language you know, or join community chat.</p><small>github.com/valkey-io/valkey</small></article>
    <article v-click.fade.right="2"><img src="/logos/opensearch.svg" alt="" /><span>OPENSEARCH</span><strong>Issues · plugins · forum</strong><p>Contribute to search, integrations, documentation, or the community’s plugin ecosystem.</p><small>github.com/opensearch-project</small></article>
    <article v-click.fade.right="3"><img src="/logos/postgresql.svg" alt="" /><span>POSTGRESQL</span><strong>Docs · patch review · lists</strong><p>The developer pages and mailing lists explain how proposals and patch review work.</p><small>postgresql.org/developer</small></article>
  </div>
</div>

<SlideFooter />

<!--
Love data and performance? The data layer. This is my home, so I’ll be specific.

[click] Valkey. Go to GitHub and find the “good first issue” label. The easiest doors in are docs, tests, and the client libraries. Pick a language you already know and improve its client. And come say hi in the community chat.

[click] OpenSearch. GitHub issues, plugins, documentation, and a friendly community forum.

[click] PostgreSQL. It lives on mailing lists. The developer pages explain how proposals and patch review work, and reviewing someone else’s patch counts as contributing.

***

- Keep the invitation balanced across the three projects; Valkey is home, not the only door.
- Entry points change. The links point to stable project or developer roots rather than a specific current issue.
- Time check: 36:30.
-->

---
layout: default
class: onramp-slide
routeAlias: onramps-ai
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">WHERE TO JUMP IN · APPLICATION / AI</p>
  <h1>Love models, inference, integrations, or agents?</h1>
</div>

<div class="onramp-layout">
  <OpenSourcePyramid compact :step="4" focus="ai" />
  <div class="onramp-cards onramp-cards--three">
    <article v-click.fade.right="1"><img src="/logos/pytorch.svg" alt="" /><span>PYTORCH</span><strong>Issues · docs · forums</strong><p>Start with documentation, a scoped issue, or a module you already use and understand.</p><small>github.com/pytorch/pytorch</small></article>
    <article v-click.fade.right="2"><img src="/logos/vllm.svg" alt="" /><span>VLLM</span><strong>Model support · docs</strong><p>A fast-moving inference project with concrete compatibility and documentation work.</p><small>github.com/vllm-project/vllm</small></article>
    <article v-click.fade.right="3"><img src="/logos/strands.svg" alt="" /><span>STRANDS</span><strong>Examples · integrations · docs</strong><p>Build an example, improve a provider integration, or make the first-agent path clearer.</p><small>github.com/strands-agents</small></article>
  </div>
</div>

<SlideFooter />

<!--
Love AI and models directly? The top layer.

[click] PyTorch has good first issues, documentation work, and active forums. Start with a module you already use and understand.

[click] vLLM moves fast and always needs help with model support, compatibility, and docs.

[click] And Strands, the agent SDK, is open on GitHub and needs examples, integrations, and documentation. Build an example. Make the first-agent path clearer for the next person.

That’s eight projects across four layers. You do not have to contribute to all of them.

***

- The map is about choice: whatever they love, there is a layer where their existing curiosity is useful.
- Time check: 38:15.
-->

---
layout: center
class: statement-slide statement-slide--dark start-slide
routeAlias: start-this-week
---

<div class="statement-lockup">
  <p class="eyebrow eyebrow--dark">ONE PROJECT · ONE SMALL THING · THIS MONTH</p>
  <h1>Comece pequeno.<br><span>Comece esta semana.</span></h1>
  <p>Small and shipped beats big and imaginary.</p>
</div>

<!--
Here’s my one rule. Pick one project, at the layer you love, and ship one small thing this month.

Comece pequeno. Comece esta semana.

Start small. Start this week. Small and shipped beats big and imaginary every single time.

***

- Pause after the Portuguese line.
- Time check: 39:15.
-->

---
layout: default
class: asks-slide
routeAlias: three-asks
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">SHAPE THE FUTURE OF AI</p>
  <h1>Leave with three commitments.</h1>
</div>

<div class="asks-grid">
  <article v-click.fade.right="1"><span>01</span><strong>Pick a project.</strong><p>Any layer of the pyramid. Start where your curiosity already lives.</p></article>
  <article v-click.fade.right="2"><span>02</span><strong>Ship one contribution.</strong><p>One issue, one doc fix, one test, one review, this month.</p></article>
  <article v-click.fade.right="3"><span>03</span><strong>Bring one person in.</strong><p>Find someone who thinks they are not ready, and help them make a first move.</p></article>
</div>

<div class="offer-callout">Find me after the talk. I will help you find a first pull request, at any layer.</div>
<SlideFooter />

<!--
Let me bring this back to where I started. Open source built my career. It gave a developer with no title and no platform a way to do work that mattered and put his name on it. And today, that same open source, every layer of that pyramid, is the foundation the entire AI era is being built on.

But a foundation isn’t finished. It’s being poured right now, by people. And it needs more hands. So I’m going to leave you with three asks.

[click] One: pick a project. Any layer of the pyramid, whatever you love.

[click] Two: ship one contribution this month. One issue, one doc fix, one test, one review.

[click] Three: bring one other person in. Find someone who thinks they’re not ready, and help them make a first move.

And if you don’t know where to start, come find me after this talk. I will personally help you find and land your first pull request, at any layer, not just my own. I mean that.

***

- Make the offer personal, and mean it.
- Time check: 41:45.
-->

---
layout: end
class: keynote-end
routeAlias: close
---

<div class="end-content">
  <AwsOpenSourceLogo tone="dark" class="end-logo" />
  <p class="eyebrow eyebrow--dark">THE FUTURE IS BEING WRITTEN NOW</p>
  <h1>O futuro da IA é aberto.<br><span>E ele precisa de você.</span></h1>
  <p>The future of AI is open. And it needs you.</p>
  <PresenterIdentity class="end-presenter" />
</div>

<div class="end-qr">
  <img src="./assets/images/rberoj_linkedin.svg" alt="QR code linking to Roberto Luna Rojas on LinkedIn" />
  <span>CONNECT ON LINKEDIN</span>
</div>

<div class="end-links">
  <a href="https://github.com/valkey-io/valkey">github.com/valkey-io/valkey</a>
  <a href="https://valkey.io/community/">valkey.io/community</a>
  <span>Obrigado, Curitiba.</span>
</div>

<!--
Because here’s what I know for sure. The future of AI is not going to be handed to us. It’s going to be built, in the open, by the people who show up.

O futuro da IA é aberto. E ele precisa de você.

The future of AI is open. And it needs you.

The QR code on the screen is my LinkedIn. Scan it, connect, and tell me what you are going to contribute.

Thank you, Curitiba. Obrigado.

***

- Let the Portuguese line land before translating. Leave the QR on screen through the Q&A. Pause after “Obrigado” before inviting questions.
- Time check: 43:15, then the remaining time (about 2 minutes) for Q&A and the contribution conversation, inside the 45-minute slot.
-->
