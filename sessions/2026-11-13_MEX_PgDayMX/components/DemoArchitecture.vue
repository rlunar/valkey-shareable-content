<script setup>
// The live demo stack: jdbc-caching-demo (Spring Boot + React) against the
// postgrespro-demo compose stack, plus Valkey Admin to watch the keys.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, arc, line, flow, particle, pill, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 336

const steps = [
  { label: 'THE DEMO STACK', detail: 'jdbc-caching-demo (Spring Boot 3.4, React) next to the postgrespro-demo compose stack. All local.' },
  { label: '1 \u00B7 ONE UI, TWO BUTTONS', detail: 'Run Direct and Run Cached call /api/query/direct and /api/query/cached with the same SQL.' },
  { label: '2 \u00B7 DIRECT PATH', detail: 'jdbc:postgresql:// straight to PostgreSQL 18. Every click pays the full 6-way join.', tone: 'red' },
  { label: '3 \u00B7 CACHED PATH', detail: 'jdbc:aws-wrapper:postgresql:// with wrapperPlugins=remoteQueryCache. Valkey first, Postgres only on a miss.' },
  { label: '4 \u00B7 SEE THE KEYS', detail: 'Valkey Admin: hit ratio and memory on the dashboard, the jdbc-demo: keys with TTL and size via Send Command.' },
  { label: '5 \u00B7 LOOPBACK ONLY', detail: 'Every port is published on 127.0.0.1. The demo API runs any SQL and Valkey Admin web mode has no login.', tone: 'red' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'da')
  const root = svg.append('g')

  // Compose network boundary.
  const net = root.append('g')
  const netRect = net.append('rect').attr('x', 572).attr('y', 8).attr('width', 500).attr('height', 320).attr('fill', 'none')
    .attr('stroke', VK.lavender).attr('stroke-width', 1.5).attr('stroke-dasharray', '7 6')
  text(net, 586, 324, 'docker compose \u00B7 postgrespro-demo_default', { size: 10, color: VK.purple, weight: 700, mono: true })

  const browser = card(root, { x: 18, y: 126, w: 190, h: 84, eyebrow: 'BROWSER', label: 'React + Recharts', status: 'Vite dev server :5173', glyph: 'users' })
  const spring = card(root, { x: 296, y: 126, w: 200, h: 84, eyebrow: 'SPRING BOOT 3.4', label: 'QueryService', status: '127.0.0.1:8080' })
  const valkey = card(root, { x: 596, y: 30, w: 200, h: 84, eyebrow: 'VALKEY 9', label: 'allkeys-lru', status: '192 MB \u00B7 :6379', valkey: true })
  const pg = card(root, { x: 596, y: 222, w: 200, h: 84, eyebrow: 'POSTGRESQL 18.6', label: 'airtravel_2y \u00B7 11 GB', status: '512 MB container \u00B7 :5432', glyph: 'db' })
  const admin = card(root, { x: 856, y: 30, w: 200, h: 84, eyebrow: 'VALKEY ADMIN 1.3', label: 'Dashboard + commands', status: '127.0.0.1:8081', valkey: true })
  const pgadmin = card(root, { x: 856, y: 222, w: 200, h: 84, eyebrow: 'PGADMIN 4', label: 'Query tool', status: '127.0.0.1:5050' })

  const api = flow(root, line(browser.right, spring.left), { tone: 'blue', prefix: 'da' })
  const direct = flow(root, arc({ x: spring.right.x, y: spring.right.y + 18 }, pg.left, 26), { tone: 'red', prefix: 'da' })
  const cached = flow(root, arc({ x: spring.right.x, y: spring.right.y - 18 }, valkey.left, -26), { tone: 'blue', prefix: 'da' })
  const onMiss = flow(root, line({ x: valkey.bottom.x - 40, y: valkey.bottom.y }, { x: pg.top.x - 40, y: pg.top.y }), { tone: 'muted', prefix: 'da', dashed: true })
  const watchKeys = flow(root, line(admin.left, valkey.right), { tone: 'purple', prefix: 'da' })
  const watchPg = flow(root, line(pgadmin.left, pg.right), { tone: 'purple', prefix: 'da' })

  const apiPill = pill(root, 252, 110, 'GET /api/query/{direct|cached}')
  const directPill = pill(root, 520, 284, 'jdbc:postgresql://', { tone: 'red' })
  const cachedPill = pill(root, 492, 52, 'jdbc:aws-wrapper:postgresql://', { tone: 'blue' })
  const missPill = pill(root, 640, 168, 'on miss only')
  const keysPill = pill(root, 826, 136, 'SCAN jdbc-demo:*')

  scene = { root, net, netRect, browser, spring, valkey, pg, admin, pgadmin, api, direct, cached, onMiss, watchKeys, watchPg, apiPill, directPill, cachedPill, missPill, keysPill }
}

async function animate(step) {
  const s = scene
  if (step === 1) await particle(s.root, s.api.node)
  if (step === 2) await particle(s.root, s.direct.node, { tone: 'red', duration: 1000 })
  if (step === 3) await particle(s.root, s.cached.node)
  if (step === 4) await particle(s.root, s.watchKeys.node, { tone: 'purple' })
}

function apply(step) {
  if (!scene) return
  const s = scene
  const st = (from) => (step >= from ? (step === from ? 'current' : 'active') : 'hidden')
  s.api.setState(st(1))
  s.direct.setState(st(2))
  s.cached.setState(st(3))
  s.onMiss.setState(st(3))
  s.watchKeys.setState(st(4))
  s.watchPg.setState(step >= 4 ? 'active' : 'hidden')
  s.apiPill.setState(st(1))
  s.directPill.setState(st(2))
  s.cachedPill.setState(st(3))
  s.missPill.setState(st(3))
  s.keysPill.setState(st(4))
  s.browser.setState(step === 1 ? 'current' : 'idle')
  s.spring.setState(step === 1 ? 'current' : step === 5 ? 'warn' : 'idle')
  s.pg.setState(step === 2 ? 'down' : 'idle')
  s.valkey.setState(step === 3 ? 'good' : 'idle')
  s.admin.setState(step === 4 ? 'current' : step === 5 ? 'warn' : 'idle')
  s.pgadmin.setState(step === 4 ? 'current' : 'idle')
  tr(s.netRect, 300).attr('stroke', step === 5 ? VK.red : VK.lavender).attr('stroke-width', step === 5 ? 2.5 : 1.5)
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="demo-arch">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Demo architecture: browser, Spring Boot app with a direct JDBC path to PostgreSQL and a cached path through Valkey, with Valkey Admin and pgAdmin for observation, all on loopback" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.demo-arch { width: 100%; }
.demo-arch .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
