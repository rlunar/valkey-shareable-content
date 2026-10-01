<script setup>
import { computed } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({ step: { type: Number, default: 0 } })
const boundedStep = computed(() => Math.min(Math.max(props.step, 0), 5))
const active = (index) => ({ 'is-active': boundedStep.value >= index, 'is-current': boundedStep.value === index })
</script>

<template>
  <div class="agent-path" role="img" aria-label="A Strands support agent using semantic cache, conversation memory, retrieval, inference, and durable state">
    <svg class="agent-path__lines" viewBox="0 0 1080 420" aria-hidden="true">
      <defs>
        <marker id="agent-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" /></marker>
      </defs>
      <path :class="active(1)" d="M460 190 C365 155 302 130 230 105" />
      <path :class="active(2)" d="M455 220 C350 255 300 285 228 315" />
      <path :class="active(3)" d="M625 185 C730 145 790 120 860 102" />
      <path :class="active(4)" d="M630 215 C745 250 790 275 860 310" />
      <path :class="active(5)" d="M545 275 C545 322 545 342 545 375" />
    </svg>

    <div class="agent-core">
      <img src="/logos/strands.svg" alt="" />
      <span>STRANDS AGENT</span>
      <strong>Support assistant</strong>
      <small>reason · choose tools · act</small>
    </div>

    <article class="agent-node agent-node--cache" :class="active(1)">
      <BrandLogo compact tone="light" />
      <span>01 · SEMANTIC CACHE</span>
      <strong>“Have we answered this?”</strong>
      <small>Valkey · avoid repeat inference</small>
    </article>

    <article class="agent-node agent-node--memory" :class="active(2)">
      <BrandLogo compact tone="light" />
      <span>02 · MEMORY</span>
      <strong>“What did you say before?”</strong>
      <small>Valkey · conversation context</small>
    </article>

    <article class="agent-node agent-node--retrieval" :class="active(3)">
      <img src="/logos/opensearch.svg" alt="" />
      <span>03 · RETRIEVAL</span>
      <strong>“Find the right knowledge.”</strong>
      <small>Valkey + OpenSearch · vectors + text</small>
    </article>

    <article class="agent-node agent-node--inference" :class="active(4)">
      <img src="/logos/vllm.svg" alt="" />
      <span>04 · INFERENCE</span>
      <strong>“Generate the new answer.”</strong>
      <small>vLLM · fast model serving</small>
    </article>

    <article class="agent-node agent-node--state" :class="active(5)">
      <img src="/logos/postgresql.svg" alt="" />
      <span>05 · DURABLE STATE</span>
      <strong>“Record what must persist.”</strong>
      <small>PostgreSQL · source of truth</small>
    </article>
  </div>
</template>

<style scoped>
.agent-path { position: relative; width: 100%; height: 420px; overflow: hidden; border: 1px solid #d3dde7; background: radial-gradient(circle at 50% 48%, #f1effd 0 14%, #fffdfa 42%, #f7fbfe 100%); }
.agent-path__lines { position: absolute; inset: 0; width: 100%; height: 100%; }
.agent-path__lines path { fill: none; stroke: #6983ff; stroke-dasharray: 480; stroke-dashoffset: 480; stroke-linecap: round; stroke-width: 3; marker-end: url(#agent-arrow); opacity: 0; transition: stroke-dashoffset 480ms cubic-bezier(.22, 1, .36, 1), opacity 180ms ease; }
.agent-path__lines path.is-active { stroke-dashoffset: 0; opacity: .35; }
.agent-path__lines path.is-current { opacity: 1; stroke-width: 4; }
#agent-arrow path { fill: #6983ff; }
.agent-core, .agent-node { position: absolute; z-index: 2; display: flex; box-sizing: border-box; flex-direction: column; justify-content: center; border: 1px solid #d3dde7; background: #fffdfa; box-shadow: 0 10px 30px rgb(48 23 110 / 10%); }
.agent-core { top: 137px; left: 455px; width: 175px; height: 145px; align-items: center; border: 2px solid #30176e; background: #30176e; color: #f7fbfe; text-align: center; }
.agent-core img { width: 25px; height: 40px; margin-bottom: 7px; object-fit: contain; }
.agent-core span, .agent-node span { color: #e0a2af; font-family: 'Cascadia Code', monospace; font-size: 8px; font-weight: 700; letter-spacing: .08em; }
.agent-core strong { margin-top: 5px; font-size: 17px; }
.agent-core small { margin-top: 4px; color: #bcb5e7; font-family: 'Cascadia Code', monospace; font-size: 7px; }
.agent-node { width: 245px; height: 100px; padding: 12px 15px 11px 58px; opacity: .2; transform: scale(.97); transition: opacity 180ms ease, transform 220ms ease, border-color 180ms ease; }
.agent-node.is-active { opacity: 1; transform: scale(1); }
.agent-node.is-current { border-color: #6983ff; box-shadow: 0 13px 34px rgb(105 131 255 / 22%); }
.agent-node > img, .agent-node > .brand-logo { position: absolute; top: 25px; left: 14px; width: 32px; max-height: 48px; object-fit: contain; }
.agent-node--inference > img { width: 38px; }
.agent-node span { color: #6983ff; }
.agent-node strong { margin-top: 4px; color: #30176e; font-size: 13px; }
.agent-node small { margin-top: 3px; color: #65717d; font-family: 'Cascadia Code', monospace; font-size: 7px; }
.agent-node--cache { top: 48px; left: 38px; }
.agent-node--memory { bottom: 40px; left: 38px; }
.agent-node--retrieval { top: 48px; right: 38px; }
.agent-node--inference { right: 38px; bottom: 40px; }
.agent-node--state { bottom: 12px; left: 420px; }
@media (prefers-reduced-motion: reduce) { .agent-path__lines path, .agent-node { transition: none; } }
</style>
