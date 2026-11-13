<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, addMarkers, tr, countUp, isStatic } from './diagram-kit.js'
import valkeyMark from '@valkey-assets/logos/valkey-icon-periwinkle.svg'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 430

// Six stages in a snake: 1 2 3 on the top row, 6 5 4 on the bottom row (4 sits under 3).
const CARD_W = 280
const CARD_H = 150
const COLS = [0, 400, 800]
const ROWS = [14, 262]
const stages = [
  { n: 1, title: 'Traffic surge', sub: 'one product, 200k shoppers', unit: 'requests / s', bad: 8000, good: 8000, healthy: 800, max: 8000, badTag: 'same product, same minute', goodTag: 'same traffic, nothing changed', badTone: 'blue' },
  { n: 2, title: 'Redundant DB reads', sub: 'identical answers recomputed', unit: 'DB reads / s', bad: 8000, good: 160, healthy: 800, max: 8000, badTag: 'price has not changed, computed 8,000x', goodTag: '98% served by Valkey', badTone: 'red' },
  { n: 3, title: 'Service time climbs', sub: 'hot rows, buffers, locks', unit: 'ms per read', bad: 40, good: 4, healthy: 4, max: 50, badTag: '10x slower under contention', goodTag: 'no contention, 4 ms', badTone: 'red' },
  { n: 4, title: 'Pool exhausted', sub: 'Little\u2019s Law: L = \u03BB \u00D7 W', unit: 'connections needed (pool = 100)', bad: 320, good: 1, healthy: 32, max: 100, badTag: '3.2x over the pool', goodTag: '99 connections idle', badTone: 'red' },
  { n: 5, title: 'Queues form', sub: 'requests wait before any work', unit: 'p99 latency, ms', bad: 2400, good: 12, healthy: 20, max: 2400, badTag: 'the knee: tail blows out', goodTag: 'no queue', badTone: 'red' },
  { n: 6, title: 'Retry storm', sub: 'clients time out and retry', unit: 'retries / s', bad: 16000, good: 0, healthy: 0, max: 16000, badTag: 'load up when headroom is gone', goodTag: 'nothing to retry', badTone: 'red' },
]
const positions = [
  { x: COLS[0], y: ROWS[0] }, { x: COLS[1], y: ROWS[0] }, { x: COLS[2], y: ROWS[0] },
  { x: COLS[2], y: ROWS[1] }, { x: COLS[1], y: ROWS[1] }, { x: COLS[0], y: ROWS[1] },
]

const CACHE_STEP = 6
let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'cascade')
  const root = svg.append('g')

  const cards = stages.map((stage, i) => {
    const { x, y } = positions[i]
    const g = root.append('g').attr('transform', `translate(${x},${y + 12})`).attr('opacity', 0)
    const rect = g.append('rect').attr('width', CARD_W).attr('height', CARD_H).attr('rx', 3)
      .attr('fill', VK.white).attr('stroke', VK.lavender).attr('stroke-width', 2)
    g.append('circle').attr('cx', 26).attr('cy', 28).attr('r', 13).attr('fill', VK.purple)
    g.append('text').attr('x', 26).attr('y', 32.5).attr('text-anchor', 'middle').attr('fill', VK.white)
      .attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 700).text(stage.n)
    g.append('text').attr('x', 48).attr('y', 26).attr('fill', VK.purple).attr('font-family', FONT_BODY).attr('font-size', 16).attr('font-weight', 700).text(stage.title)
    g.append('text').attr('x', 48).attr('y', 43).attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 11).text(stage.sub)
    const value = g.append('text').attr('x', 18).attr('y', 88).attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 28).attr('font-weight', 700).text('0')
    g.append('text').attr('x', 18).attr('y', 104).attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).attr('letter-spacing', 0.5).text(stage.unit.toUpperCase())
    const track = g.append('rect').attr('x', 18).attr('y', 114).attr('width', 244).attr('height', 8).attr('rx', 4).attr('fill', VK.mist)
    const fill = g.append('rect').attr('x', 18).attr('y', 114).attr('width', 0).attr('height', 8).attr('rx', 4).attr('fill', VK.blue)
    const limit = g.append('line').attr('x1', 18 + 244 * (100 / 320)).attr('x2', 18 + 244 * (100 / 320)).attr('y1', 110).attr('y2', 126)
      .attr('stroke', VK.purple).attr('stroke-width', 2).attr('opacity', i === 3 ? 1 : 0)
    const limitLabel = g.append('text').attr('x', 18 + 244 * (100 / 320) + 5).attr('y', 125).attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 9).attr('font-weight', 700)
      .attr('opacity', i === 3 ? 1 : 0).text('pool 100')
    const tag = g.append('text').attr('x', 18).attr('y', 140).attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 700).text('')
    const down = g.append('g').attr('opacity', 0).attr('transform', `translate(${CARD_W - 78},12)`)
    down.append('rect').attr('width', 66).attr('height', 24).attr('rx', 2).attr('fill', VK.red)
    down.append('text').attr('x', 33).attr('y', 17).attr('text-anchor', 'middle').attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).text('DOWN')
    return { g, rect, value, fill, tag, down, track, limit, limitLabel, x, y, stage }
  })

  // Connectors between consecutive stages.
  const mid = (i) => ({ x: positions[i].x + CARD_W / 2, y: positions[i].y + CARD_H / 2 })
  const connectorDefs = [
    { d: `M ${COLS[0] + CARD_W} ${ROWS[0] + 86} L ${COLS[1]} ${ROWS[0] + 86}`, label: 'same answer, again', lx: COLS[0] + CARD_W + 60, ly: ROWS[0] + 72 },
    { d: `M ${COLS[1] + CARD_W} ${ROWS[0] + 86} L ${COLS[2]} ${ROWS[0] + 86}`, label: 'hot rows contend', lx: COLS[1] + CARD_W + 60, ly: ROWS[0] + 72 },
    { d: `M ${mid(2).x} ${ROWS[0] + CARD_H} L ${mid(2).x} ${ROWS[1]}`, label: 'held longer: L = \u03BB \u00D7 W', lx: mid(2).x - 12, ly: ROWS[0] + CARD_H + 56, anchor: 'end' },
    { d: `M ${COLS[2]} ${ROWS[1] + 86} L ${COLS[1] + CARD_W} ${ROWS[1] + 86}`, label: 'requests wait', lx: COLS[1] + CARD_W + 60, ly: ROWS[1] + 72 },
    { d: `M ${COLS[1]} ${ROWS[1] + 86} L ${COLS[0] + CARD_W} ${ROWS[1] + 86}`, label: 'timeouts', lx: COLS[0] + CARD_W + 60, ly: ROWS[1] + 72 },
  ]
  const connectors = connectorDefs.map((def) => {
    const path = root.append('path').attr('d', def.d).attr('fill', 'none').attr('stroke', VK.purple).attr('stroke-width', 2.5)
      .attr('marker-end', 'url(#cascade-arrow-purple)').attr('opacity', 0)
    const length = path.node().getTotalLength()
    path.attr('stroke-dasharray', length).attr('stroke-dashoffset', length)
    const label = root.append('text').attr('x', def.lx).attr('y', def.ly).attr('text-anchor', def.anchor || 'middle')
      .attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 700).attr('opacity', 0).text(def.label)
    return { path, length, label }
  })

  // Feedback loop: retries (6) push more load into the database (2).
  const feedbackD = `M ${COLS[0] + CARD_W / 2 + 60} ${ROWS[1]} C ${COLS[0] + CARD_W / 2 + 60} ${ROWS[0] + CARD_H + 30}, ${COLS[1] + 110} ${ROWS[1] - 20}, ${COLS[1] + 110} ${ROWS[0] + CARD_H + 2}`
  const feedback = root.append('path').attr('d', feedbackD).attr('fill', 'none').attr('stroke', VK.red).attr('stroke-width', 3)
    .attr('marker-end', 'url(#cascade-arrow-red)').attr('opacity', 0)
  const feedbackLength = feedback.node().getTotalLength()
  feedback.attr('stroke-dasharray', feedbackLength).attr('stroke-dashoffset', feedbackLength)
  const feedbackLabel = root.append('text').attr('x', COLS[1] + 125).attr('y', ROWS[0] + CARD_H + 52).attr('text-anchor', 'start')
    .attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('opacity', 0).text('retries add load: the loop closes')

  // Valkey card that cuts the chain between stage 1 and stage 2.
  const valkey = root.append('g').attr('transform', `translate(${COLS[0] + CARD_W + 14},${ROWS[0] + 40})`).attr('opacity', 0)
  valkey.append('rect').attr('width', 92).attr('height', 92).attr('rx', 3).attr('fill', VK.current).attr('stroke', VK.blue).attr('stroke-width', 2.5)
  valkey.append('image').attr('href', valkeyMark).attr('x', 32).attr('y', 10).attr('width', 28).attr('height', 28)
  valkey.append('text').attr('x', 46).attr('y', 58).attr('text-anchor', 'middle').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).text('VALKEY')
  valkey.append('text').attr('x', 46).attr('y', 74).attr('text-anchor', 'middle').attr('fill', VK.blue).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).text('98% hit')
  const valkeyTail = root.append('text').attr('x', COLS[1] - 8).attr('y', ROWS[0] + 72).attr('text-anchor', 'end')
    .attr('fill', VK.blue).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).attr('opacity', 0).text('2%')

  // Headline for the cached end state.
  const verdict = root.append('text').attr('x', W / 2).attr('y', H - 4).attr('text-anchor', 'middle')
    .attr('fill', VK.purple).attr('font-family', FONT_BODY).attr('font-size', 15).attr('font-weight', 700).attr('opacity', 0)
    .text('Same traffic. The chain never starts, because the repeated work stops at the cache.')

  scene = { cards, connectors, feedback, feedbackLength, feedbackLabel, valkey, valkeyTail, verdict }
}

function setCardMetrics(c, mode, animate) {
  const { stage } = c
  const target = mode === 'good' ? stage.good : mode === 'bad' ? stage.bad : stage.healthy
  const from = mode === 'bad' ? stage.healthy : mode === 'good' ? stage.bad : stage.healthy
  if (animate) countUp(c.value, target, { from, duration: 800 })
  else c.value.text(d3.format(',')(target))
  if (stage.n === 4 && mode === 'good') c.value.text('<1')
  const ratio = stage.n === 4 ? target / 320 : target / stage.max
  const tone = mode === 'good' || stage.badTone === 'blue' ? VK.blue : VK.red
  tr(c.fill, animate ? 800 : 0).attr('width', Math.max(target > 0 ? 4 : 0, 244 * Math.min(1, ratio))).attr('fill', tone)
  c.tag.text(mode === 'good' ? stage.goodTag : stage.badTag).attr('fill', mode === 'good' ? VK.blue : stage.badTone === 'blue' ? VK.purple : VK.red)
  tr(c.rect, 300).attr('stroke', mode === 'good' ? VK.blue : stage.badTone === 'blue' ? VK.lavender : (c.visible ? VK.red : VK.lavender))
    .attr('fill', mode === 'good' ? VK.blueFill : stage.badTone === 'blue' ? VK.white : VK.redFill)
}

function apply(step) {
  if (!scene) return
  const cached = step >= CACHE_STEP
  const forward = step === lastStep + 1
  scene.cards.forEach((c, i) => {
    const visible = cached || i <= step
    c.visible = visible
    const wasVisible = cached ? true : i <= lastStep
    tr(c.g, 320).attr('opacity', visible ? 1 : 0).attr('transform', `translate(${c.x},${visible ? c.y : c.y + 12})`)
    if (!visible) {
      c.value.text(d3.format(',')(c.stage.healthy))
      c.fill.attr('width', 0)
      return
    }
    const animate = !isStatic() && ((forward && !wasVisible) || (cached && lastStep === CACHE_STEP - 1))
    setCardMetrics(c, cached ? 'good' : 'bad', animate)
    tr(c.down, 240).attr('opacity', i === 5 && !cached ? 1 : 0)
  })
  scene.connectors.forEach((k, i) => {
    const visible = cached || i + 1 <= step
    tr(k.path, 480).attr('opacity', visible ? (cached ? 0.25 : 1) : 0).attr('stroke-dashoffset', visible ? 0 : k.length)
    tr(k.label, 300).attr('opacity', visible ? (cached ? 0.3 : 1) : 0)
    if (i === 0 && cached) k.label.text('')
    else if (i === 0) k.label.text('same answer, again')
  })
  const showFeedback = step >= 5 && !cached
  tr(scene.feedback, 600).attr('opacity', showFeedback ? 1 : 0).attr('stroke-dashoffset', showFeedback ? 0 : scene.feedbackLength)
  tr(scene.feedbackLabel, 300).attr('opacity', showFeedback ? 1 : 0)
  tr(scene.valkey, 420).attr('opacity', cached ? 1 : 0)
  tr(scene.valkeyTail, 420).attr('opacity', cached ? 1 : 0)
  tr(scene.verdict, 420).attr('opacity', cached ? 1 : 0)
  lastStep = step
}

onMounted(() => {
  build()
  lastStep = props.step - 1
  apply(props.step)
})
watch(() => props.step, (s) => apply(s))
</script>

<template>
  <svg ref="svgRef" class="diagram cascade" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="How an uncached read path degrades step by step, and where a cache cuts the chain" />
</template>

<style scoped>
.cascade { width: 100%; height: auto; display: block; }
</style>
