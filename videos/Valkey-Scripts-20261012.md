# What is Valkey?

Are traffic peaks forcing you to oversize your database? If thousands of requests need the same answer, repeating the same work can become your bottleneck.

Memory is faster to access than disk because the system can read working data without waiting for storage input and output. Disk remains essential for durability. Memory is where applications keep data that must be read and changed quickly.

A key-value datastore works like a dictionary. The application provides a unique key, and the datastore returns the value associated with it. The key identifies the data directly, while commands create, read, update, delete, or expire that value.

Valkey is an open source, vendor-neutral, in-memory data structure store backed by the Linux Foundation. Applications use it for caching, shared state, messaging, and database workloads.

Start with a key and a value. Set stores a product with a sixty-second lifetime. Get reads it back. The application chooses what to store and how long it remains useful.

For caching, the application checks Valkey first. A miss sends it to the database, then it stores the result. The next matching request can reuse that result. Fewer repeated reads reach the database, so it has more room for work that needs fresh data.

Valkey supports multiple value types, for example: hashes for records, sorted sets for rankings, and Streams for queued work. These structures let applications update shared data with atomic commands instead of building every operation from a read followed by a write.

When your workload needs recovery, Valkey supports disk persistence and replication. Clustering distributes keys across servers. The settings you choose determine how the system recovers and what data may be lost during a failure.

Start with one repeated request. Store its result, add an expiry, and measure hits, misses, and database reads. Go to valkey dot I O to learn more.

---

# Valkey 9.2 GA

How do you find the most specific rule for a request path in one lookup? Valkey nine point two is generally available, and it introduces Path Hash. Path Hash can find the longest stored prefix or return every matching ancestor. Let's see it in action.

Path Hash is a binary-safe, radix-tree-backed data type.

This example stores routing rules at three nested paths. P H LONGEST returns the most specific stored prefix. P H PREFIXES returns every matching ancestor. Each path can hold several fields, and the whole tree lives under one Valkey key.

Path Hash was initially designed for AI K V-cache placement. An inference router can encode cumulative prompt-block hashes as paths and ask which workers hold each reusable prefix. The router still chooses the worker. Valkey performs exact byte-prefix matching, not vector or semantic search.

The tree occupies one cluster slot, its time to live applies to the top-level key, and a large P H delete prefix operation can block while it removes the subtree.

X ACK DEL and X DELETE X make Stream cleanup aware of consumer-group references.

Billing and analytics both read the same event. Billing finishes first. In acknowledged mode, Valkey acknowledges its copy but returns two because analytics still references the event. When analytics finishes, Valkey returns one and deletes it.

Keep ref, acknowledged, and delete ref make different retention trade-offs. They do not create exactly-once delivery.

Increment expire combines an increment and expiration. This counter increases and receives a sixty-second time to live in one atomic command.

Conditional exec can commit a transaction only when if equal, if not equal, N X, or X X conditions pass. That replaces a separate watch round trip for common optimistic-locking flows.

Set if not equal covers a smaller compare-and-set case, and move replace can overwrite a destination key.

A C L roles turn repeated selector sets into named policy. Here, three application users can share one read-only API role. Updating the role changes their effective permissions immediately.

Roles do not hold passwords and cannot include other roles. Their permissions add to the user's own selectors.

A C L digest fingerprints the effective A C L state, so automation can compare policy before and after A C L load.

Forkless snapshots move R D B serialization into a background thread instead of a forked child. The infrastructure must be enabled at startup, and it adds metadata per key. Writes touching a key currently being serialized may wait, and incompatible module data types fall back to fork-based saving.

Valkey can also compress the complete R D B stream with L Z four. Replication compression is negotiated per replica, allowing older or opted-out replicas to receive plaintext. These options are off by default, and older releases cannot load the L Z four wrapped R D B format.

Hot-key detection samples requests and reports estimated high-Q P S keys. It is disabled until hot keys top K is greater than zero.

Replication throttling can slow client writes when a replica falls behind. Priority polling lets cluster heartbeats, replication, and slot migration run during heavy client work. Reserved slots preserve connection capacity for clients arriving from configured networks.

The network list controls priority and capacity. A C L and T L S still control access.

A server can now offer a secondary T L S certificate, for example a post-quantum certificate beside R S A, when the Open S S L build and client support it.

Maximum memory scripts limits memory consumed by cached eval scripts. Script load now follows the global maximum-memory path and can evict keys or fail with an out-of-memory error.

Valkey nine point two is generally available. Try Path Hash, simplify your Stream cleanup, and test the new operational controls with your workload. Start with the release notes and the demos linked below.

---

# Top five use cases

A multiplayer game becomes popular. More application servers handle more players, but five problems remain: repeated database reads, sessions tied to one server, slow background work, constantly changing rankings, and request limits split across gateways. Let's follow five players through the application and solve each problem with Valkey.

First problem: Madelyn opens a popular game's page. Every player request runs the same catalog query against the database. Adding application servers only creates more identical reads.

The solution is cache-aside. The application checks Valkey first. On a miss, it reads the database and stores the game details with an expiry. Matching requests reuse that result.

The cache key must include every input that changes the result. When the game details change, invalidate the affected entry. Measure database reads alongside cache hits.

Second problem: Jacob signs in through server A. Their next request lands on server B. If the session exists only in server A's memory, server B does not know who they are.

The solution is a shared session store. Save the session in Valkey and give the browser an opaque identifier. Both application servers can load the same record. Here, the session fields and expiration are created together in a transaction.

The application still authenticates Jacob, generates a secure identifier, and checks permissions. Set an explicit lifetime and delete the session when they log out.

Third problem: Zhao finishes a match. Calculating rewards, updating history, and sending analytics inside the request would keep them waiting. A server failure could also lose unfinished work.

The solution is a Stream. The application appends a match-completed event and responds without waiting for every background task. Workers in a consumer group process new events and acknowledge completed work.

A delivered event remains pending until acknowledgement. If a worker fails, another worker can claim it and retry. Make reward processing safe to repeat, because a worker can finish the external effect and fail before acknowledging it.

Fourth problem: a completed match changes Paty's score. The platform must update rankings frequently and return the current leaders without sorting every player for every request.

The solution is a sorted set. Each player is stored with a numeric score. Z increment by changes Paty's score atomically, and the next reverse-range query returns the updated order.

Define ties and season boundaries. If match events can be retried, prevent the same result from increasing Paty's score twice.

Fifth problem: Robert's game client calls the platform through several gateways. If each gateway maintains its own counter, adding gateways can multiply their request allowance.

The solution is one shared rate-limit counter in Valkey. This demonstration allows three requests in ten seconds. A short script increments the counter, sets its expiry on first use, and returns the decision atomically.

Every gateway now sees the same budget. The fourth request is rejected before reaching the application. This is a fixed window; token-bucket and sliding-window policies offer different burst and accuracy trade-offs.

Start with one problem in your application. Choose the data structure that matches it, then measure the result.

---

# Query and semantic caching

Are you burning through tokens answering questions you've already answered? And is your database repeating the same expensive query? Cache the reusable result before paying for the work again. We'll start with exact query caching, then add a second chance to reuse an AI answer when the wording changes.

A category page asks for the twenty most popular laptops. The application needs a join and aggregation, but the result can be reused for a short interval.

Build a key from the inputs that change that result: tenant, permissions, filters, sort order, pagination, and schema version. Check Valkey. A miss sends the application to the database. It stores the resulting rows with an expiry. The next matching request reads those rows from Valkey.

You're caching the output of the query. Freshness still depends on your invalidation and expiry policy.

For AI responses, the same idea starts with an exact key. Include the prompt and the context that affects the answer, such as tenant, authorization scope, model, prompt-template version, and knowledge version.

An identical request can return an existing answer before any embedding or generation call. Normalize only differences that your application considers irrelevant. Don't remove numbers or negation just to make more requests match.

Now the user asks, “What steps do I follow if I forgot my password?” We previously answered, “How do I reset my password?” The exact key misses.

The application sends the new question to an embedding model. It searches nearby cached question vectors with Valkey Search, restricting candidates to the permitted scope. Valkey Search is a module; embedding generation happens outside Valkey.

The search returns candidates and distances. The application then decides whether an answer is safe to reuse.

Similarity alone isn't enough. “Can I return this after thirty days?” and “Can I return this after sixty days?” can be close in vector space and need different answers.

Check scope, source version, freshness, and task-specific parameters before reuse. In this example, a changed number rejects the cached answer. Set your distance threshold using evaluation data for your task. A threshold that works for one corpus may fail on another.

Record three outcomes. An exact repeat reuses the answer immediately. An accepted paraphrase performs embedding and search, then reuses the answer. A rejected candidate runs the normal retrieval and generation pipeline.

Store the new answer only when the workload permits caching. Keep its vector, scope, source version, and lifetime together. On a semantic hit, the application can also create an exact entry for that wording, so another identical request takes the cheaper path.

A knowledge update changes the version. Older answers then stop matching that version's lookup scope.

Measure model calls avoided and response latency, but also count rejected candidates and incorrect reuse. Semantic hits still require an embedding and a search.

For a simple example, suppose one hundred requests would each generate an answer. Twenty are exact hits and thirty more are accepted semantic hits. Fifty generation calls remain. That's half the calls in this example, before accounting for embedding, cache infrastructure, or differences in token counts. Your measured traffic tells you the real saving.

Start with exact caching for one reusable query or response. Add semantic reuse only where your tests can establish answer equivalence. Record the hit rate, avoided work, and rejected matches. Then compare the saving with the cost of the lookup pipeline.

---

# Caching Strategies

Imagine a global music-streaming service when major releases drop across several markets. Fans refresh artist pages, playlists, and charts at the same time. Everything that can be queried, can be cached. But not every result should use the same strategy. We'll compare cache-aside, write-through, and write-behind. Watch when the application returns success.

Viktor opens the artist page for Pacific June, a fictional US pop artist. With cache-aside, the application checks Valkey first. If the page is missing, it queries the music catalog and stores the result in Valkey with an expiry. Matching requests reuse that result.

The cache is filled on demand, so the service does not need to prebuild every artist page. The first request pays for the catalog query. If many listeners miss together, they can all repeat that work. Coalescing a refresh helps protect the database.

The application owns the lookup, catalog query, and cache fill.

When Pacific June's catalog metadata changes, commit the update to the database, then invalidate the cached artist page. The next read rebuilds it.

A failed invalidation needs repair. A concurrent reader can also refill an older value around the update. Expiry helps limit how long an entry lives, while versioning and coordination address stronger freshness requirements.

Cache-aside is a practical starting point for read-heavy catalog data that tolerates a defined amount of staleness.

Binbin adds a track by Camden Echoes, a fictional British arena-pop band, to a playlist called Global Friday. With write-through, the application updates the database and the cache in the request path. It reports success only after both contain the new playlist version.

The next device can read the updated playlist from Valkey without another database query. The write carries the latency of the coordinated path.

The two systems still fail independently. If the database succeeds and the cache update fails, the coordinator needs retry or repair. Playlist versions prevent an older edit from overwriting a newer cached value.

Hari plays a track by Seoul Spectrum, a fictional K-pop group. The service needs the event for listening history, recommendations, and royalty reporting, but the listener should not wait for every database write. With write-behind, the application records the event and pending write intent, then returns success under a defined durability contract. A worker writes to the database later.

This can absorb a temporary burst while the database catches up. A finite buffer buys time. If incoming writes keep exceeding the worker's throughput, the backlog grows until you need more capacity or backpressure.

Pending listening events need retention, recovery, and safe retries. Include an event identity so a retry does not count the same play twice.

Pause the worker. Valkey still contains the new listening event, while the analytics database remains behind. Keep the queue visible and watch its oldest item.

When the worker returns, it reads pending work, commits the listening event, and acknowledges it. If it crashes after committing but before acknowledgement, it can retry. The database must recognize the same event and avoid counting it twice.

The success response promised that Valkey accepted the event. The database commit came later.

Use cache-aside for reusable queries such as the artist page Viktor opens. Use write-through when Binbin's playlist edit should be cached immediately after it commits. Use write-behind when Hari's listening event can reach the database later and the pending pipeline is durable enough.

Everything that can be queried, can be cached. Pick the strategy by asking whether the result is reusable, how fresh it must be, and what failure contract the listener was promised.

Record a read, a write, and a failure for your chosen strategy. Measure database work, cache hits, stale responses, and queue lag. Then size the system for the work that remains.  
