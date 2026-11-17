#!/usr/bin/env bash
# PgDay México 2026 · live demo from the terminal, driven with gum.
#
# Same query, two JDBC connections (direct vs. remoteQueryCache plugin), then
# the keys it leaves in Valkey. Talks to the jdbc-caching-demo API on loopback
# and to the postgrespro-demo containers through `docker exec`, so no password
# is read, printed, or passed on the command line by this script.
#
# Usage:
#   ./demo.sh               menu
#   ./demo.sh all           guided run of every step, pausing between steps
#   ./demo.sh <step>        one step: preflight query reset connect direct
#                           cached compare keys plan q3 admin
#   DEMO_YES=1 ./demo.sh all    no pauses, no confirmations (rehearsal)
#
# Overrides (env): PG_INFRA_DIR, JDBC_DEMO_DIR, DIRECT_RUNS, CACHED_RUNS, CACHE_TTL

set -euo pipefail

# ── Paths and settings ───────────────────────────────────────────────────────

DEMO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GITHUB_ROOT="$(cd "$DEMO_DIR/../../../../.." && pwd)"
PG_INFRA_DIR="${PG_INFRA_DIR:-$GITHUB_ROOT/rlunar/rberoj/databases/postgresql/postgrespro/infrastructure}"
JDBC_DEMO_DIR="${JDBC_DEMO_DIR:-$GITHUB_ROOT/aws-samples/aws-amazon-elasticache-samples/jdbc-caching-demo}"
BACKEND_ENV="$JDBC_DEMO_DIR/backend/.env"

# Loopback only: the demo API runs any SQL it receives and has no login.
API="http://127.0.0.1:8080"
ADMIN_URL="http://127.0.0.1:8081"
COMPOSE_PROJECT="postgrespro-demo"

DIRECT_RUNS="${DIRECT_RUNS:-2}"
CACHED_RUNS="${CACHED_RUNS:-4}"
CACHE_TTL="${CACHE_TTL:-300s}"
DEMO_YES="${DEMO_YES:-0}"

STATE_DIR="${XDG_RUNTIME_DIR:-/tmp}/pgday-demo"
RUNS_FILE="$STATE_DIR/runs.tsv"
BACKEND_LOG="$STATE_DIR/backend.log"
mkdir -p "$STATE_DIR"
chmod 700 "$STATE_DIR"

# Non-secret values from backend/.env (database name and cache key prefix).
env_value() {
  [[ -f "$BACKEND_ENV" ]] || return 0
  sed -n "s/^$1=\([^#[:space:]]*\).*/\1/p" "$BACKEND_ENV" | tail -n 1
}
DB_NAME="$(env_value DB_NAME)";           DB_NAME="${DB_NAME:-airtravel_2y}"
KEY_PREFIX="$(env_value CACHE_KEY_PREFIX)"; KEY_PREFIX="${KEY_PREFIX:-jdbc-demo:}"

# Q3 from the deck: the six-way join over the last quarter.
read -r -d '' Q3_SQL <<'SQL' || true
SELECT dep.city ->> 'en' AS from_city, arr.city ->> 'en' AS to_city,
       a.model ->> 'en' AS aircraft, count(*) AS passengers,
       sum(s.price) AS revenue, round(avg(s.price), 2) AS avg_fare
FROM bookings.flights f
JOIN bookings.routes r ON r.route_no = f.route_no AND r.validity @> f.scheduled_departure
JOIN bookings.segments s ON s.flight_id = f.flight_id
JOIN bookings.airports_data dep ON dep.airport_code = r.departure_airport
JOIN bookings.airports_data arr ON arr.airport_code = r.arrival_airport
JOIN bookings.airplanes_data a ON a.airplane_code = r.airplane_code
WHERE f.scheduled_departure >= bookings.now() - INTERVAL '90 days'
  AND f.scheduled_departure <  bookings.now()
GROUP BY 1, 2, 3 ORDER BY revenue DESC LIMIT 20
SQL

# ── UI helpers ───────────────────────────────────────────────────────────────

PURPLE=99; BLUE=39; RED=203; GREEN=78; MUTED=245

title() {
  gum style --border rounded --border-foreground "$PURPLE" --padding "0 2" \
    --margin "1 0 0 0" --bold --foreground "$PURPLE" "$@"
}
say()  { gum style --foreground "$MUTED" "$@"; }
ok()   { gum style --foreground "$GREEN" "✓ $*"; }
warn() { gum style --foreground "$RED" "! $*"; }
die()  { warn "$@"; exit 1; }
cmd()  { gum style --foreground "$BLUE" "\$ $*"; }

confirm() {
  [[ "$DEMO_YES" == 1 ]] && return 0
  gum confirm "$@"
}

pause() {
  [[ "$DEMO_YES" == 1 ]] && return 0
  gum confirm --affirmative "Next" --negative "Stop" "${1:-Continue?}"
}

# ── Backends ─────────────────────────────────────────────────────────────────

container() {
  docker ps -q --filter "label=com.docker.compose.project=$COMPOSE_PROJECT" \
    --filter "label=com.docker.compose.service=$1" | head -n 1
}

# valkey-cli inside the container; the password never leaves it.
vcli() {
  local cid; cid="$(container valkey)"
  [[ -n "$cid" ]] || die "Valkey container is not running (./run-demo.sh start in $PG_INFRA_DIR)"
  docker exec -i "$cid" sh -c 'exec valkey-cli -a "$VALKEY_PASSWORD" --no-auth-warning "$@"' sh "$@"
}

# psql inside the container as the local superuser, over the Unix socket.
pg() {
  local cid; cid="$(container postgres)"
  [[ -n "$cid" ]] || die "PostgreSQL container is not running (./run-demo.sh start in $PG_INFRA_DIR)"
  docker exec -i "$cid" psql -X -q -U postgres -d "$DB_NAME" "$@"
}

api_up() { curl -fsS --max-time 3 "$API/api/query/info" >/dev/null 2>&1; }

# api_get <out-file> <path+query> [spinner title]; prints the HTTP status.
api_get() {
  local out="$1" path="$2" label="${3:-Calling the API}"
  gum spin --spinner dot --title "$label" -- \
    curl -sS --max-time 120 -o "$out" -w '%{http_code}' "$API$path" >"$out.code"
  cat "$out.code"
}

stat_value() { vcli INFO stats | tr -d '\r' | sed -n "s/^$1://p"; }

# ── Steps ────────────────────────────────────────────────────────────────────

step_preflight() {
  title "0 · Preflight"
  local t missing=0
  for t in gum jq curl docker; do
    command -v "$t" >/dev/null || { warn "missing: $t"; missing=1; }
  done
  [[ $missing == 0 ]] || die "Install the missing tools first."
  ok "tools: gum jq curl docker"

  if [[ -z "$(container postgres)" || -z "$(container valkey)" ]]; then
    warn "postgrespro-demo stack is not running"
    confirm "Start it with run-demo.sh start?" || die "Stack is required."
    (cd "$PG_INFRA_DIR" && ./run-demo.sh start)
  fi
  ok "containers: postgres, valkey"

  [[ "$(pg -tAc 'SELECT 1' 2>/dev/null)" == 1 ]] \
    || die "database $DB_NAME not found (./run-demo.sh import --dataset 2y)"
  ok "database: $DB_NAME"

  [[ "$(pg -tAc "SELECT 1 FROM pg_roles WHERE rolname = 'jdbc_demo'")" == 1 ]] \
    || die "role jdbc_demo missing: run setup_airtravel_role.sql (see JDBC_DEMO.md)"
  ok "role: jdbc_demo (read-only)"

  [[ "$(vcli PING | tr -d '\r')" == PONG ]] || die "Valkey did not answer PING"
  ok "valkey: PONG"

  [[ -f "$BACKEND_ENV" ]] || die "missing $BACKEND_ENV (see JDBC_DEMO.md)"
  [[ "$(env_value DEMO_QUERY)" == airtravel ]] || warn "backend/.env: DEMO_QUERY is not airtravel"

  if ! api_up; then
    warn "demo API is not running on $API"
    confirm "Start the Spring Boot backend in the background?" || die "API is required."
    start_backend
  fi
  check_loopback
  ok "api: $API (loopback)"

  if curl -fsS --max-time 2 -o /dev/null "$ADMIN_URL" 2>/dev/null; then
    ok "valkey admin: $ADMIN_URL"
  else
    say "valkey admin: not running (step 'admin' starts it)"
  fi
}

start_backend() {
  # SERVER_ADDRESS is pinned to loopback; a real env var wins over backend/.env.
  # Prefer the built jar (fast start); fall back to bootRun (compiles first).
  local jar="$JDBC_DEMO_DIR/backend/build/libs/sample-app.jar"
  if [[ -f "$jar" ]]; then
    (cd "$JDBC_DEMO_DIR/backend" &&
      SERVER_ADDRESS=127.0.0.1 nohup java -jar "$jar" >"$BACKEND_LOG" 2>&1 </dev/null &)
  else
    (cd "$JDBC_DEMO_DIR/backend" &&
      SERVER_ADDRESS=127.0.0.1 nohup ./gradlew -q bootRun >"$BACKEND_LOG" 2>&1 </dev/null &)
  fi
  # Wait up to 3 minutes (first run compiles).
  gum spin --spinner dot --title "Starting Spring Boot (log: $BACKEND_LOG)" -- \
    bash -c "for i in \$(seq 1 90); do curl -fsS --max-time 2 -o /dev/null '$API/api/query/info' 2>/dev/null && exit 0; sleep 2; done; exit 1" \
    || { tail -n 30 "$BACKEND_LOG"; die "backend did not start"; }
  ok "backend started (stop it with: pkill -f sample-app.jar, or pkill -f bootRun)"
}

# The demo API runs any SQL it receives: refuse to demo if it listens beyond
# loopback (127.0.0.1 or ::ffff:127.0.0.1). ss is Linux; lsof covers macOS.
check_loopback() {
  local addrs=""
  if command -v ss >/dev/null; then
    addrs="$(ss -Hltn 'sport = :8080' | awk '{print $4}')"
  elif command -v lsof >/dev/null; then
    addrs="$(lsof -nP -iTCP:8080 -sTCP:LISTEN 2>/dev/null | awk 'NR > 1 {print $9}')"
  fi
  if [[ -n "$addrs" ]] && grep -qv '127\.0\.0\.1' <<<"$addrs"; then
    die "the API listens beyond loopback on :8080 ($addrs); restart it with SERVER_ADDRESS=127.0.0.1"
  fi
}

step_query() {
  title "1 · The query" "Top routes by revenue, last 30 days: 3 joins over 27M segments"
  local out="$STATE_DIR/info.json"
  [[ "$(api_get "$out" /api/query/info 'Fetching the built-in query')" == 200 ]] || die "API error"
  jq -r '.query' "$out" | gum format -t code -l sql
  say "The cached path sends the same text with one prefix:"
  gum style --foreground "$BLUE" "/* CACHE_PARAM(ttl=$CACHE_TTL) */ SELECT ..."
}

step_reset() {
  title "Reset" "Delete ${KEY_PREFIX}* keys and reset Valkey's hit/miss counters"
  confirm "Delete only the ${KEY_PREFIX}* keys and run CONFIG RESETSTAT?" || return 0
  # SCAN + DEL in one server-side script: the keys are binary, so they never
  # pass through the shell.
  local n
  n="$(vcli EVAL "local c, n = '0', 0
    repeat
      local r = redis.call('SCAN', c, 'MATCH', ARGV[1] .. '*', 'COUNT', 1000)
      c = r[1]
      for _, k in ipairs(r[2]) do n = n + redis.call('DEL', k) end
    until c == '0'
    return n" 0 "$KEY_PREFIX" | tr -d '\r')"
  vcli CONFIG RESETSTAT >/dev/null
  : >"$RUNS_FILE"
  ok "deleted $n key(s), counters reset, run history cleared"
}

step_connect() {
  title "2 · Connect" "jdbc:postgresql://  and  jdbc:aws-wrapper:postgresql://  (remoteQueryCache)"
  local out="$STATE_DIR/connect.json"
  gum spin --spinner dot --title "Opening both JDBC connections" -- \
    curl -sS --max-time 60 -o "$out" -X POST "$API/api/connections/connect"
  jq -r 'to_entries[] | "\(.key),\(.value)"' "$out" |
    gum table --print --columns "connection,status" --widths 12,40
  jq -e '.direct == "connected" and .cached == "connected"' "$out" >/dev/null \
    || die "a connection failed (check backend/.env and $BACKEND_LOG)"
}

# run_query <direct|cached> <label> [sql]
run_query() {
  local mode="$1" label="$2" sql="${3:-}" out="$STATE_DIR/run.json" path code
  path="/api/query/$mode?includePlan=false"
  [[ "$mode" == cached ]] && path+="&ttl=$CACHE_TTL"
  [[ -n "$sql" ]] && path+="&sql=$(jq -rn --arg s "$sql" '$s | @uri')"

  local hits0 misses0 result="-"
  [[ "$mode" == cached ]] && { hits0="$(stat_value keyspace_hits)"; misses0="$(stat_value keyspace_misses)"; }

  code="$(api_get "$out" "$path" "$label · $mode")"
  if [[ "$code" != 200 ]]; then
    warn "HTTP $code: $(jq -r '.error // .' "$out" 2>/dev/null)"
    [[ "$code" == 500 ]] && say "Not connected? Run the 'connect' step."
    return 1
  fi

  if [[ "$mode" == cached ]]; then
    # The plugin's GET shows up as a Valkey keyspace hit or miss.
    if (( $(stat_value keyspace_hits) > hits0 )); then result=HIT
    elif (( $(stat_value keyspace_misses) > misses0 )); then result=MISS
    fi
  fi

  local ms rows
  ms="$(jq -r '.latencyMs' "$out")"; rows="$(jq -r '.rowCount' "$out")"
  printf '%s\t%s\t%s\t%s\t%s\n' "$label" "$mode" "$result" "$ms" "$rows" >>"$RUNS_FILE"

  local color=$BLUE
  [[ "$mode" == direct ]] && color=$RED
  [[ "$result" == HIT ]] && color=$GREEN
  gum style --foreground "$color" --bold \
    "$(printf '%-7s %-5s %8s ms   %s rows' "$mode" "$result" "$ms" "$rows")"
}

step_direct() {
  title "3 · Direct" "jdbc:postgresql → PostgreSQL 18 · every run pays for the join"
  local i
  for i in $(seq 1 "$DIRECT_RUNS"); do run_query direct top-routes; done
}

step_cached() {
  title "4 · Cached" "jdbc:aws-wrapper + remoteQueryCache → Valkey first, Postgres on a miss"
  local i
  for i in $(seq 1 "$CACHED_RUNS"); do run_query cached top-routes; done
}

step_compare() {
  title "5 · Compare"
  [[ -s "$RUNS_FILE" ]] || { say "No runs yet."; return 0; }
  awk -F'\t' '{printf "%s,%s,%s,%s ms,%s\n", $1, $2, $3, $4, $5}' "$RUNS_FILE" |
    gum table --print --columns "query,path,valkey,latency,rows" --widths 12,8,7,11,6
  local label
  for label in $(cut -f1 "$RUNS_FILE" | sort -u); do
    awk -F'\t' -v q="$label" '
      $1 == q && $2 == "direct"             { d += $4; nd++ }
      $1 == q && $2 == "cached" && $3 == "HIT" { h += $4; nh++ }
      END {
        if (nd && nh) {
          ad = d / nd; ah = h / nh; if (ah < 1) ah = 1
          printf "%s: direct %.0f ms · cached hit %.0f ms · ~%.0fx\n", q, ad, ah, ad / ah
        }
      }' "$RUNS_FILE"
  done | while read -r line; do gum style --bold --foreground "$GREEN" "$line"; done
}

step_keys() {
  title "6 · The keys in Valkey" "prefix + binary hash of (user, schema, SQL text)"
  cmd "SCAN 0 MATCH ${KEY_PREFIX}*   (TYPE, TTL, STRLEN per key)"
  vcli EVAL "local out = {}
    local plen = #ARGV[1]
    for _, k in ipairs(redis.call('SCAN', '0', 'MATCH', ARGV[1] .. '*', 'COUNT', '1000')[2]) do
      table.insert(out, string.sub(k, 1, plen) .. '<hash ' .. (#k - plen) .. ' bytes>'
        .. '  type=' .. redis.call('TYPE', k)['ok']
        .. '  ttl=' .. redis.call('TTL', k) .. 's'
        .. '  size=' .. redis.call('STRLEN', k) .. ' B')
    end
    return out" 0 "$KEY_PREFIX" | tr -d '\r' | sed 's/^/  /'
  echo
  cmd "INFO stats · INFO memory"
  printf 'keyspace_hits,%s\nkeyspace_misses,%s\nused_memory,%s\n' \
    "$(stat_value keyspace_hits)" "$(stat_value keyspace_misses)" \
    "$(vcli INFO memory | tr -d '\r' | sed -n 's/^used_memory_human://p')" |
    gum table --print --columns "metric,value" --widths 18,12
}

step_plan() {
  title "7 · EXPLAIN ANALYZE" "Why the direct path is slow (opens in a pager, q to quit)"
  local out="$STATE_DIR/plan.json"
  [[ "$(api_get "$out" '/api/query/direct?includePlan=true' 'Running EXPLAIN ANALYZE')" == 200 ]] \
    || die "API error: $(jq -r '.error // .' "$out")"
  if [[ "$DEMO_YES" == 1 ]]; then
    jq -r '.queryPlan' "$out" | head -n 25
  else
    jq -r '.queryPlan' "$out" | gum pager
  fi
}

step_q3() {
  title "8 · Q3 · six-way join, 90 days" "The deck's 8 to 10 second query, through the same API"
  echo "$Q3_SQL" | gum format -t code -l sql
  confirm "Run Q3 once direct and twice cached?" || return 0
  run_query direct q3 "$Q3_SQL" || return 0
  run_query cached q3 "$Q3_SQL"
  run_query cached q3 "$Q3_SQL"
}

step_admin() {
  title "9 · Valkey Admin" "$ADMIN_URL · web mode has no login, loopback only"
  if ! curl -fsS --max-time 2 -o /dev/null "$ADMIN_URL" 2>/dev/null; then
    confirm "Start Valkey Admin (compose.valkey-admin.yaml)?" || return 0
    cmd "docker compose --env-file <infra>/.env -f compose.valkey-admin.yaml up -d"
    gum spin --spinner dot --title "Starting Valkey Admin" -- \
      docker compose --env-file "$PG_INFRA_DIR/.env" -f "$DEMO_DIR/compose.valkey-admin.yaml" up -d
  fi
  printf 'host,valkey\nport,6379\nuser,default\npassword,VALKEY_PASSWORD from the stack .env\nUse TLS,unchecked\n' |
    gum table --print --columns "field,value" --widths 10,38
  say "Key Browser cannot list the binary keys yet: use Send Command with demo/list-cache-keys.txt."
  if [[ -n "${SSH_CONNECTION:-}" ]]; then
    say "Over SSH: open $ADMIN_URL in your laptop browser (through the tunnel)."
  elif [[ "$DEMO_YES" != 1 ]] && confirm "Open $ADMIN_URL in the browser?"; then
    if command -v xdg-open >/dev/null; then xdg-open "$ADMIN_URL" >/dev/null 2>&1 &
    elif command -v open >/dev/null; then open "$ADMIN_URL"
    else say "Open $ADMIN_URL manually."
    fi
  fi
}

# ── Flow ─────────────────────────────────────────────────────────────────────

STEPS=(preflight query reset connect direct cached compare keys plan q3 admin)

run_all() {
  local i last=$(( ${#STEPS[@]} - 1 ))
  for i in "${!STEPS[@]}"; do
    "step_${STEPS[$i]}"
    (( i == last )) || pause "Next: ${STEPS[$((i + 1))]}" || return 0
  done
}

index_of() {
  local i
  for i in "${!STEPS[@]}"; do [[ "${STEPS[$i]}" == "$1" ]] && { echo "$i"; return; }; done
}

menu() {
  local choice
  while true; do
    choice="$(gum choose --header "PgDay MX · Valkey query cache demo" \
      "all · guided, every step" "${STEPS[@]}" "quit")" || return 0
    case "$choice" in
      quit) return 0 ;;
      all*) run_all ;;
      *)    "step_$choice" || true ;;
    esac
  done
}

command -v gum >/dev/null || { echo "gum is required: https://github.com/charmbracelet/gum" >&2; exit 1; }

case "${1:-menu}" in
  menu) menu ;;
  all)  run_all ;;
  -h|--help) sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//' ;;
  *)
    [[ -n "$(index_of "$1")" ]] || { echo "unknown step: $1 (try --help)" >&2; exit 2; }
    "step_$1"
    ;;
esac
