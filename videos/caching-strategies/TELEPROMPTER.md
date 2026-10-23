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

When the worker returns, it reads pending work, commits the listening event, and acknowledges it. If it crashes after committing but before acknowledgement, it can retry. The database must recognise the same event and avoid counting it twice.

That accepted-versus-committed distinction defines what the user was promised.

Use cache-aside for reusable queries such as the artist page Viktor opens. Use write-through when Binbin's playlist edit should be cached immediately after it commits. Use write-behind when Hari's listening event can reach the database later and the pending pipeline is durable enough.

Everything that can be queried, can be cached. The real question is whether the result is reusable, how fresh it must be, and what failure contract the listener was promised.

Record a read, a write, and a failure for your chosen strategy. Measure database work, cache hits, stale responses, and queue lag. Then size the system for the work that remains.
