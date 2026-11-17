<script setup>
// PostgreSQL's read and write path, then what it needs to scale out (a proxy)
// and what it does not have (a place to keep finished answers).
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, line, elbow, flow, particle, pill, tr } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 340

const steps = [
  { label: 'THE ENGINE', detail: 'A superb relational engine: MVCC, a cost-based planner, WAL durability. Built for correctness first.' },
  { label: '1 \u00B7 A PROCESS PER CONNECTION', detail: 'Every connection forks its own backend process. Hundreds are fine; tens of thousands are not.' },
  { label: '2 \u00B7 PAGES, NOT ANSWERS', detail: 'shared_buffers caches 8 KB pages. A miss falls to the OS cache, then storage. The work is redone every time.' },
  { label: '3 \u00B7 ONE WRITER', detail: 'Every commit is fsynced to the WAL on a single primary. Durable, and a hard ceiling for write scale-out.' },
  { label: '4 \u00B7 SCALE OUT NEEDS A PROXY', detail: 'PgBouncer or RDS Proxy multiplexes clients onto a few backends and routes reads to replicas.' },
  { label: '5 \u00B7 THE MISSING TIER', detail: 'Nothing in this path remembers a finished result. Valkey keeps the answer itself, in memory.', tone: 'red' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'pa')
  const root = svg.append('g')

  const ys = [24, 134, 244]
  const clients = ys.map((y, i) => card(root, { x: 18, y, w: 150, h: 72, eyebrow: 'CLIENT', label: `app ${i + 1}`, status: i === 2 ? '\u2026 x 10,000' : '', glyph: 'users' }))
  // Wrapper groups own the fade, so card.setState() transitions on the inner group do not cancel it.
  const proxyWrap = root.append('g').attr('opacity', 0)
  const valkeyWrap = root.append('g').attr('opacity', 0)
  const proxy = card(proxyWrap, { x: 208, y: 134, w: 160, h: 72, eyebrow: 'PROXY', label: 'PgBouncer', status: 'pool + route reads' })
  const valkey = card(valkeyWrap, { x: 208, y: 244, w: 160, h: 72, eyebrow: 'VALKEY', label: 'Answers', status: 'in memory, < 1 ms', valkey: true })
  const backends = ys.map((y, i) => card(root, { x: 410, y, w: 160, h: 72, eyebrow: 'BACKEND', label: `postgres pid ${4100 + i}`, status: 'one per connection' }))
  const shared = card(root, { x: 612, y: 24, w: 200, h: 84, eyebrow: 'SHARED_BUFFERS', label: '8 KB pages', status: '128 MB of an 11 GB db' })
  const os = card(root, { x: 612, y: 150, w: 200, h: 84, eyebrow: 'OS PAGE CACHE', label: 'Kernel pages', status: 'whatever fits in 512 MB' })
  const disk = card(root, { x: 870, y: 120, w: 190, h: 84, eyebrow: 'STORAGE', label: 'Data files', status: 'airtravel_2y \u00B7 11 GB', glyph: 'db' })
  const wal = card(root, { x: 870, y: 244, w: 190, h: 84, eyebrow: 'WAL', label: 'fsync on commit', status: 'single primary' })

  const direct = clients.map((c, i) => flow(root, line(c.right, backends[i].left), { tone: 'blue', prefix: 'pa' }))
  const toProxy = clients.map((c) => flow(root, line(c.right, proxy.left), { tone: 'blue', prefix: 'pa' }))
  const fromProxy = backends.map((b) => flow(root, line(proxy.right, b.left), { tone: 'blue', prefix: 'pa' }))
  const toValkey = flow(root, line(clients[2].right, valkey.left), { tone: 'blue', prefix: 'pa' })
  const read = flow(root, elbow(backends[0].right, shared.left), { tone: 'purple', prefix: 'pa' })
  const pageMiss = flow(root, line(shared.bottom, os.top), { tone: 'red', prefix: 'pa' })
  const ioRead = flow(root, line(os.right, disk.left), { tone: 'red', prefix: 'pa' })
  const write = flow(root, elbow(backends[2].right, wal.left, 840), { tone: 'red', prefix: 'pa' })

  const forkPill = pill(root, 390, 116, 'fork() per connection')
  const pagePill = pill(root, 712, 128, 'miss \u2192 read()', { tone: 'red' })
  const ioPill = pill(root, 842, 108, 'Q3: 610K page reads', { tone: 'red' })
  const walPill = pill(root, 712, 316, 'COMMIT waits for fsync', { tone: 'red' })
  const proxyPill = pill(root, 288, 116, '10,000 clients \u2192 100 backends')
  const valkeyPill = pill(root, 288, 226, 'GET answer \u00B7 skip the engine', { tone: 'blue' })

  scene = { root, proxyWrap, valkeyWrap, clients, proxy, valkey, backends, shared, os, disk, wal, direct, toProxy, fromProxy, toValkey, read, pageMiss, ioRead, write, forkPill, pagePill, ioPill, walPill, proxyPill, valkeyPill }
}

async function animate(step) {
  const s = scene
  if (step === 1) await Promise.all(s.direct.map((f) => particle(s.root, f.node)))
  if (step === 2) {
    await particle(s.root, s.read.node, { tone: 'purple' })
    await particle(s.root, s.pageMiss.node, { tone: 'red' })
    await particle(s.root, s.ioRead.node, { tone: 'red', duration: 900 })
  }
  if (step === 3) await particle(s.root, s.write.node, { tone: 'red', duration: 900 })
  if (step === 4) {
    await Promise.all(s.toProxy.map((f) => particle(s.root, f.node)))
    await Promise.all(s.fromProxy.map((f) => particle(s.root, f.node)))
  }
  if (step === 5) await particle(s.root, s.toValkey.node)
}

function apply(step) {
  if (!scene) return
  const s = scene
  const proxied = step >= 4
  s.direct.forEach((f) => f.setState(step >= 1 && !proxied ? (step === 1 ? 'current' : 'active') : 'hidden'))
  s.toProxy.forEach((f) => f.setState(proxied ? (step === 4 ? 'current' : 'active') : 'hidden'))
  s.fromProxy.forEach((f) => f.setState(proxied ? (step === 4 ? 'current' : 'active') : 'hidden'))
  s.read.setState(step >= 2 ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.pageMiss.setState(step >= 2 ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.ioRead.setState(step >= 2 ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.write.setState(step >= 3 ? (step === 3 ? 'current' : 'active') : 'hidden')
  s.toValkey.setState(step >= 5 ? 'current' : 'hidden')

  s.forkPill.setState(step === 1 ? 'current' : 'hidden')
  s.pagePill.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden')
  s.ioPill.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden')
  s.walPill.setState(step === 3 ? 'current' : step > 3 ? 'active' : 'hidden')
  s.proxyPill.setState(step === 4 ? 'current' : step > 4 ? 'active' : 'hidden')
  s.valkeyPill.setState(step >= 5 ? 'current' : 'hidden')

  tr(s.proxyWrap, 300).attr('opacity', proxied ? 1 : 0)
  tr(s.valkeyWrap, 300).attr('opacity', step >= 5 ? 1 : 0)
  s.clients.forEach((c) => c.setState(step === 1 || step === 4 ? 'current' : 'idle'))
  s.backends.forEach((b) => b.setState(step === 1 ? 'warn' : step === 4 ? 'good' : 'idle'))
  s.backends.forEach((b) => b.setStatus(step === 1 ? 'fork, MBs of RAM each' : step >= 4 ? 'pooled' : 'one per connection', step === 1 ? VK.red : VK.muted))
  s.shared.setState(step === 2 ? 'current' : 'idle')
  s.os.setState(step === 2 ? 'warn' : 'idle')
  s.disk.setState(step === 2 ? 'down' : 'idle')
  s.wal.setState(step === 3 ? 'down' : 'idle')
  s.proxy.setState(step === 4 ? 'current' : 'idle')
  s.valkey.setState(step === 5 ? 'good' : 'idle')
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => {
  build()
  lastStep = props.step - 1
  apply(props.step)
})
watch(() => props.step, apply)
</script>

<template>
  <div class="pg-arch">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="PostgreSQL architecture: a backend process per connection, shared buffers and OS page cache in front of storage, WAL on a single primary, a proxy to scale connections, and Valkey to keep finished answers" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.pg-arch { width: 100%; }
.pg-arch .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
