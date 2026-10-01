<script setup>
import { computed } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  step: { type: Number, default: 4 },
  focus: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const focusedLayers = computed(() => new Set(
  props.focus.split(',').map((value) => value.trim()).filter(Boolean),
))

const layerClasses = (id, revealAt) => ({
  'is-visible': props.step >= revealAt,
  'is-focused': focusedLayers.value.has(id),
  'is-dimmed': focusedLayers.value.size > 0 && !focusedLayers.value.has(id),
})
</script>

<template>
  <div class="oss-pyramid" :class="{ 'is-compact': compact }" role="img" aria-label="Open source AI stack from Linux through Kubernetes and data systems to AI frameworks">
    <section class="oss-layer oss-layer--ai" :class="layerClasses('ai', 4)">
      <div class="oss-layer__label"><span>04</span><strong>APPLICATION / AI</strong><small>train · serve · act</small></div>
      <div class="oss-layer__projects">
        <div class="oss-project"><img src="/logos/pytorch.svg" alt="PyTorch" /></div>
        <div class="oss-project"><img src="/logos/vllm.svg" alt="vLLM" /></div>
        <div class="oss-project oss-project--strands"><img src="/logos/strands.svg" alt="Strands Agents" /><b>Strands</b></div>
      </div>
    </section>

    <section class="oss-layer oss-layer--data" :class="layerClasses('data', 3)">
      <div class="oss-layer__label"><span>03</span><strong>DATA / STATE</strong><small>memory · search · truth</small></div>
      <div class="oss-layer__projects">
        <div class="oss-project oss-project--valkey"><BrandLogo compact tone="light" /><b>Valkey</b></div>
        <div class="oss-project"><img src="/logos/opensearch.svg" alt="OpenSearch" /></div>
        <div class="oss-project oss-project--postgres"><img src="/logos/postgresql.svg" alt="PostgreSQL" /><b>PostgreSQL</b></div>
      </div>
    </section>

    <section class="oss-layer oss-layer--orchestration" :class="layerClasses('orchestration', 2)">
      <div class="oss-layer__label"><span>02</span><strong>ORCHESTRATION</strong><small>schedule · scale · recover</small></div>
      <div class="oss-layer__projects">
        <div class="oss-project oss-project--single"><img src="/logos/kubernetes.svg" alt="Kubernetes" /><b>Kubernetes</b></div>
      </div>
    </section>

    <section class="oss-layer oss-layer--foundation" :class="layerClasses('foundation', 1)">
      <div class="oss-layer__label"><span>01</span><strong>FOUNDATION</strong><small>the ground beneath the cloud</small></div>
      <div class="oss-layer__projects">
        <div class="oss-project oss-project--single"><img src="/logos/linux.svg" alt="Linux" /><b>Linux</b></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.oss-pyramid {
  display: flex;
  width: 100%;
  height: 472px;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
}
.oss-layer {
  display: grid;
  min-height: 0;
  grid-template-columns: 230px 1fr;
  align-items: center;
  margin-inline: auto;
  border: 1px solid #d3dde7;
  background: #fffdfa;
  box-shadow: 0 12px 34px rgb(48 23 110 / 8%);
  opacity: 0;
  transform: translateY(16px) scale(.985);
  transition: opacity 240ms ease, transform 300ms cubic-bezier(.22, 1, .36, 1), filter 220ms ease;
}
.oss-layer.is-visible { opacity: 1; transform: translateY(0) scale(1); }
.oss-layer.is-focused { border-color: #6983ff; box-shadow: 0 14px 42px rgb(105 131 255 / 24%); }
.oss-layer.is-dimmed { filter: grayscale(.85); opacity: .28; }
.oss-layer--ai { width: 68%; height: 104px; border-top: 7px solid #e0a2af; }
.oss-layer--data { width: 79%; height: 104px; border-top: 7px solid #6983ff; }
.oss-layer--orchestration { width: 90%; height: 94px; border-top: 7px solid #326ce5; }
.oss-layer--foundation { width: 100%; height: 94px; border-top: 7px solid #30176e; }
.oss-layer__label { display: flex; min-width: 0; flex-direction: column; padding: 12px 18px; }
.oss-layer__label span { color: #6983ff; font-family: 'Cascadia Code', monospace; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.oss-layer__label strong { margin-top: 3px; color: #30176e; font-size: 14px; letter-spacing: .04em; }
.oss-layer__label small { margin-top: 2px; color: #65717d; font-family: 'Cascadia Code', monospace; font-size: 8px; }
.oss-layer__projects { display: flex; min-width: 0; align-items: center; justify-content: center; gap: 28px; padding: 8px 20px; }
.oss-project { display: flex; min-width: 112px; align-items: center; justify-content: center; gap: 8px; color: #1a2026; }
.oss-project img { width: auto; max-width: 132px; height: 38px; object-fit: contain; }
.oss-project b { font-size: 14px; }
.oss-project--single img { width: 44px; height: 44px; }
.oss-project--valkey .brand-logo { width: 37px; }
.oss-project--postgres img { width: 43px; }
.oss-project--strands img { width: 27px; }
.oss-pyramid.is-compact { height: 390px; gap: 6px; }
.oss-pyramid.is-compact .oss-layer { grid-template-columns: 116px 1fr; }
.oss-pyramid.is-compact .oss-layer--ai,
.oss-pyramid.is-compact .oss-layer--data,
.oss-pyramid.is-compact .oss-layer--orchestration,
.oss-pyramid.is-compact .oss-layer--foundation { width: 100%; height: 88px; }
.oss-pyramid.is-compact .oss-layer__label { padding: 9px 10px; }
.oss-pyramid.is-compact .oss-layer__label strong { font-size: 10px; }
.oss-pyramid.is-compact .oss-layer__label small { display: none; }
.oss-pyramid.is-compact .oss-layer__projects { gap: 9px; padding: 6px 8px; }
.oss-pyramid.is-compact .oss-project { min-width: 0; gap: 4px; }
.oss-pyramid.is-compact .oss-project img { max-width: 72px; height: 27px; }
.oss-pyramid.is-compact .oss-project b { font-size: 9px; }
.oss-pyramid.is-compact .oss-project--single img { width: 32px; height: 32px; }
.oss-pyramid.is-compact .oss-project--valkey .brand-logo { width: 26px; }
.oss-pyramid.is-compact .oss-project--strands img { width: 18px; }
@media (prefers-reduced-motion: reduce) { .oss-layer { transition: none; } }
</style>
