<script setup>
import { computed } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
})

const visible = computed(() => Math.min(Math.max(props.step, 0), 3))
</script>

<template>
  <div class="wa-matrix">
    <div class="wa-matrix__head"><span>PATTERN</span><strong :class="{ 'is-visible': visible >= 1 }">Cost optimization</strong><strong :class="{ 'is-visible': visible >= 2 }">Performance efficiency</strong><strong :class="{ 'is-visible': visible >= 3 }">Reliability</strong></div>
    <div class="wa-matrix__row">
      <span><b>01</b> Database cache-aside</span>
      <p :class="{ 'is-visible': visible >= 1 }">Avoid repeated reads and right-size capacity after measuring.</p>
      <p :class="{ 'is-visible': visible >= 2 }">Serve hot data from memory.</p>
      <p :class="{ 'is-visible': visible >= 3 }">Absorb read spikes; define safe miss behavior.</p>
    </div>
    <div class="wa-matrix__row wa-matrix__row--accent">
      <span><b>02</b> Semantic cache</span>
      <p :class="{ 'is-visible': visible >= 1 }">Skip repeated LLM inference.</p>
      <p :class="{ 'is-visible': visible >= 2 }">Return validated hits without generation.</p>
      <p :class="{ 'is-visible': visible >= 3 }">Reduce pressure on throttled model endpoints.</p>
    </div>
    <div class="wa-matrix__guardrail" :class="{ 'is-visible': visible >= 3 }"><strong>Reliability is designed, not implied.</strong><span>Replicate the cache, protect misses, prevent stampedes, and never remove database capacity used for failover.</span></div>
  </div>
</template>

<style scoped>
.wa-matrix { margin-top: 28px; }
.wa-matrix__head, .wa-matrix__row { display: grid; grid-template-columns: 1.12fr repeat(3, minmax(0, 1fr)); }
.wa-matrix__head > * { padding: 13px 15px; border-right: 1px solid rgb(188 181 231 / 24%); background: #30176e; color: #fffdfa; }
.wa-matrix__head span { color: #e0a2af; font-family: 'Cascadia Code', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
.wa-matrix__head strong { font-size: 14px; opacity: 0.2; transition: opacity 200ms ease, background 200ms ease; }
.wa-matrix__head strong.is-visible { background: #3e2380; opacity: 1; }
.wa-matrix__row > * { min-height: 92px; box-sizing: border-box; padding: 15px; border-right: 1px solid #d3dde7; border-bottom: 1px solid #d3dde7; background: #f7fbfe; }
.wa-matrix__row > span { border-left: 5px solid #6983ff; color: #30176e; font-size: 17px; font-weight: 700; }
.wa-matrix__row--accent > span { border-left-color: #e0a2af; }
.wa-matrix__row b { display: block; margin-bottom: 10px; color: #6983ff; font-family: 'Cascadia Code', monospace; font-size: 10px; letter-spacing: 0.08em; }
.wa-matrix__row p { color: #4f5c68; font-size: 13px; line-height: 1.42; opacity: 0.15; transform: translateY(6px); transition: opacity 200ms ease, transform 220ms ease; }
.wa-matrix__row p.is-visible { opacity: 1; transform: translateY(0); }
.wa-matrix__guardrail { display: flex; align-items: center; gap: 20px; margin-top: 18px; padding: 14px 18px; border-left: 6px solid #642637; background: #faedf0; opacity: 0; transform: translateY(7px); transition: opacity 220ms ease, transform 220ms ease; }
.wa-matrix__guardrail.is-visible { opacity: 1; transform: translateY(0); }
.wa-matrix__guardrail strong { min-width: 285px; color: #642637; font-size: 16px; }
.wa-matrix__guardrail span { color: #4f5c68; font-size: 13px; }
@media (prefers-reduced-motion: reduce) { .wa-matrix__head strong, .wa-matrix__row p, .wa-matrix__guardrail { transition: none; } }
</style>
