<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr, isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 400
const margin = { top: 28, right: 250, bottom: 56, left: 92 }
const POOL = 100
const LOAD = 8000 // requests per second offered to the app tier
const CACHED_LOAD = 160 // what reaches the database at a 98% hit ratio

let scene = null

function connections(load, ms) {
  return load * (ms / 1000)
}

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const innerW = W - margin.left - margin.right
  const innerH = H - margin.top - margin.bottom
  const x = d3.scaleLinear().domain([0, 60]).range([0, innerW])
  const y = d3.scaleLinear().domain([0, 340]).range([innerH, 0])
  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const grid = chart.append('g').attr('opacity', 0)
  grid.selectAll('line').data(y.ticks(6)).join('line').attr('x1', 0).attr('x2', innerW).attr('y1', (d) => y(d)).attr('y2', (d) => y(d)).attr('stroke', VK.mist)
  const axes = chart.append('g').attr('opacity', 0)
  axes.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(6).tickFormat((d) => `${d} ms`))
  axes.append('g').call(d3.axisLeft(y).ticks(6))
  axes.selectAll('.domain, .tick line').attr('stroke', VK.muted)
  axes.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 11)
  axes.append('text').attr('x', innerW / 2).attr('y', innerH + 44).attr('text-anchor', 'middle').attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 13).attr('font-weight', 600)
    .text('W: how long each request holds a database connection')
  axes.append('text').attr('transform', `translate(-62,${innerH / 2}) rotate(-90)`).attr('text-anchor', 'middle').attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 13).attr('font-weight', 600)
    .text('L: connections in use')

  // Pool ceiling.
  const pool = chart.append('g').attr('opacity', 0)
  pool.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(POOL)).attr('y2', y(POOL)).attr('stroke', VK.purple).attr('stroke-width', 2).attr('stroke-dasharray', '8 7')
  pool.append('text').attr('x', innerW - 6).attr('y', y(POOL) - 8).attr('text-anchor', 'end').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800)
    .text('pool = 100 connections')

  // Danger zone above the pool line.
  const dangerX0 = (POOL / LOAD) * 1000 // 12.5 ms
  const danger = chart.append('rect').attr('x', x(dangerX0)).attr('y', 0).attr('width', innerW - x(dangerX0)).attr('height', y(POOL)).attr('fill', VK.red).attr('opacity', 0)
  const dangerLabel = chart.append('text').attr('x', x(dangerX0) + 12).attr('y', 58).attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).attr('opacity', 0)
    .text('BEYOND THE POOL: requests block before they run a query')
  const knee = chart.append('g').attr('opacity', 0)
  knee.append('line').attr('x1', x(dangerX0)).attr('x2', x(dangerX0)).attr('y1', y(POOL)).attr('y2', innerH).attr('stroke', VK.red).attr('stroke-width', 1.5).attr('stroke-dasharray', '4 4')
  knee.append('text').attr('x', x(dangerX0) + 6).attr('y', innerH - 8).attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 700).text('the knee: 12.5 ms')

  const lineGen = d3.line().x((d) => x(d.ms)).y((d) => y(d.l))
  const series = (load, maxMs) => d3.range(0, maxMs + 0.01, 0.5).map((ms) => ({ ms, l: connections(load, ms) }))
  const hot = chart.append('path').datum(series(LOAD, 42.5)).attr('d', lineGen).attr('fill', 'none').attr('stroke', VK.purple).attr('stroke-width', 4)
  const hotLen = hot.node().getTotalLength()
  hot.attr('stroke-dasharray', hotLen).attr('stroke-dashoffset', hotLen).attr('opacity', 0)
  const hotLabel = chart.append('text').attr('x', x(30) + 10).attr('y', y(connections(LOAD, 30)) - 2).attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).attr('opacity', 0)
    .text('\u03BB = 8,000 req/s  \u2192  L = 8 \u00D7 W')

  const cool = chart.append('path').datum(series(CACHED_LOAD, 60)).attr('d', lineGen).attr('fill', 'none').attr('stroke', VK.blue).attr('stroke-width', 4)
  const coolLen = cool.node().getTotalLength()
  cool.attr('stroke-dasharray', coolLen).attr('stroke-dashoffset', coolLen).attr('opacity', 0)
  const coolLabel = chart.append('text').attr('x', x(44)).attr('y', y(connections(CACHED_LOAD, 44)) - 12).attr('fill', VK.blue).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).attr('opacity', 0)
    .text('with a 98% hit ratio: \u03BB = 160 req/s')

  const marker = (ms, load, color) => {
    const g = chart.append('g').attr('opacity', 0)
    g.append('circle').attr('cx', x(ms)).attr('cy', y(connections(load, ms))).attr('r', 9).attr('fill', color).attr('stroke', VK.white).attr('stroke-width', 3)
    return g
  }
  const healthy = marker(4, LOAD, VK.blue)
  const slowed = marker(40, LOAD, VK.red)
  const cachedDot = marker(40, CACHED_LOAD, VK.blue)

  // Side panel with the arithmetic.
  const panel = svg.append('g').attr('transform', `translate(${W - margin.right + 28},${margin.top})`)
  const rows = [
    { key: 'healthy', title: 'HEALTHY', color: VK.blue, lines: ['8,000 /s \u00D7 4 ms', '= 32 connections', 'fits, 68 to spare'] },
    { key: 'slowed', title: 'ORIGIN SLOWED 10x', color: VK.red, lines: ['8,000 /s \u00D7 40 ms', '= 320 connections', 'pool exhausted 3.2x over'] },
    { key: 'cached', title: 'SAME LOAD, 98% HITS', color: VK.blue, lines: ['160 /s \u00D7 40 ms', '= 6 connections', 'the pool never notices'] },
  ]
  const panelRows = rows.map((row, i) => {
    const g = panel.append('g').attr('transform', `translate(0,${i * 104})`).attr('opacity', 0)
    g.append('rect').attr('width', 214).attr('height', 92).attr('fill', VK.cream).attr('stroke', VK.mist)
    g.append('rect').attr('width', 5).attr('height', 92).attr('fill', row.color)
    g.append('text').attr('x', 16).attr('y', 20).attr('fill', row.color).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).attr('letter-spacing', 1).text(row.title)
    g.append('text').attr('x', 16).attr('y', 44).attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 13).text(row.lines[0])
    g.append('text').attr('x', 16).attr('y', 63).attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 15).attr('font-weight', 800).text(row.lines[1])
    g.append('text').attr('x', 16).attr('y', 81).attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 11).text(row.lines[2])
    return g
  })

  scene = { grid, axes, pool, danger, dangerLabel, knee, hot, hotLen, hotLabel, cool, coolLen, coolLabel, healthy, slowed, cachedDot, panelRows }
}

function apply(step) {
  if (!scene) return
  const s = scene
  const on = (sel, visible, duration = 360) => tr(sel, duration).attr('opacity', visible ? 1 : 0)
  // Axes and the pool ceiling are always visible; each click adds one idea.
  on(s.grid, true)
  on(s.axes, true)
  on(s.pool, true)
  tr(s.hot, 700).attr('opacity', step >= 1 ? 1 : 0).attr('stroke-dashoffset', step >= 1 ? 0 : s.hotLen)
  on(s.hotLabel, step >= 1)
  on(s.healthy, step >= 2)
  on(s.panelRows[0], step >= 2)
  on(s.slowed, step >= 3)
  tr(s.danger, 500).attr('opacity', step >= 3 ? 0.09 : 0)
  on(s.dangerLabel, step >= 3)
  on(s.knee, step >= 3)
  on(s.panelRows[1], step >= 3)
  tr(s.cool, 700).attr('opacity', step >= 4 ? 1 : 0).attr('stroke-dashoffset', step >= 4 ? 0 : s.coolLen)
  on(s.coolLabel, step >= 4)
  on(s.cachedDot, step >= 4)
  on(s.panelRows[2], step >= 4)
  if (step >= 4) {
    tr(s.hot, 400).attr('opacity', 0.35)
    tr(s.hotLabel, 400).attr('opacity', 0.45)
  }
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <svg ref="svgRef" class="diagram littles-law" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Little's Law: connections in use equal arrival rate times service time; a fixed pool is exhausted when service time grows" />
</template>

<style scoped>
.littles-law { width: 100%; height: auto; display: block; }
</style>
