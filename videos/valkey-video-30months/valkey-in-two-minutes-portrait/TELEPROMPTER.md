Memory access is faster than disk access. Valkey keeps working data in memory, with optional disk persistence.

Valkey is an open source, B S D, high-performance key-value datastore that supports a variety of workloads such as caching, message queues, and can act as a primary database. The project is backed by the Linux Foundation, ensuring it will remain open source forever.

Start with a key and a value. Set stores it. Get reads it back.

Cache-aside is a common starting point. Your app checks Valkey first. On a miss, it reads the database and caches the result with an expiry. The next hit skips the database.

Choose stable releases, or explore the next release candidate.

Extend Valkey with JSON, Search, Bloom, and L D A P modules.

Connect through Glide, Spring Boot, Fastify, and Lambda Powertools.

Cache data, manage sessions, and control traffic.

Coordinate services and keep retries under control.

Track rankings and event histories. Add Bloom filters for fraud-screening prechecks.

Build with JSON documents and full-text search. Add vector search, K V-cache offload, and semantic caching.

For AI, embed the prompt and search cached vectors with Valkey Search. A close, valid match reuses the answer. Otherwise, call the model and cache the result. Check context and freshness before reuse.

Built together, by the Valkey community. Open source forever.

Run Valkey's core server with Docker using this command. Start building at valkey dot I O.
