<script setup>
// Write-behind with a Valkey stream as the durable pending log and a consumer
// group draining batches into PostgreSQL. Commands are standard Valkey stream
// commands (XADD, XREADGROUP, XACK, XAUTOCLAIM).
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, arc, line, flow, particle, pill, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 316

const steps = [
  { label: 'WRITE-BEHIND', detail: 'Move the database commit off the request path. Acknowledge in memory, drain to Postgres in batches.' },
  { label: '1 \u00B7 XADD', detail: 'The write is appended to a Valkey stream. One in-memory append, persisted by AOF and replicas.' },
  { label: '2 \u00B7 ACK FAST', detail: 'The caller hears success in about a millisecond. PostgreSQL has not seen the row yet.' },
  { label: '3 \u00B7 XREADGROUP', detail: 'A worker in a consumer group pulls up to 500 entries. Add workers to drain faster.' },
  { label: '4 \u00B7 ONE TRANSACTION', detail: 'Many rows, one commit: INSERT ... ON CONFLICT DO NOTHING. One WAL fsync instead of 500.' },
  { label: '5 \u00B7 XACK AFTER COMMIT', detail: 'Crash between commit and XACK? XAUTOCLAIM redelivers, and the idempotent insert makes that safe.' },
  { label: '6 \u00B7 THE PRICE', detail: 'Bounded staleness and a loss window set by Valkey durability (appendfsync, replicas). Choose it on purpose.', tone: 'red' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'wb')
  const root = svg.append('g')

  const app = card(root, { x: 18, y: 120, w: 190, h: 84, eyebrow: 'APPLICATION', label: 'POST /booking', status: 'request path' })
  const stream = card(root, { x: 300, y: 120, w: 210, h: 84, eyebrow: 'VALKEY STREAM', label: 'bookings:pending', status: 'appendonly yes', valkey: true })
  const worker = card(root, { x: 600, y: 120, w: 190, h: 84, eyebrow: 'WORKER', label: 'consumer group', status: 'XREADGROUP COUNT 500' })
  const pg = card(root, { x: 870, y: 120, w: 192, h: 84, eyebrow: 'POSTGRESQL', label: 'bookings', status: 'batched commit', glyph: 'db' })

  const xadd = flow(root, arc({ x: app.right.x, y: app.right.y - 14 }, { x: stream.left.x, y: stream.left.y - 14 }, -40), { tone: 'blue', prefix: 'wb' })
  const ack = flow(root, arc({ x: stream.left.x, y: stream.left.y + 16 }, { x: app.right.x, y: app.right.y + 16 }, 40), { tone: 'blue', prefix: 'wb' })
  const read = flow(root, line(stream.right, worker.left), { tone: 'purple', prefix: 'wb' })
  const insert = flow(root, arc({ x: worker.right.x, y: worker.right.y - 14 }, { x: pg.left.x, y: pg.left.y - 14 }, -40), { tone: 'red', prefix: 'wb' })
  const commit = flow(root, arc({ x: pg.left.x, y: pg.left.y + 16 }, { x: worker.right.x, y: worker.right.y + 16 }, 40), { tone: 'red', prefix: 'wb' })
  const xack = flow(root, arc({ x: worker.top.x, y: worker.top.y }, { x: stream.top.x + 40, y: stream.top.y }, -70), { tone: 'purple', prefix: 'wb' })

  const xaddPill = pill(root, 254, 70, 'XADD * \u2026')
  const ackPill = pill(root, 254, 254, 'OK \u00B7 ~1 ms', { tone: 'blue' })
  const readPill = pill(root, 555, 146, 'batch of 500')
  const insertPill = pill(root, 830, 70, 'BEGIN; INSERT \u2026 ON CONFLICT; COMMIT', { tone: 'red' })
  const commitPill = pill(root, 830, 254, 'committed', { tone: 'red' })
  const xackPill = pill(root, 540, 34, 'XACK ids')

  const lag = root.append('g').attr('opacity', 0).attr('transform', 'translate(300,272)')
  lag.append('rect').attr('width', 490).attr('height', 36).attr('fill', VK.redFill).attr('stroke', VK.candy)
  text(lag, 14, 23, 'stream length = staleness window  \u00B7  unflushed entries = loss window', { size: 12, color: VK.red, weight: 800, mono: true })

  scene = { root, app, stream, worker, pg, xadd, ack, read, insert, commit, xack, xaddPill, ackPill, readPill, insertPill, commitPill, xackPill, lag }
}

async function animate(step) {
  const s = scene
  if (step === 1) await particle(s.root, s.xadd.node)
  if (step === 2) await particle(s.root, s.ack.node)
  if (step === 3) await particle(s.root, s.read.node, { tone: 'purple' })
  if (step === 4) { await particle(s.root, s.insert.node, { tone: 'red', duration: 900 }); await particle(s.root, s.commit.node, { tone: 'red' }) }
  if (step === 5) await particle(s.root, s.xack.node, { tone: 'purple', duration: 900 })
}

function apply(step) {
  if (!scene) return
  const s = scene
  const st = (from) => (step >= from ? (step === from ? 'current' : 'active') : 'hidden')
  s.xadd.setState(st(1)); s.xaddPill.setState(st(1))
  s.ack.setState(st(2)); s.ackPill.setState(st(2))
  s.read.setState(st(3)); s.readPill.setState(st(3))
  s.insert.setState(st(4)); s.insertPill.setState(st(4))
  s.commit.setState(st(4)); s.commitPill.setState(st(4))
  s.xack.setState(st(5)); s.xackPill.setState(st(5))
  s.app.setState(step === 1 || step === 2 ? 'current' : 'idle')
  s.stream.setState(step === 1 ? 'current' : step === 6 ? 'warn' : step >= 1 ? 'good' : 'idle')
  s.worker.setState(step === 3 || step === 5 ? 'current' : 'idle')
  s.pg.setState(step === 4 ? 'current' : step === 2 ? 'faded' : 'idle')
  s.pg.setStatus(step === 2 ? 'not yet' : 'batched commit', step === 2 ? VK.red : VK.muted)
  tr(s.lag, 360).attr('opacity', step >= 6 ? 1 : 0)
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="write-behind">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Write-behind: the application appends to a Valkey stream and is acknowledged, a worker reads batches with a consumer group, inserts them idempotently into PostgreSQL in one transaction, then acknowledges the stream entries" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.write-behind { width: 100%; }
.write-behind .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
