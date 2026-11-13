<script setup>
// Closing numbers: each tile counts up when its click arrives.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })

const tiles = [
  { key: 'db', value: 55, suffix: '%', eyebrow: 'DATABASE COST', title: 'lower, for frequently read data', note: 'Earned through hit ratio and right-sizing. Measure before you shrink.', tone: 'red' },
  { key: 'ai', value: 86, suffix: '%', eyebrow: 'INFERENCE COST', title: 'lower with a semantic cache', note: 'AWS evaluation, 63,796 queries, threshold 0.75, 91% accuracy.', tone: 'blue' },
  { key: 'lat', value: 88, suffix: '%', eyebrow: 'LATENCY', title: 'lower end to end on AI answers', note: 'Up to 59x on a single hit: seconds become hundreds of milliseconds.', tone: 'blue' },
  { key: 'infra', value: 45, suffix: '%', eyebrow: 'INFRASTRUCTURE', title: 'lower cache tier cost at Amazon Ads', note: 'Valkey 8 on Graviton, 12% more throughput, zero downtime.', tone: 'purple' },
  { key: 'pages', value: 3, suffix: ' AM', eyebrow: 'FOR SRE AND DEVOPS', title: 'fewer pages at this hour', note: 'The surge stops at the cache: no pool exhaustion, no retry storm, nothing to wake up for.', tone: 'purple', static: true },
]

const numbers = ref([])

function apply(step) {
  tiles.forEach((tile, i) => {
    const el = numbers.value[i]
    if (!el) return
    const visible = step >= i + 1
    const target = visible ? tile.value : 0
    if (tile.static || isStatic()) {
      el.textContent = visible ? `${tile.value}${tile.suffix}` : `0${tile.suffix}`
      return
    }
    const from = Number(el.textContent.replace(/[^0-9.]/g, '')) || 0
    d3.select(el).transition().duration(900).ease(d3.easeCubicOut).tween('text', function () {
      const interp = d3.interpolateNumber(from, target)
      return (t) => { this.textContent = `${Math.round(interp(t))}${tile.suffix}` }
    })
  })
}

onMounted(() => apply(props.step))
watch(() => props.step, apply)
</script>

<template>
  <div class="impact-board">
    <article v-for="(tile, i) in tiles" :key="tile.key" class="impact-tile" :class="[`is-${tile.tone}`, { 'is-visible': step >= i + 1 }]">
      <span class="impact-tile__eyebrow">{{ tile.eyebrow }}</span>
      <strong class="impact-tile__number" :ref="(el) => (numbers[i] = el)">0{{ tile.suffix }}</strong>
      <b class="impact-tile__title">{{ tile.title }}</b>
      <p class="impact-tile__note">{{ tile.note }}</p>
    </article>
  </div>
</template>

<style scoped>
.impact-board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}
.impact-tile {
  display: flex;
  min-height: 330px;
  flex-direction: column;
  padding: 20px 18px;
  border: 1px solid #d3dde7;
  border-top: 6px solid #6983ff;
  background: #f7fbfe;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 260ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.impact-tile.is-visible { opacity: 1; transform: translateY(0); }
.impact-tile.is-red { border-top-color: #642637; }
.impact-tile.is-purple { border-top-color: #30176e; }
.impact-tile__eyebrow { color: #596672; font-family: 'Cascadia Code', monospace; font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; }
.impact-tile__number { display: block; margin-top: 34px; color: #30176e; font-family: 'Open Sans', sans-serif; font-size: 58px; font-weight: 800; line-height: 1; letter-spacing: -0.03em; }
.is-red .impact-tile__number { color: #642637; }
.is-blue .impact-tile__number { color: #6983ff; }
.impact-tile__title { display: block; margin-top: 14px; color: #1a2026; font-size: 15px; font-weight: 700; line-height: 1.3; }
.impact-tile__note { margin-top: auto; padding-top: 14px; color: #596672; font-size: 11.5px; line-height: 1.45; }
@media (prefers-reduced-motion: reduce) { .impact-tile { transition: none; } }
</style>
