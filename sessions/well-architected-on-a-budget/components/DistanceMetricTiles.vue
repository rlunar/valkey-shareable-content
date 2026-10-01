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
  <div class="metric-grid">
    <article class="metric-card" :class="{ 'is-visible': visible >= 1 }">
      <div class="metric-card__head"><span>L2</span><strong>Euclidean</strong></div>
      <svg viewBox="0 0 260 150" role="img" aria-label="Euclidean distance shown as a straight line between two points">
        <line class="axis" x1="35" y1="122" x2="230" y2="122" />
        <line class="axis" x1="35" y1="122" x2="35" y2="24" />
        <line class="measure" x1="75" y1="98" x2="205" y2="42" />
        <circle class="point point--a" cx="75" cy="98" r="8" />
        <circle class="point point--b" cx="205" cy="42" r="8" />
        <text x="58" y="88">A</text><text x="214" y="37">B</text><text class="formula" x="112" y="58">d(A,B)</text>
      </svg>
      <p>Straight-line separation. Scale and magnitude both matter.</p>
      <code>lower distance = closer</code>
    </article>

    <article class="metric-card metric-card--cosine" :class="{ 'is-visible': visible >= 2 }">
      <div class="metric-card__head"><span>COSINE</span><strong>Cosine</strong></div>
      <svg viewBox="0 0 260 150" role="img" aria-label="Cosine distance shown as the angle between two vectors">
        <defs><marker id="metric-arrow-cosine" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" /></marker></defs>
        <line class="axis" x1="45" y1="122" x2="230" y2="122" />
        <line class="axis" x1="45" y1="122" x2="45" y2="20" />
        <line class="vector" x1="45" y1="122" x2="205" y2="78" marker-end="url(#metric-arrow-cosine)" />
        <line class="vector vector--second" x1="45" y1="122" x2="145" y2="35" marker-end="url(#metric-arrow-cosine)" />
        <path class="angle" d="M92 109 A50 50 0 0 0 78 87" />
        <text class="formula" x="88" y="92">θ</text>
      </svg>
      <p>Angle between vectors. Direction matters more than magnitude.</p>
      <code>lower cosine distance = closer</code>
    </article>

    <article class="metric-card metric-card--ip" :class="{ 'is-visible': visible >= 3 }">
      <div class="metric-card__head"><span>IP</span><strong>Inner product</strong></div>
      <svg viewBox="0 0 260 150" role="img" aria-label="Inner product shown as one vector projected onto another">
        <defs><marker id="metric-arrow-ip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" /></marker></defs>
        <line class="axis" x1="45" y1="122" x2="230" y2="122" />
        <line class="axis" x1="45" y1="122" x2="45" y2="20" />
        <line class="vector" x1="45" y1="122" x2="215" y2="72" marker-end="url(#metric-arrow-ip)" />
        <line class="vector vector--second" x1="45" y1="122" x2="155" y2="35" marker-end="url(#metric-arrow-ip)" />
        <line class="projection" x1="155" y1="35" x2="173" y2="84" />
        <circle class="point" cx="173" cy="84" r="5" />
        <text class="formula" x="153" y="104">A · B</text>
      </svg>
      <p>Alignment plus magnitude. Useful when vector length carries signal.</p>
      <code>larger dot product = stronger match</code>
    </article>
  </div>
</template>

<style scoped>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 27px;
}

.metric-card {
  min-height: 388px;
  padding: 20px;
  border: 1px solid #d3dde7;
  border-top: 6px solid #6983ff;
  background: #f7fbfe;
  opacity: 0.12;
  transform: translateY(10px);
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease;
}

.metric-card.is-visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: 0 12px 34px rgb(48 23 110 / 8%);
}

.metric-card--cosine { border-top-color: #e0a2af; }
.metric-card--ip { border-top-color: #30176e; }
.metric-card__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.metric-card__head span { color: #6983ff; font-family: 'Cascadia Code', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; }
.metric-card__head strong { color: #30176e; font-family: 'Open Sans', sans-serif; font-size: 22px; }
.metric-card svg { width: 100%; height: 155px; margin-top: 18px; }
.axis { stroke: #b9c3cd; stroke-width: 2; }
.measure { stroke: #6983ff; stroke-width: 4; stroke-dasharray: 7 5; }
.vector { stroke: #6983ff; stroke-width: 4; }
.vector--second { stroke: #642637; }
.angle { fill: none; stroke: #e0a2af; stroke-width: 5; }
.projection { stroke: #642637; stroke-width: 3; stroke-dasharray: 5 4; }
.point { fill: #30176e; }
.point--a { fill: #6983ff; }
.point--b { fill: #642637; }
svg text { fill: #30176e; font-family: 'Cascadia Code', monospace; font-size: 11px; font-weight: 700; }
.formula { fill: #642637; }
.metric-card p { min-height: 44px; color: #53606c; font-size: 13px; line-height: 1.45; }
.metric-card code { display: block; margin-top: 14px; padding: 7px 9px; background: #30176e !important; color: #fffdfa !important; font-family: 'Cascadia Code', monospace; font-size: 9px; }
@media (prefers-reduced-motion: reduce) { .metric-card { transition: none; } }
</style>
