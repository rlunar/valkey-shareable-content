<script setup>
// Closing numbers: each tile counts up when its click arrives.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })

const tiles = [
  { key: 'db', value: 55, suffix: '%', eyebrow: 'COSTO DE BASE DE DATOS', title: 'menos para datos de lectura frecuente', note: 'Se logra con la tasa de aciertos y el dimensionamiento adecuado. Mide antes de reducir la capacidad.', tone: 'red' },
  { key: 'ai', value: 86, suffix: '%', eyebrow: 'COSTO DE INFERENCIA', title: 'menos con caché semántica', note: 'Evaluación de AWS: 63,796 consultas, umbral 0.75, 91% de exactitud.', tone: 'blue' },
  { key: 'lat', value: 88, suffix: '%', eyebrow: 'LATENCIA', title: 'menos de extremo a extremo en respuestas de IA', note: 'Hasta 59x más rápido en un solo acierto: los segundos bajan a cientos de milisegundos.', tone: 'blue' },
  { key: 'infra', value: 45, suffix: '%', eyebrow: 'INFRAESTRUCTURA', title: 'menos en el costo de la capa de caché en Amazon Ads', note: 'Valkey 8 en Graviton, 12% más capacidad de procesamiento, cero tiempo de inactividad.', tone: 'purple' },
  { key: 'pages', value: 3, suffix: ' AM', eyebrow: 'PARA SRE Y DEVOPS', title: 'menos alertas a esta hora', note: 'El pico se detiene en la caché: sin agotar el grupo de conexiones, sin tormenta de reintentos y sin alertas nocturnas.', tone: 'purple', static: true },
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
