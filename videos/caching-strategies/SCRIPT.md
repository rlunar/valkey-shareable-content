# Cache-aside, write-through, and write-behind

Recording script and animation brief. Planned runtime: **5:00**, including diagram and command holds. Audience: developers deciding how a cache fits around an existing database.

## Opening hook

“Imagine a global music-streaming service when major releases drop across several markets. Fans refresh artist pages, playlists, and charts at the same time. Everything that can be queried, can be cached. But the write strategy determines when listeners see fresh data and when the database catches up.”

Alternate opening: “Your cache is fast. Is it serving the right value after a write? That answer depends on the strategy you chose.”

## Visual contract

Use one global music-streaming service throughout. Cache-aside serves a page for Pacific June, a fictional US pop artist. Write-through updates a playlist with Camden Echoes, a fictional British arena-pop band. Write-behind records a listening event for Seoul Spectrum, a fictional K-pop group. Do not use real recordings, lyrics, logos, album covers, or artist likenesses. One shot shows one operation: read, commit, invalidate, update cache, enqueue, or flush. No simultaneous read and write paths. Place a short `ACK` badge exactly where the application reports success; this is the comparison viewers should remember.

Use Application, Valkey, Database, and, for write-behind, one Worker. Preserve positions across scenes. Fade inactive components and reveal arrows individually. The library's capacity laboratories are optional reference material; their full dashboards do not belong in the recording.

## 00:00–00:25 | Workload and choice

**Voiceover**

“Imagine a global music-streaming service when major releases drop across several markets. Fans refresh artist pages, playlists, and charts at the same time. Everything that can be queried, can be cached. But not every result should use the same strategy. We'll compare cache-aside, write-through, and write-behind. Watch when the application returns success.”

**On screen:** `When is the write complete?`

**Animation**

Start with repeated requests for artist pages, playlists, and global charts piling up at the database. Introduce Valkey and redirect matching reads. Cut between an artist-page update, a playlist edit, and a new listening event, then pause before choosing a strategy.

**Reference:** [C12 — add a cache](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C12), then [C08 — acknowledgement contract](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C08).

## 00:25–01:10 | Cache-aside reads

**Voiceover**

“Viktor opens the artist page for Pacific June, a fictional US pop artist. With cache-aside, the application checks Valkey first. If the page is missing, it queries the music catalog and stores the result in Valkey with an expiry. Matching requests reuse that result.

“The cache is filled on demand, so the service does not need to prebuild every artist page. The first request pays for the catalog query. If many listeners miss together, they can all repeat that work. Coalescing a refresh helps protect the database.

“The application owns the lookup, catalog query, and cache fill.”

**On screen:** `Cache-aside` then `Miss → load → fill`.

**Animation**

Show GET and miss. Then show Application → Music Catalog, followed by the Pacific June artist page returning. Then show SET. Reset the request dot; replay only GET and hit. Teach stampede control in a separate three-second shot showing several listeners waiting for one fill.

**References:** [C01](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C01), `miss` / `hit`; [C06](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C06), coalesced refresh.

**Sample inside valkey-cli**

```console
valkey> GET demo:artist:pacific-june
(nil)
valkey> SET demo:artist:pacific-june '{"name":"Pacific June","genre":"US pop"}' EX 60
OK
```

The application database read occurs between the commands.

## 01:10–01:50 | Cache-aside writes

**Voiceover**

“When Pacific June's catalog metadata changes, commit the update to the database, then invalidate the cached artist page. The next read rebuilds it.

“A failed invalidation needs repair. A concurrent reader can also refill an older value around the update. Expiry helps limit how long an entry lives, while versioning and coordination address stronger freshness requirements.

“Cache-aside is a practical starting point for read-heavy catalog data that tolerates a defined amount of staleness.”

**On screen:** `Commit` then `Invalidate` then `Reload`.

**Animation**

Light Application → Database. Update the album count only after commit. Then light DEL and remove the older Pacific June artist-page card. The application shows ACK after invalidation succeeds in this demo contract. On the next shot, a read loads the updated page.

**Reference:** [C03 — cache-aside writes](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C03), normal commit/invalidate path; use its race scenario only for the final sentence.

**Application sample**

```python
database.update_artist(artist_id="pacific-june", albums=5)
cache.delete("demo:artist:pacific-june")
return success()
```

This is pseudocode. Both calls need error handling; a cache failure after database commit does not undo the database write.

## 01:50–02:40 | Write-through

**Voiceover**

“Binbin adds a track by Camden Echoes, a fictional British arena-pop band, to a playlist called Global Friday. With write-through, the application updates the database and the cache in the request path. It reports success only after both contain the new playlist version.

“The next device can read the updated playlist from Valkey without another database query. The write carries the latency of the coordinated path.

“The two systems still fail independently. If the database succeeds and the cache update fails, the coordinator needs retry or repair. Playlist versions prevent an older edit from overwriting a newer cached value.”

**On screen:** `Write-through` then `Commit → cache → ACK`.

**Animation**

Keep the database and cache separate. First add the Camden Echoes track to the database playlist. Then update the cached playlist. Only then return ACK. In a fresh shot, interrupt the cache arrow and place a single `Repair` label next to the coordinator.

**Reference:** [C02 — write-through](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C02), `success`, then `partial`.

**Application sample**

```python
committed = database.add_track(
    playlist_id="global-friday",
    track_id="camden-echoes-track",
)
cache.set("demo:playlist:global-friday", committed, ex=60)
return success()
```

Use a brief terminal insert showing only the actual cache write:

```console
valkey> SET demo:playlist:global-friday '{"version":8,"tracks":31}' EX 60
OK
```

Valkey core needs the coordinator to write the external database; this is application behaviour.

## 02:40–03:35 | Write-behind

**Voiceover**

“Hari plays a track by Seoul Spectrum, a fictional K-pop group. The service needs the event for listening history, recommendations, and royalty reporting, but the listener should not wait for every database write. With write-behind, the application records the event and pending write intent, then returns success under a defined durability contract. A worker writes to the database later.

“This can absorb a temporary burst while the database catches up. A finite buffer buys time. If incoming writes keep exceeding the worker's throughput, the backlog grows until you need more capacity or backpressure.

“Pending listening events need retention, recovery, and safe retries. Include an event identity so a retry does not count the same play twice.”

**On screen:** `Write-behind` then `Accepted` then `Committed`.

**Animation**

Show a Seoul Spectrum play event and its write-intent card entering Valkey together. Return ACK while the analytics database is still behind. Pause on that difference. Then introduce the Worker, move the full event to the database, commit it, and send an acknowledgement to the pending queue.

**References:** [C04 — write-back](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C04), async flush; [C11 — buffer overload](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C11). The library calls this write-back; the video's write-behind term describes the same deferred database-write pattern.

**Demo excerpt, one CLI connection**

```console
valkey> MULTI
OK
valkey> INCR demo:plays:{seoul-spectrum}:track-42
QUEUED
valkey> XADD demo:pending:{seoul-spectrum} * listener hari track_id 42 event_id play-8
QUEUED
valkey> EXEC
```

Both keys share `{seoul-spectrum}` for cluster colocation. The Stream stores the full pending event independently of the counter.

## 03:35–04:15 | Follow the failure

**Voiceover**

“Pause the worker. Valkey still contains the new listening event, while the analytics database remains behind. Keep the queue visible and watch its oldest item.

“When the worker returns, it reads pending work, commits the listening event, and acknowledges it. If it crashes after committing but before acknowledgement, it can retry. The database must recognise the same event and avoid counting it twice.

“That accepted-versus-committed distinction defines what the user was promised.”

**On screen:** `Worker paused` then `Retry safely`.

**Animation**

One pending item grows older. Bring the Worker back and drain it. Show a replay of the same operation identity and a database badge reading `Already applied`; acknowledge after that safe result. Do not portray a successful queue append as proof of disk durability.

**Reference:** [C04](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C04), failure; [U07](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U07), `duplicate`.

**Worker sample**

```python
event = read_from_consumer_group()
database.record_play_once(
    listener=event.listener,
    track_id=event.track_id,
    event_id=event.event_id,
)
acknowledge(event)
```

This is a worker contract, not a built-in Valkey-to-database adapter. Acknowledge only after the commit or confirmed idempotent replay.

## 04:15–04:45 | Choose by the contract

**Voiceover**

“Use cache-aside for reusable queries such as the artist page Viktor opens. Use write-through when Binbin's playlist edit should be cached immediately after it commits. Use write-behind when Hari's listening event can reach the database later and the pending pipeline is durable enough.

“Everything that can be queried, can be cached. The real question is whether the result is reusable, how fresh it must be, and what failure contract the listener was promised.”

**On screen:** Three separate cards:

```text
Cache-aside: commit, invalidate
Write-through: commit, cache
Write-behind: accept, commit later
```

**Animation**

Use three sequential full-screen shots of the same ACK badge at its respective point. Do not introduce a dense comparison table into the video.

**Reference:** [C08 — choose the acknowledgement contract](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C08).

## 04:45–05:00 | Next experiment

**Voiceover**

“Record a read, a write, and a failure for your chosen strategy. Measure database work, cache hits, stale responses, and queue lag. Then size the system for the work that remains.”

**On screen:** `Read. Write. Failure.`

**Animation**

Reveal those three words individually over the application node. End on the Valkey logo and companion notes.

## Recording preparation

Use isolated artist, playlist, and listening-event records with the demo keys named above. Capture the database's committed value beside the cache value only when teaching acknowledgement. Keep each shot focused on one music-service workload.

For write-behind, prepare the worker's consumer group before recording and retain full pending intents until committed. Show its paused/resumed state. Configure and document the acknowledgement's persistence expectations in the companion environment; the script does not assert durability from MULTI alone.

Inspect every EXEC reply before accepting the write: a command that fails at execution time does not roll back earlier commands. The demo assumes clean keys with the expected types.

The examples are source-checked templates. Cross-system samples are pseudocode; no live database, worker, or failure scenario was run while drafting.

## Primary sources and references

- Local C01–C04 and C08 supply the read/write sequences, coordinator, partial failures, and acknowledgement contracts.
- Local C06 supplies stampede control; C11 supplies bounded-buffer behaviour.
- [Cache-aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) — miss and write/invalidate sequence.
- [SET](https://valkey.io/commands/set/) — cache write and expiry.
- [Transactions](https://valkey.io/topics/transactions/) — grouped commands, without cross-system transactions or runtime rollback.
- [Streams](https://valkey.io/topics/streams-intro/) — retained intent, consumer groups, replay, acknowledgement.
- [Persistence](https://valkey.io/topics/persistence/) — queue recovery and acknowledgement durability choices.

Source review: October 11, 2026.
