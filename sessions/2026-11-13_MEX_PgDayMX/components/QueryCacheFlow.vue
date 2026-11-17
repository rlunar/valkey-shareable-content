<script setup>
// The AWS Advanced JDBC Wrapper Remote Query Cache Plugin, one request at a time.
// Behavior follows docs/using-the-jdbc-driver/using-plugins/UsingTheRemoteQueryCachePlugin.md:
// hint prefix -> hashed key (user, schema, SQL) -> GET; on a miss, run on the database,
// return to the caller first, then write to Valkey asynchronously with the TTL.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, arc, line, flow, particle, pill, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 336

const steps = [
  { label: 'THE PLUGIN', detail: 'A JDBC driver wrapper with a plugin chain. Your code keeps using java.sql.Connection and ResultSet.' },
  { label: '1 \u00B7 OPT IN WITH A HINT', detail: 'Only a statement that starts with /* CACHE_PARAM(ttl=300s) */ is cacheable. No hint, no caching.' },
  { label: '2 \u00B7 BUILD THE KEY, LOOK UP', detail: 'Key = prefix + hash(db user, schema, SQL text). One GET to Valkey. First time: miss.' },
  { label: '3 \u00B7 MISS: ASK POSTGRES', detail: 'The query runs on PostgreSQL exactly as before. Q3 costs its full 1.25 s here.', tone: 'red' },
  { label: '4 \u00B7 ANSWER FIRST, FILL LATER', detail: 'The ResultSet goes back to the caller, then an async SET with the TTL. One string key, ~15 KB.' },
  { label: '5 \u00B7 HIT', detail: 'The next identical statement is served from Valkey in 2 to 4 ms. PostgreSQL never sees it.' },
  { label: '6 \u00B7 FAIL OPEN', detail: 'Cache down or unhealthy? failWhenCacheDown=false treats it as a miss and the database path keeps working.', tone: 'red' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'qc')
  const root = svg.append('g')

  const app = card(root, { x: 18, y: 126, w: 196, h: 84, eyebrow: 'APPLICATION', label: 'Plain JDBC \u00B7 Hibernate', status: 'executeQuery(sql)' })
  const wrapper = card(root, { x: 300, y: 126, w: 214, h: 84, eyebrow: 'AWS JDBC WRAPPER', label: 'remoteQueryCache', status: 'parse hint \u00B7 hash key' })
  const valkey = card(root, { x: 640, y: 18, w: 196, h: 84, eyebrow: 'VALKEY', label: 'key \u2192 ResultSet', status: 'string, TTL 300 s', valkey: true })
  const pg = card(root, { x: 640, y: 234, w: 196, h: 84, eyebrow: 'POSTGRESQL', label: 'airtravel_2y', status: '6-way join', glyph: 'db' })

  const ask = flow(root, line(app.right, wrapper.left), { tone: 'blue', prefix: 'qc' })
  const get = flow(root, arc({ x: wrapper.right.x, y: wrapper.right.y - 22 }, valkey.left, -26), { tone: 'blue', prefix: 'qc' })
  const reply = flow(root, arc({ x: valkey.left.x, y: valkey.left.y + 24 }, { x: wrapper.right.x, y: wrapper.right.y - 6 }, 18), { tone: 'blue', prefix: 'qc' })
  const exec = flow(root, arc({ x: wrapper.right.x, y: wrapper.right.y + 8 }, { x: pg.left.x, y: pg.left.y - 12 }, 18), { tone: 'red', prefix: 'qc' })
  const rows = flow(root, arc({ x: pg.left.x, y: pg.left.y + 14 }, { x: wrapper.right.x, y: wrapper.right.y + 26 }, 30), { tone: 'red', prefix: 'qc' })
  const back = flow(root, line({ x: wrapper.left.x, y: wrapper.left.y + 22 }, { x: app.right.x, y: app.right.y + 22 }), { tone: 'blue', prefix: 'qc' })
  const fill = flow(root, line({ x: wrapper.right.x - 40, y: wrapper.top.y }, { x: valkey.left.x, y: valkey.bottom.y - 10 }), { tone: 'purple', prefix: 'qc', dashed: true })
  const bypass = flow(root, arc({ x: wrapper.bottom.x, y: wrapper.bottom.y }, { x: pg.left.x, y: pg.left.y + 30 }, 46), { tone: 'muted', prefix: 'qc' })

  const hintPill = pill(root, 257, 112, '/* CACHE_PARAM(ttl=300s) */ SELECT \u2026')
  const getPill = pill(root, 572, 40, 'GET key')
  const missPill = pill(root, 588, 120, 'MISS', { tone: 'red' })
  const execPill = pill(root, 588, 206, 'execute \u00B7 1.25 s', { tone: 'red' })
  const backPill = pill(root, 257, 236, 'ResultSet')
  const fillPill = pill(root, 520, 82, 'async SET EX 300')
  const hitPill = pill(root, 588, 120, 'HIT \u00B7 2-4 ms', { tone: 'blue' })
  const bypassPill = pill(root, 470, 300, 'cache down \u2192 database')

  // Key anatomy panel.
  const panel = root.append('g').attr('transform', 'translate(866,18)').attr('opacity', 0)
  panel.append('rect').attr('width', 196).attr('height', 300).attr('fill', VK.purple)
  text(panel, 14, 24, 'THE CACHE KEY', { size: 10, color: VK.candy, weight: 800, mono: true })
  const keyLines = [
    ['cacheKeyPrefix', 'jdbc-demo:'],
    ['+ hash of', 'db user'],
    ['', 'schema / catalog'],
    ['', 'full SQL text'],
    ['observed', '58-byte key'],
    ['value', 'serialized ResultSet'],
    ['size', '~15 KB for 20 rows'],
  ]
  keyLines.forEach(([k, v], i) => {
    text(panel, 14, 54 + i * 34, k, { size: 9.5, color: VK.lavender, weight: 700, mono: true })
    text(panel, 14, 70 + i * 34, v, { size: 13, color: VK.white, weight: 700 })
  })

  scene = { root, app, wrapper, valkey, pg, ask, get, reply, exec, rows, back, fill, bypass, hintPill, getPill, missPill, execPill, backPill, fillPill, hitPill, bypassPill, panel }
}

async function animate(step) {
  const s = scene
  if (step === 1) await particle(s.root, s.ask.node)
  if (step === 2) { await particle(s.root, s.get.node); await particle(s.root, s.reply.node, { tone: 'red' }) }
  if (step === 3) { await particle(s.root, s.exec.node, { tone: 'red', duration: 1100 }); await particle(s.root, s.rows.node, { tone: 'red', duration: 900 }) }
  if (step === 4) { await particle(s.root, s.back.node); await particle(s.root, s.fill.node, { tone: 'purple' }) }
  if (step === 5) { await particle(s.root, s.ask.node); await particle(s.root, s.get.node); await particle(s.root, s.reply.node); await particle(s.root, s.back.node) }
  if (step === 6) await particle(s.root, s.bypass.node, { tone: 'muted', duration: 900 })
}

function apply(step) {
  if (!scene) return
  const s = scene
  const is = (...xs) => xs.includes(step)
  s.ask.setState(step >= 1 ? (is(1, 5) ? 'current' : 'active') : 'hidden')
  s.get.setState(is(2, 5) ? 'current' : step > 2 && step < 6 ? 'active' : 'hidden')
  s.reply.setState(is(2, 5) ? 'current' : step > 2 && step < 6 ? 'active' : 'hidden')
  s.exec.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.rows.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.back.setState(is(4, 5) ? 'current' : step === 6 ? 'active' : 'hidden')
  s.fill.setState(step === 4 ? 'current' : 'hidden')
  s.bypass.setState(step === 6 ? 'current' : 'hidden')

  s.hintPill.setState(step === 1 ? 'current' : step >= 1 && step < 6 ? 'active' : 'hidden')
  s.getPill.setState(is(2, 5) ? 'current' : 'hidden')
  s.missPill.setState(step === 2 ? 'current' : step === 3 || step === 4 ? 'active' : 'hidden')
  s.execPill.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.backPill.setState(is(4, 5, 6) ? 'current' : 'hidden')
  s.fillPill.setState(step === 4 ? 'current' : 'hidden')
  s.hitPill.setState(step === 5 ? 'current' : 'hidden')
  s.bypassPill.setState(step === 6 ? 'current' : 'hidden')

  s.app.setState(is(1, 4, 5) ? 'current' : 'idle')
  s.wrapper.setState(step >= 1 && step <= 2 ? 'current' : 'idle')
  s.valkey.setState(step === 6 ? 'down' : is(2, 4) ? 'current' : step === 5 ? 'good' : 'idle')
  s.valkey.setStatus(step === 6 ? 'unreachable' : 'string, TTL 300 s', step === 6 ? VK.red : VK.muted)
  s.pg.setState(step === 3 ? 'down' : step === 5 ? 'faded' : step === 6 ? 'current' : 'idle')
  s.pg.setStatus(step === 5 ? 'not touched' : '6-way join', step === 3 ? VK.red : VK.muted)
  tr(s.panel, 360).attr('opacity', step >= 2 ? 1 : 0)
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="query-cache-flow">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Remote Query Cache Plugin flow: a hinted query is hashed into a key, looked up in Valkey, executed on PostgreSQL on a miss, returned to the caller, then written to Valkey asynchronously with a TTL" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.query-cache-flow { width: 100%; }
.query-cache-flow .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
