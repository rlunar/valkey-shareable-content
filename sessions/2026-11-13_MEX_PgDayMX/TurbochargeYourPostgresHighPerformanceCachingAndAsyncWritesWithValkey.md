Title: Turbocharge Your Postgres: High-Performance Caching and Async Writes with Valkey

Description
Every microsecond counts. PostgreSQL is a fantastic database, mainly focused on solving relational use cases. When your application's performance bottleneck is too many repetitive reads, too much write pressure, or not enough throughput the answer isn't always a bigger database. Sometimes you need a smarter architecture.

In this session, we explore how **Valkey**, the open source, BSD-licensed in-memory data store, becomes PostgreSQL's most powerful ally. We start with the **cache-aside pattern**: identifying hot data in Postgres and serving it at in-memory speed with Valkey, dramatically reducing read latency and database load. Then we go deeper with the **write-behind pattern** powered by the **Valkey Sink module** enabling asynchronous, durable writes back to Postgres without blocking your application.

By the end of this session, you'll walk away with proven architectural patterns, real benchmarks, and code samples you can apply immediately.

Roberto Luna Rojas
Sr Developer Advocate for Valkey

Roberto Luna Rojas is a Sr Developer Advocate for Valkey based in the USA, originally from Mexico. He tries to get the most out of in-memory databases one bit at the time, been around developing software since the mid 90s focused on performance and scalability. When not in front of the computer, he loves spending time with his family, listening to music, and watching movies, TV shows, and sports.
