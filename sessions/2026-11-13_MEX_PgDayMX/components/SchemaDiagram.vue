<script setup>
// The Postgres Pro airline schema (bookings, 2025-09-01 release) as an ERD,
// with one normalization gap flagged per click. Row counts are reltuples
// from airtravel_2y.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_CODE, addMarkers, tr } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 344
const BOX_W = 206
const HEAD = 24
const ROW = 14

const tables = [
  { id: 'bookings', x: 8, y: 8, rows: '9.7M', cols: [['book_ref', 'PK'], ['book_date', ''], ['total_amount', '']] },
  { id: 'tickets', x: 290, y: 8, rows: '21.1M', cols: [['ticket_no', 'PK'], ['book_ref', 'FK'], ['passenger_id', ''], ['passenger_name', ''], ['outbound', '']] },
  { id: 'segments', x: 572, y: 8, rows: '27.6M', cols: [['ticket_no', 'PK FK'], ['flight_id', 'PK FK'], ['fare_conditions', ''], ['price', '']] },
  { id: 'boarding_passes', x: 866, y: 8, rows: '26.3M', cols: [['ticket_no', 'PK FK'], ['flight_id', 'PK FK'], ['seat_no', ''], ['boarding_no', ''], ['boarding_time', '']] },
  { id: 'airports_data', x: 8, y: 152, rows: '5.5K', cols: [['airport_code', 'PK'], ['airport_name jsonb', ''], ['city jsonb', ''], ['country jsonb', ''], ['coordinates point', ''], ['timezone', '']] },
  { id: 'routes', x: 290, y: 152, rows: '7.2K', cols: [['route_no', 'EXCL'], ['validity tstzrange', 'EXCL'], ['departure_airport', 'FK'], ['arrival_airport', 'FK'], ['airplane_code', 'FK'], ['days_of_week int[]', ''], ['scheduled_time', ''], ['duration', '']] },
  { id: 'flights', x: 572, y: 152, rows: '135.6K', cols: [['flight_id', 'PK'], ['route_no', ''], ['status', ''], ['scheduled_departure', ''], ['scheduled_arrival', ''], ['actual_departure', ''], ['actual_arrival', '']] },
  { id: 'airplanes_data', x: 866, y: 152, rows: '10', cols: [['airplane_code', 'PK'], ['model jsonb', ''], ['range', ''], ['speed', '']] },
  { id: 'seats', x: 866, y: 262, rows: '1.7K', cols: [['airplane_code', 'PK FK'], ['seat_no', 'PK'], ['fare_conditions', '']] },
]

// One normalization finding per click. `cols` are table.column keys to flag.
const findings = [
  null,
  { cols: ['tickets.passenger_id', 'tickets.passenger_name'], badge: ['tickets', '3NF'] },
  { cols: ['bookings.total_amount', 'segments.price'], badge: ['bookings', 'DERIVED'] },
  { cols: ['airports_data.airport_name jsonb', 'airports_data.city jsonb', 'airports_data.country jsonb', 'airplanes_data.model jsonb'], badge: ['airports_data', '1NF'] },
  { cols: ['routes.days_of_week int[]'], badge: ['routes', '1NF'] },
  { cols: ['segments.fare_conditions', 'seats.fare_conditions', 'flights.status', 'flights.route_no'], badge: ['flights', 'NO FK'] },
  { cols: [], badge: null },
]

const steps = [
  { label: 'THE SCHEMA', detail: '9 tables, ~85M rows in the 2-year set. Three hot tables of 20M+ rows each: tickets, segments, boarding_passes.' },
  { label: '1 \u00B7 NO PASSENGERS TABLE', detail: 'passenger_name depends on passenger_id, not on ticket_no. Repeated on every ticket: a 3NF transitive dependency.', tone: 'red' },
  { label: '2 \u00B7 A STORED TOTAL', detail: 'bookings.total_amount is SUM(segments.price) kept by hand. Derived data that can drift from its source.', tone: 'red' },
  { label: '3 \u00B7 JSON INSIDE A COLUMN', detail: 'Localized names packed as {"en": .., "ru": ..}; city and country repeat per airport. Every read pays ->> \'en\'.', tone: 'red' },
  { label: '4 \u00B7 AN ARRAY AS A COLUMN', detail: 'days_of_week integer[] is a repeating group: 1NF says one value per cell, or a route_days child table.', tone: 'red' },
  { label: '5 \u00B7 TEXT CODES, A TEMPORAL LINK', detail: 'fare_conditions and status are CHECK-constrained text, no lookup table. flights \u2192 routes has no FK: route_no + validity @>.', tone: 'red' },
  { label: '6 \u00B7 WHY IT MATTERS HERE', detail: 'Meaning is rebuilt at read time: temporal joins plus JSON extraction, on every request. That is the work a cache remembers.' },
]

let scene = null

function boxHeight(t) {
  return HEAD + t.cols.length * ROW + 8
}

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'erd')
  const links = svg.append('g')
  const root = svg.append('g')
  const colMarks = new Map()
  const boxes = new Map()
  const badges = new Map()

  for (const t of tables) {
    const h = boxHeight(t)
    const g = root.append('g').attr('transform', `translate(${t.x},${t.y})`)
    g.append('rect').attr('width', BOX_W).attr('height', h).attr('fill', VK.white).attr('stroke', VK.lavender).attr('stroke-width', 1.5)
    g.append('rect').attr('width', BOX_W).attr('height', HEAD).attr('fill', VK.purple)
    g.append('text').attr('x', 10).attr('y', 16).attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 700).text(t.id)
    g.append('text').attr('x', BOX_W - 10).attr('y', 16).attr('text-anchor', 'end').attr('fill', VK.candy).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 700).text(t.rows)
    t.cols.forEach(([name, key], i) => {
      const y = HEAD + 4 + i * ROW
      const hl = g.append('rect').attr('x', 2).attr('y', y).attr('width', BOX_W - 4).attr('height', ROW).attr('fill', VK.redFill).attr('opacity', 0)
      const label = g.append('text').attr('x', 10).attr('y', y + 10.5).attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 10.5).text(name)
      if (key) {
        g.append('text').attr('x', BOX_W - 10).attr('y', y + 10.5).attr('text-anchor', 'end')
          .attr('fill', key.startsWith('PK') ? VK.blue : VK.muted).attr('font-family', FONT_CODE).attr('font-size', 9).attr('font-weight', 700).text(key)
      }
      colMarks.set(`${t.id}.${name}`, { hl, label })
    })
    const badge = g.append('g').attr('opacity', 0).attr('transform', `translate(${BOX_W - 8},-6)`)
    badge.append('rect').attr('x', -60).attr('y', -2).attr('width', 64).attr('height', 18).attr('rx', 9).attr('fill', VK.red)
    const badgeText = badge.append('text').attr('x', -28).attr('y', 11).attr('text-anchor', 'middle').attr('fill', VK.white)
      .attr('font-family', FONT_CODE).attr('font-size', 9.5).attr('font-weight', 800).text('')
    badges.set(t.id, { g: badge, text: badgeText })
    boxes.set(t.id, { ...t, h, g })
  }

  const b = (id) => boxes.get(id)
  const rowY = (id, i) => b(id).y + HEAD + 4 + i * ROW + ROW / 2
  const rel = (d, { dashed = false, color = VK.muted } = {}) => links.append('path').attr('d', d).attr('fill', 'none')
    .attr('stroke', color).attr('stroke-width', 1.6).attr('stroke-dasharray', dashed ? '6 5' : null).attr('marker-end', 'url(#erd-arrow-muted)')

  // Child -> parent, arrow at the referenced (one) side.
  rel(`M ${b('tickets').x} ${rowY('tickets', 1)} L ${b('bookings').x + BOX_W} ${rowY('bookings', 0)}`)
  rel(`M ${b('segments').x} ${rowY('segments', 0)} L ${b('tickets').x + BOX_W} ${rowY('tickets', 0)}`)
  rel(`M ${b('boarding_passes').x} ${rowY('boarding_passes', 0)} L ${b('segments').x + BOX_W} ${rowY('segments', 0)}`)
  rel(`M ${b('segments').x + 120} ${b('segments').y + b('segments').h} L ${b('flights').x + 120} ${b('flights').y}`)
  rel(`M ${b('routes').x} ${rowY('routes', 2)} L ${b('airports_data').x + BOX_W} ${rowY('airports_data', 0)}`)
  rel(`M ${b('routes').x} ${rowY('routes', 3)} L ${b('airports_data').x + BOX_W} ${rowY('airports_data', 0) + 6}`)
  rel(`M ${b('seats').x + 40} ${b('seats').y} L ${b('airplanes_data').x + 40} ${b('airplanes_data').y + b('airplanes_data').h}`)
  // routes.airplane_code -> airplanes_data, routed through the corridor between the rows.
  rel(`M ${b('routes').x + BOX_W} ${rowY('routes', 4)} L ${b('routes').x + BOX_W + 18} ${rowY('routes', 4)} L ${b('routes').x + BOX_W + 18} 132 L ${b('airplanes_data').x - 22} 132 L ${b('airplanes_data').x - 22} ${rowY('airplanes_data', 0)} L ${b('airplanes_data').x} ${rowY('airplanes_data', 0)}`)
  // flights -> routes is a logical temporal relationship, not a declared FK.
  const temporal = rel(`M ${b('flights').x} ${rowY('flights', 1)} L ${b('routes').x + BOX_W} ${rowY('routes', 0)}`, { dashed: true })
  const temporalLabel = links.append('text').attr('x', (b('flights').x + b('routes').x + BOX_W) / 2).attr('y', rowY('routes', 0) - 6)
    .attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 9).text('@> validity')

  scene = { colMarks, badges, temporal, temporalLabel }
}

function apply(step) {
  if (!scene) return
  const f = findings[Math.min(step, findings.length - 1)]
  const flagged = new Set(f?.cols || [])
  for (const [key, m] of scene.colMarks) {
    const on = flagged.has(key)
    tr(m.hl, 260).attr('opacity', on ? 1 : 0)
    m.label.attr('fill', on ? VK.red : VK.black).attr('font-weight', on ? 800 : 400)
  }
  for (const [id, badge] of scene.badges) {
    const on = f?.badge && f.badge[0] === id
    if (on) badge.text.text(f.badge[1])
    tr(badge.g, 260).attr('opacity', on ? 1 : 0)
  }
  const temporalOn = step === 5
  scene.temporal.attr('stroke', temporalOn ? VK.red : VK.muted).attr('stroke-width', temporalOn ? 2.4 : 1.6)
  scene.temporalLabel.attr('fill', temporalOn ? VK.red : VK.muted).attr('font-weight', temporalOn ? 800 : 400)
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="schema-erd">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Entity relationship diagram of the Postgres Pro airline schema with normalization gaps highlighted" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.schema-erd { width: 100%; }
.schema-erd .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
