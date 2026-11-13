<script setup>
import { computed } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
})

const states = [
  { position: 12, label: 'Start tight', detail: 'Protect answer quality; expect fewer hits.', tone: 'tight' },
  { position: 88, label: 'Too loose', detail: 'Hit rate rises, but unsafe matches rise too.', tone: 'loose' },
  { position: 58, label: 'Measured operating point', detail: 'Tune with hit rate and answer accuracy together.', tone: 'balanced' },
]

const current = computed(() => states[Math.min(Math.max(props.step, 0), states.length - 1)])
</script>

<template>
  <div class="threshold-dial">
    <div class="threshold-dial__labels"><span>TIGHT · FEWER HITS</span><span>LOOSE · MORE RISK</span></div>
    <div class="threshold-dial__track">
      <span class="threshold-dial__safe-zone" />
      <span class="threshold-dial__risk-zone" />
      <span class="threshold-dial__knob" :class="`is-${current.tone}`" :style="{ left: `${current.position}%` }" />
    </div>
    <Transition name="dial-copy" mode="out-in">
      <div :key="current.label" class="threshold-dial__copy" :class="`is-${current.tone}`">
        <strong>{{ current.label }}</strong>
        <span>{{ current.detail }}</span>
      </div>
    </Transition>
    <div class="threshold-dial__metrics">
      <article><span>GUARDRAIL</span><strong>Answer accuracy</strong><p>Review false matches, not just aggregate hit rate.</p></article>
      <article><span>EFFICIENCY</span><strong>Cache hit rate</strong><p>Measure avoided model calls and end-to-end latency.</p></article>
      <article><span>FRESHNESS</span><strong>TTL + context</strong><p>Expire stale answers and filter by tenant, locale, or product.</p></article>
    </div>
  </div>
</template>

<style scoped>
.threshold-dial { margin-top: 42px; }
.threshold-dial__labels { display: flex; justify-content: space-between; color: #596672; font-family: 'Cascadia Code', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; }
.threshold-dial__track { position: relative; height: 18px; margin-top: 12px; border: 1px solid #bcb5e7; border-radius: 999px; background: #d3dde7; }
.threshold-dial__safe-zone { position: absolute; top: 0; bottom: 0; left: 38%; width: 28%; background: #6983ff; opacity: 0.55; }
.threshold-dial__risk-zone { position: absolute; top: 0; right: 0; bottom: 0; width: 22%; border-radius: 0 999px 999px 0; background: #642637; opacity: 0.72; }
.threshold-dial__knob { position: absolute; top: 50%; width: 34px; height: 34px; border: 5px solid #fffdfa; border-radius: 50%; background: #30176e; box-shadow: 0 8px 20px rgb(48 23 110 / 25%); transform: translate(-50%, -50%); transition: left 620ms cubic-bezier(0.22, 1, 0.36, 1), background 180ms ease; }
.threshold-dial__knob.is-loose { background: #642637; }
.threshold-dial__knob.is-balanced { background: #6983ff; }
.threshold-dial__copy { display: flex; align-items: baseline; gap: 18px; margin-top: 22px; padding: 14px 18px; border-left: 6px solid #30176e; background: #f1effd; }
.threshold-dial__copy.is-loose { border-left-color: #642637; background: #faedf0; }
.threshold-dial__copy.is-balanced { border-left-color: #6983ff; background: #eef2ff; }
.threshold-dial__copy strong { min-width: 245px; color: #30176e; font-size: 20px; }
.threshold-dial__copy span { color: #4f5c68; font-size: 15px; }
.threshold-dial__metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 25px; }
.threshold-dial__metrics article { min-height: 118px; padding: 16px 18px; border: 1px solid #d3dde7; border-left: 5px solid #6983ff; background: #f7fbfe; }
.threshold-dial__metrics span { color: #6983ff; font-family: 'Cascadia Code', monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; }
.threshold-dial__metrics strong { display: block; margin-top: 17px; color: #30176e; font-size: 18px; }
.threshold-dial__metrics p { margin-top: 7px; color: #596672; font-size: 12px; line-height: 1.4; }
.dial-copy-enter-active, .dial-copy-leave-active { transition: opacity 150ms ease, transform 150ms ease; }
.dial-copy-enter-from { opacity: 0; transform: translateY(7px); }
.dial-copy-leave-to { opacity: 0; transform: translateY(-5px); }
@media (prefers-reduced-motion: reduce) { .threshold-dial__knob, .dial-copy-enter-active, .dial-copy-leave-active { transition: none; } }
</style>
