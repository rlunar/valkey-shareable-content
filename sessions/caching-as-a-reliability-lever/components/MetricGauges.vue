<script setup>
// Six operating targets for a read-heavy cache tier, shown as radial gauges that fill on click.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr, isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 400

const metrics = [
  { name: 'CACHE HIT RATIO', value: 94, unit: '%', fraction: 0.94, target: 'target: 90%+ (read-heavy)', note: 'Amazon-scale catalogs run 95 to 99%. A falling ratio is the early warning.', tone: VK.blue },
  { name: 'p99 LATENCY, HIT PATH', value: 0.6, unit: ' ms', fraction: 0.075, target: 'target: under 1 ms', note: 'Origin path sits near 8 ms. Track the two paths separately.', tone: VK.blue, format: (v) => v.toFixed(1) },
  { name: 'ORIGIN POOL IN USE', value: 45, unit: '%', fraction: 0.45, target: 'target: under 60%', note: 'Headroom for the surge and for a cold cache.', tone: VK.blue },
  { name: 'ORIGIN CPU', value: 38, unit: '%', fraction: 0.38, target: 'target: under 50% steady', note: 'Confirms the cache is actually shielding the database.', tone: VK.blue },
  { name: 'EVICTIONS / s', value: 0, unit: '', fraction: 0.72, target: 'target: ~0, memory < 75%', note: 'Evictions mean the working set outgrew the cache.', tone: VK.purple, format: (v) => Math.round(v).toString(), ring: 'memory used 72%' },
  { name: 'SEMANTIC HIT ACCURACY', value: 91.2, unit: '%', fraction: 0.912, target: 'target: 90%+ near the line', note: 'Log every hit with its score. Audit a sample of near-threshold hits.', tone: VK.blue, format: (v) => v.toFixed(1) },
]

let tiles = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const tileW = 350
  const tileH = 190
  const arcGen = d3.arc().innerRadius(44).outerRadius(56).startAngle(-Math.PI * 0.75).cornerRadius(6)
  tiles = metrics.map((m, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const g = svg.append('g').attr('transform', `translate(${col * (tileW + 15)},${row * (tileH + 20)})`).attr('opacity', 0)
    g.append('rect').attr('width', tileW).attr('height', tileH).attr('fill', VK.cream).attr('stroke', VK.mist)
    g.append('rect').attr('width', 5).attr('height', tileH).attr('fill', m.tone)
    const dial = g.append('g').attr('transform', 'translate(78,98)')
    dial.append('path').attr('d', arcGen({ endAngle: Math.PI * 0.75 })).attr('fill', VK.mist)
    const fill = dial.append('path').attr('fill', m.tone).attr('d', arcGen({ endAngle: -Math.PI * 0.75 }))
    const value = dial.append('text').attr('y', 8).attr('text-anchor', 'middle').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 22).attr('font-weight', 800).text('0')
    if (m.ring) dial.append('text').attr('y', 62).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 9).attr('font-weight', 700).text(m.ring)
    g.append('text').attr('x', 152).attr('y', 44).attr('fill', m.tone).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('letter-spacing', 1).text(m.name)
    g.append('text').attr('x', 152).attr('y', 78).attr('fill', VK.purple).attr('font-family', FONT_BODY).attr('font-size', 14).attr('font-weight', 700).text(m.target)
    const note = g.append('text').attr('x', 152).attr('y', 104).attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 12.5)
    wrap(note, m.note, 185)
    return { g, fill, value, m, arcGen }
  })
}

function wrap(textSel, content, width) {
  const words = content.split(' ')
  let lineWords = []
  let lineNo = 0
  let tspan = textSel.append('tspan').attr('x', 152).attr('dy', 0)
  for (const word of words) {
    lineWords.push(word)
    tspan.text(lineWords.join(' '))
    if (tspan.node().getComputedTextLength() > width && lineWords.length > 1) {
      lineWords.pop()
      tspan.text(lineWords.join(' '))
      lineWords = [word]
      lineNo += 1
      tspan = textSel.append('tspan').attr('x', 152).attr('dy', 17).text(word)
    }
  }
}

function apply(step) {
  if (!tiles) return
  tiles.forEach((t, i) => {
    const visible = step >= i + 1
    tr(t.g, 320).attr('opacity', visible ? 1 : 0)
    const endAngle = -Math.PI * 0.75 + (visible ? t.m.fraction : 0) * Math.PI * 1.5
    const format = t.m.format || ((v) => Math.round(v).toString())
    if (isStatic()) {
      t.fill.attr('d', t.arcGen({ endAngle }))
      t.value.text(visible ? `${format(t.m.value)}${t.m.unit}` : '0')
      return
    }
    t.fill.transition().duration(800).ease(d3.easeCubicOut).attrTween('d', function () {
      const current = this.__angle ?? -Math.PI * 0.75
      const interp = d3.interpolateNumber(current, endAngle)
      return (k) => { this.__angle = interp(k); return t.arcGen({ endAngle: interp(k) }) }
    })
    t.value.transition().duration(800).ease(d3.easeCubicOut).tween('text', function () {
      const from = Number(String(d3.select(this).text()).replace(/[^0-9.]/g, '')) || 0
      const interp = d3.interpolateNumber(from, visible ? t.m.value : 0)
      return (k) => d3.select(this).text(`${format(interp(k))}${visible ? t.m.unit : ''}`)
    })
  })
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <svg ref="svgRef" class="diagram metric-gauges" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Six operating targets for a cache tier: hit ratio, p99 latency, origin pool, origin CPU, evictions and memory, semantic hit accuracy" />
</template>

<style scoped>
.metric-gauges { width: 100%; height: auto; display: block; }
</style>
