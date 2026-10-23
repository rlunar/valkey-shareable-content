<script setup>
// No cache for a while: the edge must shed load so fail-open does not take the origin down.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, flow, particle, pill, gauge, tr, text, line, arc, countUp } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 372
const OFFERED = 8000
const DB_CAPACITY = 2000

const steps = [
  { label: 'READY', detail: 'A normal day: the gateway admits everything, 98% of reads stop at Valkey, and the origin sees 160 requests per second.' },
  { label: '1 \u00B7 CACHE UNAVAILABLE', detail: 'Failover window, cold restart, or a bad config push. Fail open now sends every read to the origin: 8,000 req/s onto a database that sustains 2,000. The outage you avoided arrives through the back door.', tone: 'red' },
  { label: '2 \u00B7 THROTTLE AT THE EDGE', detail: 'The API gateway admits what the origin can serve and sheds the rest with 429 and Retry-After. Users get a fast no instead of a slow timeout, and the database stays up.' },
  { label: '3 \u00B7 THE CACHE WARMS', detail: 'Valkey comes back empty. Every admitted miss refills a key, so the hit ratio climbs from 0 toward 98% and the origin load falls with it.' },
  { label: '4 \u00B7 RELEASE', detail: 'Raise the limit as the hit ratio recovers. Fail open removed the natural brake; the limiter is the brake you add back on purpose.' },
]

let s = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'gw')
  const root = svg.append('g')

  const clients = card(root, { x: 30, y: 140, w: 170, h: 92, eyebrow: 'CLIENTS', label: '8,000 req/s', status: 'surge traffic', glyph: 'users', id: 'clients' })
  const gateway = card(root, { x: 280, y: 140, w: 190, h: 92, eyebrow: 'API GATEWAY', label: 'Admission control', status: 'admit all', glyph: 'gateway', id: 'gw' })
  const app = card(root, { x: 550, y: 140, w: 170, h: 92, eyebrow: 'APPLICATION', label: 'Fail-open client', status: 'cache first', id: 'app' })
  const valkey = card(root, { x: 820, y: 22, w: 220, h: 86, eyebrow: 'VALKEY', label: 'Cache tier', status: 'warm \u00B7 98% hit ratio', valkey: true, id: 'vk' })
  const db = card(root, { x: 820, y: 222, w: 220, h: 92, eyebrow: 'DATABASE', label: 'Origin', status: 'capacity 2,000 req/s', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 820, 326, 220, 10)
  const dbReadout = text(root, 930, 354, '', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  const inbound = flow(root, line({ x: clients.right.x, y: clients.right.y - 14 }, { x: gateway.left.x, y: gateway.left.y - 14 }), { tone: 'blue', prefix: 'gw' })
  const shed = flow(root, line({ x: gateway.left.x, y: gateway.left.y + 18 }, { x: clients.right.x, y: clients.right.y + 18 }), { tone: 'red', prefix: 'gw', width: 3 })
  const admitted = flow(root, line({ x: gateway.right.x, y: gateway.right.y }, { x: app.left.x, y: app.left.y }), { tone: 'blue', prefix: 'gw' })
  const toCache = flow(root, arc({ x: app.right.x, y: app.right.y - 24 }, { x: valkey.left.x, y: valkey.left.y + 10 }, -40), { tone: 'blue', prefix: 'gw' })
  const toDb = flow(root, arc({ x: app.right.x, y: app.right.y + 24 }, { x: db.left.x, y: db.left.y - 10 }, 40), { tone: 'red', prefix: 'gw' })

  const inboundPill = pill(root, 240, 100, '8,000 req/s', { tone: 'blue' })
  const shedPill = pill(root, 240, 268, '6,000 req/s \u2192 429 + Retry-After', { tone: 'red' })
  const admittedPill = pill(root, 510, 232, 'admit all', { tone: 'blue' })
  const cachePill = pill(root, 770, 60, '98% of reads stop here', { tone: 'blue' })
  const dbPill = pill(root, 760, 300, '160 req/s', { tone: 'red' })

  s = { root, clients, gateway, app, valkey, db, dbGauge, dbReadout, inbound, shed, admitted, toCache, toDb, inboundPill, shedPill, admittedPill, cachePill, dbPill }
}

async function animate(step) {
  if (step === 1) {
    await particle(s.root, s.admitted.node, { tone: 'red' })
    await particle(s.root, s.toDb.node, { tone: 'red', duration: 700 })
  }
  if (step === 2) {
    particle(s.root, s.shed.node, { tone: 'red', duration: 700 })
    await particle(s.root, s.admitted.node, { tone: 'blue' })
  }
  if (step === 3) await particle(s.root, s.toCache.node, { tone: 'blue', duration: 700 })
  if (step === 4) await particle(s.root, s.inbound.node, { tone: 'blue' })
}

function apply(step) {
  if (!s) return
  const cacheDown = step === 1 || step === 2
  const throttled = step === 2 || step === 3
  s.inbound.setState(step >= 1 ? 'active' : 'current')
  s.inboundPill.setState(step === 0 || step === 4 ? 'current' : 'active')
  s.admitted.setState(step === 1 ? 'current' : 'active')
  s.admittedPill.setText(throttled ? 'admit 2,000 req/s' : 'admit all 8,000 req/s')
  s.admittedPill.setState(step === 2 || step === 4 ? 'current' : 'active')
  s.shed.setState(throttled ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.shedPill.setState(throttled ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.toCache.setState(cacheDown ? 'broken' : step === 3 ? 'current' : 'active')
  s.cachePill.setText(cacheDown ? 'unavailable' : step === 3 ? 'refilling on every miss' : '98% of reads stop here')
  s.cachePill.setState(cacheDown ? 'hidden' : step === 3 ? 'current' : 'active')
  s.toDb.setState(step === 1 ? 'current' : 'active')

  s.gateway.setStatus(throttled ? 'token bucket: 2,000 req/s' : 'admit all', throttled ? VK.purple : VK.muted)
  s.gateway.setState(step === 2 ? 'current' : throttled ? 'good' : 'idle')
  s.valkey.setState(cacheDown ? 'down' : step === 3 ? 'current' : 'idle')
  if (step === 3) {
    s.valkey.setStatus('0% hit ratio \u00B7 warming up', VK.blue)
    countUp(s.valkey.statusText, 98, { from: 0, duration: 1400, format: (v) => Math.round(v).toString(), suffix: '% hit ratio \u00B7 warming up' })
  } else {
    s.valkey.setStatus(cacheDown ? 'unavailable: failover or cold restart' : 'warm \u00B7 98% hit ratio', cacheDown ? VK.red : VK.blue)
  }
  s.app.setStatus(cacheDown ? 'fail open: every read goes to the origin' : 'cache first', cacheDown ? VK.red : VK.muted)

  const load = step === 1 ? OFFERED : step === 2 ? DB_CAPACITY : step === 3 ? 900 : 160
  const ratio = load / DB_CAPACITY
  const tone = step === 1 ? 'red' : step === 2 ? 'purple' : 'blue'
  s.dbGauge.set(ratio, { tone })
  s.dbReadout.text(step === 1 ? '8,000 req/s onto 2,000 capacity: saturates in seconds' : step === 2 ? '2,000 req/s: at capacity, not beyond it' : step === 3 ? '900 req/s and falling' : '160 req/s: misses only')
    .attr('fill', step === 1 ? VK.red : step === 2 ? VK.purple : VK.blue)
  s.db.setState(step === 1 ? 'down' : step === 2 ? 'warn' : 'idle')
  s.db.setStatus(step === 1 ? 'pool exhausted, queues form' : step === 2 ? 'busy but healthy' : 'capacity 2,000 req/s', step === 1 ? VK.red : VK.muted)
  s.dbPill.setText(step === 1 ? '8,000 req/s' : step === 2 ? '2,000 req/s' : step === 3 ? '900 req/s' : '160 req/s')
  s.dbPill.setState(step === 1 ? 'current' : 'active')
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="gateway-shed">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="With the cache unavailable, the API gateway rate limits traffic so the database stays within capacity while Valkey recovers" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.gateway-shed { width: 100%; }
.gateway-shed .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
