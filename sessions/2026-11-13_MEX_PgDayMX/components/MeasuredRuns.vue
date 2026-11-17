<script setup>
// Seven consecutive runs of the demo's built-in airtravel query (30-day top routes)
// through jdbc-caching-demo: two direct, then five through the Remote Query Cache Plugin.
// End-to-end latency as reported by the app (query + fetch), local Docker stack.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr, countUp } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 340
const margin = { top: 24, right: 290, bottom: 54, left: 70 }

const runs = [
  { id: 'd1', label: 'direct 1', ms: 1267, kind: 'direct', step: 1 },
  { id: 'd2', label: 'direct 2', ms: 1250, kind: 'direct', step: 1 },
  { id: 'c1', label: 'cached 1', ms: 1443, kind: 'miss', step: 2 },
  { id: 'c2', label: 'cached 2', ms: 9, kind: 'hit', step: 3 },
  { id: 'c3', label: 'cached 3', ms: 4, kind: 'hit', step: 3 },
  { id: 'c4', label: 'cached 4', ms: 3, kind: 'hit', step: 3 },
  { id: 'c5', label: 'cached 5', ms: 2, kind: 'hit', step: 3 },
]
const color = { direct: VK.red, miss: VK.candy, hit: VK.blue }

const steps = [
  { label: 'MEASURED, NOT MODELED', detail: 'The built-in airtravel query from the demo app, run seven times in a row. Log scale.' },
  { label: '1 \u00B7 DIRECT', detail: 'Plain JDBC to PostgreSQL: ~1.25 s, every time. A warm buffer cache does not make the join free.', tone: 'red' },
  { label: '2 \u00B7 FIRST CACHED RUN', detail: 'A miss: the plugin looks up Valkey, runs the query on Postgres, returns, then fills the key. Slightly slower.', tone: 'red' },
  { label: '3 \u00B7 HITS', detail: '9, 4, 3, 2 ms. The connection pool to Valkey warms up and the answer comes straight from memory.' },
  { label: '4 \u00B7 THE RATIO', detail: '1,250 ms / 3 ms \u2248 400x for this query. Memory beats disk by far more than 100x once the work is skipped.' },
]

let scene = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const innerW = W - margin.left - margin.right
  const innerH = H - margin.top - margin.bottom
  const x = d3.scaleBand().domain(runs.map((r) => r.id)).range([0, innerW]).padding(0.28)
  const y = d3.scaleLog().domain([1, 3000]).range([innerH, 0])
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const ticks = [1, 10, 100, 1000]
  g.append('g').selectAll('line').data(ticks).join('line').attr('x1', 0).attr('x2', innerW).attr('y1', (d) => y(d)).attr('y2', (d) => y(d)).attr('stroke', VK.mist)
  const ay = g.append('g').call(d3.axisLeft(y).tickValues(ticks).tickFormat((d) => (d >= 1000 ? `${d / 1000} s` : `${d} ms`)))
  ay.selectAll('.domain, .tick line').attr('stroke', VK.muted)
  ay.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 11)
  const ax = g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).tickFormat((id) => runs.find((r) => r.id === id).label))
  ax.selectAll('.domain, .tick line').attr('stroke', VK.muted)
  ax.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 11)

  const bars = runs.map((r) => {
    const bar = g.append('rect').attr('x', x(r.id)).attr('width', x.bandwidth()).attr('y', innerH).attr('height', 0).attr('fill', color[r.kind])
    const label = g.append('text').attr('x', x(r.id) + x.bandwidth() / 2).attr('y', y(r.ms) - 8).attr('text-anchor', 'middle')
      .attr('fill', color[r.kind] === VK.candy ? VK.red : color[r.kind]).attr('font-family', FONT_CODE).attr('font-size', 13).attr('font-weight', 800).attr('opacity', 0)
      .text(r.ms >= 1000 ? `${d3.format(',')(r.ms)} ms` : `${r.ms} ms`)
    return { ...r, bar, label, top: y(r.ms), h: innerH - y(r.ms) }
  })

  const missTag = g.append('text').attr('x', x('c1') + x.bandwidth() / 2).attr('y', y(1443) - 26).attr('text-anchor', 'middle')
    .attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).attr('opacity', 0).text('MISS')

  const panel = svg.append('g').attr('transform', `translate(${W - margin.right + 30},${margin.top})`).attr('opacity', 0)
  panel.append('rect').attr('width', 250).attr('height', innerH).attr('fill', VK.purple)
  panel.append('text').attr('x', 22).attr('y', 34).attr('fill', VK.candy).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).attr('letter-spacing', 1).text('DIRECT \u00F7 CACHED HIT')
  const big = panel.append('text').attr('x', 22).attr('y', 118).attr('fill', VK.white).attr('font-family', FONT_BODY).attr('font-size', 76).attr('font-weight', 800).text('0x')
  panel.append('text').attr('x', 22).attr('y', 156).attr('fill', VK.lavender).attr('font-family', FONT_BODY).attr('font-size', 14).text('1,250 ms on PostgreSQL')
  panel.append('text').attr('x', 22).attr('y', 178).attr('fill', VK.lavender).attr('font-family', FONT_BODY).attr('font-size', 14).text('~3 ms from Valkey')
  panel.append('text').attr('x', 22).attr('y', 222).attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 11).text('one key \u00B7 ~15 KB \u00B7 TTL 300 s')

  scene = { bars, missTag, panel, big }
}

function apply(step) {
  if (!scene) return
  for (const b of scene.bars) {
    const on = step >= b.step
    tr(b.bar, 650).attr('y', on ? b.top : b.top + b.h).attr('height', on ? b.h : 0)
    tr(b.label, 400).attr('opacity', on ? 1 : 0)
  }
  tr(scene.missTag, 300).attr('opacity', step >= 2 ? 1 : 0)
  tr(scene.panel, 360).attr('opacity', step >= 4 ? 1 : 0)
  if (step >= 4) countUp(scene.big, 400, { from: 0, suffix: 'x' })
  else scene.big.text('0x')
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="measured-runs">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Measured runs: two direct runs at about 1.25 seconds, a first cached run at 1.44 seconds (miss), then cached hits at 9, 4, 3 and 2 milliseconds" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.measured-runs { width: 100%; }
.measured-runs .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
