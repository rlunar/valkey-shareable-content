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
  { label: 'READY', detail: 'The application owns the cache decision.' },
  { label: '1 · CHECK', detail: 'Ask Valkey before asking the database.' },
  { label: '2 · HIT', detail: 'Return the cached value without database work.' },
  { label: '3 · MISS', detail: 'The key is absent, expired, or evicted.' },
  { label: '4 · LOAD', detail: 'Read the source value from the database once.' },
  { label: '5 · FILL', detail: 'Store with a TTL, then return the response.' },
]

const boundedStep = computed(() => Math.min(Math.max(props.step, 0), steps.length - 1))
const currentStep = computed(() => steps[boundedStep.value])
const pathClass = (index, persistent = true) => ({
  'is-active': persistent ? boundedStep.value >= index : boundedStep.value === index,
  'is-current': boundedStep.value === index,
})
</script>

<template>
  <div class="cache-flow">
    <div class="cache-flow__canvas">
      <svg class="cache-flow__paths" viewBox="0 0 1000 330" role="img" aria-label="Animated cache-aside request flow">
        <defs>
          <marker id="cache-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker id="cache-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <path class="flow flow--blue" :class="pathClass(1)" d="M 260 127 C 360 78, 435 78, 535 127" />
        <path class="flow flow--blue" :class="pathClass(2, false)" d="M 535 162 C 435 211, 360 211, 260 162" />
        <path class="flow flow--red" :class="pathClass(3, false)" d="M 535 182 C 420 238, 358 238, 260 182" />
        <path class="flow flow--red" :class="pathClass(4)" d="M 260 201 C 420 286, 610 286, 755 201" />
        <path class="flow flow--red" :class="pathClass(4)" d="M 755 161 C 625 91, 400 91, 260 151" />
        <path class="flow flow--blue" :class="pathClass(5)" d="M 260 105 C 365 36, 440 36, 535 105" />
      </svg>

      <div class="node node--app" :class="{ 'is-current': [0, 3, 4, 5].includes(boundedStep) }">
        <span>APPLICATION</span>
        <strong>Cache-aside logic</strong>
      </div>

      <div class="node node--valkey" :class="{ 'is-current': [1, 2, 3, 5].includes(boundedStep) }">
        <BrandLogo compact class="node__mark" />
        <span>VALKEY</span>
        <strong>Fast path</strong>
      </div>

      <div class="node node--database" :class="{ 'is-current': boundedStep === 4 }">
        <span>DATABASE</span>
        <strong>Source of truth</strong>
      </div>

      <span class="label label--get" :class="pathClass(1)">GET key</span>
      <span class="label label--hit" :class="pathClass(2, false)">HIT · return</span>
      <span class="label label--miss" :class="pathClass(3, false)">MISS</span>
      <span class="label label--load" :class="pathClass(4)">read once</span>
      <span class="label label--fill" :class="pathClass(5)">SET + TTL</span>
    </div>

    <Transition name="step-copy" mode="out-in">
      <div :key="currentStep.label" class="cache-flow__step">
        <strong>{{ currentStep.label }}</strong>
        <span>{{ currentStep.detail }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cache-flow { width: 100%; }
.cache-flow__canvas {
  position: relative;
  height: 330px;
  overflow: hidden;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 64%, #efedfa 100%);
}
.cache-flow__paths { position: absolute; inset: 0; width: 100%; height: 100%; }
.flow {
  fill: none;
  stroke-dasharray: 650;
  stroke-dashoffset: 650;
  stroke-linecap: round;
  stroke-width: 3;
  opacity: 0;
  transition: stroke-dashoffset 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, stroke 180ms ease;
}
.flow--blue { stroke: #6983ff; marker-end: url(#cache-arrow-blue); }
.flow--red { stroke: #642637; marker-end: url(#cache-arrow-red); }
.flow.is-active { stroke-dashoffset: 0; opacity: 0.32; }
.flow.is-current { opacity: 1; stroke-width: 4; }
#cache-arrow-blue path { fill: #6983ff; }
#cache-arrow-red path { fill: #642637; }
.node {
  position: absolute;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  width: 190px;
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
.node.is-current {
  border-color: #6983ff;
  background: #f1effd;
  box-shadow: 0 12px 35px rgb(105 131 255 / 20%);
  transform: translateY(-4px);
}
.node span { color: #30176e; font-family: 'Cascadia Code', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
.node strong { margin-top: 7px; font-family: 'Open Sans', sans-serif; font-size: 17px; }
.node--app { left: 70px; top: 119px; }
.node--valkey { left: 535px; top: 63px; }
.node--database { right: 55px; bottom: 30px; }
.node__mark { position: absolute; top: 8px; right: 8px; width: 19px; height: 19px; }
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
.label--get { left: 37%; top: 58px; }
.label--hit { left: 37%; top: 192px; }
.label--miss { left: 38%; top: 226px; }
.label--load { left: 50%; top: 279px; }
.label--fill { left: 38%; top: 15px; }
.cache-flow__step {
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
.cache-flow__step strong { min-width: 116px; color: #e0a2af; font-family: 'Cascadia Code', monospace; font-size: 11px; }
.cache-flow__step span { font-size: 14px; }
.step-copy-enter-active, .step-copy-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.step-copy-enter-from { opacity: 0; transform: translateY(8px); }
.step-copy-leave-to { opacity: 0; transform: translateY(-5px); }
@media (prefers-reduced-motion: reduce) {
  .flow, .node, .label, .step-copy-enter-active, .step-copy-leave-active { transition: none; }
}
</style>
