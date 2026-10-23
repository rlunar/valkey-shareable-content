Are you burning through tokens answering questions you've already answered? And is your database repeating the same expensive query? Cache the reusable result before paying for the work again.

Exact caches ask a yes-or-no question: does Valkey have this key? Semantic caching asks a grayer question: maybe Valkey has an answer, if the meaning is close enough.

A category page asks for the twenty most popular laptops. The application needs a join and aggregation, but the result can be reused for a short interval.

Build a key from the inputs that change that result: tenant, permissions, filters, sort order, pagination, and schema version. Check Valkey. A miss sends the application to the database. It stores the resulting rows with an expiry. The next matching request reads those rows from Valkey.

For a specific key and the cache's current state, the lookup is deterministic. Valkey either has the result or it doesn't. Hit or miss. Yes or no.

You're caching the output of the query. Whether that result is still valid depends on your invalidation and expiry policy.

For AI responses, the same idea starts with an exact key. Include the prompt and the context that affects the answer, such as tenant, authorization scope, model, prompt-template version, and knowledge version.

Prompt caching is also deterministic at lookup. The same canonical request produces the same key, and that key either exists or it doesn't. An identical request can return an existing answer before any embedding or generation call.

Normalize only differences that your application considers irrelevant. Don't remove numbers or negation just to make more requests match.

Now the user asks, “What steps do I follow if I forgot my password?” We previously answered, “How do I reset my password?” The exact key misses.

The application sends the new question to an embedding model. It searches nearby cached question vectors with Valkey Search, restricting candidates to the permitted scope. Valkey Search is a module; embedding generation happens outside Valkey.

Semantic lookup isn't black and white. The search returns nearby candidates and distances. That means maybe Valkey has the answer. A candidate is reused only if it is close enough and passes the application's validation checks.

Maybe does not mean yes. Similarity alone isn't enough. “Can I return this after thirty days?” and “Can I return this after sixty days?” can be close in vector space and need different answers.

Check scope, source version, freshness, and task-specific parameters before reuse. In this example, a changed number rejects the cached answer. Set your distance threshold using evaluation data for your task. A threshold that works for one corpus may fail on another.

Record three outcomes. An exact repeat reuses the answer immediately. An accepted paraphrase performs embedding and search, then reuses the answer. A rejected candidate runs the normal retrieval and generation pipeline.

Store the new answer only when the workload permits caching. Keep its vector, scope, source version, and lifetime together. On a semantic hit, the application can also create an exact entry for that wording, so another identical request takes the cheaper path.

A knowledge update changes the version. Older answers then stop matching that version's lookup scope.

Measure model calls avoided and response latency, but also count rejected candidates and incorrect reuse. Semantic hits still require an embedding and a search.

For a simple example, suppose one hundred requests would each generate an answer. Twenty are exact hits and thirty more are accepted semantic hits. Fifty generation calls remain. That's half the calls in this example, before accounting for embedding, cache infrastructure, or differences in token counts. Your measured traffic tells you the real saving.

Start with exact caching for one reusable query or response. Add semantic reuse only where your tests can establish answer equivalence. Record the hit rate, avoided work, and rejected matches. Then compare the saving with the cost of the lookup pipeline.
