<script setup>
// Click-driven request traces for the three strategies that are not cache-aside.
// Narratives follow animations/Valkey_Demo_Library (C01 cache-aside reads, C02 write-through, C04 write-back).
import { computed, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, arc, flow, particle, pill } from './diagram-kit.js'

const props = defineProps({
  scenario: { type: String, default: 'read-through' },
  step: { type: Number, default: 0 },
})
const svgRef = ref(null)
const W = 1080
const H = 320
const NODE_W = 180
const NODE_H = 92
const NODE_Y = 112
const NODE_X = [40, 320, 600, 880]

const scenes = {
  'read-through': {
    nodes: [
      { eyebrow: 'CLIENT', label: 'Product page', status: 'read product 42' },
      { eyebrow: 'APPLICATION', label: 'Read path', status: 'talks to the cache only' },
      { eyebrow: 'VALKEY', label: 'Read-through cache', status: 'owns the database call', valkey: true },
      { eyebrow: 'DATABASE', label: 'Source of truth', status: 'authoritative', glyph: 'db' },
    ],
    steps: [
      { label: 'READY', detail: 'The cache tier owns the loader. The application has one interface and never queries the database for reads.' },
      { label: '1 \u00B7 CHECK', detail: 'The application asks the cache for product 42.', moves: [['f12', 'read product 42', 'blue'], ['f23', 'GET product:42', 'blue']], nodes: [0, 1, 2] },
      { label: '2 \u00B7 MISS, CACHE LOADS', detail: 'The key is absent, so the cache tier itself runs the loader against the database. The application does not know a miss happened.', moves: [['f34', 'miss: loader runs SELECT', 'red']], nodes: [2, 3], status: { 2: ['loading from source', VK.red], 3: ['reads once', VK.red] } },
      { label: '3 \u00B7 FILL + TTL', detail: 'The value comes back and is stored with an expiration. Freshness is a policy decision, not automatic synchronization.', moves: [['b43', 'v1', 'red']], nodes: [2, 3], status: { 2: ['v1 \u00B7 TTL 60 s', VK.blue], 3: ['authoritative', VK.muted] } },
      { label: '4 \u00B7 RETURN', detail: 'The cache answers the application, which answers the client.', moves: [['b32', 'v1', 'blue'], ['b21', 'response', 'blue']], nodes: [0, 1, 2] },
      { label: '5 \u00B7 WARM HIT', detail: 'The next read is served from memory. The database is never asked. A hit can still be stale: the TTL bounds how long.', moves: [['f12', 'read product 42', 'blue'], ['f23', 'GET \u2192 hit', 'blue'], ['b32', 'v1 from memory', 'blue'], ['b21', 'response', 'blue']], nodes: [0, 1, 2], status: { 3: ['idle: never asked', VK.blue] } },
    ],
  },
  'write-through': {
    nodes: [
      { eyebrow: 'CLIENT', label: 'Write v2', status: 'update product 42' },
      { eyebrow: 'WRITE ADAPTER', label: 'Coordinator', status: 'application-owned' },
      { eyebrow: 'VALKEY', label: 'Cache', status: 'v1 \u00B7 TTL 60 s', valkey: true },
      { eyebrow: 'DATABASE', label: 'Source of truth', status: 'v1', glyph: 'db' },
    ],
    steps: [
      { label: 'READY', detail: 'Writes go through a coordinator that waits for both systems before it reports success. Readers never see the cache lag the database.' },
      { label: '1 \u00B7 WRITE', detail: 'The client submits v2 to the write adapter.', moves: [['f12', 'PUT product:42 = v2', 'blue']], nodes: [0, 1], status: { 1: ['v2 pending', VK.red] } },
      { label: '2 \u00B7 COMMIT THE SOURCE', detail: 'This implementation commits the database first. The two stores do not share a transaction.', moves: [['f24', 'COMMIT v2', 'red']], nodes: [1, 3], status: { 3: ['v2 confirmed', VK.blue] } },
      { label: '3 \u00B7 UPDATE THE CACHE', detail: 'Then the adapter stores v2 in Valkey and refreshes the TTL. Between the two writes there is a short visibility gap.', moves: [['f23', 'SET v2 EX 60', 'blue']], nodes: [1, 2], status: { 2: ['v2 \u00B7 TTL 60 s', VK.blue] } },
      { label: '4 \u00B7 ACKNOWLEDGE', detail: 'Only after both confirm does the client hear success. Write latency is now database plus cache.', moves: [['b21', 'both confirmed', 'blue']], nodes: [0, 1], status: { 1: ['latency = DB + cache', VK.purple] } },
      { label: '5 \u00B7 READ v2', detail: 'The next reader finds v2 in the cache. The sharp edge: if the SET fails after the commit, record repair work; do not claim clean success.', moves: [['f12', 'read product 42', 'blue'], ['f23', 'GET \u2192 v2', 'blue'], ['b32', 'v2', 'blue'], ['b21', 'response', 'blue']], nodes: [0, 1, 2] },
    ],
  },
  'write-behind': {
    nodes: [
      { eyebrow: 'CLIENT', label: 'Write v2', status: 'update product 42' },
      { eyebrow: 'WRITE ADAPTER', label: 'Accepts writes', status: 'application-owned' },
      { eyebrow: 'VALKEY', label: 'Write buffer', status: 'pending work + intent', valkey: true },
      { eyebrow: 'DB WORKER', label: 'Async drain', status: 'database still at v1', glyph: 'db' },
    ],
    steps: [
      { label: 'READY', detail: 'Acknowledge before the database commit, then drain pending changes asynchronously. The durability boundary moves to the buffer.' },
      { label: '1 \u00B7 WRITE', detail: 'The client submits v2.', moves: [['f12', 'PUT product:42 = v2', 'blue']], nodes: [0, 1] },
      { label: '2 \u00B7 BUFFER', detail: 'The adapter records v2 plus flush intent in Valkey. A plain SET is not a write-back pipeline: you need an explicit pending-work protocol.', moves: [['f23', 'v2 + flush intent', 'blue']], nodes: [1, 2], status: { 2: ['v2 pending', VK.purple] } },
      { label: '3 \u00B7 ACK EARLY', detail: 'The client hears success in about a millisecond. The database still has v1.', moves: [['b21', 'accepted', 'blue']], nodes: [0, 1], status: { 0: ['done in ~1 ms', VK.blue], 3: ['still v1 \u00B7 behind', VK.red] } },
      { label: '4 \u00B7 DRAIN', detail: 'A background worker commits the batch idempotently, then acknowledges the pending task. Batching can coalesce writes when the semantics allow it.', moves: [['f34', 'worker flushes batch', 'red']], nodes: [2, 3], status: { 2: ['lag \u2192 0', VK.blue], 3: ['v2 committed', VK.blue] } },
      { label: '5 \u00B7 THE RISK', detail: 'Lose the buffer before the flush and v2 is gone after the client was told success. Use a durable, replayable log, or only accept this where the loss window is acceptable.', tone: 'red', nodes: [2], down: [2], status: { 2: ['buffer lost before flush', VK.red], 3: ['never sees v2', VK.red] } },
    ],
  },
}

const scene = computed(() => scenes[props.scenario] || scenes['read-through'])
const steps = computed(() => scene.value.steps)
let built = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const prefix = `sf-${props.scenario}`
  addMarkers(svg, prefix)
  const root = svg.append('g')
  const nodes = scene.value.nodes.map((n, i) => card(root, { x: NODE_X[i], y: NODE_Y, w: NODE_W, h: NODE_H, ...n, id: `n${i}` }))
  // Flatter arcs: start near the vertical middle and bulge only modestly, so short gaps do not read as circles.
  const fwd = (a, b, bulge) => arc({ x: nodes[a].right.x, y: nodes[a].right.y - 12 }, { x: nodes[b].left.x, y: nodes[b].left.y - 12 }, bulge)
  const back = (a, b, bulge) => arc({ x: nodes[a].left.x, y: nodes[a].left.y + 14 }, { x: nodes[b].right.x, y: nodes[b].right.y + 14 }, bulge)
  const defs = {
    f12: [fwd(0, 1, -16), 'blue', 270, 96],
    f23: [fwd(1, 2, -16), 'blue', 550, 96],
    f34: [fwd(2, 3, -16), 'red', 830, 96],
    f24: [fwd(1, 3, -108), 'red', 690, 52],
    b21: [back(1, 0, 16), 'blue', 270, 224],
    b32: [back(2, 1, 16), 'blue', 550, 224],
    b43: [back(3, 2, 16), 'red', 830, 224],
  }
  const flows = {}
  const pills = {}
  for (const [id, [d, tone, px, py]] of Object.entries(defs)) {
    flows[id] = flow(root, d, { tone, prefix })
    pills[id] = pill(root, px, py, '', { tone })
  }
  built = { root, nodes, flows, pills }
}

async function animate(step) {
  const spec = steps.value[step]
  if (!spec?.moves) return
  for (const [id, , tone] of spec.moves) {
    await particle(built.root, built.flows[id].node, { tone, duration: 620 })
  }
}

function apply(step) {
  if (!built) return
  const list = steps.value
  const bounded = Math.min(Math.max(step, 0), list.length - 1)
  const spec = list[bounded]
  // Flows: used by the current step are bright; used by earlier steps rest at low opacity.
  const usedBefore = new Set()
  for (let i = 1; i < bounded; i++) for (const [id] of list[i].moves || []) usedBefore.add(id)
  const usedNow = new Map((spec.moves || []).map(([id, label, tone]) => [id, { label, tone }]))
  for (const [id, f] of Object.entries(built.flows)) {
    if (usedNow.has(id)) f.setState('current')
    else if (usedBefore.has(id)) f.setState('active')
    else f.setState('hidden')
    const p = built.pills[id]
    if (usedNow.has(id)) {
      p.setText(usedNow.get(id).label)
      p.setState('current')
    } else if (usedBefore.has(id)) {
      // keep the most recent label used for this flow
      let label = ''
      for (let i = 1; i < bounded; i++) for (const [mid, mlabel] of list[i].moves || []) if (mid === id) label = mlabel
      p.setText(label)
      p.setState('active')
    } else {
      p.setState('hidden')
    }
  }
  // Node status accumulates across steps.
  built.nodes.forEach((n, i) => {
    let status = [scene.value.nodes[i].status, VK.muted]
    for (let s = 1; s <= bounded; s++) {
      const st = list[s].status?.[i]
      if (st) status = st
    }
    n.setStatus(status[0], status[1])
    const down = (spec.down || []).includes(i)
    const current = (spec.nodes || []).includes(i)
    n.setState(down ? 'down' : current ? 'current' : 'idle')
  })
  if (bounded === lastStep + 1) animate(bounded)
  lastStep = bounded
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
watch(() => props.scenario, () => { build(); lastStep = -1; apply(props.step) })
</script>

<template>
  <div class="strategy-flow">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Animated ${scenario} request trace`" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.strategy-flow { width: 100%; }
.strategy-flow .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
