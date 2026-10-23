# Five Valkey use cases you can demonstrate

Recording script and animation brief. Planned runtime: **5:00**, including demo holds. Audience: application developers. Examples use core commands so the episode can stand independently of the 9.2 preview.

## Opening hook

“Are traffic peaks forcing you to keep adding servers? Before you add capacity, look at repeated reads, session state, background jobs, rankings, and request limits.”

Alternate hook: “Your application has more servers, but the database is still struggling. Which work could you move into a shared in-memory layer?”

## Visual contract

Follow five players through one multiplayer game platform, assigning one player to each use case. Every chapter uses the same sequence: show the application problem first, label it `Problem`, then introduce the Valkey-backed path and label it `Solution`. Each chapter gets a simplified library diagram, a short command demo, and one consequence. Keep a maximum of four primary components visible, except the session shot with two app instances. Show one active path. Use three-word labels and a single short headline. Switch to a full-screen terminal for commands.

## 00:00–00:20 | The scaling question

**Voiceover**

“A multiplayer game becomes popular. More application servers handle more players, but five problems remain: repeated database reads, sessions tied to one server, slow background work, constantly changing rankings, and request limits split across gateways. Let's follow five players through the application and solve each problem with Valkey.”

**On screen:** `Where does the work go?`

**Animation**

Start with Madelyn, Jacob, Zhao, Paty, and Robert entering the game platform. Show the application scaling from one server to three while the database, local sessions, synchronous worker, leaderboard, and gateways remain under pressure. Introduce the five problems as short title flashes, never as five detailed panels.

**Reference:** [C12 — traffic and caching](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C12).

## 00:20–01:10 | 1. Cache repeated reads

**Voiceover**

“First problem: Madelyn opens a popular game's page. Every player request runs the same catalog query against the database. Adding application servers only creates more identical reads.

“The solution is cache-aside. The application checks Valkey first. On a miss, it reads the database and stores the game details with an expiry. Matching requests reuse that result.

“The cache key must include every input that changes the result. When the game details change, invalidate the affected entry. Measure database reads alongside cache hits.”

**On screen:** `Problem: repeated reads` then `Solution: cache-aside` then `Miss` then `Hit`.

**Animation**

Begin with several requests for the same game card reaching the database. Then replay U01's cold path and warm path. Let the game card return from Valkey on the second request; leave the database dim. Discuss invalidation in a new shot with one DEL arrow.

**References:** [U01](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U01), `pg-cold` / `pg-warm`; [C03](../../Valkey_Demo_Library/animations/Valkey_Caching_Strategies.html#C03).

**Demo**

```console
valkey> GET demo:game:42
(nil)
valkey> SET demo:game:42 '{"name":"Star Arena","mode":"ranked"}' EX 60
OK
valkey> GET demo:game:42
"{\"name\":\"Star Arena\",\"mode\":\"ranked\"}"
```

The database read between GET and SET is application work. Depict it in the diagram, then show the commands.

## 01:10–02:00 | 2. Share sessions across app instances

**Voiceover**

“Second problem: Jacob signs in through server A. Their next request lands on server B. If the session exists only in server A's memory, server B does not know who they are.

“The solution is a shared session store. Save the session in Valkey and give the browser an opaque identifier. Both application servers can load the same record. Here, the session fields and expiration are created together in a transaction.

“The application still authenticates Jacob, generates a secure identifier, and checks permissions. Set an explicit lifetime and delete the session when they log out.”

**On screen:** `Problem: local session` then `Solution: shared session`.

**Animation**

Show Browser → App A → Valkey. Hold the shared record. Cut to Browser → App B → the same record. The browser carries only a small ID badge. Keep authentication outside the Valkey node.

**Reference:** [U02 — shared session store](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U02), `login-roam`, then `logout`.

**Demo in one CLI connection**

```console
valkey> MULTI
OK
valkey> HSET demo:session:opaque-demo-id user_id jacob role player
QUEUED
valkey> EXPIRE demo:session:opaque-demo-id 1800
QUEUED
valkey> EXEC
1) (integer) 2
2) (integer) 1
valkey> HGET demo:session:opaque-demo-id user_id
"jacob"
```

Use a fixed identifier only for this isolated demo. In the diagram, label it `session ID`, without showing credentials.

## 02:00–02:55 | 3. Distribute background work

**Voiceover**

“Third problem: Zhao finishes a match. Calculating rewards, updating history, and sending analytics inside the request would keep them waiting. A server failure could also lose unfinished work.

“The solution is a Stream. The application appends a match-completed event and responds without waiting for every background task. Workers in a consumer group process new events and acknowledge completed work.

“A delivered event remains pending until acknowledgement. If a worker fails, another worker can claim it and retry. Make reward processing safe to repeat, because a worker can finish the external effect and fail before acknowledging it.”

**On screen:** `Problem: slow request` then `Solution: Stream` then `Pending` then `Acknowledged`.

**Animation**

Show Producer → Stream → Worker A. The job stays represented in the Stream while it becomes pending. After processing, send an ACK back. In a separate shot, dim Worker A and transfer the pending job to Worker B. The job does not disappear merely because it was acknowledged.

**Reference:** [U07 — work queues](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U07), `ack`, then `reclaim`.

**Demo**

```console
valkey> XGROUP CREATE demo:matches processors 0 MKSTREAM
OK
valkey> XADD demo:matches 1-0 player zhao result win
"1-0"
valkey> XREADGROUP GROUP processors worker-a COUNT 1 STREAMS demo:matches >
valkey> XACK demo:matches processors 1-0
(integer) 1
valkey> XLEN demo:matches
(integer) 1
```

Before recording, reset this named demo Stream. ID `1-0` is a deterministic teaching ID; applications normally use `*`. Show the actual XREADGROUP response rather than reconstructing it.

## 02:55–03:45 | 4. Keep a leaderboard ordered

**Voiceover**

“Fourth problem: a completed match changes Paty's score. The platform must update rankings frequently and return the current leaders without sorting every player for every request.

“The solution is a sorted set. Each player is stored with a numeric score. ZINCRBY changes Paty's score atomically, and the next reverse-range query returns the updated order.

“Define ties and season boundaries. If match events can be retried, prevent the same result from increasing Paty's score twice.”

**On screen:** `Problem: sort every read` then `Solution: sorted set`.

**Animation**

Start with three rows: Madelyn 120, Zhao 110, Paty 100. Animate only Paty changing to 150 and moving above Madelyn. Hold the final order before showing the terminal.

**Reference:** [U08 — leaderboards](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U08), `reorder`.

**Demo**

```console
valkey> ZADD demo:leaderboard 100 paty 120 madelyn 110 zhao
(integer) 3
valkey> ZINCRBY demo:leaderboard 50 paty
"150"
valkey> ZRANGE demo:leaderboard 0 2 REV WITHSCORES
1) "paty"
2) "150"
3) "madelyn"
4) "120"
5) "zhao"
6) "110"
```

## 03:45–04:40 | 5. Enforce one shared rate limit

**Voiceover**

“Fifth problem: Robert's game client calls the platform through several gateways. If each gateway maintains its own counter, adding gateways can multiply their request allowance.

“The solution is one shared rate-limit counter in Valkey. This demonstration allows three requests in ten seconds. A short script increments the counter, sets its expiry on first use, and returns the decision atomically.

“Every gateway now sees the same budget. The fourth request is rejected before reaching the application. This is a fixed window; token-bucket and sliding-window policies offer different burst and accuracy trade-offs.”

**On screen:** `Problem: split limits` then `Solution: shared budget` then `Next request: 429`.

**Animation**

Show Gateway A and Gateway B feeding the same counter in Valkey. Send three numbered requests, alternating gateways. Mark the next request rejected at the gateway, before it reaches the backend. Then show the timer releasing the budget.

**Reference:** [U05 — distributed rate limiting](../../Valkey_Demo_Library/animations/Valkey_Use_Cases.html#U05), `shared-budget`. Adapt its token-bucket picture to the fixed-window demo; use a counter and timer instead of refill tokens.

**Visible application demo**

```text
Request 1 → allowed
Request 2 → allowed
Request 3 → allowed
Request 4 → HTTP 429
```

Capture these from the demo application if available. Otherwise label the sequence `Illustrative application responses`. HTTP status is chosen by the gateway, not returned directly by Valkey.

## 04:40–05:00 | Pick one pattern

**Voiceover**

“Five players exposed five scaling problems. One shared in-memory layer now reuses game data, shares sessions, processes match events, updates rankings, and enforces request limits. Start with one problem in your application. Choose the data structure that matches it, then measure the result.”

**On screen:** `Next: caching strategies`.

**Animation**

Replay the five players as five short stops connected by one line. End on the five Valkey structures, then hold the next-episode title for three seconds.

## Rate-limiter sample for preparation

This Lua script implements the fixed-window demo. Pass the same key from both gateways. Counts include attempts rejected after the limit.

```lua
local n = redis.call("INCR", KEYS[1])
if n == 1 then
    redis.call("EXPIRE", KEYS[1], tonumber(ARGV[2]))
end
local allowed = 0
if n <= tonumber(ARGV[1]) then allowed = 1 end
return {allowed, n, redis.call("TTL", KEYS[1])}
```

One interactive CLI command, repeated four times within ten seconds:

```text
EVAL "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],tonumber(ARGV[2])) end; local a=0; if n<=tonumber(ARGV[1]) then a=1 end; return {a,n,redis.call('TTL',KEYS[1])}" 1 demo:rate:{robert} 3 10
```

The first reply field is 1 for allow and 0 for reject. The key expires ten seconds after the first request; later requests do not refresh the window. A client retry can count again. This demonstrates the policy, not a complete traffic-management service.

## Recording notes

Prepare only the keys named in this script. Session commands require one connection for MULTI/EXEC. Use RESP2 for the displayed leaderboard reply. Record the first three Lua calls and the fourth rejection close together. Leave long command bodies in the companion notes; show the application result in the video.

Expected replies assume clean demo keys and correct types. Samples are source-checked, not executed during script creation.

## Primary sources

- [SET](https://valkey.io/commands/set/) and [cache-aside](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside) — cache fill, expiry, invalidation.
- [Transactions](https://valkey.io/topics/transactions/) — grouped session writes.
- [Streams](https://valkey.io/topics/streams-intro/) — consumer groups, acknowledgement, reclaim, retention.
- [ZINCRBY](https://valkey.io/commands/zincrby/) and [ZRANGE](https://valkey.io/commands/zrange/) — sorted-set update and order.
- [EVAL](https://valkey.io/commands/eval/) — Lua invocation and key arguments.
- The local U02 and U05 scene descriptions supply the application-level session and limiter context.

Source review: October 11, 2026.
