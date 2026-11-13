<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, addMarkers, card, arc, flow, particle, pill, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 336

const steps = [
  { label: 'THE SHAPE', detail: 'A fast layer sits in front of the expensive dependency. Every read asks it first.' },
  { label: '1 \u00B7 ASK', detail: 'The client asks the cache for the key. One in-memory lookup, well under a millisecond.' },
  { label: '2 \u00B7 HIT', detail: 'Found: answer straight back. Fast and cheap, and the origin never hears about it.' },
  { label: '3 \u00B7 MISS', detail: 'Not found: do the expensive work once at the origin, remember the answer, then return it.' },
  { label: '4 \u00B7 THE BET', detail: 'Expected cost = hit ratio \u00D7 cheap + miss ratio \u00D7 expensive. You control the odds (hit ratio) and the downside (staleness).' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'mm')
  const root = svg.append('g')

  const client = card(root, { x: 40, y: 96, w: 190, h: 92, eyebrow: 'CLIENT', label: 'Request', status: 'web, API, worker', id: 'client' })
  const cache = card(root, { x: 445, y: 96, w: 190, h: 92, eyebrow: 'VALKEY', label: 'Fast path', status: 'memory, sub-ms', valkey: true, id: 'cache' })
  const origin = card(root, { x: 850, y: 96, w: 190, h: 92, eyebrow: 'ORIGIN', label: 'Expensive path', status: 'database or model', id: 'origin' })

  const ask = flow(root, arc({ x: client.right.x, y: client.right.y - 18 }, { x: cache.left.x, y: cache.left.y - 18 }, -52), { tone: 'blue', prefix: 'mm' })
  const hit = flow(root, arc({ x: cache.left.x, y: cache.left.y + 20 }, { x: client.right.x, y: client.right.y + 20 }, 52), { tone: 'blue', prefix: 'mm' })
  const miss = flow(root, arc({ x: cache.right.x, y: cache.right.y - 18 }, { x: origin.left.x, y: origin.left.y - 18 }, -52), { tone: 'red', prefix: 'mm' })
  const fill = flow(root, arc({ x: origin.left.x, y: origin.left.y + 20 }, { x: cache.right.x, y: cache.right.y + 20 }, 52), { tone: 'red', prefix: 'mm' })

  const askPill = pill(root, 337, 50, 'GET key')
  const hitPill = pill(root, 337, 206, 'HIT \u00B7 ~0.5 ms \u00B7 cheap', { tone: 'blue' })
  const missPill = pill(root, 742, 50, 'MISS \u00B7 compute once', { tone: 'red' })
  const fillPill = pill(root, 742, 206, 'SET + TTL \u00B7 8 ms or 3 s', { tone: 'red' })

  // The bet: expected cost bars for a 90% hit ratio.
  const bet = root.append('g').attr('opacity', 0).attr('transform', 'translate(40,230)')
  bet.append('rect').attr('width', 1000).attr('height', 90).attr('fill', VK.cream).attr('stroke', VK.mist)
  bet.append('rect').attr('width', 5).attr('height', 90).attr('fill', VK.blue)
  text(bet, 22, 24, 'EXPECTED COST PER READ \u00B7 QUERY CACHE EXAMPLE', { size: 10, color: VK.blue, weight: 800, mono: true })
  text(bet, 22, 50, '0.90 \u00D7 0.5 ms  +  0.10 \u00D7 8.5 ms  =  1.3 ms average  (was 8 ms)', { size: 16, color: VK.purple, weight: 800, mono: true })
  text(bet, 560, 24, 'TWO DIALS YOU OWN', { size: 10, color: VK.red, weight: 800, mono: true })
  text(bet, 560, 50, 'odds: the hit ratio', { size: 13, color: VK.black, weight: 600 })
  text(bet, 560, 72, 'downside: staleness, bounded by TTL and invalidation', { size: 13, color: VK.black, weight: 600 })
  bet.append('rect').attr('x', 22).attr('y', 62).attr('width', 500).attr('height', 8).attr('rx', 4).attr('fill', VK.mist)
  const barHit = bet.append('rect').attr('x', 22).attr('y', 62).attr('width', 0).attr('height', 8).attr('rx', 4).attr('fill', VK.blue)
  const barMiss = bet.append('rect').attr('x', 22 + 450).attr('y', 62).attr('width', 0).attr('height', 8).attr('fill', VK.red)
  text(bet, 22 + 225, 83, '90% hits', { size: 9, color: VK.blue, mono: true, anchor: 'middle' })
  text(bet, 22 + 475, 83, '10% misses', { size: 9, color: VK.red, mono: true, anchor: 'middle' })

  scene = { client, cache, origin, ask, hit, miss, fill, askPill, hitPill, missPill, fillPill, bet, barHit, barMiss, root }
}

async function animate(step) {
  const s = scene
  if (step === 1) await particle(s.root, s.ask.node, { tone: 'blue' })
  if (step === 2) await particle(s.root, s.hit.node, { tone: 'blue' })
  if (step === 3) {
    await particle(s.root, s.miss.node, { tone: 'red', duration: 900 })
    await particle(s.root, s.fill.node, { tone: 'red', duration: 900 })
    await particle(s.root, s.hit.node, { tone: 'blue' })
  }
}

function apply(step) {
  if (!scene) return
  const s = scene
  const state = (index, persistent = true) => (step >= index ? (step === index ? 'current' : persistent ? 'active' : 'hidden') : 'hidden')
  s.ask.setState(state(1))
  s.hit.setState(step === 2 || step === 3 ? 'current' : step > 3 ? 'active' : 'hidden')
  s.miss.setState(state(3))
  s.fill.setState(state(3))
  s.askPill.setState(state(1))
  s.hitPill.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden')
  s.missPill.setState(state(3))
  s.fillPill.setState(state(3))
  s.client.setState(step === 0 || step === 1 || step === 2 ? 'current' : 'idle')
  s.cache.setState([1, 2, 3].includes(step) ? 'current' : step === 4 ? 'good' : 'idle')
  s.origin.setState(step === 3 ? 'down' : 'idle')
  s.origin.setStatus(step === 3 ? 'slow, expensive, paid again' : 'database or model', step === 3 ? VK.red : VK.muted)
  tr(s.bet, 360).attr('opacity', step >= 4 ? 1 : 0)
  tr(s.barHit, 700).attr('width', step >= 4 ? 450 : 0)
  tr(s.barMiss, 700).attr('width', step >= 4 ? 50 : 0)
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="mental-model">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Client, cache and origin: hits return from the cache, misses go to the origin once and are remembered" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.mental-model { width: 100%; }
.mental-model .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
