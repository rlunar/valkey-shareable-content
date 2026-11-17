# JDBC Remote Query Cache demo · step by step

Same SQL, two JDBC connections, one Valkey:

- **direct**: `jdbc:postgresql://` → PostgreSQL 18
- **cached**: `jdbc:aws-wrapper:postgresql://` + `wrapperPlugins=remoteQueryCache` → Valkey first, PostgreSQL on a miss

Every step below has a one-liner with [`demo.sh`](demo.sh) (gum), the raw command it runs, and where it applies, what to show in Valkey Admin.

Everything binds to loopback: PostgreSQL `127.0.0.1:5432`, Valkey `127.0.0.1:6379`, demo API `127.0.0.1:8080`, Valkey Admin `127.0.0.1:8081`. The demo API runs any SQL it receives and Valkey Admin web mode has no login, so never widen those binds. To present from the Cloud Desktop, use the SSH tunnel in the deck's [README](../README.md#presenting-from-the-cloud-desktop) (ports 3030, 8080, 8081, 5050, same numbers on the laptop).

## Repositories

| Path (relative to `GitHub/`) | What |
| --- | --- |
| `rlunar/rberoj/databases/postgresql/postgrespro/infrastructure` | PostgreSQL 18 + Valkey 9 + pgAdmin stack, `run-demo.sh` |
| `aws-samples/aws-amazon-elasticache-samples/jdbc-caching-demo` | Spring Boot API + React UI |
| `valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo` | `demo.sh`, Valkey Admin compose file, this guide |

`demo.sh` finds the first two from its own location. Override with `PG_INFRA_DIR` and `JDBC_DEMO_DIR`.

Tools: `docker`, `gum`, `jq`, `curl`, Java 17+. No local `psql` or `valkey-cli` needed: the script runs both inside the containers, so the Valkey password stays inside the Valkey container.

## One-time setup

### 1. Stack and dataset

```bash
cd rlunar/rberoj/databases/postgresql/postgrespro/infrastructure
cp .env.example .env                 # choose your own passwords
./run-demo.sh import --dataset 2y    # airtravel_2y, ~11 GB, anchored to this week
```

### 2. Read-only role for the demo API

```bash
cd aws-samples/aws-amazon-elasticache-samples/jdbc-caching-demo
docker exec -i postgrespro-demo-postgres-1 \
  psql -X -U postgres -d airtravel_2y -v demo_password='<choose-a-password>' \
  < setup_airtravel_role.sql
```

`jdbc_demo` can only read `bookings`, every transaction is read-only, and queries stop after 60 s.

### 3. `backend/.env` (git-ignored)

```env
DEMO_QUERY=airtravel
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=airtravel_2y
DB_USER=jdbc_demo
DB_PASSWORD=<the password from step 2>
DB_SSLMODE=disable
CACHE_ENDPOINT=127.0.0.1:6379
CACHE_USE_SSL=false
CACHE_USERNAME=default
CACHE_PASSWORD=<VALKEY_PASSWORD from the stack .env>
CACHE_KEY_PREFIX=jdbc-demo:
```

### 4. Build the backend jar (fast start on stage)

```bash
cd aws-samples/aws-amazon-elasticache-samples/jdbc-caching-demo/backend
./gradlew bootJar                    # build/libs/sample-app.jar
```

`demo.sh` starts the jar with `SERVER_ADDRESS=127.0.0.1`. Without the jar it falls back to `./gradlew bootRun`.

## On stage

```bash
cd valkey/valkey-shareable-content/sessions/2026-11-13_MEX_PgDayMX/demo
./demo.sh            # menu
./demo.sh all        # every step, "Next" between steps
```

Rehearsal without prompts: `DEMO_YES=1 ./demo.sh all`.

### Step 0 · Preflight

```bash
./demo.sh preflight
```

Checks the tools, the `postgres` and `valkey` containers, the `airtravel_2y` database, the `jdbc_demo` role, Valkey `PING`, and `backend/.env`. If the API is down, it offers to start it, then refuses to continue if anything listens on `:8080` beyond loopback.

```text
✓ tools: gum jq curl docker
✓ containers: postgres, valkey
✓ database: airtravel_2y
✓ role: jdbc_demo (read-only)
✓ valkey: PONG
✓ api: http://127.0.0.1:8080 (loopback)
✓ valkey admin: http://127.0.0.1:8081
```

### Step 1 · Open Valkey Admin (second tab)

```bash
./demo.sh admin
```

Starts `compose.valkey-admin.yaml` on the stack's network if it is not running (raw: `docker compose --env-file <infra>/.env -f compose.valkey-admin.yaml up -d`), then opens `http://127.0.0.1:8081`.

Add a connection in the UI:

| Field | Value |
| --- | --- |
| Host | `valkey` (the compose service name) |
| Port | `6379` |
| Username | `default` |
| Password | `VALKEY_PASSWORD` from the stack `.env` |
| Use TLS | **unchecked** (it defaults to on, then hangs on "Connecting...") |

Keep the **Dashboard** visible: used memory, ops, and hit ratio move during the next steps.

### Step 2 · The query

```bash
./demo.sh query
```

Raw: `curl -s http://127.0.0.1:8080/api/query/info | jq -r .query`

The built-in query: top 20 routes by revenue, last 30 days, over `flights`, `routes` (temporal join), and the 27.6M-row `segments`. The cached path sends the same text behind one prefix: `/* CACHE_PARAM(ttl=300s) */`.

### Step 3 · Reset

```bash
./demo.sh reset
```

Deletes only the `jdbc-demo:*` keys (one server-side `SCAN` + `DEL` script, since the keys are binary) and runs `CONFIG RESETSTAT`, so hits and misses start at zero. In Valkey Admin, the Dashboard hit ratio resets.

### Step 4 · Connect

```bash
./demo.sh connect
```

Raw: `curl -s -X POST http://127.0.0.1:8080/api/connections/connect`

```text
direct   connected
cached   connected
```

Connections are opened once, so the latencies below exclude connection setup.

### Step 5 · Direct, twice

```bash
./demo.sh direct
```

Raw: `curl -s 'http://127.0.0.1:8080/api/query/direct' | jq .latencyMs`

```text
direct  -   1331 ms   20 rows
direct  -   1282 ms   20 rows
```

Warm buffers do not make the join free.

### Step 6 · Cached, four times

```bash
./demo.sh cached
```

Raw: `curl -s 'http://127.0.0.1:8080/api/query/cached?ttl=300s' | jq .latencyMs`

```text
cached  MISS   1460 ms   20 rows
cached  HIT      10 ms   20 rows
cached  HIT       5 ms   20 rows
cached  HIT       4 ms   20 rows
```

`HIT` and `MISS` come from Valkey's `keyspace_hits` / `keyspace_misses` before and after each call. The miss is slightly slower than direct: database time plus a Valkey round trip, and the plugin fills the key after returning. In Valkey Admin, the Dashboard shows the hit ratio climbing.

### Step 7 · Compare

```bash
./demo.sh compare
```

A table of every run so far and the ratio, for example:

```text
top-routes: direct 1306 ms · cached hit 6 ms · ~206x
```

### Step 8 · The keys

```bash
./demo.sh keys
```

```text
jdbc-demo:<hash 48 bytes>  type=string  ttl=299s  size=15347 B
keyspace_hits     6
keyspace_misses   1
used_memory       1.30M
```

One key per distinct statement: the 10-character prefix plus a 48-byte hash of the database user, schema, and SQL text. One string of ~15 KB for 20 rows, TTL counting down from 300.

**In Valkey Admin**: open **Send Command** and paste [`list-cache-keys.txt`](list-cache-keys.txt). Then `INFO stats` and `TTL` on the key.

Known limitation: Valkey Admin 1.3.0's **Key Browser** cannot list these keys (`invalid utf-8 sequence of 1 bytes from index 10`) because the hash is binary. Dashboard and Send Command work.

### Step 9 · Why direct is slow

```bash
./demo.sh plan
```

Raw: `curl -s 'http://127.0.0.1:8080/api/query/direct?includePlan=true' | jq -r .queryPlan`

`EXPLAIN ANALYZE` in a pager (`q` to quit). Point at the nested loop: ~5,400 flights × ~200 segments = ~1M joined rows, ~670K buffers, for 20 rows out.

### Step 10 · Q3, the six-way join (optional)

```bash
./demo.sh q3
```

The deck's 90-day revenue by city pair and aircraft, sent as custom SQL through the same API:

```text
direct  -   11636 ms   20 rows
cached  MISS 7289 ms   20 rows
cached  HIT     4 ms   20 rows
```

Run `./demo.sh keys` again: two keys now, one per statement.

## Teardown

```bash
pkill -f sample-app.jar                                      # demo API
docker compose --env-file <infra>/.env -f compose.valkey-admin.yaml down   # Valkey Admin
(cd <infra> && ./run-demo.sh stop)                           # stack, data kept
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Cached connection is not open` | Run `./demo.sh connect` |
| Cached run never shows `HIT` | Check `CACHE_PASSWORD` and `CACHE_ENDPOINT` in `backend/.env` and the backend log; with `failWhenCacheDown=false` the plugin falls back to PostgreSQL, so a cache problem can look like "always slow" rather than an error |
| Valkey Admin stuck on "Connecting..." | Uncheck **Use TLS** |
| Key Browser shows no keys | Expected for binary keys; use Send Command or `./demo.sh keys` |
| Backend does not start | `tail $XDG_RUNTIME_DIR/pgday-demo/backend.log` |
