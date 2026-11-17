---
theme: default
title: 'Turbocharge Your Postgres'
titleTemplate: '%s · Valkey'
info: |
  Turbocharge Your Postgres: High-Performance Caching and Async Writes with Valkey.
  PgDay México, November 13, 2026. Roberto Luna Rojas, Valkey project, AWS.
canvasWidth: 1200
aspectRatio: 16/9
colorSchema: light
transition: fade-out
clickAnimation: fade
highlighter: shiki
lineNumbers: false
codeCopy: false
mdc: true
layout: cover
class: cover-slide
---

<div class="cover-content">
  <BrandLogo tone="dark" class="cover-logo" />

  <p class="eyebrow eyebrow--dark">PGDAY MÉXICO · NOVEMBER 13, 2026</p>
  <h1>Turbocharge<br><span>your Postgres.</span></h1>
  <p class="cover-deck">Memory for the answers. PostgreSQL for the truth.</p>

  <PresenterIdentity class="cover-presenter" />

  <div class="cover-meta">
    <span>POSTGRESQL 18</span><span>VALKEY 9</span><span>AWS JDBC WRAPPER</span><span>LIVE DEMO</span>
  </div>
</div>

<!--
Open with the thesis: PostgreSQL is a fantastic database, and it is not a cache. When the bottleneck is repeated reads or write pressure, the answer is not always a bigger database. Sometimes it is a smarter architecture.
Everything I show today runs on a laptop: PostgreSQL 18, Valkey 9, a two-year airline dataset, and a Java app. Real numbers, measured this week.
Time check: 0:00.
-->

---
layout: default
class: speaker-slide
---

<div class="deck-header">
  <p class="eyebrow">ABOUT THE SPEAKER</p>
  <h1>Hola, PgDay México.</h1>
</div>

<div class="versus">
  <div class="versus-card">
    <h3>Roberto Luna Rojas</h3>
    <ul>
      <li>Sr. Developer Advocate, Valkey · AWS</li>
      <li>From Mexico, based in the USA</li>
      <li>Performance and scalability since the 1990s</li>
    </ul>
  </div>
  <div class="versus-card versus-card--red">
    <h3>Today</h3>
    <ul>
      <li>Read the schema and the plan</li>
      <li>Cache from JDBC and Hibernate</li>
      <li>Live demo, async writes</li>
    </ul>
  </div>
</div>

<!--
Short intro. I am Roberto, Sr. Developer Advocate for Valkey at AWS. Originally from Mexico, so it is a real pleasure to be at PgDay México. I have been building software since the mid-1990s, and I try to get the most out of in-memory databases, one bit at a time.
Set expectations: this is a Postgres talk first. We will read DDL, read a plan, and only then bring Valkey in.
Time check: 0:45.
-->

---
layout: default
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">THE ROAD MAP</p>
  <h1>From physics to a cached six-way join.</h1>
</div>

<div class="agenda-grid">
  <article class="agenda-card" v-click="1"><span>01 · WHY</span><strong>Memory vs. disk</strong></article>
  <article class="agenda-card agenda-card--purple" v-click="1"><span>02 · THE DATA</span><strong>The Flights database</strong></article>
  <article class="agenda-card agenda-card--red" v-click="2"><span>03 · THE WORK</span><strong>Three queries, one EXPLAIN</strong></article>
  <article class="agenda-card" v-click="2"><span>04 · THE FIX</span><strong>Query caching in JDBC</strong></article>
  <article class="agenda-card agenda-card--purple" v-click="3"><span>05 · THE PROOF</span><strong>Live demo</strong></article>
  <article class="agenda-card agenda-card--red" v-click="3"><span>06 · THE WRITES</span><strong>Write-behind</strong></article>
</div>

<!--
[click] Why: memory is 100x+ faster than disk, and why PostgreSQL, a disk-first engine, needs help for real-time reads. The data: the Flights schema, its DDL, and the normalization it skips.
[click] The work: point lookup, range scan, six-way join, and watch the cost climb. The fix: the AWS Advanced JDBC Wrapper, from plain Java and from Hibernate.
[click] The proof: direct versus cached, live, and the keys it writes. Then the write side: acknowledge in memory, drain to Postgres in batches.
Time check: 1:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">01</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 1</p>
  <h1>Memory is faster than disk.</h1>
  <p class="section-subtitle">By orders of magnitude.</p>
</div>

<!--
Start from physics, because everything else follows from it. Not 2x, not 10x: orders of magnitude, and that changes architecture.
Time check: 2:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
routeAlias: latency
---

<div class="deck-header">
  <p class="eyebrow">THE LATENCY LADDER</p>
  <h1>"100x faster" is the polite version.</h1>
</div>

<LatencyLadder :step="$clicks" />

<p class="source-note">Orders of magnitude · Jeff Dean, Peter Norvig</p>

<!--
Log scale: every grid line is ten times the previous one. The figures are the classic "Latency numbers every programmer should know". Exact values vary by device; the ratios are the point.

[click] RAM. About 100 nanoseconds for a main-memory reference. This is where Valkey keeps every key and every value.

[click] SSD. A random 4 KB read is on the order of 150 microseconds. That is roughly 1,500 times slower than RAM. And random reads are exactly what an index nested loop does: probe, probe, probe.

[click] Disk seek. About 10 milliseconds on spinning media. One hundred thousand times slower than RAM. So when someone says memory is 100x faster than disk, that is the polite, conservative version.

[click] Make it human. If a RAM read took one second, the SSD read would take 25 minutes and the disk seek more than a day. Keep this picture in mind when we look at a plan that touches two million pages.
Time check: 4:00.
-->

---
layout: default
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">POSTGRESQL IS GREAT</p>
  <h1>At what it was built for.</h1>
</div>

<div class="versus">
  <div class="versus-card" v-click="1">
    <h3>Built for</h3>
    <ul>
      <li>ACID · MVCC · WAL</li>
      <li>Any question in SQL</li>
      <li>One primary owns every write</li>
    </ul>
  </div>
  <div class="versus-card versus-card--red" v-click="2">
    <h3>Real-time reads need</h3>
    <ul>
      <li>Sub-millisecond at high concurrency</li>
      <li>The same answer, thousands of times</li>
      <li>Read scale-out</li>
    </ul>
  </div>
</div>

<div class="thesis" v-click="2">Pages are cached. Answers are recomputed.</div>

<!--
I love PostgreSQL. This is not a "Postgres is slow" talk.

[click] It is built for correctness: ACID transactions, MVCC snapshots, WAL durability, a cost-based planner that can answer any question you can express in SQL, rich types like jsonb, ranges, and GiST exclusion constraints. And one primary that owns every write.

[click] Real-time reads ask for something else: sub-millisecond answers at high concurrency, for the same expensive question repeated thousands of times, and tens of thousands of connections without a process each. Postgres can do that only when the whole working set lives in shared buffers. On an 11 GB database in a 512 MB budget, that is not the case: every answer pays for pages, planning, joins, and visibility checks, again.
Time check: 5:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
routeAlias: postgres
---

<div class="deck-header">
  <p class="eyebrow">INSIDE THE ENGINE</p>
  <h1>Nothing in the path keeps the answer.</h1>
</div>

<PostgresArchitecture :step="$clicks" />

<!--
Walk the engine left to right.

[click] Process per connection. The postmaster forks a backend for every client connection. Each one costs real memory and scheduler time. Hundreds is fine. Ten thousand is not, which is why every serious deployment has a pooler.

[click] Pages, not answers. shared_buffers caches 8 KB pages. On a miss, Postgres calls read() and lands in the OS page cache, or in storage. Our Q3 later does 610 thousand of those reads. Even when every page is cached, the join and the aggregation are recomputed on every execution.

[click] One writer. Every commit waits for a WAL fsync on a single primary. That is the durability guarantee, and also the ceiling for write scale-out.

[click] Scale-out needs a proxy. PgBouncer, pgcat, or RDS Proxy multiplex thousands of clients onto a few backends and can route reads to replicas. Replicas scale read throughput, but each replica still recomputes the same join.

[click] The missing tier. Nothing here remembers a finished result. That is the job of Valkey: keep the answer itself, in memory, next to the app.
Time check: 7:00.
-->

---
layout: section
class: section-slide
---

<div class="section-number">02</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 2</p>
  <h1>The Flights database.</h1>
  <p class="section-subtitle">2 years · 11 GB · 85M rows</p>
</div>

<!--
Our use case: the Postgres Pro airline demo database, the 2025-09-01 release, two-year span. It is MIT licensed and a great teaching schema.
Time check: 7:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
routeAlias: schema
---

<div class="deck-header">
  <p class="eyebrow">THE SCHEMA</p>
  <h1>Nine tables. Three over 20M rows.</h1>
</div>

<SchemaDiagram :step="$clicks" />

<!--
The transactional chain on top: bookings, tickets, segments, boarding passes. Reference data below: airports, routes, flights, airplanes, seats. Row counts from the two-year database.

[click] No passengers table. passenger_id and passenger_name live on tickets. The name depends on the passenger, not on the ticket number: a transitive dependency, a third normal form violation. Rename a passenger and you update every ticket they ever bought.

[click] A stored total. bookings.total_amount is the sum of segment prices, stored by hand. Derived data that can drift from its source.

[click] JSON inside a column. Airport name, city, and country are jsonb maps of languages. City and country repeat for every airport in the city, and country depends on city. Every read pays a ->> 'en' extraction.

[click] An array as a column. days_of_week is integer[]: a repeating group in a single cell. Strict first normal form would put it in a child table.

[click] Text codes and a temporal link. fare_conditions and status are CHECK-constrained text, no lookup tables. And flights to routes has no foreign key at all: you join on route_no plus validity @> scheduled_departure.

[click] Why this matters for us: the meaning of a row is rebuilt at read time, with temporal joins and JSON extraction, on every request. That is precisely the work a cache can remember.
Time check: 10:00.
-->

---
layout: default
class: code-slide code-slide--xdense
---

<div class="deck-header">
  <p class="eyebrow">THE DDL · TRANSACTIONAL CHAIN</p>
  <h1>Passenger facts on every ticket.</h1>
</div>

<TerminalWindow title="bookings.sql">

```sql {all|1-5|4|7-14|10-11|16-22|all}
CREATE TABLE bookings.bookings (
    book_ref     char(6)       PRIMARY KEY,
    book_date    timestamptz   NOT NULL,
    total_amount numeric(10,2) NOT NULL         -- = SUM(segments.price)
);

CREATE TABLE bookings.tickets (
    ticket_no      text    PRIMARY KEY,
    book_ref       char(6) NOT NULL REFERENCES bookings.bookings,
    passenger_id   text    NOT NULL,            -- no passengers table
    passenger_name text    NOT NULL,            -- 3NF gap
    outbound       boolean NOT NULL,
    UNIQUE (book_ref, passenger_id, outbound)
);

CREATE TABLE bookings.segments (
    ticket_no       text          NOT NULL REFERENCES bookings.tickets,
    flight_id       integer       NOT NULL REFERENCES bookings.flights,
    fare_conditions text          NOT NULL CHECK (fare_conditions IN ('Economy', 'Comfort', 'Business')),
    price           numeric(10,2) NOT NULL CHECK (price >= 0),
    PRIMARY KEY (ticket_no, flight_id)
);
```

</TerminalWindow>

<!--
Condensed from the dump. Follow the highlights.
bookings: three columns, and total_amount is derived from segments, kept by hand.
tickets: passenger_id and passenger_name. There is no passengers table, so the same person's name is copied onto every ticket. The name depends on passenger_id: a 3NF gap. 21 million tickets.
segments: the 27.6 million row table that every revenue question touches. fare_conditions is free text guarded by a CHECK.
The dump declares the foreign keys with ALTER TABLE at the end; I folded them inline so the slide is readable.
Time check: 11:00.
-->

---
layout: default
class: code-slide code-slide--xdense
---

<div class="deck-header">
  <p class="eyebrow">THE DDL · REFERENCE DATA</p>
  <h1>JSON, arrays, and a join with no FK.</h1>
</div>

<TerminalWindow title="routes.sql">

```sql {all|1-7|3-5|8-17|14|16|18-23|all}
CREATE TABLE bookings.airports_data (
    airport_code char(3) PRIMARY KEY,
    airport_name jsonb   NOT NULL,     -- {"en": "Mexico City Intl", ...}
    city         jsonb   NOT NULL,     -- repeated per airport
    country      jsonb   NOT NULL,     -- depends on city
    coordinates  point   NOT NULL,  timezone text NOT NULL
);
CREATE TABLE bookings.routes (
    route_no          text      NOT NULL,
    validity          tstzrange NOT NULL,
    departure_airport char(3)   NOT NULL REFERENCES bookings.airports_data,
    arrival_airport   char(3)   NOT NULL REFERENCES bookings.airports_data,
    airplane_code     char(3)   NOT NULL REFERENCES bookings.airplanes_data,
    days_of_week      integer[] NOT NULL,  -- 1NF gap
    scheduled_time    time      NOT NULL,  duration interval NOT NULL,
    EXCLUDE USING gist (route_no WITH =, validity WITH &&)
);
CREATE TABLE bookings.flights (
    flight_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    route_no  text NOT NULL,   -- no FK: join on route_no AND validity @> departure
    status    text NOT NULL,   -- CHECK list, no lookup table
    scheduled_departure timestamptz NOT NULL
);
```

</TerminalWindow>

<!--
airports_data: three jsonb maps of language to text. Great for a demo of jsonb, but city and country are repeated per airport and country depends on city.
routes: days_of_week integer[] is a repeating group in one cell. The EXCLUDE constraint is beautiful PostgreSQL: it prevents two versions of the same route from overlapping in time. That is why routes has no ordinary primary key.
flights: no foreign key to routes. The relationship is temporal, so every query must join on route_no and validity @> scheduled_departure. Status is a CHECK list of 7 states. Arrival and actual times trimmed. Remember that temporal join; it is the second step of our EXPLAIN.
Time check: 12:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">WHAT NORMALIZED WOULD LOOK LIKE</p>
  <h1>Fewer anomalies. More joins.</h1>
</div>

<TerminalWindow title="normalize.sql">

````md magic-move
```sql
-- Today: passenger facts ride on every ticket
CREATE TABLE bookings.tickets (
    ticket_no      text    PRIMARY KEY,
    book_ref       char(6) NOT NULL REFERENCES bookings.bookings,
    passenger_id   text    NOT NULL,
    passenger_name text    NOT NULL,
    outbound       boolean NOT NULL
);
```

```sql
-- 3NF: one row per passenger, tickets point at it
CREATE TABLE bookings.passengers (
    passenger_id   text PRIMARY KEY,
    passenger_name text NOT NULL
);

CREATE TABLE bookings.tickets (
    ticket_no      text    PRIMARY KEY,
    book_ref       char(6) NOT NULL REFERENCES bookings.bookings,
    passenger_id   text    NOT NULL REFERENCES bookings.passengers,
    outbound       boolean NOT NULL
);
```

```sql
-- 1NF and lookups for the rest of the gaps
CREATE TABLE bookings.fare_classes (fare_conditions text PRIMARY KEY);

CREATE TABLE bookings.route_days (
    route_no    text, validity tstzrange, day_of_week smallint CHECK (day_of_week BETWEEN 1 AND 7),
    PRIMARY KEY (route_no, validity, day_of_week)
);

CREATE TABLE bookings.airport_names (
    airport_code char(3) REFERENCES bookings.airports_data,
    lang text, name text, PRIMARY KEY (airport_code, lang)
);
-- total_amount: compute it in a view, or keep it with a trigger you test
```
````

</TerminalWindow>

<!--
Slidev magic move: same file, three states.
State one: today's tickets table.
[click] Third normal form: a passengers table, and tickets reference it. Now a rename is one row.
[click] The same idea for the other gaps: a fare_classes lookup, a route_days child table instead of the array, an airport_names table instead of jsonb maps, and the total as a view or a tested trigger.
The honest point: normalizing fixes update anomalies, and it adds joins. Denormalized or normalized, the expensive revenue answer is still assembled at read time. The cache comes after that design choice, not instead of it.
Time check: 13:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">03</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 3</p>
  <h1>Three queries. One EXPLAIN.</h1>
</div>

<!--
Each query asks the disk for a little more than the last.
All numbers on the next slides: airtravel_2y, PostgreSQL 18.6 in a container capped at 512 MB, shared_buffers 128 MB, EXPLAIN (ANALYZE, BUFFERS) with track_io_timing on.
Time check: 14:00.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">Q1 · POINT LOOKUP · 1.4 MS</p>
  <h1>Already a key/value lookup.</h1>
</div>

<TerminalWindow title="q1_manifest.sql">

```sql {all|5-6|7}
SELECT f.flight_id, f.route_no, f.status, f.scheduled_departure,
       count(s.ticket_no)        AS seats_sold,
       coalesce(sum(s.price), 0) AS revenue
FROM bookings.flights  f
LEFT JOIN bookings.segments s
       ON s.flight_id = f.flight_id          -- segments_flight_id_idx
WHERE f.flight_id = 4242                     -- flights_pkey
GROUP BY f.flight_id, f.route_no, f.status, f.scheduled_departure;
```

</TerminalWindow>

<div class="code-map">
  <span>235 buffers</span><span>1.4 ms</span><span class="red">do not cache this</span>
</div>

<!--
The check-in desk: who is on flight 4242?
Two index scans: flights_pkey, then segments_flight_id_idx for 325 rows. 235 buffers, 1.4 milliseconds.
The plugin docs make the same observation: with an indexed primary-key lookup the database already behaves like a key/value store, and caching shows no noticeable latency difference. Don't cache this one; at most it saves CPU under high concurrency.
Time check: 14:45.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">Q2 · RANGE SCAN · 1.8 S</p>
  <h1>No index on <code>book_date</code>.</h1>
</div>

<TerminalWindow title="q2_daily_revenue.sql">

```sql {all|5-6|1,7-8}
SELECT date_trunc('day', b.book_date) AS booking_day,
       count(*)                       AS bookings,
       sum(b.total_amount)            AS revenue
FROM bookings.bookings b
WHERE b.book_date >= bookings.now() - INTERVAL '30 days'
  AND b.book_date <  bookings.now()
GROUP BY booking_day
ORDER BY booking_day;
```

</TerminalWindow>

<div class="code-map">
  <span>9.7M rows scanned</span><span>30 returned</span><span>1,815 ms</span>
</div>

<!--
A dashboard tile: bookings and revenue per day, last 30 days.
The only index on bookings is the primary key, so the range filter is a full sequential scan: 9.7 million rows read, 9.3 million thrown away, 61,826 buffers read, and the sort spills 9 MB to disk because it exceeds work_mem.
This one has two honest fixes: an index on book_date, or a cache. The index is the right first move. Use bookings.now(), not now(): it is the dataset's clock, and a fixed expression keeps the SQL text identical, which matters for a cache key.
Time check: 15:30.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">Q3 · SIX-WAY JOIN · 8 TO 10 S</p>
  <h1>Revenue by city pair, last quarter.</h1>
</div>

<TerminalWindow title="q3_quarter_revenue.sql">

```sql {all|1-3|7-9|10|11-13|14-15|16-18|all}
SELECT dep.city  ->> 'en'      AS from_city,
       arr.city  ->> 'en'      AS to_city,
       a.model   ->> 'en'      AS aircraft,
       count(*)                AS passengers,
       sum(s.price)            AS revenue,
       round(avg(s.price), 2)  AS avg_fare
FROM bookings.flights f
JOIN bookings.routes r          ON  r.route_no = f.route_no
                                AND r.validity @> f.scheduled_departure
JOIN bookings.segments s        ON s.flight_id      = f.flight_id
JOIN bookings.airports_data dep ON dep.airport_code = r.departure_airport
JOIN bookings.airports_data arr ON arr.airport_code = r.arrival_airport
JOIN bookings.airplanes_data a  ON a.airplane_code  = r.airplane_code
WHERE f.scheduled_departure >= bookings.now() - INTERVAL '90 days'
  AND f.scheduled_departure <  bookings.now()
GROUP BY 1, 2, 3
ORDER BY revenue DESC
LIMIT 20;
```

</TerminalWindow>

<!--
This is the query the business actually asks for, and it touches every normalization gap we flagged.
Highlights: JSON extraction for display names. The temporal join: route_no plus validity @>. Segments, the 27.6 million row table. Two joins to airports_data, one to airplanes. The quarter filter. And group, sort, limit 20.
Twenty rows out. Let's see what it costs.
Time check: 16:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
routeAlias: queries
---

<div class="deck-header">
  <p class="eyebrow">THE COST CLIMB</p>
  <h1>1 ms → 8 s.</h1>
</div>

<QueryLadder :step="$clicks" />

<!--
Measured on airtravel_2y with a 512 MB budget. Three orders of magnitude between the first and the last query.

[click] Q1, point lookup: 1.4 ms, 235 buffers.

[click] Q2, range scan: 1.8 seconds. 9.7 million rows read for 30 rows of output.

[click] Q3, six-way join: 8 to 10 seconds across runs. 16 thousand flights times about 200 segments each, 3.28 million joined rows, a 160 MB sort spill, 20 rows out.

[click] Now the metric that matters for caching: buffers touched per row returned. 235, then about 2 thousand, then about 104 thousand. Anything above 100 blocks per row is a strong cache candidate. High work, small result.
Time check: 18:00.
-->

---
layout: default
class: code-slide code-slide--xdense code-slide--plan
---

<div class="deck-header">
  <p class="eyebrow">EXPLAIN (ANALYZE, BUFFERS) · Q3</p>
  <h1>Read it bottom-up.</h1>
</div>

<TerminalWindow title="psql · airtravel_2y">

```text {all|13-14|9-12|15-17|5-6|1-2,18-19}
Limit (actual time=8094.286..8094.296 rows=20.00 loops=1)
  Buffers: shared hit=1468951 read=610559, temp read=40069 written=40136
  ->  Sort  Sort Method: top-N heapsort  Memory: 29kB
        ->  GroupAggregate (actual rows=717.00 loops=1)
              ->  Sort (actual time=6626.022..7451.952 rows=3278688.00 loops=1)
                    Sort Method: external merge  Disk: 160296kB
                    ->  Nested Loop (actual time=6.621..4554.070 rows=3278688.00 loops=1)
                          ->  Nested Loop (rows=16207.00)  + 2 Hash Joins, Memoize
                                ->  Hash Join (actual rows=16207.00 loops=1)
                                      Hash Cond: (f.route_no = r.route_no)
                                      Join Filter: (r.validity @> f.scheduled_departure)
                                      Rows Removed by Join Filter: 204294
                                      ->  Seq Scan on flights f (actual rows=16207.00 loops=1)
                                            Rows Removed by Filter: 119364
                          ->  Index Scan using segments_flight_id_idx on segments s
                                (actual time=0.006..0.215 rows=202.30 loops=16207)
                                Buffers: shared hit=1468774 read=608903
Planning Time: 3.110 ms
Execution Time: 8105.179 ms
```

</TerminalWindow>

<!--
Trimmed plan. Bottom-up, following the highlights. The cost hides in one innocent line.
Seq scan on flights for the quarter: 16,207 flights kept.
The temporal hash join: route_no matches, then the @> filter removes 204 thousand candidate pairs. That is the cost of not having a foreign key with a single matching row.
The innocent line: an index scan on segments, but loops=16207. Each probe is fast, 0.2 ms, but 16 thousand of them return 3.28 million rows and touch 2.08 million buffers, 609 thousand of them read from outside shared buffers. That is 99.9% of the buffers in the whole plan.
Then the sort spills 160 MB to temp files, because we group by JSON-extracted strings.
And the top: 20 rows, 8.1 seconds, 2 million page touches. That ratio is our cache signal.
Time check: 19:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
routeAlias: explain
---

<div class="deck-header">
  <p class="eyebrow">THE SAME PLAN, AS A TREE</p>
  <h1>Millions of pages for 20 rows.</h1>
</div>

<ExplainTree :step="$clicks" />

<!--
The same plan as a tree, rows flowing left to right into the result. Seconds of work.

[click] Scans: flights for the quarter, routes hashed in memory.

[click] The temporal join with the @> filter.

[click] Dimensions: airports hashed twice, airplanes memoized. Cheap, but it runs on every single request.

[click] The hot spot in red: 16,207 index probes into segments, 3.28 million rows, 2.08 million buffers.

[click] The spill: a sort larger than work_mem, 160 MB written to disk.

[click] The answer: 717 groups, top 20. A result that fits in a few kilobytes. Compute it once, keep it in memory, serve it a thousand times.
Time check: 21:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">PG_STAT_STATEMENTS</p>
  <h1>Find your own Q3.</h1>
</div>

<TerminalWindow title="cache_candidates.sql">

```sql {all|3|4-5|6-7|10-12|all}
SELECT
    LEFT(query, 80) AS query_preview,
    calls,
    ROUND(total_exec_time::numeric / calls, 2) AS avg_time_ms,
    ROUND((rows::numeric / calls), 0)          AS avg_rows,
    ROUND(((shared_blks_hit + shared_blks_read)::numeric /
           NULLIF(rows, 0)), 0)                AS blocks_per_row
FROM pg_stat_statements
WHERE query LIKE 'SELECT%'
  AND rows > 0
  AND (shared_blks_hit + shared_blks_read) / NULLIF(rows, 0) > 100
ORDER BY calls DESC, blocks_per_row DESC
LIMIT 20;
```

</TerminalWindow>

<div class="code-map">
  <span>frequent</span><span>slow</span><span>blocks_per_row &gt; 100</span>
</div>

<!--
Look for frequent reads that do 100x more work than they return. You do not need to guess: this query is in the demo repository's README. Requires shared_preload_libraries = pg_stat_statements.
calls is frequency. avg_time is latency. blocks_per_row is work per result row: above 100 means more than 800 KB of pages per row returned.
Our Q3 scores about 104 thousand. Combine high frequency, high latency, high blocks per row, and read-only, slow-changing data, and you have your shortlist.
Time check: 22:00.
-->

---
layout: section
class: section-slide
---

<div class="section-number">04</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 4</p>
  <h1>Where Valkey comes in.</h1>
  <p class="section-subtitle">One plugin. One hint.</p>
</div>

<!--
Now we bring in the in-memory tier: query caching in the JDBC driver, with no new data access layer. For Java, you don't have to write cache-aside code yourself.
Time check: 22:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
routeAlias: query-cache
---

<div class="deck-header">
  <p class="eyebrow">REMOTE QUERY CACHE PLUGIN</p>
  <h1>Cache the ResultSet in Valkey.</h1>
</div>

<QueryCacheFlow :step="$clicks" />

<!--
The AWS Advanced JDBC Wrapper is an open source JDBC driver that wraps the PostgreSQL driver with a plugin chain. Version 3.3.0 added the Remote Query Cache Plugin. The ResultSet is keyed by the SQL.

[click] Opt in per statement. A query is cacheable only if it starts with the hint, /* CACHE_PARAM(ttl=300s) */. Anywhere else in the SQL, the hint is ignored.

[click] The key is a hash of the configured database user, the schema or catalog, and the SQL text, behind an optional prefix of up to 10 characters. One GET to Valkey. The first time, a miss.

[click] On a miss the query runs on PostgreSQL exactly as before. Q3 pays its full cost.

[click] The ResultSet goes back to your code first. Then the plugin writes it to Valkey asynchronously with the TTL. In our demo: one string key of about 15 KB for 20 rows.

[click] The next identical statement is a hit: served from Valkey in 2 to 4 milliseconds. PostgreSQL never sees it.

[click] And if Valkey is down, failWhenCacheDown=false treats it as a miss. The plugin has a health monitor that bypasses the cache while it is degraded. You fail open to the database.
Time check: 24:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">PLAIN JAVA · 1 OF 2</p>
  <h1>Plugin, endpoint, URL.</h1>
</div>

<TerminalWindow title="CachedConnection.java">

```java {all|1-3|5-7|9|10|11-14|15|17-18|all}
// software.amazon.jdbc:aws-advanced-jdbc-wrapper:3.3.0
// io.valkey:valkey-glide:2.3.0 · org.apache.commons:commons-pool2:2.11.1
// org.postgresql:postgresql:42.7.3

Properties props = new Properties();
props.setProperty("user", "jdbc_demo");                           // read-only role
props.setProperty("password", System.getenv("DB_PASSWORD"));

props.setProperty("wrapperPlugins", "remoteQueryCache");          // 1 · plugin
props.setProperty("cacheEndpointAddrRw", "127.0.0.1:6379");       // 2 · Valkey
props.setProperty("cacheUseSSL", "false");                        //     local only
props.setProperty("cacheUsername", "default");
props.setProperty("cachePassword", System.getenv("CACHE_PASSWORD"));
props.setProperty("cacheKeyPrefix", "jdbc-demo:");                //     max 10 chars
props.setProperty("failWhenCacheDown", "false");                  //     fail open

String url = "jdbc:aws-wrapper:postgresql://127.0.0.1:5432/airtravel_2y";   // 3 · URL
Connection conn = DriverManager.getConnection(url, props);
```

</TerminalWindow>

<!--
This is the exact configuration from the demo's QueryService. Three changes: the plugin, the Valkey endpoint, the URL.
Dependencies: the wrapper, Valkey GLIDE as the cache client, and commons-pool2. They are runtime requirements of the plugin.
Then: wrapperPlugins=remoteQueryCache, cacheEndpointAddrRw for Valkey, and the jdbc:aws-wrapper:postgresql:// URL. Optional: TLS (keep it on with ElastiCache), username and password or ElastiCache IAM with cacheName and cacheIamRegion, a key prefix to share a cluster, and fail-open behavior.
Note the read-only role: the demo API runs whatever SQL it is sent, so it connects as jdbc_demo, read-only, with a 60 second statement timeout.
Time check: 25:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">PLAIN JAVA · 2 OF 2</p>
  <h1>One hint. Plain JDBC.</h1>
</div>

<TerminalWindow title="TopRoutes.java">

```java {all|2|3-10|13-14|15-18|all}
static final String TOP_ROUTES =
    "/* CACHE_PARAM(ttl=300s) */ " +
    "SELECT r.departure_airport, r.arrival_airport, COUNT(*) AS passengers, SUM(s.price) AS revenue " +
    "FROM bookings.flights f " +
    "JOIN bookings.routes r ON r.route_no = f.route_no AND r.validity @> f.scheduled_departure " +
    "JOIN bookings.segments s ON s.flight_id = f.flight_id " +
    "WHERE f.scheduled_departure >= bookings.now() - INTERVAL '30 days' " +
    "  AND f.scheduled_departure <  bookings.now() " +
    "GROUP BY r.departure_airport, r.arrival_airport " +
    "ORDER BY revenue DESC LIMIT 20";

List<Route> routes = new ArrayList<>();
try (PreparedStatement ps = conn.prepareStatement(TOP_ROUTES);
     ResultSet rs = ps.executeQuery()) {                  // hit: Valkey · miss: PostgreSQL
    while (rs.next()) {
        routes.add(new Route(rs.getString(1), rs.getString(2),
                             rs.getLong(3), rs.getBigDecimal(4)));
    }
}
```

</TerminalWindow>

<!--
Line two is the whole opt-in: the hint as the very first characters of the statement. TTL in seconds, must be positive, capped by the plugin at 180 days.
The SQL is the demo's built-in airtravel query.
executeQuery returns a normal ResultSet whether it came from Valkey or from PostgreSQL. Your mapping code does not change.
Keep the SQL text stable. The key is the text, so a timestamp literal that changes every call would never hit. bookings.now() is a fixed expression, so the key is stable.
Time check: 26:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">HIBERNATE · 1 OF 2</p>
  <h1>The hint rides on the SQL comment.</h1>
</div>

<TerminalWindow title="Flight.java">

```java {all|1-2|3-7|6-7|8-13|all}
@Entity
@Table(name = "flights", schema = "bookings")
@NamedQuery(
    name  = "Flight.byRoute",
    query = "SELECT f FROM Flight f WHERE f.routeNo = :route ORDER BY f.scheduledDeparture",
    hints = @QueryHint(name  = "org.hibernate.comment",        // HibernateHints.HINT_COMMENT
                       value = "CACHE_PARAM(ttl=300s)"))
public class Flight {
    @Id @Column(name = "flight_id")       Integer id;
    @Column(name = "route_no")            String routeNo;
                                          String status;
    @Column(name = "scheduled_departure") OffsetDateTime scheduledDeparture;
}
```

</TerminalWindow>

<div class="sql-out"><b>Hibernate 6.6 emits:</b> /* CACHE_PARAM(ttl=300s) */ select f1_0.flight_id, ... from bookings.flights f1_0 where f1_0.route_no=?</div>

<!--
Hibernate can attach a comment to the SQL it generates. The plugin reads that comment as the hint, because Hibernate places it at the very start of the statement.
A plain JPA entity mapped to bookings.flights. The named query carries the hint with the org.hibernate.comment query hint, which is HibernateHints.HINT_COMMENT in Hibernate 6.
The bottom strip is the real SQL Hibernate 6.6 produced in my test against this database, trimmed: the hint first, then the generated select with all four columns and the order by. The plugin docs show the same pattern for Hibernate 5.6.
Time check: 27:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">HIBERNATE · 2 OF 2</p>
  <h1>Turn on SQL comments.</h1>
</div>

<TerminalWindow title="FlightRepository.java">

```java {all|2-3|4|5-6|9-11|13-16|all}
Configuration cfg = new Configuration().addAnnotatedClass(Flight.class);
cfg.setProperty("hibernate.connection.url",
    "jdbc:aws-wrapper:postgresql://127.0.0.1:5432/airtravel_2y");
cfg.setProperty("hibernate.use_sql_comments", "true");                       // emit the comment
cfg.setProperty("hibernate.connection.wrapperPlugins", "remoteQueryCache");   // passed to the driver
cfg.setProperty("hibernate.connection.cacheEndpointAddrRw", "127.0.0.1:6379");

try (SessionFactory sf = cfg.buildSessionFactory()) {
    List<Flight> byRoute = sf.fromSession(s -> s
        .createNamedQuery("Flight.byRoute", Flight.class)                     // static hint
        .setParameter("route", "PG0181").getResultList());

    List<Flight> cancelled = sf.fromSession(s -> s
        .createQuery("SELECT f FROM Flight f WHERE f.status = 'Cancelled'", Flight.class)
        .setHint("org.hibernate.comment", "CACHE_PARAM(ttl=120s)")           // dynamic hint
        .getResultList());
}
```

</TerminalWindow>

<div class="code-map">
  <span>331 ms miss → 13 ms hit</span><span>760 rows</span>
</div>

<!--
Bootstrap, and a dynamic hint. The URL is the wrapper URL. hibernate.use_sql_comments=true is mandatory: without it Hibernate drops the comment and nothing is cached. Every hibernate.connection.* property is passed to the JDBC driver, so the plugin settings go through unchanged. User, password, and the rest are the same as before; I trimmed them to fit.
The second query sets the hint at runtime with setHint: useful when the TTL depends on the use case.
Tested with Hibernate 6.6.59 and wrapper 3.3.0 against the airtravel database: the named query went from 331 ms on the miss to 13 ms on hits, including entity hydration for 760 rows, and Valkey held two keys with TTLs of 300 and 120 seconds.
Time check: 28:00.
-->

---
layout: default
class: table-dense
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">THE RULES OF THE HINT</p>
  <h1>A TTL cache keyed by SQL text.</h1>
</div>

<table>
<thead><tr><th>Rule</th><th>Means</th></tr></thead>
<tbody>
<tr v-click="1"><td>Hint first</td><td>Anywhere else: not cached</td></tr>
<tr v-click="2"><td>Key = user + schema + SQL</td><td>Nothing else is in the key</td></tr>
<tr v-click="3"><td>Invalidation = TTL</td><td>No invalidation on write</td></tr>
<tr v-click="4"><td>Limits</td><td>16 KB SQL · no LOBs · no transactions</td></tr>
<tr v-click="5"><td>Not an authz boundary</td><td>Hits skip GRANTs and RLS</td></tr>
<tr v-click="6"><td>Protect Valkey</td><td>TLS · auth · private network</td></tr>
</tbody>
</table>

<!--
The honest slide. Read the plugin documentation's security section; these six lines are the summary.

[click] The hint must be the first thing in the statement: /* CACHE_PARAM(ttl=300s) */. Anywhere else it is ignored. No hint, no cache.

[click] The key is the configured database user, the schema or catalog, and the SQL text. Nothing else. If the result depends on a session setting, setMaxRows, or binary or stream parameters the driver does not put in the statement text, do not cache it.

[click] Invalidation is time-based, max 180 days. There is no "a row changed, drop the key". Choose a TTL that matches your staleness budget: revenue for last quarter is a great fit, a seat map is not.

[click] Limits: statements longer than 16 KB (cacheMaxQuerySize), CLOB and BLOB, and reads inside a transaction are not served from cache.

[click] It is not an authorization boundary. A cache hit does not re-check GRANTs or row-level security. cacheKeyPrefix separates keys; it does not restrict access. Multi-tenant apps should separate tenants by database user, prefix, or cluster, and the docs are explicit that the multi-tenancy option is best-effort hardening.

[click] And protect Valkey like you protect the database: anyone who can reach it can read and overwrite cached results. TLS, authentication, private networking.
Time check: 29:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">05</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 5</p>
  <h1>Live demo.</h1>
  <p class="section-subtitle">Same query. Two connections.</p>
</div>

<!--
Switch to the terminal. Pre-flight: ./demo/demo.sh preflight already green, Valkey Admin open in a second tab. Step-by-step run sheet: demo/JDBC_DEMO.md.
Time check: 30:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
routeAlias: demo-architecture
---

<div class="deck-header">
  <p class="eyebrow">THE DEMO ARCHITECTURE</p>
  <h1>One app, two JDBC URLs, one Valkey.</h1>
</div>

<DemoArchitecture :step="$clicks" />

<!--
[click] The client: the React UI, or today the gum script in the terminal. Run Direct and Run Cached both call the Spring Boot API with the same SQL.

[click] Direct: jdbc:postgresql to PostgreSQL 18. Every call pays the join.

[click] Cached: jdbc:aws-wrapper with the remoteQueryCache plugin. Valkey first, Postgres only on a miss. The API prepends the hint for you.

[click] Valkey Admin and pgAdmin to watch both sides. Valkey Admin is the new open source management UI from the Valkey project.

[click] Everything is published on 127.0.0.1 only. The demo API executes any SQL it receives and Valkey Admin's web mode has no login, so neither should ever be reachable from the network. To demo from another machine, use an SSH tunnel.
Time check: 31:00.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">RUN IT FROM THE TERMINAL</p>
  <h1>One script.</h1>
</div>

<TerminalWindow title="zsh">

```bash {all|1-2|4-5|7-9|all}
# once: dataset, read-only role, backend/.env  (demo/JDBC_DEMO.md)
./run-demo.sh import --dataset 2y

# on stage
./demo/demo.sh all

# or one step at a time
./demo/demo.sh direct
./demo/demo.sh cached
./demo/demo.sh keys
```

</TerminalWindow>

<!--
Everything you need is public.
Once: the Postgres Pro stack with run-demo.sh, which downloads the dataset once and anchors its clock to this week. Then the read-only role, because the demo executes arbitrary SQL, and backend/.env with DEMO_QUERY=airtravel. All in demo/JDBC_DEMO.md.
On stage: demo.sh, built with gum. Preflight, the query, reset the keys, connect, two direct runs, four cached runs, the comparison table, the keys in Valkey, the plan, Q3, and Valkey Admin.
Each step also runs alone.
Time check: 32:00.
-->

---
layout: iframe
url: http://127.0.0.1:8080/
class: demo-slide
routeAlias: live
---

<!--
LIVE, optional: the same API has a web UI, served by Spring Boot at 127.0.0.1:8080. Use it if the terminal is hard to read in the room.
Terminal run (./demo/demo.sh all):
1. preflight: stack, database, role, Valkey, API on loopback.
2. query: the built-in 30-day top-routes join.
3. reset: delete the jdbc-demo:* keys, reset hit/miss counters.
4. connect: direct and cached connections.
5. direct twice: about 1.3 seconds each.
6. cached four times: a MISS slightly slower than direct, then single-digit HITs.
7. compare: the table and the ratio.
8. keys: one string key, about 15 KB, TTL counting down from 300.
9. plan: EXPLAIN ANALYZE in a pager.
10. q3: the 90-day six-way join, about 10 seconds direct, 4 ms cached.
11. admin: switch to the Valkey Admin tab.
If the iframe is blank, the backend is not running: run ./demo/demo.sh preflight.
-->

---
layout: default
class: diagram-slide
clicks: 4
routeAlias: results
---

<div class="deck-header">
  <p class="eyebrow">WHAT THE DEMO MEASURED</p>
  <h1>Hundreds of times faster.</h1>
</div>

<MeasuredRuns :step="$clicks" />

<!--
These are the runs I measured this week with the demo's built-in query, the 30-day top-routes join.

[click] Direct: 1,267 and 1,250 milliseconds. Warm buffers do not make the join free.

[click] First cached run: 1,443 ms. A miss costs the database time plus a Valkey round trip, and the plugin fills the key after returning.

[click] Then 9, 4, 3, 2 milliseconds.

[click] 1,250 divided by about 3: roughly 400 times, once the work is skipped. The ladder promised 100x or more from memory versus disk, and skipping the work entirely is where the rest comes from. Rehearsal runs land between 200x and 400x depending on the first hit.
Time check: 36:00.
-->

---
layout: default
class: code-slide
routeAlias: valkey-admin
---

<div class="deck-header">
  <p class="eyebrow">VALKEY ADMIN · SEND COMMAND</p>
  <h1>One key per statement.</h1>
</div>

<TerminalWindow title="Valkey Admin · 127.0.0.1:8081">

```bash {all|1-2|3-5|7-8|all}
# demo/list-cache-keys.txt
EVAL "... SCAN 0 MATCH jdbc-demo:* ..." 0
jdbc-demo:<hash 48 bytes>  type=string
                           ttl=272s
                           size=15347 B

INFO stats    # keyspace_hits / keyspace_misses
MEMORY USAGE  # ~16 KB per 20-row ResultSet
```

</TerminalWindow>

<a class="admin-open" href="http://127.0.0.1:8081" target="_blank" rel="noopener">Open Valkey Admin · 127.0.0.1:8081</a>

<!--
A prefix, a hash, a TTL. Valkey Admin runs in Docker, web mode, on the same compose network. Connect in the UI with host valkey, port 6379, user default, the stack password, and Use TLS UNCHECKED (it defaults to on and then hangs on "Connecting...").
Dashboard first: used memory, operations, and the hit ratio. Watch the hit ratio, not just latency.
Then Send Command: the keys are binary, the 10 character prefix plus a 48-byte hash of user, schema, and SQL text. Valkey Admin 1.3.0's Key Browser cannot decode non-UTF-8 key names yet ("invalid utf-8 sequence ... from index 10"), so list them with the EVAL in demo/list-cache-keys.txt: one plain string per distinct statement, about 15 KB for 20 rows, TTL counting down from 300. The same listing is ./demo/demo.sh keys.
Valkey Admin sends X-Frame-Options SAMEORIGIN, so it opens in its own tab rather than inside the slides.
Time check: 37:30.
-->

---
layout: section
class: section-slide
---

<div class="section-number">06</div>
<div class="section-content">
  <p class="eyebrow eyebrow--dark">PART 6</p>
  <h1>Async writes.</h1>
  <p class="section-subtitle">Acknowledge in memory. Drain in batches.</p>
</div>

<!--
Reads were half of the abstract. The other half is write pressure. Write-behind: acknowledge in memory, drain to PostgreSQL in batches.
Time check: 38:00.
-->

---
layout: default
class: diagram-slide
clicks: 6
routeAlias: write-behind
---

<div class="deck-header">
  <p class="eyebrow">WRITE-BEHIND · A VALKEY STREAM</p>
  <h1>Take the commit off the request path.</h1>
</div>

<WriteBehindFlow :step="$clicks" />

<!--
A Valkey stream as the pending log. Take the commit off the request path, on purpose.

[click] XADD: the write is appended to a Valkey stream. With appendonly yes and a replica, that append is durable within Valkey's fsync policy. Note: the demo stack's Valkey is configured as a pure cache, no persistence. Write-behind needs AOF on.

[click] The caller is acknowledged in about a millisecond. PostgreSQL has not seen the row yet.

[click] A worker in a consumer group reads up to 500 entries. Add workers to drain faster; the group hands each entry to one consumer.

[click] One transaction for the whole batch, idempotent with ON CONFLICT DO NOTHING. One WAL fsync instead of 500.

[click] XACK only after COMMIT. If the worker dies between the two, XAUTOCLAIM hands the entries to another worker, and the idempotent insert makes the replay harmless.

[click] The price: the stream length is your staleness window and unflushed entries are your loss window. Valkey durability settings decide its size. Choose it on purpose, and never for data that must be committed before you answer.

Speaker TODO: the abstract names the Valkey Sink module. If it is published before the talk, swap its API in here; the shape of the pattern stays the same.
Time check: 39:30.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">WRITE-BEHIND · VALKEY</p>
  <h1>Append, read as a group, acknowledge.</h1>
</div>

<TerminalWindow title="valkey-cli">

```bash {all|1-3|5-7|9-10|12-13|all}
# request path: append and return
XADD bookings:pending * book_ref A1B2C3 \
     book_date 2026-11-13T10:00Z total 18450.00

# worker: one group, many consumers
XGROUP CREATE bookings:pending pg-writer $ MKSTREAM
XREADGROUP GROUP pg-writer w1 COUNT 500 BLOCK 2000 STREAMS bookings:pending >

# only after the COMMIT succeeds
XACK bookings:pending pg-writer <id> <id> ...

# a worker died? claim entries idle for 60 s
XAUTOCLAIM bookings:pending pg-writer w2 60000 0-0 COUNT 500
```

</TerminalWindow>

<!--
The Valkey side: XADD on the request path; a consumer group and XREADGROUP for workers; XACK after commit; XAUTOCLAIM for recovery.
Time check: 40:00.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">WRITE-BEHIND · POSTGRESQL</p>
  <h1>Commit first. Then XACK.</h1>
</div>

<TerminalWindow title="psql">

```sql {all|2-6|7|8-9|all}
BEGIN;
INSERT INTO bookings.bookings (book_ref, book_date, total_amount)
SELECT *
FROM unnest($1::char(6)[],          -- 500 book_refs
            $2::timestamptz[],      -- 500 dates
            $3::numeric[])          -- 500 totals
ON CONFLICT (book_ref) DO NOTHING;  -- replay-safe
COMMIT;
-- then XACK the batch ids
```

</TerminalWindow>

<!--
The PostgreSQL side: one statement inserts the whole batch from arrays with unnest, and ON CONFLICT DO NOTHING makes redelivery safe because book_ref is the primary key.
Order matters: commit first, acknowledge second. The reverse order loses data on a crash.
Time check: 40:30.
-->

---
layout: default
class: table-dense
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">WHEN TO USE WHAT</p>
  <h1>Match the tool to the query.</h1>
</div>

<table>
<thead><tr><th>Workload</th><th>Reach for</th></tr></thead>
<tbody>
<tr v-click="1"><td>Point lookup (Q1)</td><td>An index</td></tr>
<tr v-click="2"><td>Missing index (Q2)</td><td>The index first</td></tr>
<tr v-click="3"><td>Expensive, frequent, slow-changing (Q3)</td><td class="hl">Query cache plugin</td></tr>
<tr v-click="4"><td>Hot entity, changes on write</td><td>Cache-aside + invalidation</td></tr>
<tr v-click="5"><td>Write bursts</td><td class="red">Write-behind on a stream</td></tr>
</tbody>
</table>

<div class="thesis" v-click="5">Postgres for the truth. Valkey for the answers.</div>

<!--
Match the tool to the query, not the other way around.
[click] Q1: an indexed point lookup is already about 1 ms. An index wins; do not cache it.
[click] Q2: fix the index first. Caching a missing index hides a problem. Cache only if it is still hot and slow.
[click] Q3: the sweet spot for the plugin: expensive, frequent, slow-changing. One hint, a TTL.
[click] When a write must invalidate immediately, do cache-aside in code and delete on write.
[click] And when writes come in bursts that can be acknowledged early, write-behind on a Valkey stream, with AOF and replicas. PostgreSQL stays the source of truth. Valkey keeps the answers and absorbs the bursts.
Time check: 41:30.
-->

---
layout: default
class: closing-slide
---

<div class="closing-grid">
  <div class="closing-copy">
    <p class="eyebrow eyebrow--dark">GRACIAS, PGDAY MÉXICO</p>
    <h1>Postgres for the truth.<br><span>Valkey for the answers.</span></h1>
    <div class="closing-steps">
      <div><b>01</b>Find your Q3</div>
      <div><b>02</b>Add one hint</div>
      <div><b>03</b>Measure the hit ratio</div>
    </div>
    <div class="closing-presenter">
      <img class="closing-headshot" src="/images/rberoj.jpg" alt="Roberto Luna Rojas" />
      <PresenterIdentity />
    </div>
  </div>
  <a class="qr-card" href="https://www.linkedin.com/in/robertolunarojas/" aria-label="Open Roberto's LinkedIn profile">
    <img src="/qr/qr-linkedin.svg" alt="QR code for Roberto Luna Rojas on LinkedIn" />
    <strong>Let's connect</strong>
    <span>linkedin.com/in/robertolunarojas</span>
  </a>
  <a class="qr-card" href="https://valkey.io" aria-label="Open valkey.io">
    <img src="/qr/qr-valkey.svg" alt="QR code for valkey.io" />
    <strong>Explore Valkey</strong>
    <span>valkey.io</span>
  </a>
</div>

<div class="closing-links">
  <a href="https://github.com/aws/aws-advanced-jdbc-wrapper/blob/main/docs/using-the-jdbc-driver/using-plugins/UsingTheRemoteQueryCachePlugin.md">Remote Query Cache Plugin</a>
  <a href="https://github.com/aws-samples/aws-amazon-elasticache-samples">jdbc-caching-demo</a>
  <a href="https://postgrespro.com/community/demodb">Postgres Pro demo DB</a>
  <a href="https://valkey-admin.valkey.io/">Valkey Admin</a>
</div>

<!--
Close with action. Three steps for Monday: find your Q3 with pg_stat_statements (frequent, slow, 100+ blocks per row). Add the wrapper, the plugin, and one hint with a TTL you can defend. Measure hit ratio and p99 in Valkey Admin before you expand.
Gracias. Questions.
-->
