# Turbocharge Your Postgres

**High-Performance Caching and Async Writes with Valkey.** Slidev deck for PgDay México, November 13, 2026 (about 40 minutes). Session abstract: [`TurbochargeYourPostgresHighPerformanceCachingAndAsyncWritesWithValkey.md`](TurbochargeYourPostgresHighPerformanceCachingAndAsyncWritesWithValkey.md).

The story: memory is 100x+ faster than disk; PostgreSQL is a disk-first engine that caches pages, not answers, and needs a proxy to scale out; the Flights schema and its normalization gaps; three queries that climb from 1.4 ms to 8 s; the EXPLAIN of the six-way join; the AWS Advanced JDBC Wrapper Remote Query Cache Plugin from plain JDBC and Hibernate; a live demo with Valkey Admin; and write-behind on a Valkey stream.

## Run

Requires Node.js 20.19 or later and pnpm. On the Cloud Desktop the default Node is 18, so run everything through Node 22 from mise (corepack provides pnpm):

```bash
cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX
mise exec node@22 -- corepack pnpm install --frozen-lockfile
mise exec node@22 -- corepack pnpm run dev      # http://localhost:3030 (binds 127.0.0.1)
mise exec node@22 -- corepack pnpm run build
mise exec node@22 -- corepack pnpm run export   # PDF (needs playwright-chromium)
```

Presenter identity defaults live in `vite.config.mjs`; copy `.env.example` to `.env` to override. `pnpm-lock.yaml` is shared with `caching-as-a-reliability-lever`: a fresh resolution pulls `markdown-it` 15, which breaks `@slidev/cli` 52.19.1.

## Presenting from the Cloud Desktop

The deck, the database stack, the demo API, and Valkey Admin all run on the Cloud Desktop (`dev-dsk-rberoj-1d-8f08d073.us-east-1.amazon.com`), bound to loopback. The laptop only runs a browser, an SSH tunnel, and an SSH terminal for the demo.

### Paths (Cloud Desktop)

| What | Path |
| --- | --- |
| This deck | `/workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX` |
| Demo script and run sheet | `.../2026-11-13_MEX_PgDayMX/demo/demo.sh`, [`demo/JDBC_DEMO.md`](demo/JDBC_DEMO.md) |
| PostgreSQL + Valkey stack | `/workplace/rberoj/code/GitHub/rlunar/rberoj/databases/postgresql/postgrespro/infrastructure` |
| Demo API (Spring Boot) | `/workplace/rberoj/code/GitHub/aws-samples/aws-amazon-elasticache-samples/jdbc-caching-demo/backend` |

### Ports

Every service gets its own port, and every one binds to `127.0.0.1` on the Cloud Desktop. The tunnel uses the **same port numbers** on the laptop, because the live slide iframes `http://127.0.0.1:8080/` and the Valkey Admin slide links to `http://127.0.0.1:8081`.

| Service | Cloud Desktop | Tunneled to laptop |
| --- | --- | --- |
| Slidev (deck, presenter view) | `127.0.0.1:3030` | `127.0.0.1:3030` |
| Demo API + web UI (Spring Boot) | `127.0.0.1:8080` | `127.0.0.1:8080` |
| Valkey Admin (container port 8080) | `127.0.0.1:8081` | `127.0.0.1:8081` |
| pgAdmin (optional) | `127.0.0.1:5050` | `127.0.0.1:5050` |
| PostgreSQL | `127.0.0.1:5432` | not tunneled (`demo.sh` uses `docker exec`) |
| Valkey | `127.0.0.1:6379` | not tunneled (`demo.sh` uses `docker exec`) |
| Vite dev server (`run.sh` only) | `5173` | not used: Spring Boot serves the built UI on 8080 |

None of these clash with what the Cloud Desktop already listens on (22, 53, 2009, 2010, 2014, 3027, 7443, 8444, 8953, and a few high ports, as of 2026-11-13). To recheck on the desktop:

```bash
ss -Hltn | awk '{print $4}' | grep -E ':(3030|8080|8081|5050|5432|6379)$'
```

Expected: `5432`, `6379`, `5050`, and `8081` once the stack and Valkey Admin are up, `3030` once Slidev runs, and `8080` once the API runs. Each must show `127.0.0.1` (or `[::ffff:127.0.0.1]`), never `0.0.0.0` or `*`.

On the **laptop**, make sure nothing local already holds the tunneled ports (a local Tomcat, Jenkins, or another dev server often takes 8080):

```bash
lsof -nP -iTCP -sTCP:LISTEN | grep -E ':(3030|8080|8081|5050) '   # expect no output
```

If one is taken, stop that local process. Don't remap the port: the deck's iframe and link expect these exact numbers.

### The day before: one-time setup (Cloud Desktop)

Follow [`demo/JDBC_DEMO.md`](demo/JDBC_DEMO.md#one-time-setup): import `airtravel_2y`, create the `jdbc_demo` role, write `backend/.env`, and build the jar with `./gradlew bootJar`. Then do a full rehearsal without prompts:

```bash
cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo
DEMO_YES=1 ./demo.sh all
```

### 30 minutes before: start everything (Cloud Desktop)

Use `tmux` so nothing stops if SSH drops on the venue Wi-Fi:

```bash
ssh dev-dsk-rberoj-1d-8f08d073.us-east-1.amazon.com
tmux new -s pgday
```

Window 1, the stack (PostgreSQL, Valkey, pgAdmin):

```bash
cd /workplace/rberoj/code/GitHub/rlunar/rberoj/databases/postgresql/postgrespro/infrastructure
./run-demo.sh start
./run-demo.sh status
```

Window 2 (`Ctrl-b c`), the deck:

```bash
cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX
mise exec node@22 -- corepack pnpm run dev
```

Window 3 (`Ctrl-b c`), the demo API and Valkey Admin:

```bash
cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo
./demo.sh preflight   # starts the API on 127.0.0.1:8080 if needed, checks it is loopback only
./demo.sh admin       # starts Valkey Admin on 127.0.0.1:8081
./demo.sh reset       # empty cache and zeroed hit/miss counters for the talk
```

Detach with `Ctrl-b d`. Everything keeps running.

### On the laptop: tunnel, browser, terminal

1. Authenticate: `mwinit`.
2. Open the tunnel and leave it running in its own terminal. `ExitOnForwardFailure` makes it fail loudly instead of silently skipping a port that is already in use on the laptop:

   ```bash
   ssh -N \
     -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3 \
     -L 127.0.0.1:3030:127.0.0.1:3030 \
     -L 127.0.0.1:8080:127.0.0.1:8080 \
     -L 127.0.0.1:8081:127.0.0.1:8081 \
     -L 127.0.0.1:5050:127.0.0.1:5050 \
     dev-dsk-rberoj-1d-8f08d073.us-east-1.amazon.com
   ```

   The laptop end binds to `127.0.0.1` only, so nobody else on the venue network can reach the demo API or Valkey Admin through your laptop.

3. Browser tabs:
   - `http://127.0.0.1:3030/presenter/`: presenter view on the laptop screen
   - `http://127.0.0.1:3030/`: the deck, on the projector (or press `p` to toggle)
   - `http://127.0.0.1:8081`: Valkey Admin. The first time, add the connection: host `valkey`, port `6379`, user `default`, password `VALKEY_PASSWORD` from the stack `.env`, **Use TLS unchecked**. Leave it on the Dashboard.
   - `http://127.0.0.1:8080/`: the demo web UI (also shown inside the deck's live slide)
4. Demo terminal: a second SSH session with a large font (24 pt or more) and a dark theme:

   ```bash
   ssh dev-dsk-rberoj-1d-8f08d073.us-east-1.amazon.com
   cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo
   ./demo.sh preflight
   ```

5. Smoke test from the laptop: `curl -s http://127.0.0.1:8080/api/connections/status` should return JSON, and the deck's live slide should show the app.

### During the talk

At Part 5 (Live demo), switch to the demo terminal:

```bash
./demo.sh all        # query, reset, connect, direct x2, cached x4, compare, keys, plan, q3, admin
```

Or go step by step: `./demo.sh connect`, `direct`, `cached`, `compare`, `keys`, then switch to the Valkey Admin tab (Dashboard hit ratio, then **Send Command** with [`demo/list-cache-keys.txt`](demo/list-cache-keys.txt)). Over SSH, `demo.sh admin` prints the URL instead of opening a browser on the desktop. Details and expected output for each step: [`demo/JDBC_DEMO.md`](demo/JDBC_DEMO.md).

Fallbacks:

| Problem | Do this |
| --- | --- |
| Tunnel dropped | Rerun the `ssh -N ...` command; the tmux session on the desktop kept everything running |
| Live slide is blank | API down: `./demo.sh preflight` in the demo terminal |
| `ssh: bind ... Address already in use` | A laptop process holds the port: find it with `lsof -nP -iTCP:<port> -sTCP:LISTEN` and stop it |
| Terminal hard to read in the room | Use the web UI at `http://127.0.0.1:8080/` (the deck's live slide) |
| Valkey Admin stuck on "Connecting..." | Uncheck **Use TLS** in the connection |

### After the talk

On the Cloud Desktop:

```bash
pkill -f sample-app.jar                                                    # demo API
cd /workplace/rberoj/code/GitHub/valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo
docker compose --env-file /workplace/rberoj/code/GitHub/rlunar/rberoj/databases/postgresql/postgrespro/infrastructure/.env \
  -f compose.valkey-admin.yaml down                                       # Valkey Admin
cd /workplace/rberoj/code/GitHub/rlunar/rberoj/databases/postgresql/postgrespro/infrastructure
./run-demo.sh stop                                                         # stack, data kept
tmux kill-session -t pgday
```

On the laptop, `Ctrl-C` the tunnel.

## Layout

- `slides.md`: the deck, with speaker notes and `[click]` markers that follow each diagram step. Minimal on-slide text (a short eyebrow and a one-line title; details live in the speaker notes), at most 25 lines per code block, no em dashes, matching the other decks.
- `style.css`: the Valkey visual system from `caching-as-a-reliability-lever`, plus PgDay additions at the end.
- `setup/shiki.ts`: Monokai, with `sql`, `java`, `bash`, `yaml`, `properties`, `text`.
- `slide-top.vue`: footer with event name, page counter, and logo; hidden on the full-bleed live demo slide.
- `components/`: D3 diagrams, each `<Component :step="$clicks" />` with a matching `clicks:` in the frontmatter.
- `demo/`: `demo.sh` (gum CLI for the live demo), `JDBC_DEMO.md` (step-by-step run sheet), the Valkey Admin compose file, and the key-listing command.
- `assets/public/images/`: headshot only. The deck has no demo screenshots; the demo runs live from the terminal.

| Component | Slide | Steps |
| --- | --- | --- |
| `LatencyLadder.vue` | RAM vs SSD vs disk on a log scale, then in human time | 4 |
| `PostgresArchitecture.vue` | process per connection, pages not answers, one writer, proxy, the missing tier | 5 |
| `SchemaDiagram.vue` | ERD of the 9 tables with each normalization gap flagged | 6 |
| `QueryLadder.vue` | Q1/Q2/Q3 latency and buffers per row returned | 4 |
| `ExplainTree.vue` | the Q3 plan as a tree, hot spot and sort spill in red | 6 |
| `QueryCacheFlow.vue` | hint, key, miss, async fill, hit, fail open | 6 |
| `DemoArchitecture.vue` | the live demo stack, loopback only | 5 |
| `MeasuredRuns.vue` | two direct runs, one miss, four hits, the ratio | 4 |
| `WriteBehindFlow.vue` | XADD, ack, XREADGROUP, batched insert, XACK, the price | 6 |
| `TerminalWindow.vue`, `StepBar.vue`, `BrandLogo.vue`, `PresenterIdentity.vue`, `diagram-kit.js` | shared, copied from `caching-as-a-reliability-lever` | |

Code slides use Slidev line highlighting (`{all|1-5|...}`) and one Magic Move (normalizing `tickets`).

## Where the numbers come from

All measured on the author's machine, November 2026:

- Database: Postgres Pro airline demo `airtravel_2y` (11 GB; segments 27.6M, boarding_passes 26.3M, tickets 21.1M, bookings 9.7M rows), PostgreSQL 18.6 in a container capped at 512 MB, `shared_buffers=128MB`, `track_io_timing=on`, from [`rlunar/rberoj/databases/postgresql/postgrespro`](../../../../rlunar/rberoj/databases/postgresql/postgrespro).
- Q1 (manifest by `flight_id`): 1.4 ms, 235 buffers. Q2 (30-day revenue on `bookings`, no `book_date` index): 1,815 ms, 9.3M rows removed by filter, 9 MB sort spill. Q3 (6-way join, 90 days): 8.1 to 10.1 s across runs, 3.28M joined rows, 2.08M buffers, 160 MB sort spill, 20 rows. All from `EXPLAIN (ANALYZE, BUFFERS)`.
- Demo runs (`jdbc-caching-demo`, `DEMO_QUERY=airtravel`, 30-day query): direct 1,267 and 1,250 ms; cached 1,443 (miss), 9, 4, 3, 2 ms. Key: `jdbc-demo:` + 48-byte hash, string, about 15 KB, TTL 300 s.
- Hibernate: Hibernate ORM 6.6.59 + wrapper 3.3.0 + `jakarta.persistence`, both the `@NamedQuery` hint and `setHint("org.hibernate.comment", ...)` produced cached keys (TTL 300 s and 120 s); the emitted SQL on the slide is verbatim.
- The latency ladder uses the classic order-of-magnitude figures (100 ns RAM, 150 µs SSD random read, 10 ms disk seek) and says so on the slide.

## JDBC driver demo

The live demo is the [`jdbc-caching-demo`](https://github.com/aws-samples/aws-amazon-elasticache-samples) Spring Boot API (with a React UI on the same port). It runs the same SQL over two JDBC connections against the same `airtravel_2y` database and one Valkey:

| Connection | JDBC URL | Path |
| --- | --- | --- |
| direct | `jdbc:postgresql://127.0.0.1:5432/airtravel_2y?sslmode=disable` | PostgreSQL every time |
| cached | `jdbc:aws-wrapper:postgresql://127.0.0.1:5432/airtravel_2y?sslmode=disable` | Valkey first, PostgreSQL on a miss |

The cached connection uses AWS Advanced JDBC Wrapper 3.3.0 (`software.amazon.jdbc:aws-advanced-jdbc-wrapper`) with these driver properties, set in `backend/src/main/java/com/example/QueryService.java`:

```properties
wrapperPlugins=remoteQueryCache
cacheEndpointAddrRw=127.0.0.1:6379
cacheEndpointAddrRo=127.0.0.1:6379
cacheUseSSL=false
cacheUsername=default
cachePassword=<VALKEY_PASSWORD from the stack .env>
cacheKeyPrefix=jdbc-demo:
cacheConnectionTimeoutMs=5000
cacheConnectionPoolSize=10
failWhenCacheDown=false
```

- Opt-in per statement: only SQL that starts with `/* CACHE_PARAM(ttl=300s) */` is cached. The API prepends it on `/api/query/cached?ttl=...`; everything else goes straight to PostgreSQL.
- Keys: `jdbc-demo:` plus a 48-byte binary hash of database user, schema, and SQL text. One string per distinct statement, about 15 KB for the 20-row result, TTL 300 s.
- Fail open: with `failWhenCacheDown=false`, a Valkey outage makes the cached path slow, not broken. A wrong `CACHE_PASSWORD` therefore looks like "never hits", not an error.
- Database access: the API connects as `jdbc_demo`, a read-only role with `SELECT` on the `bookings` schema only, read-only transactions, and a 60 s statement timeout (`setup_airtravel_role.sql`).
- Configuration: `backend/.env` (git-ignored) holds `DEMO_QUERY=airtravel`, the `DB_*` and `CACHE_*` values; the template is in [`demo/JDBC_DEMO.md`](demo/JDBC_DEMO.md#3-backendenv-git-ignored).

### API endpoints

| Endpoint | What it does |
| --- | --- |
| `POST /api/connections/connect` | Opens both connections once, so latencies exclude connection setup |
| `POST /api/connections/disconnect` | Closes both |
| `GET /api/connections/status` | `direct` / `cached` connection state (the smoke test) |
| `GET /api/query/info` | The built-in query text |
| `GET /api/query/direct[?includePlan=true]` | Runs it over plain JDBC, optionally with `EXPLAIN ANALYZE` |
| `GET /api/query/cached?ttl=300s` | Runs it through the wrapper with the cache hint |

Both query endpoints also take `sql=` for custom SQL (used for Q3).

### `demo.sh` steps

`demo/demo.sh` wraps the API, `docker exec` into the PostgreSQL and Valkey containers (no local `psql` or `valkey-cli`, and the Valkey password never leaves its container), and [gum](https://github.com/charmbracelet/gum) for the stage UI. `./demo.sh` opens a menu; `./demo.sh all` runs every step with "Next" between them; `DEMO_YES=1` skips the prompts for rehearsal.

| Step | Command | Shows | Expected |
| --- | --- | --- | --- |
| 0 | `preflight` | tools, containers, database, role, Valkey `PING`, API on loopback | all green |
| 1 | `admin` | starts Valkey Admin on `127.0.0.1:8081` | Dashboard tab |
| 2 | `query` | the 30-day top-routes query over `flights`, `routes`, `segments` | SQL text |
| 3 | `reset` | deletes `jdbc-demo:*` keys, `CONFIG RESETSTAT` | hit ratio at zero |
| 4 | `connect` | opens both connections | `connected` x2 |
| 5 | `direct` | two direct runs | about 1,250 to 1,330 ms each |
| 6 | `cached` | four cached runs, HIT/MISS from `keyspace_hits`/`keyspace_misses` | one miss about 1,450 ms, then 2 to 10 ms |
| 7 | `compare` | every run so far and the ratio | about 200x |
| 8 | `keys` | key, type, TTL, size, hits, misses, memory | one key, about 15 KB, TTL under 300 s |
| 9 | `plan` | `EXPLAIN ANALYZE` of the direct path in a pager | the nested loop over `segments` |
| 10 | `q3` (optional) | the deck's six-way join through the same API | direct about 11 s, hit 4 ms |

Deck numbers (the `MeasuredRuns` slide) come from a rehearsal: direct 1,267 and 1,250 ms; cached 1,443 (miss), 9, 4, 3, 2 ms. Expect a few percent of drift between runs.

Full run sheet with raw commands, expected output, Valkey Admin connection fields, and troubleshooting: [`demo/JDBC_DEMO.md`](demo/JDBC_DEMO.md). How to start, tunnel, and run it on stage: [Presenting from the Cloud Desktop](#presenting-from-the-cloud-desktop). Valkey Admin sends `X-Frame-Options: SAMEORIGIN`, so it opens in its own tab, not inside the deck.

### Known limitation: Valkey Admin Key Browser and binary keys

The plugin's keys are `cacheKeyPrefix` followed by a raw binary hash. Valkey Admin 1.3.0 (and `edge` as of 2026-11-13) fails to list them: `Decoding error: 'Error: invalid utf-8 sequence of 1 bytes from index 10'`, and the Key Browser then shows no keys at all. The Dashboard and Send Command work, which is what the deck uses. Worth reporting upstream at [valkey-io/valkey-admin](https://github.com/valkey-io/valkey-admin/issues).

## Security

Everything is loopback only: PostgreSQL `127.0.0.1:5432`, Valkey `127.0.0.1:6379`, pgAdmin `127.0.0.1:5050`, demo API `127.0.0.1:8080`, Valkey Admin `127.0.0.1:8081`, Slidev `127.0.0.1:3030` (it only binds publicly with `--remote`; don't pass it). Valkey Admin web mode has no login and the demo API runs arbitrary SQL, so never publish either beyond loopback. The only way in from the laptop is the SSH tunnel above, whose laptop end also binds to `127.0.0.1`. `demo.sh` pins the API to `SERVER_ADDRESS=127.0.0.1` and refuses to run if `:8080` listens anywhere else. The compose file takes `VALKEY_PASSWORD` from the stack's `.env` with a fail-fast reference and contains no credential.

## Open items for the speaker

- The abstract names the **Valkey Sink module** for write-behind. No public documentation for it was found when this deck was built, so Part 6 shows the pattern with standard stream commands (`XADD`, `XREADGROUP`, `XACK`, `XAUTOCLAIM`). Swap in the module's API if it ships before the talk.
- The deck is not yet listed in `sessions/slidecks.yaml`; adding it publishes it on the next deploy of the slide decks site.

## Sources

- [Remote Query Cache Plugin](https://github.com/aws/aws-advanced-jdbc-wrapper/blob/main/docs/using-the-jdbc-driver/using-plugins/UsingTheRemoteQueryCachePlugin.md) (AWS Advanced JDBC Wrapper)
- [jdbc-caching-demo](https://github.com/aws-samples/aws-amazon-elasticache-samples) (aws-samples)
- [Postgres Pro demo database](https://postgrespro.com/community/demodb)
- [Valkey Admin Docker deployment](https://valkey-admin.valkey.io/deployment/docker/)
