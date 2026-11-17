<script setup>
// Memory versus disk on a log scale, then the same ratios in human time.
// Figures are the classic "latency numbers every programmer should know"
// (Jeff Dean, Peter Norvig): main memory 100 ns, 4 KB random SSD read 150 us,
// disk seek 10 ms. Order of magnitude is the point, not the exact device.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 360
const margin = { top: 30, right: 300, bottom: 50, left: 190 }

const tiers = [
  { key: 'ram', label: 'RAM read', sub: 'where Valkey keeps every key', ns: 100, tone: VK.blue, human: '1 second', ratio: '1x' },
  { key: 'ssd', label: 'SSD random 4 KB', sub: 'an 8 KB page miss in Postgres', ns: 150_000, tone: VK.purple, human: '25 minutes', ratio: '1,500x' },
  { key: 'hdd', label: 'Disk seek', sub: 'spinning media, cold storage', ns: 10_000_000, tone: VK.red, human: '1.2 days', ratio: '100,000x' },
]

const steps = [
  { label: 'THE LADDER', detail: 'Same question, three places the answer can live. Log scale: each grid line is 10x.' },
  { label: '1 \u00B7 RAM', detail: '~100 ns. A pointer chase in memory. This is where an in-memory store answers from.' },
  { label: '2 \u00B7 SSD', detail: '~150 \u00B5s for a random 4 KB read: ~1,500x slower than RAM. Index nested loops do exactly this.' },
  { label: '3 \u00B7 DISK', detail: '~10 ms per seek: 100,000x slower than RAM. Even "100x" is a conservative claim.' },
  { label: '4 \u00B7 HUMAN TIME', detail: 'Scale RAM to one second: the SSD read takes 25 minutes, the disk seek more than a day.', tone: 'red' },
]

let scene = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const innerW = W - margin.left - margin.right
  const innerH = H - margin.top - margin.bottom
  const x = d3.scaleLog().domain([10, 100_000_000]).range([0, innerW])
  const y = d3.scaleBand().domain(tiers.map((t) => t.key)).range([0, innerH]).padding(0.34)
  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const ticks = [10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000]
  const tickLabel = (ns) => (ns >= 1e6 ? `${ns / 1e6} ms` : ns >= 1e3 ? `${ns / 1e3} \u00B5s` : `${ns} ns`)
  chart.append('g').selectAll('line').data(ticks).join('line')
    .attr('x1', (d) => x(d)).attr('x2', (d) => x(d)).attr('y1', 0).attr('y2', innerH).attr('stroke', VK.mist)
  const axis = chart.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).tickValues(ticks).tickFormat(tickLabel))
  axis.selectAll('.domain, .tick line').attr('stroke', VK.muted)
  axis.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 11)
  chart.append('text').attr('x', innerW / 2).attr('y', innerH + 42).attr('text-anchor', 'middle')
    .attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 12).attr('font-weight', 600)
    .text('time to fetch one small piece of data (log scale)')

  const rows = tiers.map((t) => {
    const g = chart.append('g').attr('opacity', 0.18)
    const yy = y(t.key)
    g.append('text').attr('x', -14).attr('y', yy + y.bandwidth() / 2 - 4).attr('text-anchor', 'end')
      .attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 16).attr('font-weight', 700).text(t.label)
    g.append('text').attr('x', -14).attr('y', yy + y.bandwidth() / 2 + 14).attr('text-anchor', 'end')
      .attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).text(t.sub)
    const bar = g.append('rect').attr('x', 0).attr('y', yy).attr('height', y.bandwidth()).attr('width', 0).attr('fill', t.tone)
    const value = g.append('text').attr('x', 8).attr('y', yy + y.bandwidth() / 2 + 5)
      .attr('fill', t.tone).attr('font-family', FONT_CODE).attr('font-size', 14).attr('font-weight', 800).text('')
    return { ...t, g, bar, value, width: x(t.ns) }
  })

  // Right-hand human-time panel.
  const panel = svg.append('g').attr('transform', `translate(${W - margin.right + 30},${margin.top})`)
  const humans = rows.map((r) => {
    const yy = y(r.key)
    const g = panel.append('g').attr('opacity', 0).attr('transform', `translate(0,${yy})`)
    g.append('rect').attr('width', 250).attr('height', y.bandwidth()).attr('fill', VK.cream).attr('stroke', VK.mist)
    g.append('rect').attr('width', 5).attr('height', y.bandwidth()).attr('fill', r.tone)
    g.append('text').attr('x', 18).attr('y', y.bandwidth() / 2 - 4).attr('fill', r.tone)
      .attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).attr('letter-spacing', 1).text(`IF RAM = 1 s \u00B7 ${r.ratio}`)
    g.append('text').attr('x', 18).attr('y', y.bandwidth() / 2 + 18).attr('fill', VK.purple)
      .attr('font-family', FONT_BODY).attr('font-size', 20).attr('font-weight', 800).text(r.human)
    return g
  })

  scene = { rows, humans }
}

function apply(step) {
  if (!scene) return
  scene.rows.forEach((r, i) => {
    const visible = step >= i + 1
    tr(r.g, 300).attr('opacity', visible ? 1 : 0.18)
    tr(r.bar, 700).attr('width', visible ? r.width : 0)
    r.value.attr('x', visible ? r.width + 10 : 8)
    if (visible) {
      const label = r.ns >= 1e6 ? `${r.ns / 1e6} ms` : r.ns >= 1e3 ? `${r.ns / 1e3} \u00B5s` : `${r.ns} ns`
      r.value.text(`${label}  \u00B7  ${r.ratio}`)
    } else {
      r.value.text('')
    }
  })
  scene.humans.forEach((g) => tr(g, 360).attr('opacity', step >= 4 ? 1 : 0))
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="latency-ladder">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Latency of RAM, SSD and disk on a log scale: RAM about 100 nanoseconds, SSD about 150 microseconds, disk seek about 10 milliseconds" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.latency-ladder { width: 100%; }
.latency-ladder .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
