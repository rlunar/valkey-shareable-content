<script setup>
// Stampede, penetration and avalanche, each as a click-driven trace with a database load gauge.
import { computed, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_CODE, addMarkers, card, flow, particle, pill, gauge, tr, text, line, arc } from './diagram-kit.js'

const props = defineProps({
  mode: { type: String, default: 'stampede' },
  step: { type: Number, default: 0 },
})
const svgRef = ref(null)
const W = 1080
const H = 330
const CLIENTS = 12

const specs = {
  stampede: {
    valkey: { eyebrow: 'VALKEY', label: 'Hot key', status: 'product:42 \u00B7 v1 \u00B7 TTL 300 s' },
    steps: [
      { label: 'READY', detail: 'One hot key, many concurrent readers. While the key is fresh the origin is idle.' },
      { label: '1 \u00B7 HITS', detail: 'Twelve readers, twelve hits. Zero database queries.' },
      { label: '2 \u00B7 THE KEY EXPIRES', detail: 'The TTL runs out at the busiest moment. The next twelve reads all miss at once.' },
      { label: '3 \u00B7 STAMPEDE', detail: 'Every reader runs the same expensive query against the origin at the same time. Twelve identical answers, computed twelve times.', tone: 'red' },
      { label: '4 \u00B7 FIX: SINGLE-FLIGHT', detail: 'The first miss takes a short lock (SET lock:key NX EX 10) and recomputes. Everyone else waits a few milliseconds and reads the refilled value. One query, not twelve.' },
    ],
  },
  penetration: {
    valkey: { eyebrow: 'VALKEY', label: 'Cache', status: 'holds keys that exist' },
    steps: [
      { label: 'READY', detail: 'Requests arrive for product:999, which does not exist. Bad links, scrapers, or an attacker guessing ids.' },
      { label: '1 \u00B7 MISS', detail: 'The cache has no entry, the database says "no such row", and nothing gets stored. The next request repeats the trip.' },
      { label: '2 \u00B7 EVERY TIME', detail: 'Non-existent keys bypass the cache on every request. Twelve requests, twelve origin queries, forever.', tone: 'red' },
      { label: '3 \u00B7 FIX A: CACHE THE ABSENCE', detail: 'Store the negative result with a short TTL: product:999 = nothing, 60 s. Repeats stop at the cache.' },
      { label: '4 \u00B7 FIX B: BLOOM FILTER', detail: 'A compact filter in front answers "definitely not here" without touching the cache or the origin. False positives are possible, false negatives never.' },
    ],
  },
  avalanche: {
    valkey: { eyebrow: 'VALKEY', label: 'Working set', status: '24 keys \u00B7 same TTL' },
    steps: [
      { label: 'READY', detail: 'The cache holds the whole working set, filled by a deploy at the same moment with the same TTL.' },
      { label: '1 \u00B7 EXPIRY WAVE', detail: 'Every key expires in the same second. Or a node drops and takes all of them with it.', tone: 'red' },
      { label: '2 \u00B7 AVALANCHE', detail: 'The origin receives the entire working set as misses at once. This is the cascade from the opening, triggered by the cache itself.', tone: 'red' },
      { label: '3 \u00B7 FIX: JITTER + REPLICAS', detail: 'TTL jitter spreads refills over minutes. A replica in another zone takes over when a node is lost, so the keys never vanish together.' },
      { label: '4 \u00B7 FIX: ORIGIN RATE LIMIT', detail: 'Cap concurrent refills at the origin side. A cold cache then degrades you to slow, never to down.' },
    ],
  },
}

const spec = computed(() => specs[props.mode] || specs.stampede)
const steps = computed(() => spec.value.steps)
let built = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const prefix = `fm-${props.mode}`
  addMarkers(svg, prefix)
  const root = svg.append('g')

  // Clients column.
  const clientX = 70
  const clientYs = d3.range(CLIENTS).map((i) => 46 + i * 21)
  text(root, clientX, 24, '12 CONCURRENT READERS', { size: 10, color: VK.purple, weight: 800, mono: true, anchor: 'middle' })
  const clients = clientYs.map((y) => root.append('circle').attr('cx', clientX).attr('cy', y).attr('r', 6).attr('fill', VK.white).attr('stroke', VK.purple).attr('stroke-width', 2))

  const valkey = card(root, { x: 420, y: 118, w: 200, h: 92, ...spec.value.valkey, valkey: true, id: 'valkey' })
  const db = card(root, { x: 850, y: 118, w: 200, h: 92, eyebrow: 'DATABASE', label: 'Origin', status: '0 queries', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 850, 222, 200, 10)
  const dbReadout = text(root, 950, 250, '0 queries / s', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  // Fan-in from clients to the cache, and the cache-to-origin trunk.
  const fanTarget = { x: valkey.left.x, y: valkey.left.y }
  const fanPaths = clientYs.map((y) => flow(root, arc({ x: clientX + 8, y }, fanTarget, 0), { tone: 'blue', prefix, width: 1.5 }))
  const trunk = flow(root, line({ x: valkey.right.x, y: valkey.right.y - 10 }, { x: db.left.x, y: db.left.y - 10 }), { tone: 'red', prefix, width: 3 })
  const trunkBack = flow(root, line({ x: db.left.x, y: db.left.y + 14 }, { x: valkey.right.x, y: valkey.right.y + 14 }), { tone: 'red', prefix, width: 2 })
  const trunkPill = pill(root, 735, 128, '', { tone: 'red' })
  const fixPill = pill(root, 520, 76, '', { tone: 'blue' })

  // Mode-specific extras.
  const extras = {}
  if (props.mode === 'stampede') {
    extras.waiting = d3.range(CLIENTS - 1).map((i) => root.append('circle').attr('cx', 360 + (i % 4) * 14).attr('cy', 150 + Math.floor(i / 4) * 14).attr('r', 5).attr('fill', VK.blue).attr('stroke', VK.white).attr('stroke-width', 1.5).attr('opacity', 0))
    extras.waitLabel = text(root, 380, 220, 'waiting ~5 ms', { size: 9, color: VK.blue, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }
  if (props.mode === 'penetration') {
    extras.bloom = card(root, { x: 200, y: 118, w: 150, h: 92, eyebrow: 'BLOOM FILTER', label: 'Definitely not', status: 'bits say: absent', id: 'bloom' })
    extras.bloom.show(false)
    extras.rejected = text(root, 275, 236, '12 of 12 rejected at the filter', { size: 10, color: VK.purple, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }
  if (props.mode === 'avalanche') {
    const grid = root.append('g').attr('transform', 'translate(428,226)')
    extras.keys = d3.range(24).map((i) => grid.append('rect').attr('x', (i % 12) * 16).attr('y', Math.floor(i / 12) * 16).attr('width', 13).attr('height', 13).attr('rx', 2).attr('fill', VK.blue))
    extras.keysLabel = text(root, 520, 274, 'the working set', { size: 9, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })
    extras.replica = card(root, { x: 440, y: 20, w: 200, h: 80, eyebrow: 'VALKEY \u00B7 AZ b', label: 'Replica', status: 'promotes on node loss', valkey: true, id: 'replica' })
    extras.replica.show(false)
    extras.limiter = root.append('g').attr('opacity', 0).attr('transform', 'translate(700,154)')
    extras.limiter.append('rect').attr('x', -14).attr('y', -14).attr('width', 28).attr('height', 28).attr('rx', 4).attr('fill', VK.white).attr('stroke', VK.purple).attr('stroke-width', 2)
    extras.limiter.append('path').attr('d', 'M-8 0 h4 l3 -6 l3 12 l3 -6 h3').attr('fill', 'none').attr('stroke', VK.purple).attr('stroke-width', 2)
    extras.limiterLabel = text(root, 735, 200, 'max 8 refills in flight', { size: 9, color: VK.purple, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }

  built = { root, clients, fanPaths, trunk, trunkBack, trunkPill, fixPill, valkey, db, dbGauge, dbReadout, extras, prefix }
}

function setDb(load, label, tone) {
  built.dbGauge.set(load, { tone })
  built.dbReadout.text(label).attr('fill', tone === 'red' ? VK.red : tone === 'blue' ? VK.blue : VK.muted)
  built.db.setStatus(label, tone === 'red' ? VK.red : VK.muted)
  built.db.setState(load >= 0.9 ? 'down' : load > 0 ? 'current' : 'idle')
}

async function fanIn(tone, through, count = CLIENTS) {
  const b = built
  const runs = b.fanPaths.slice(0, count).map((f, i) => new Promise((r) => setTimeout(() => particle(b.root, f.node, { tone, duration: 520, r: 5 }).then(r), i * 45)))
  await Promise.all(runs)
  if (through) {
    await particle(b.root, b.trunk.node, { tone: 'red', duration: 500 })
    await particle(b.root, b.trunkBack.node, { tone: 'red', duration: 500 })
  }
}

function applyStampede(step, animate) {
  const b = built
  const { extras: e } = b
  b.fanPaths.forEach((f) => f.setState(step >= 1 ? (step === 1 || step === 3 ? 'current' : 'active') : 'hidden'))
  b.trunk.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.trunkBack.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.valkey.setStatus(step >= 4 ? 'product:42 \u00B7 v2 \u00B7 TTL 300 s' : step >= 2 ? 'product:42 \u00B7 EXPIRED' : 'product:42 \u00B7 v1 \u00B7 TTL 300 s', step >= 4 ? VK.blue : step >= 2 ? VK.red : VK.blue)
  b.valkey.setState(step === 2 || step === 3 ? 'warn' : step >= 1 ? 'current' : 'idle')
  b.trunkPill.setText(step === 3 ? '12 identical queries at once' : '1 query, 11 wait')
  b.trunkPill.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.fixPill.setText('SET lock:product:42 1 NX EX 10')
  b.fixPill.setState(step >= 4 ? 'current' : 'hidden')
  e.waiting.forEach((w, i) => tr(w, 300 + i * 30).attr('opacity', step === 4 ? 1 : 0))
  tr(e.waitLabel, 300).attr('opacity', step === 4 ? 1 : 0)
  if (step === 3) setDb(1.2, '12 queries \u00B7 p99 climbing', 'red')
  else if (step === 4) setDb(1 / 12, '1 query', 'blue')
  else setDb(0, '0 queries', 'muted')
  if (animate && step === 1) fanIn('blue', false)
  if (animate && step === 3) fanIn('red', true)
  if (animate && step === 4) particle(b.root, b.fanPaths[0].node, { tone: 'blue', duration: 500 }).then(() => particle(b.root, b.trunk.node, { tone: 'blue', duration: 500 })).then(() => particle(b.root, b.trunkBack.node, { tone: 'blue', duration: 500 }))
}

function applyPenetration(step, animate) {
  const b = built
  const { extras: e } = b
  const blocked = step >= 4
  b.fanPaths.forEach((f) => f.setState(blocked ? 'faded' : step >= 1 ? (step === 1 ? 'current' : 'active') : 'hidden'))
  b.trunk.setState(step === 1 || step === 2 ? 'current' : step >= 3 ? 'faded' : 'hidden')
  b.trunkBack.setState(step === 1 || step === 2 ? 'current' : step >= 3 ? 'faded' : 'hidden')
  b.trunkPill.setText(step === 2 ? 'every request reaches the origin' : 'SELECT ... = no row')
  b.trunkPill.setState(step === 1 || step === 2 ? 'current' : 'hidden')
  b.valkey.setStatus(step >= 3 ? 'product:999 = nothing \u00B7 TTL 60 s' : step >= 1 ? 'no entry, nothing stored' : 'holds keys that exist', step >= 3 ? VK.blue : step >= 1 ? VK.red : VK.muted)
  b.valkey.setState(blocked ? 'faded' : step === 3 ? 'good' : step >= 1 ? 'current' : 'idle')
  b.fixPill.setText('negative cache: 12 of 12 stop here')
  b.fixPill.setState(step === 3 ? 'current' : 'hidden')
  e.bloom.show(blocked)
  e.bloom.setState(blocked ? 'good' : 'idle')
  tr(e.rejected, 300).attr('opacity', blocked ? 1 : 0)
  if (step === 1) setDb(1 / 12, '1 query, nothing to cache', 'red')
  else if (step === 2) setDb(1.2, '12 of 12 reach the origin', 'red')
  else setDb(0, '0 queries', 'muted')
  if (animate && step === 1) particle(b.root, b.fanPaths[0].node, { tone: 'red', duration: 500 }).then(() => particle(b.root, b.trunk.node, { tone: 'red', duration: 500 })).then(() => particle(b.root, b.trunkBack.node, { tone: 'red', duration: 500 }))
  if (animate && step === 2) fanIn('red', true)
  if (animate && step === 3) fanIn('blue', false)
}

function applyAvalanche(step, animate) {
  const b = built
  const { extras: e } = b
  b.fanPaths.forEach((f) => f.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden'))
  b.trunk.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.trunkBack.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.trunkPill.setText(step === 2 ? 'whole working set as misses' : step >= 4 ? 'refills capped: slow, not down' : 'refills spread over minutes')
  b.trunkPill.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.valkey.setStatus(step === 1 || step === 2 ? '24 keys \u00B7 ALL EXPIRED' : step >= 3 ? '24 keys \u00B7 TTL 300 \u00B1 60 s' : '24 keys \u00B7 same TTL', step === 1 || step === 2 ? VK.red : step >= 3 ? VK.blue : VK.muted)
  b.valkey.setState(step === 1 || step === 2 ? 'warn' : step >= 3 ? 'good' : 'idle')
  const rng = d3.randomLcg(3)
  const pattern = d3.range(24).map(() => rng() > 0.45)
  e.keys.forEach((k, i) => tr(k, 300 + i * 20).attr('fill', step === 1 || step === 2 ? VK.mist : step >= 3 ? (pattern[i] ? VK.blue : VK.mist) : VK.blue))
  e.replica.show(step >= 3)
  e.replica.setState(step >= 3 ? 'good' : 'idle')
  tr(e.limiter, 300).attr('opacity', step >= 4 ? 1 : 0)
  tr(e.limiterLabel, 300).attr('opacity', step >= 4 ? 1 : 0)
  b.fixPill.setText('jitter + a replica in another zone')
  b.fixPill.setState(step >= 3 ? (step === 3 ? 'current' : 'active') : 'hidden')
  if (step === 2) setDb(1.3, 'entire working set at once', 'red')
  else if (step === 3) setDb(0.45, 'refills spread out', 'blue')
  else if (step === 4) setDb(0.33, 'capped at 8 in flight', 'blue')
  else setDb(0, '0 queries', 'muted')
  if (animate && step === 2) fanIn('red', true)
  if (animate && step === 3) fanIn('blue', true, 5)
}

function apply(step) {
  if (!built) return
  const bounded = Math.min(Math.max(step, 0), steps.value.length - 1)
  const animate = bounded === lastStep + 1
  if (props.mode === 'stampede') applyStampede(bounded, animate)
  else if (props.mode === 'penetration') applyPenetration(bounded, animate)
  else applyAvalanche(bounded, animate)
  lastStep = bounded
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
watch(() => props.mode, () => { build(); lastStep = -1; apply(props.step) })
</script>

<template>
  <div class="failure-mode">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Animated ${mode} failure mode and its fix`" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.failure-mode { width: 100%; }
.failure-mode .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
