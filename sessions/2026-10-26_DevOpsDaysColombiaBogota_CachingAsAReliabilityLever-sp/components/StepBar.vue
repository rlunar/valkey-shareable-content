<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: { type: Array, required: true },
  step: { type: Number, default: 0 },
  tone: { type: String, default: 'blue' },
})

const current = computed(() => props.steps[Math.min(Math.max(props.step, 0), props.steps.length - 1)])
const accent = computed(() => (current.value?.tone || props.tone) === 'red' ? '#642637' : '#6983ff')
</script>

<template>
  <Transition name="step-copy" mode="out-in">
    <div :key="current.label" class="step-bar" :style="{ borderLeftColor: accent }">
      <strong>{{ current.label }}</strong>
      <span>{{ current.detail }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.step-bar {
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-height: 42px;
  margin-top: 10px;
  padding: 10px 14px;
  border-left: 5px solid #6983ff;
  background: #30176e;
  color: #f7fbfe;
}
.step-bar strong { min-width: 200px; color: #e0a2af; font-family: 'Cascadia Code', monospace; font-size: 11px; letter-spacing: 0.04em; }
.step-bar span { font-size: 14px; line-height: 1.35; }
.step-copy-enter-active, .step-copy-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.step-copy-enter-from { opacity: 0; transform: translateY(8px); }
.step-copy-leave-to { opacity: 0; transform: translateY(-5px); }
@media (prefers-reduced-motion: reduce) {
  .step-copy-enter-active, .step-copy-leave-active { transition: none; }
}
</style>
