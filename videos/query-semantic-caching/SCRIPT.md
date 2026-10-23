# Query caching and semantic caching

Recording script and animation brief. Planned runtime: **5:00**, including demo and diagram holds. Audience: developers building database-backed applications and AI request pipelines.

## Opening hook

“Are you burning through tokens answering questions you've already answered? And is your database repeating the same expensive query? Cache the reusable result before paying for the work again.”

Alternate AI-only hook: “How many of your model calls produce an answer you already have? Exact and semantic caching give you two chances to reuse it.”

## Visual contract

Use one request and one cached result throughout. Show exact query caching first. Then teach exact AI response caching, semantic lookup, validation, and miss handling as separate steps.

Make the central contrast visual: exact lookup is a black-or-white `Yes` or `No` for a specific key. Semantic lookup returns a gray `Maybe`: a candidate that must be close enough and pass validation before reuse.

Keep no more than four main nodes in a shot. During semantic lookup, show Application, Embedding model, and Valkey Search. During generation, replace that shot with Application, Knowledge source, and Language model. Put the validation gate in its own shot. Each shot has one short headline and one active arrow.

Use U01 and U19 as the conceptual references. The library's long metadata rows belong in companion notes, not in the animation. Command excerpts containing vector variables are templates for a binary-safe client; they are not paste-ready CLI commands.

## 00:00–00:20 | Repeated work has a price

**Voiceover**

“Are you burning through tokens answering questions you've already answered? And is your database repeating the same expensive query? Cache the reusable result before paying for the work again.

“Exact caches ask a yes-or-no question: does Valkey have this key? Semantic caching asks a grayer question: maybe Valkey has an answer, if the meaning is close enough.”

**On screen:** `Exact: Yes or No` then `Semantic: Maybe`.

**Animation**

One question reaches a language model and returns an answer. The identical question arrives again. Pause with the cached answer visible beside the application. Show no fabricated token-spend number.

**Reference:** [U19 — semantic caching](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U19), `scope`.

## 00:20–01:10 | Query caching stores a result

**Voiceover**

“A category page asks for the twenty most popular laptops. The application needs a join and aggregation, but the result can be reused for a short interval.

“Build a key from the inputs that change that result: tenant, permissions, filters, sort order, pagination, and schema version. Check Valkey. A miss sends the application to the database. It stores the resulting rows with an expiry. The next matching request reads those rows from Valkey.

“For a specific key and the cache's current state, the lookup is deterministic. Valkey either has the result or it doesn't. Hit or miss. Yes or no.

“You're caching the output of the query. Whether that result is still valid depends on your invalidation and expiry policy.”

**On screen:** `Same inputs → same key` then `Key exists? Yes or No`.

**Animation**

First show three input chips merging into one key: `Tenant`, `Filters`, `Version`. Then cut to Application → Valkey and show miss. Cut to the database query. Return its product-list card to the application and fill Valkey. On the next matching request, only the cache path lights up.

**Reference:** [U01 — query caching](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U01), `pg-cold`, then `pg-warm`.

**Demo**

```console
valkey> GET demo:query:v3:t42:public:laptops:popular:page1
(nil)
valkey> SET demo:query:v3:t42:public:laptops:popular:page1 '[{"id":42,"name":"Blue laptop"}]' EX 60
OK
valkey> GET demo:query:v3:t42:public:laptops:popular:page1
```

Keep the full key in the recording notes. On screen, the diagram only needs `query key`.

## 01:10–01:45 | Exact AI response caching comes first

**Voiceover**

“For AI responses, the same idea starts with an exact key. Include the prompt and the context that affects the answer, such as tenant, authorization scope, model, prompt-template version, and knowledge version.

“Prompt caching is also deterministic at lookup. The same canonical request produces the same key, and that key either exists or it doesn't. An identical request can return an existing answer before any embedding or generation call.

“Normalize only differences that your application considers irrelevant. Don't remove numbers or negation just to make more requests match.”

**On screen:** `Exact key` then `Yes: reuse` or `No: continue`.

**Animation**

Show the same question twice. A key badge matches on the second request. Its cached answer goes back to the application. Keep both model nodes off screen during that hit.

**Reference:** [U19](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U19), `scope`, exact-match step.

**Application sample**

```python
identity = canonical_request(
    tenant=tenant,
    authorization_scope=scope,
    model_version=model_version,
    template_version=template_version,
    knowledge_version=knowledge_version,
    prompt=prompt,
    generation_parameters=parameters,
)
cached_answer = cache.get("answer:exact:" + sha256(identity))
```

This is explanatory pseudocode. A hash creates an identifier; it does not protect confidential prompt data or establish authorization.

## 01:45–02:30 | Changed wording opens the semantic path

**Voiceover**

“Now the user asks, ‘What steps do I follow if I forgot my password?’ We previously answered, ‘How do I reset my password?’ The exact key misses.

“The application sends the new question to an embedding model. It searches nearby cached question vectors with Valkey Search, restricting candidates to the permitted scope. Valkey Search is a module; embedding generation happens outside Valkey.

“Semantic lookup isn't black and white. The search returns nearby candidates and distances. That means maybe Valkey has the answer. A candidate is reused only if it is close enough and passes the application's validation checks.”

**On screen:** `Different wording` → `Find candidate` → `Maybe`.

**Animation**

Display the two question cards in sequence. Show a separate embedding node turning the new question into a vector dot. Move that dot into a small neighbourhood in Valkey Search. Return one candidate card. The 2D arrangement is a conceptual projection, with no invented similarity percentage.

**References:** [U19](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U19), `hit`; [U16 — vectors](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U16).

**Setup excerpt**

```text
FT.CREATE demo_semcache ON HASH PREFIX 1 demo:sem: SCHEMA
    tenant TAG audience TAG version TAG
    question_vec VECTOR HNSW 6 TYPE FLOAT32 DIM 384 DISTANCE_METRIC COSINE
```

Use this schema with an embedding model that outputs 384 dimensions. Index creation and vector ingestion happen before the visible demo.

## 02:30–03:10 | Validate before returning the answer

**Voiceover**

“Maybe does not mean yes. Similarity alone isn't enough. ‘Can I return this after thirty days?’ and ‘Can I return this after sixty days?’ can be close in vector space and need different answers.

“Check scope, source version, freshness, and task-specific parameters before reuse. In this example, a changed number rejects the cached answer. Set your distance threshold using evaluation data for your task. A threshold that works for one corpus may fail on another.”

**On screen:** `Close wording ≠ same answer` then `Validate`.

**Animation**

Show only the two return-policy questions. Highlight `30` and `60`. Cut to a candidate card moving through a gate. Reveal the checks one at a time: `Scope`, `Freshness`, `Parameters`. The changed parameter closes the gate. Don't draw a single global “semantic score” as sufficient proof.

**Reference:** [U19](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U19), `rejected`.

## 03:10–04:00 | Record the hit, rejection, and miss

**Voiceover**

“Record three outcomes. An exact repeat reuses the answer immediately. An accepted paraphrase performs embedding and search, then reuses the answer. A rejected candidate runs the normal retrieval and generation pipeline.

“Store the new answer only when the workload permits caching. Keep its vector, scope, source version, and lifetime together. On a semantic hit, the application can also create an exact entry for that wording, so another identical request takes the cheaper path.

“A knowledge update changes the version. Older answers then stop matching that version's lookup scope.”

**On screen:** One outcome at a time: `Exact hit`, `Semantic hit`, `Generate`.

**Animation**

Three separate runs of the same small application diagram. Each run highlights only the work performed. On the miss, show retrieval and generation in a separate shot. On the accepted hit, show a brief exact-entry fill after returning the answer.

**Reference:** [U19](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U19), `scope`, then `hit`.

**Visible demo design**

Use a small application with one request box and one result card. For each request show:

```text
Outcome: exact-hit | semantic-hit | miss
Generation calls: observed counter
Elapsed time: measured value
```

Show the counters only after the result arrives. Keep vectors, index schema, and metadata off the application UI during this demonstration.

## 04:00–04:40 | Count the work avoided

**Voiceover**

“Measure model calls avoided and response latency, but also count rejected candidates and incorrect reuse. Semantic hits still require an embedding and a search.

“For a simple example, suppose one hundred requests would each generate an answer. Twenty are exact hits and thirty more are accepted semantic hits. Fifty generation calls remain. That's half the calls in this example, before accounting for embedding, cache infrastructure, or differences in token counts. Your measured traffic tells you the real saving.”

**On screen, sequentially:** `100 generation calls` → `20 exact hits` → `30 semantic hits` → `50 calls remain`.

**Animation**

Start with ten dots, each representing ten requests. Move two into the exact-hit lane, then three into the semantic-hit lane. Keep the remaining five in the generation lane. End with `Illustrative workload` visible. No dollar figure or latency speedup is implied.

**Reference:** U19's `scope` final step, “Account for the real saving.” The numerical example is editorial arithmetic, not a library benchmark.

## 04:40–05:00 | First experiment

**Voiceover**

“Start with exact caching for one reusable query or response. Add semantic reuse only where your tests can establish answer equivalence. Record the hit rate, avoided work, and rejected matches. Then compare the saving with the cost of the lookup pipeline.”

**On screen:** `Reuse what is valid`.

**Animation**

Return to the password-reset answer. One accepted match passes the gate and reaches the user. End on the Valkey logo and a link to the companion demo.

## Samples for the companion demo

### Exact lookup and fill

```console
valkey> GET demo:answer:exact:t42:public:m1:p1:kb8:request-digest
(nil)
valkey> SET demo:answer:exact:t42:public:m1:p1:kb8:request-digest "Open Settings, then Reset password." EX 300
OK
```

### Binary vector search from the application

API-shaped Python excerpt. `client` is a binary-safe Valkey client and `embedding_model` produces 384-dimensional vectors. It is not a standalone executable program.

```python
query_vector = embedding_model.encode(prompt).astype("<f4").tobytes()
candidates = client.execute_command(
    "FT.SEARCH", "demo_semcache",
    "(@tenant:{t42} @audience:{public} @version:{kb8})"
    "=>[KNN 3 @question_vec $v AS distance]",
    "PARAMS", 2, "v", query_vector,
    "RETURN", 2, "answer", "distance",
    "DIALECT", 2,
)
```

The complete implementation must carry the model, prompt, language, authorization, and source-version scope described in the narration. The shortened schema illustrates query mechanics. Escape filter inputs with a proper query builder. Cosine distance is lower for closer vectors; it is not a confidence probability.

### Storage lifecycle

Store the answer and vector in the same scoped Hash, set its TTL, and populate any exact pointer with a lifetime no longer than the answer's remaining lifetime. Validate a pointer target before reuse; an expired or missing answer falls through to the normal pipeline.

## Recording preparation

Prepare a small public FAQ corpus, a fixed embedding model/version, and a pinned Search-enabled environment. Run the question sequence in advance and select genuine accepted/rejected examples. Use actual client responses and timing. A prerecorded embedding fixture can make the visual deterministic, but label that mode and don't present it as a live embedding call.

The generated answers, measured distances, and model-call counts must come from the recorded application. The expected outcomes in this script are a demonstration plan, not a claim that those requests have already passed evaluation.

## Primary sources

- [Cache-aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) — exact result caching and semantic reuse considerations.
- [SET](https://valkey.io/commands/set/) — cache expiry.
- [Valkey Search](https://valkey.io/topics/search/) — module, vector search, and filters.
- [FT.CREATE](https://valkey.io/commands/ft.create/) — schema and cosine distance.
- [FT.SEARCH](https://valkey.io/commands/ft.search/) — vector parameters and result fields.
- Local U01/U19 supply the product and FAQ scenarios, scope rules, and rejected 30-day/60-day example.

Source review: October 11, 2026.
