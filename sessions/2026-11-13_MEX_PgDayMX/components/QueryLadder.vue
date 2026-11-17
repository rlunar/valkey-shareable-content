<script setup>
// Three queries against airtravel_2y (11 GB) in a PostgreSQL 18 container
// capped at 512 MB, measured with EXPLAIN (ANALYZE, BUFFERS). Left: execution
// time. Right: 8 KB buffers touched per row returned (the work-to-result ratio).
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 330

const queries = [
  { key: 'q1', name: 'Q1 \u00B7 point lookup', sub: 'flight manifest by flight_id', ms: 1.4, msLabel: '1.4 ms', perRow: 235, perRowLabel: '235', verdict: 'index wins: skip', tone: VK.blue },
  { key: 'q2', name: 'Q2 \u00B7 range scan', sub: '30-day revenue, no index on book_date', ms: 1815, msLabel: '1.8 s', perRow: 2061, perRowLabel: '2,061', verdict: 'index it, or cache', tone: VK.purple },
  { key: 'q3', name: 'Q3 \u00B7 6-way join', sub: 'quarter revenue by route and aircraft', ms: 8105, msLabel: '8.1 s', perRow: 103_976, perRowLabel: '103,976', verdict: 'cache it', tone: VK.red },
]

const steps = [
  { label: 'THREE QUERIES', detail: 'Same database, same 512 MB budget. Each query asks a little more of the engine than the last.' },
  { label: 'Q1 \u00B7 POINT LOOKUP', detail: 'Two index scans, 235 buffers. Postgres behaves like a key/value store here: 1.4 ms.' },
  { label: 'Q2 \u00B7 RANGE SCAN', detail: 'No index on book_date: a 9.7M-row seq scan and a sort that spills to disk, for 30 rows. 1.8 s.' },
  { label: 'Q3 \u00B7 MULTI-JOIN', detail: '16,207 flights x ~200 segments each = 3.28M joined rows, a 160 MB sort spill, 20 rows out. 8 to 10 s.', tone: 'red' },
  { label: '4 \u00B7 WORK PER ANSWER', detail: 'Buffers touched per row returned: 235 \u2192 2,061 \u2192 103,976. High work, small result: the textbook cache candidate.', tone: 'red' },
]

let scene = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const top = 46
  const labelW = 250
  const chartW = 300
  const gap = 40
  const innerH = H - top - 48
  const y = d3.scaleBand().domain(queries.map((q) => q.key)).range([0, innerH]).padding(0.32)
  const xMs = d3.scaleLog().domain([1, 100_000]).range([0, chartW])
  const xWork = d3.scaleLog().domain([100, 1_000_000]).range([0, chartW])
  const left = labelW
  const right = labelW + chartW + gap

  const header = (x, title) => svg.append('text').attr('x', x).attr('y', 24).attr('fill', VK.purple)
    .attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('letter-spacing', 1.2).text(title)
  header(left, 'EXECUTION TIME (LOG)')
  const workHeader = header(right, 'BUFFERS PER ROW RETURNED (LOG)').attr('opacity', 0)

  const axis = (x0, scale, ticks, fmt) => {
    const g = svg.append('g').attr('transform', `translate(${x0},${top})`)
    g.selectAll('line').data(ticks).join('line').attr('x1', (d) => scale(d)).attr('x2', (d) => scale(d)).attr('y1', 0).attr('y2', innerH).attr('stroke', VK.mist)
    const a = g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(scale).tickValues(ticks).tickFormat(fmt))
    a.selectAll('.domain, .tick line').attr('stroke', VK.muted)
    a.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 10)
    return g
  }
  axis(left, xMs, [1, 10, 100, 1000, 10000, 100000], (d) => (d >= 1000 ? `${d / 1000} s` : `${d} ms`))
  const workAxis = axis(right, xWork, [100, 1000, 10000, 100000, 1000000], d3.format('~s')).attr('opacity', 0)

  const rows = queries.map((q) => {
    const yy = top + y(q.key)
    const g = svg.append('g').attr('opacity', 0.2)
    g.append('text').attr('x', labelW - 16).attr('y', yy + y.bandwidth() / 2 - 3).attr('text-anchor', 'end')
      .attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 16).attr('font-weight', 800).text(q.name)
    g.append('text').attr('x', labelW - 16).attr('y', yy + y.bandwidth() / 2 + 14).attr('text-anchor', 'end')
      .attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).text(q.sub)
    const msBar = g.append('rect').attr('x', left).attr('y', yy).attr('height', y.bandwidth()).attr('width', 0).attr('fill', q.tone)
    const msText = g.append('text').attr('x', left + xMs(q.ms) + 8).attr('y', yy + y.bandwidth() / 2 + 5)
      .attr('fill', q.tone).attr('font-family', FONT_CODE).attr('font-size', 14).attr('font-weight', 800).attr('opacity', 0).text(q.msLabel)
    const workBar = g.append('rect').attr('x', right).attr('y', yy).attr('height', y.bandwidth()).attr('width', 0).attr('fill', q.tone).attr('opacity', 0.85)
    const workText = g.append('text').attr('x', right + xWork(q.perRow) + 8).attr('y', yy + y.bandwidth() / 2 + 5)
      .attr('fill', q.tone).attr('font-family', FONT_CODE).attr('font-size', 13).attr('font-weight', 800).attr('opacity', 0).text(q.perRowLabel)
    const verdict = g.append('g').attr('opacity', 0).attr('transform', `translate(${W - 8},${yy + y.bandwidth() / 2})`)
    const vText = verdict.append('text').attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).text(q.verdict.toUpperCase())
    const vb = vText.node().getBBox()
    verdict.insert('rect', 'text').attr('x', vb.x - 8).attr('y', vb.y - 4).attr('width', vb.width + 16).attr('height', vb.height + 8).attr('rx', 999).attr('fill', q.tone)
    return { ...q, g, msBar, msText, workBar, workText, verdict, msW: xMs(q.ms), workW: xWork(q.perRow) }
  })

  scene = { rows, workHeader, workAxis }
}

function apply(step) {
  if (!scene) return
  scene.rows.forEach((r, i) => {
    const on = step >= i + 1
    tr(r.g, 300).attr('opacity', on ? 1 : 0.2)
    tr(r.msBar, 700).attr('width', on ? r.msW : 0)
    tr(r.msText, 400).attr('opacity', on ? 1 : 0)
    tr(r.workBar, 700).attr('width', step >= 4 ? r.workW : 0)
    tr(r.workText, 400).attr('opacity', step >= 4 ? 1 : 0)
    tr(r.verdict, 400).attr('opacity', step >= 4 ? 1 : 0)
  })
  tr(scene.workHeader, 300).attr('opacity', step >= 4 ? 1 : 0)
  tr(scene.workAxis, 300).attr('opacity', step >= 4 ? 1 : 0)
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="query-ladder">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Three queries: a 1.4 ms point lookup, a 1.8 second range scan, and an 8 second six-way join, with buffers touched per row returned" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.query-ladder { width: 100%; }
.query-ladder .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
