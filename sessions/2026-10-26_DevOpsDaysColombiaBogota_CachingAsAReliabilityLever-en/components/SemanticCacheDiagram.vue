<script setup>
import { computed } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
})

const steps = [
  { label: 'READY', detail: 'Cache by meaning, not by the exact prompt string.' },
  { label: '1 · EMBED', detail: 'Convert the incoming prompt into a vector.' },
  { label: '2 · SEARCH', detail: 'Find the nearest cached prompt vectors.' },
  { label: '3 · HIT', detail: 'Within the distance limit: return the cached answer.' },
  { label: '4 · MISS', detail: 'No safe match: invoke the model once.' },
  { label: '5 · STORE', detail: 'Save the new embedding and answer with a TTL.' },
]

const boundedStep = computed(() => Math.min(Math.max(props.step, 0), steps.length - 1))
const currentStep = computed(() => steps[boundedStep.value])
const pathClass = (index, persistent = true) => ({
  'is-active': persistent ? boundedStep.value >= index : boundedStep.value === index,
  'is-current': boundedStep.value === index,
})
</script>

<template>
  <div class="semantic-flow">
    <div class="semantic-flow__canvas">
      <svg class="semantic-flow__paths" viewBox="0 0 1080 330" role="img" aria-label="Animated semantic cache request flow">
        <defs>
          <marker id="semantic-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
          <marker id="semantic-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
        </defs>
        <path class="flow flow--blue" :class="pathClass(1)" d="M 190 142 C 230 90, 275 90, 315 142" />
        <path class="flow flow--blue" :class="pathClass(2)" d="M 475 142 C 520 90, 565 90, 610 142" />
        <path class="flow flow--blue" :class="pathClass(3, false)" d="M 610 184 C 480 258, 315 258, 190 184" />
        <path class="flow flow--red" :class="pathClass(4)" d="M 770 180 C 820 231, 860 231, 910 180" />
        <path class="flow flow--red" :class="pathClass(5)" d="M 910 133 C 865 52, 815 52, 770 133" />
      </svg>

      <div class="node node--prompt" :class="{ 'is-current': boundedStep === 0 || boundedStep === 1 }"><span>PROMPT</span><strong>User question</strong></div>
      <div class="node node--embed" :class="{ 'is-current': boundedStep === 1 }"><span>EMBEDDING</span><strong>Meaning → vector</strong></div>
      <div class="node node--valkey" :class="{ 'is-current': [2, 3, 4, 5].includes(boundedStep) }">
        <BrandLogo compact class="node__mark" /><span>VALKEY SEARCH</span><strong>Nearest vectors</strong>
      </div>
      <div class="node node--llm" :class="{ 'is-current': boundedStep === 4 || boundedStep === 5 }"><span>MODEL</span><strong>Generate once</strong></div>

      <span class="label label--embed" :class="pathClass(1)">embedding</span>
      <span class="label label--search" :class="pathClass(2)">KNN</span>
      <span class="label label--hit" :class="pathClass(3, false)">HIT · no LLM</span>
      <span class="label label--miss" :class="pathClass(4)">MISS</span>
      <span class="label label--store" :class="pathClass(5)">store + TTL</span>
    </div>

    <Transition name="semantic-copy" mode="out-in">
      <div :key="currentStep.label" class="semantic-flow__step">
        <strong>{{ currentStep.label }}</strong>
        <span>{{ currentStep.detail }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.semantic-flow { width: 100%; }
.semantic-flow__canvas {
  position: relative;
  height: 330px;
  overflow: hidden;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
.semantic-flow__paths { position: absolute; inset: 0; width: 100%; height: 100%; }
.flow {
  fill: none;
  stroke-dasharray: 650;
  stroke-dashoffset: 650;
  stroke-linecap: round;
  stroke-width: 3;
  opacity: 0;
  transition: stroke-dashoffset 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, stroke 180ms ease;
}
.flow--blue { stroke: #6983ff; marker-end: url(#semantic-arrow-blue); }
.flow--red { stroke: #642637; marker-end: url(#semantic-arrow-red); }
.flow.is-active { stroke-dashoffset: 0; opacity: 0.32; }
.flow.is-current { opacity: 1; stroke-width: 4; }
#semantic-arrow-blue path { fill: #6983ff; }
#semantic-arrow-red path { fill: #642637; }
.node {
  position: absolute;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  width: 160px;
  height: 92px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #bcb5e7;
  background: #fffdfa;
  color: #1a2026;
  box-shadow: 0 9px 30px rgb(48 23 110 / 8%);
  text-align: center;
  transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
}
.node.is-current { border-color: #6983ff; background: #f1effd; box-shadow: 0 12px 35px rgb(105 131 255 / 20%); transform: translateY(-4px); }
.node span { color: #30176e; font-family: 'Cascadia Code', monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.09em; }
.node strong { margin-top: 7px; font-family: 'Open Sans', sans-serif; font-size: 15px; }
.node--prompt { left: 30px; top: 119px; }
.node--embed { left: 315px; top: 119px; }
.node--valkey { left: 610px; top: 119px; }
.node--llm { right: 10px; top: 119px; }
.node__mark { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; }
.label {
  position: absolute;
  z-index: 3;
  padding: 4px 8px;
  border: 1px solid #d3dde7;
  border-radius: 999px;
  background: #fffdfa;
  color: #596672;
  font-family: 'Cascadia Code', monospace;
  font-size: 9px;
  font-weight: 700;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 180ms ease, transform 180ms ease, color 180ms ease, border-color 180ms ease;
}
.label.is-active { opacity: 0.48; transform: translateY(0); }
.label.is-current { border-color: #6983ff; color: #30176e; opacity: 1; }
.label--embed { left: 21%; top: 68px; }
.label--search { left: 49%; top: 67px; }
.label--hit { left: 37%; top: 250px; }
.label--miss { left: 78%; top: 238px; }
.label--store { left: 78%; top: 38px; }
.semantic-flow__step {
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-height: 42px;
  margin-top: 12px;
  padding: 10px 14px;
  border-left: 5px solid #6983ff;
  background: #30176e;
  color: #f7fbfe;
}
.semantic-flow__step strong { min-width: 116px; color: #e0a2af; font-family: 'Cascadia Code', monospace; font-size: 11px; }
.semantic-flow__step span { font-size: 14px; }
.semantic-copy-enter-active, .semantic-copy-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.semantic-copy-enter-from { opacity: 0; transform: translateY(8px); }
.semantic-copy-leave-to { opacity: 0; transform: translateY(-5px); }
@media (prefers-reduced-motion: reduce) {
  .flow, .node, .label, .semantic-copy-enter-active, .semantic-copy-leave-active { transition: none; }
}
</style>
