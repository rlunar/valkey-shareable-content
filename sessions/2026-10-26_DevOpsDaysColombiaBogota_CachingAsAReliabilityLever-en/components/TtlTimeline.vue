<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 360

const steps = [
  { label: 'READY', detail: 'A cache is a second copy of your data. Two tools keep the copy honest: time (TTL) and events (invalidation).' },
  { label: '1 \u00B7 SET + TTL', detail: 'SET product:42 ... EX 300. For five minutes every read is a hit and the origin is never asked.' },
  { label: '2 \u00B7 HITS', detail: 'Reads inside the window come from memory. Staleness is bounded: never older than the TTL you chose.' },
  { label: '3 \u00B7 EXPIRE + REFILL', detail: 'At 300 s the key disappears. The next read misses, reloads once from the origin, and opens a new window.' },
  { label: '4 \u00B7 INVALIDATE ON WRITE', detail: 'A write deletes the key immediately instead of waiting for the clock. Delete the fan-out keys too (the category list that contains product 42).' },
  { label: '5 \u00B7 SYNCHRONIZED EXPIRY', detail: '1,000 keys filled together expire together: 1,000 misses hit the origin in the same second. A self-inflicted spike.', tone: 'red' },
  { label: '6 \u00B7 JITTER', detail: 'Give each key EX 300 plus or minus a random 60 s. The same misses spread over two minutes at about eight per second. Cheap insurance.' },
]

let scene = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  // Top band: one key over 12 minutes.
  const top = svg.append('g')
  const x = d3.scaleLinear().domain([0, 12]).range([70, 1040])
  const baseY = 126
  text(top, 70, 22, 'ONE KEY \u00B7 product:42', { size: 10, color: VK.purple, weight: 800, mono: true })
  top.append('line').attr('x1', 70).attr('x2', 1040).attr('y1', baseY).attr('y2', baseY).attr('stroke', VK.muted).attr('stroke-width', 1.5)
  for (const m of d3.range(0, 13, 1)) {
    top.append('line').attr('x1', x(m)).attr('x2', x(m)).attr('y1', baseY).attr('y2', baseY + 6).attr('stroke', VK.muted)
    if (m % 2 === 0) text(top, x(m), baseY + 20, `${m} min`, { size: 10, color: VK.muted, mono: true, anchor: 'middle', weight: 600 })
  }
  const barY = 58
  const barH = 30
  const bar = (from, to, color = VK.blue) => {
    const r = top.append('rect').attr('x', x(from)).attr('y', barY).attr('width', 0).attr('height', barH).attr('fill', color).attr('opacity', 0.9)
    return { r, w: x(to) - x(from) }
  }
  const fresh1 = bar(0, 5)
  const fresh2 = bar(5.4, 10.4)
  const fresh3 = bar(7.6, 12)
  const setTag = text(top, x(0), barY - 12, 'SET product:42 ... EX 300', { size: 11, color: VK.purple, weight: 800, mono: true, opacity: 0 })
  const freshLabel = text(top, x(2.5), barY + 20, 'fresh: served from memory', { size: 11, color: VK.white, weight: 700, anchor: 'middle', opacity: 0 })

  const markerY = barY + barH + 12
  const hits = [0.8, 1.9, 3.1, 4.2].map((t) => {
    const g = top.append('g').attr('opacity', 0)
    g.append('circle').attr('cx', x(t)).attr('cy', markerY).attr('r', 5).attr('fill', VK.blue).attr('stroke', VK.white).attr('stroke-width', 2)
    text(g, x(t), markerY + 17, 'HIT', { size: 9, color: VK.blue, mono: true, anchor: 'middle', weight: 800 })
    return g
  })

  const expiry = top.append('g').attr('opacity', 0)
  expiry.append('line').attr('x1', x(5)).attr('x2', x(5)).attr('y1', barY - 20).attr('y2', baseY).attr('stroke', VK.muted).attr('stroke-dasharray', '4 4').attr('stroke-width', 1.5)
  text(expiry, x(5), barY - 24, 'expired at 300 s', { size: 10, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })
  const miss1 = top.append('g').attr('opacity', 0)
  miss1.append('circle').attr('cx', x(5.4)).attr('cy', markerY).attr('r', 5).attr('fill', VK.red).attr('stroke', VK.white).attr('stroke-width', 2)
  text(miss1, x(5.4) + 10, markerY + 4, 'MISS \u2192 reload once', { size: 9, color: VK.red, mono: true, anchor: 'start', weight: 800 })

  const write = top.append('g').attr('opacity', 0)
  write.append('line').attr('x1', x(7.2)).attr('x2', x(7.2)).attr('y1', barY - 20).attr('y2', baseY).attr('stroke', VK.purple).attr('stroke-width', 2)
  text(write, x(7.2), barY - 24, 'write \u2192 DEL product:42', { size: 10, color: VK.purple, mono: true, anchor: 'middle', weight: 800 })
  const miss2 = top.append('g').attr('opacity', 0)
  miss2.append('circle').attr('cx', x(7.6)).attr('cy', markerY).attr('r', 5).attr('fill', VK.red).attr('stroke', VK.white).attr('stroke-width', 2)
  text(miss2, x(7.6) + 10, markerY + 4, 'MISS \u2192 fresh copy', { size: 9, color: VK.red, mono: true, anchor: 'start', weight: 800 })

  // Bottom band: 1,000 keys expiring, misses per second on a log scale so both shapes are visible.
  const bottom = svg.append('g').attr('transform', 'translate(0,186)')
  const bx = d3.scaleLinear().domain([200, 400]).range([70, 1040])
  const floor = 140
  const by = d3.scaleLog().domain([1, 1000]).range([floor, 20])
  const bottomTitle = text(bottom, 70, 10, '1,000 KEYS FILLED AT THE SAME TIME \u00B7 misses per second as they expire (log scale)', { size: 10, color: VK.purple, weight: 800, mono: true, opacity: 0 })
  const bottomAxis = bottom.append('g').attr('opacity', 0)
  bottomAxis.append('line').attr('x1', 70).attr('x2', 1040).attr('y1', floor).attr('y2', floor).attr('stroke', VK.muted).attr('stroke-width', 1.5)
  for (const s of d3.range(200, 401, 50)) {
    bottomAxis.append('line').attr('x1', bx(s)).attr('x2', bx(s)).attr('y1', floor).attr('y2', floor + 6).attr('stroke', VK.muted)
    text(bottomAxis, bx(s), floor + 20, `${s} s`, { size: 10, color: VK.muted, mono: true, anchor: 'middle', weight: 600 })
  }
  for (const v of [10, 100, 1000]) {
    bottomAxis.append('line').attr('x1', 70).attr('x2', 1040).attr('y1', by(v)).attr('y2', by(v)).attr('stroke', VK.mist)
    text(bottomAxis, 64, by(v) + 3, `${v}`, { size: 9, color: VK.muted, mono: true, anchor: 'end', weight: 600 })
  }
  const spike = bottom.append('rect').attr('x', bx(299.2)).attr('width', bx(300.8) - bx(299.2)).attr('y', floor).attr('height', 0).attr('fill', VK.red)
  const spikeLabel = text(bottom, bx(300) + 12, by(1000) + 10, '1,000 misses in one second', { size: 12, color: VK.red, weight: 800, mono: true, opacity: 0 })
  // Deterministic jittered distribution: 1,000 keys spread over 240..360 s, about 8 per second.
  const rng = d3.randomLcg(7)
  const buckets = d3.range(240, 360, 1).map((start) => ({ start, n: Math.max(2, Math.round(1000 / 120 + (rng() - 0.5) * 6)) }))
  const jitterBars = bottom.selectAll('rect.jitter').data(buckets).join('rect').attr('class', 'jitter')
    .attr('x', (d) => bx(d.start) + 0.5).attr('width', bx(1) - bx(0) - 1).attr('y', floor).attr('height', 0).attr('fill', VK.blue)
  const jitterLabel = text(bottom, bx(240), by(8) - 14, 'EX 300 \u00B1 60 s jitter: about 8 misses per second, for two minutes', { size: 12, color: VK.blue, weight: 800, mono: true, opacity: 0 })
  const originLine = bottom.append('g').attr('opacity', 0)
  originLine.append('line').attr('x1', 70).attr('x2', 1040).attr('y1', by(120)).attr('y2', by(120)).attr('stroke', VK.purple).attr('stroke-dasharray', '6 6')
  text(originLine, 1040, by(120) - 6, 'origin headroom: 120 extra reads per second', { size: 10, color: VK.purple, mono: true, anchor: 'end', weight: 700 })

  scene = { fresh1, fresh2, fresh3, setTag, freshLabel, hits, expiry, miss1, write, miss2, bottomTitle, bottomAxis, spike, spikeLabel, jitterBars, jitterLabel, originLine, by, floor, x }
}

function apply(step) {
  if (!scene) return
  const s = scene
  const on = (sel, visible, d = 300) => tr(sel, d).attr('opacity', visible ? 1 : 0)
  tr(s.fresh1.r, 700).attr('width', step >= 1 ? s.fresh1.w : 0)
  on(s.setTag, step >= 1)
  on(s.freshLabel, step >= 1)
  s.hits.forEach((h, i) => tr(h, 300 + i * 120).attr('opacity', step >= 2 ? 1 : 0))
  on(s.expiry, step >= 3)
  on(s.miss1, step >= 3)
  // Second window: full until the write cuts it at 7.2 min.
  const cut = s.x(7.2) - s.x(5.4)
  tr(s.fresh2.r, 700).attr('width', step >= 4 ? cut : step >= 3 ? s.fresh2.w : 0)
  on(s.write, step >= 4)
  on(s.miss2, step >= 4)
  tr(s.fresh3.r, 700).attr('width', step >= 4 ? s.fresh3.w : 0)
  on(s.bottomTitle, step >= 5)
  on(s.bottomAxis, step >= 5)
  on(s.originLine, step >= 5)
  const spikeOn = step === 5
  tr(s.spike, 600).attr('y', spikeOn ? s.by(1000) : s.floor).attr('height', spikeOn ? s.floor - s.by(1000) : 0)
  on(s.spikeLabel, spikeOn)
  tr(s.jitterBars, 700).attr('y', (d) => (step >= 6 ? s.by(d.n) : s.floor)).attr('height', (d) => (step >= 6 ? s.floor - s.by(d.n) : 0))
  on(s.jitterLabel, step >= 6)
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="ttl">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="TTL timeline: a key is set with a five minute TTL, served from memory, expires, is refilled, and is deleted on write; then synchronized expiry versus jittered expiry" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.ttl { width: 100%; }
.ttl .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
