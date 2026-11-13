<script setup>
// Multi-AZ Valkey: lose a zone, promote a replica, and fail open to the origin in between.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, flow, particle, pill, gauge, tr, text, line } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 384

const steps = [
  { label: 'READY', detail: 'One primary in AZ a takes reads and writes. Replicas in AZ b and AZ c stream every change. The application wraps cache calls in a fail-open guard.' },
  { label: '1 \u00B7 STEADY STATE', detail: 'Hits are served from the primary in well under a millisecond. The origin sees only the misses.' },
  { label: '2 \u00B7 AZ a IS LOST', detail: 'Power, network, or a bad deploy: the primary stops answering. Cache calls time out after a short, deliberate deadline.', tone: 'red' },
  { label: '3 \u00B7 FAIL OPEN', detail: 'Timeouts are swallowed and the loader runs against the origin. Users see slow, not down. The origin must be shielded while this lasts: next slide.', tone: 'red' },
  { label: '4 \u00B7 REPLICA PROMOTED', detail: 'The replica in AZ b becomes the new primary within seconds and the remaining replica follows it. The data was already there.' },
  { label: '5 \u00B7 RECOVERED', detail: 'Clients reconnect to the new primary, hits resume, and the origin drops back to misses only. AZ a rejoins later as a replica.' },
]

let s = null
let lastStep = -1

function azBox(root, x, y, w, h, label) {
  const g = root.append('g')
  const rect = g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h).attr('rx', 4).attr('fill', 'none').attr('stroke', VK.mist).attr('stroke-dasharray', '6 5').attr('stroke-width', 1.5)
  const t = text(g, x + 10, y + 15, label, { size: 10, color: VK.muted, mono: true, weight: 800 })
  return {
    setState(state) {
      tr(rect, 300).attr('stroke', state === 'down' ? VK.red : state === 'good' ? VK.blue : VK.mist).attr('fill', state === 'down' ? VK.redFill : 'none')
      t.attr('fill', state === 'down' ? VK.red : state === 'good' ? VK.blue : VK.muted)
    },
  }
}

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'fo')
  const root = svg.append('g')

  const app = card(root, { x: 40, y: 146, w: 190, h: 92, eyebrow: 'APPLICATION', label: 'Cache client', status: 'fail-open wrapper', id: 'app' })
  const zoneA = azBox(root, 430, 10, 222, 106, 'AVAILABILITY ZONE a')
  const zoneB = azBox(root, 430, 136, 222, 106, 'AVAILABILITY ZONE b')
  const zoneC = azBox(root, 430, 262, 222, 106, 'AVAILABILITY ZONE c')
  const primary = card(root, { x: 446, y: 32, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 PRIMARY', label: 'Reads + writes', status: 'all keys in memory', valkey: true, id: 'a' })
  const replicaB = card(root, { x: 446, y: 158, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 REPLICA', label: 'Follows primary', status: 'promote on failover', valkey: true, id: 'b' })
  const replicaC = card(root, { x: 446, y: 284, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 REPLICA', label: 'Follows primary', status: 'read scaling', valkey: true, id: 'c' })
  const db = card(root, { x: 850, y: 146, w: 190, h: 92, eyebrow: 'DATABASE', label: 'Origin', status: 'misses only', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 850, 250, 190, 10)
  const dbReadout = text(root, 945, 278, '160 reads / s', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  const toPrimary = flow(root, line({ x: app.right.x, y: app.right.y - 24 }, { x: primary.left.x, y: primary.left.y + 10 }), { tone: 'blue', prefix: 'fo' })
  const toB = flow(root, line({ x: app.right.x, y: app.right.y }, { x: replicaB.left.x, y: replicaB.left.y }), { tone: 'blue', prefix: 'fo' })
  const replAB = flow(root, line({ x: primary.bottom.x, y: primary.bottom.y }, { x: replicaB.top.x, y: replicaB.top.y }), { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const replBC = flow(root, line({ x: replicaB.bottom.x, y: replicaB.bottom.y }, { x: replicaC.top.x, y: replicaC.top.y }), { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const replAC = flow(root, `M ${primary.right.x} ${primary.right.y + 20} C 700 120, 700 290, ${replicaC.right.x} ${replicaC.right.y}`, { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const fallback = flow(root, `M ${app.bottom.x} ${app.bottom.y} L ${app.bottom.x} 376 L ${db.bottom.x} 376 L ${db.bottom.x} ${db.bottom.y + 2}`, { tone: 'red', prefix: 'fo' })
  const misses = flow(root, line({ x: primary.right.x, y: primary.right.y - 12 }, { x: db.left.x, y: db.left.y - 30 }), { tone: 'red', prefix: 'fo', width: 2 })
  const missesB = flow(root, line({ x: replicaB.right.x, y: replicaB.right.y - 12 }, { x: db.left.x, y: db.left.y - 12 }), { tone: 'red', prefix: 'fo', width: 2 })

  const readPill = pill(root, 330, 118, 'GET / SET \u00B7 < 1 ms', { tone: 'blue' })
  const timeoutPill = pill(root, 330, 118, 'timeout after 50 ms', { tone: 'red' })
  const fallbackPill = pill(root, 540, 376, 'fail open: loader runs at the origin', { tone: 'red' })
  const promotePill = pill(root, 745, 150, 'promoted in seconds', { tone: 'blue' })
  const replPill = pill(root, 598, 252, 'replication', { tone: 'purple' })

  s = { root, app, zoneA, zoneB, zoneC, primary, replicaB, replicaC, db, dbGauge, dbReadout, toPrimary, toB, replAB, replBC, replAC, fallback, misses, missesB, readPill, timeoutPill, fallbackPill, promotePill, replPill }
}

async function animate(step) {
  if (step === 1) {
    await particle(s.root, s.toPrimary.node, { tone: 'blue' })
    particle(s.root, s.replAB.node, { tone: 'purple', r: 4 })
    await particle(s.root, s.replAC.node, { tone: 'purple', r: 4 })
  }
  if (step === 3) await particle(s.root, s.fallback.node, { tone: 'red', duration: 1100 })
  if (step === 4) await particle(s.root, s.replBC.node, { tone: 'purple', r: 4 })
  if (step === 5) await particle(s.root, s.toB.node, { tone: 'blue' })
}

function apply(step) {
  if (!s) return
  const lost = step >= 2
  const promoted = step >= 4
  const recovered = step >= 5
  s.zoneA.setState(lost ? 'down' : 'idle')
  s.zoneB.setState(promoted ? 'good' : 'idle')
  s.zoneC.setState('idle')
  s.primary.setState(lost ? 'down' : step === 1 ? 'current' : 'idle')
  s.primary.setStatus(lost ? (recovered ? 'rejoins as a replica later' : 'unreachable') : 'all keys in memory', lost && !recovered ? VK.red : VK.muted)
  s.primary.setEyebrow(lost ? 'VALKEY \u00B7 LOST' : 'VALKEY \u00B7 PRIMARY', lost ? VK.red : VK.purple)
  s.replicaB.setEyebrow(promoted ? 'VALKEY \u00B7 NEW PRIMARY' : 'VALKEY \u00B7 REPLICA', promoted ? VK.blue : VK.purple)
  s.replicaB.setLabel(promoted ? 'Reads + writes' : 'Follows primary')
  s.replicaB.setStatus(promoted ? 'same data, already in AZ b' : 'promote on failover', promoted ? VK.blue : VK.muted)
  s.replicaB.setState(promoted ? (recovered ? 'current' : 'good') : 'idle')
  s.replicaC.setStatus(promoted ? 'follows the new primary' : 'read scaling')
  s.app.setStatus(step === 3 ? 'timeouts swallowed, loader runs' : step === 2 ? 'cache calls time out' : 'fail-open wrapper', step === 2 || step === 3 ? VK.red : VK.muted)
  s.app.setState(step >= 1 ? 'current' : 'idle')

  s.toPrimary.setState(step === 1 ? 'current' : lost ? (recovered ? 'hidden' : 'broken') : step >= 1 ? 'active' : 'hidden')
  s.toB.setState(recovered ? 'current' : 'hidden')
  s.replAB.setState(step >= 1 && !lost ? 'active' : lost ? 'hidden' : 'hidden')
  s.replAC.setState(step >= 1 && !lost ? 'active' : 'hidden')
  s.replBC.setState(promoted ? (step === 4 ? 'current' : 'active') : 'hidden')
  s.fallback.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.misses.setState(step >= 1 && !lost ? 'active' : 'hidden')
  s.missesB.setState(recovered ? 'active' : 'hidden')

  s.readPill.setState(step === 1 ? 'current' : step >= 1 && !lost ? 'active' : 'hidden')
  s.timeoutPill.setState(step === 2 ? 'current' : step === 3 ? 'active' : 'hidden')
  s.fallbackPill.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.promotePill.setState(step === 4 ? 'current' : step > 4 ? 'active' : 'hidden')
  s.replPill.setState(step === 1 ? 'current' : step >= 1 && (!lost || promoted) ? 'active' : 'hidden')

  if (step === 3 || step === 4) {
    s.dbGauge.set(0.72, { tone: 'red' })
    s.dbReadout.text('all reads land here \u00B7 rate limit it').attr('fill', VK.red)
    s.db.setState('warn')
    s.db.setStatus('slow, not down', VK.red)
  } else if (step >= 1) {
    s.dbGauge.set(0.04, { tone: 'blue' })
    s.dbReadout.text('160 reads / s \u00B7 misses only').attr('fill', VK.blue)
    s.db.setState('idle')
    s.db.setStatus('misses only')
  } else {
    s.dbGauge.set(0)
    s.dbReadout.text('160 reads / s').attr('fill', VK.muted)
    s.db.setState('idle')
  }
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="failover">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Multi-AZ Valkey failover: the primary in zone a is lost, the application fails open to the database, the replica in zone b is promoted, and traffic recovers" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.failover { width: 100%; }
.failover .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
