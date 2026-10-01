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
  { label: 'Ready', detail: 'The application owns the cache-aside decision.' },
  { label: '1 · GET', detail: 'The application checks Valkey first.' },
  { label: '2 · MISS', detail: 'Valkey reports that the key is not cached.' },
  { label: '3 · SELECT', detail: 'The application reads the primary database.' },
  { label: '4 · VALUE', detail: 'The database returns the source value.' },
  { label: '5 · SET + RESPOND', detail: 'The application populates Valkey and returns the response.' },
]

const currentStep = computed(() => steps[Math.min(Math.max(props.step, 0), steps.length - 1)])
const stateClass = (index) => ({
  'is-active': props.step >= index,
  'is-current': props.step === index,
})
</script>

<template>
  <div class="cache-aside">
    <div class="cache-aside__canvas">
      <svg class="cache-aside__flows" viewBox="0 0 1000 350" role="img" aria-label="Animated cache-aside request flow">
        <defs>
          <marker id="cache-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        <path class="flow flow--request" :class="stateClass(1)" d="M 405 158 C 500 92, 574 88, 665 88" />
        <path class="flow flow--miss" :class="stateClass(2)" d="M 665 126 C 570 145, 510 164, 405 179" />
        <path class="flow flow--select" :class="stateClass(3)" d="M 405 208 C 510 250, 566 278, 665 278" />
        <path class="flow flow--value" :class="stateClass(4)" d="M 665 315 C 560 314, 510 275, 405 231" />
        <path class="flow flow--set" :class="stateClass(5)" d="M 405 146 C 502 53, 582 48, 665 60" />
        <path class="flow flow--response" :class="stateClass(5)" d="M 270 214 C 218 242, 178 242, 126 212" />
      </svg>

      <div class="cache-node cache-node--client" :class="{ 'is-current': step === 5 }">
        <span>CLIENT</span>
        <strong>Request</strong>
      </div>

      <div class="cache-node cache-node--app" :class="{ 'is-current': step === 0 }">
        <span>APPLICATION</span>
        <strong>Cache-aside logic</strong>
      </div>

      <div class="cache-node cache-node--valkey" :class="{ 'is-current': step === 1 || step === 2 || step === 5 }">
        <BrandLogo compact class="cache-node__mark" />
        <span>VALKEY</span>
        <strong>Fast cache</strong>
      </div>

      <div class="cache-node cache-node--database" :class="{ 'is-current': step === 3 || step === 4 }">
        <span>DATABASE</span>
        <strong>Source of truth</strong>
      </div>

      <span class="flow-label flow-label--get" :class="stateClass(1)">GET key</span>
      <span class="flow-label flow-label--miss" :class="stateClass(2)">MISS</span>
      <span class="flow-label flow-label--select" :class="stateClass(3)">SELECT</span>
      <span class="flow-label flow-label--value" :class="stateClass(4)">VALUE</span>
      <span class="flow-label flow-label--set" :class="stateClass(5)">SET key</span>
      <span class="flow-label flow-label--response" :class="stateClass(5)">RESPONSE</span>
    </div>

    <Transition name="step-copy" mode="out-in">
      <div :key="currentStep.label" class="cache-aside__step">
        <strong>{{ currentStep.label }}</strong>
        <span>{{ currentStep.detail }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cache-aside {
  width: 100%;
}

.cache-aside__canvas {
  position: relative;
  height: 350px;
  overflow: hidden;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 64%, #efedfa 100%);
}

.cache-aside__flows {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.cache-aside__flows marker path {
  fill: #6983ff;
}

.flow {
  fill: none;
  stroke: #6983ff;
  stroke-dasharray: 520;
  stroke-dashoffset: 520;
  stroke-linecap: round;
  stroke-width: 3;
  marker-end: url(#cache-arrow);
  opacity: 0;
  transition: stroke-dashoffset 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, stroke 180ms ease;
}

.flow.is-active {
  stroke-dashoffset: 0;
  opacity: 0.34;
}

.flow.is-current {
  stroke: #30176e;
  opacity: 1;
}

.cache-node {
  position: absolute;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  width: 150px;
  height: 82px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #bcb5e7;
  background: #fff;
  color: #1a2026;
  box-shadow: 0 9px 30px rgb(48 23 110 / 8%);
  text-align: center;
  transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
}

.cache-node.is-current {
  border-color: #6983ff;
  background: #f1effd;
  box-shadow: 0 12px 35px rgb(105 131 255 / 20%);
  transform: translateY(-4px);
}

.cache-node span {
  color: #30176e;
  font-family: 'Cascadia Code', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.cache-node strong {
  margin-top: 7px;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 16px;
}

.cache-node--client { left: 25px; top: 135px; }
.cache-node--app { left: 255px; top: 135px; }
.cache-node--valkey { right: 55px; top: 37px; }
.cache-node--database { right: 55px; bottom: 25px; }

.cache-node__mark {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 18px;
  height: 18px;
}

.flow-label {
  position: absolute;
  z-index: 3;
  padding: 3px 7px;
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

.flow-label.is-active {
  opacity: 0.55;
  transform: translateY(0);
}

.flow-label.is-current {
  border-color: #6983ff;
  color: #30176e;
  opacity: 1;
}

.flow-label--get { left: 49%; top: 59px; }
.flow-label--miss { left: 49%; top: 142px; }
.flow-label--select { left: 49%; top: 242px; }
.flow-label--value { left: 50%; top: 298px; }
.flow-label--set { left: 48%; top: 17px; }
.flow-label--response { left: 16%; top: 225px; }

.cache-aside__step {
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

.cache-aside__step strong {
  min-width: 130px;
  color: #e0a2af;
  font-family: 'Cascadia Code', monospace;
  font-size: 12px;
}

.cache-aside__step span {
  font-size: 14px;
}

.step-copy-enter-active,
.step-copy-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}

.step-copy-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.step-copy-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (prefers-reduced-motion: reduce) {
  .flow,
  .cache-node,
  .flow-label,
  .step-copy-enter-active,
  .step-copy-leave-active {
    transition: none;
  }
}
</style>
