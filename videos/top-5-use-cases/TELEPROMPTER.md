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

Five players exposed five scaling problems. One shared in-memory layer now reuses game data, shares sessions, processes match events, updates rankings, and enforces request limits. Start with one problem in your application. Choose the data structure that matches it, then measure the result.
