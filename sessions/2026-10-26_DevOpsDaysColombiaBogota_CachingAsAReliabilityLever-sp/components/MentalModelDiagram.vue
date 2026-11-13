<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, addMarkers, card, arc, flow, particle, pill, tr, text } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 336

const steps = [
  { label: 'EL MODELO', detail: 'Una capa rápida se ubica frente a la dependencia costosa. Cada lectura la consulta primero.' },
  { label: '1 \u00B7 CONSULTAR', detail: 'El cliente consulta la clave en la caché. La operación en memoria tarda mucho menos de un milisegundo.' },
  { label: '2 \u00B7 ACIERTO', detail: 'Si encuentra la clave, la caché devuelve la respuesta directamente. El acierto es rápido y económico, y el origen no recibe la consulta.' },
  { label: '3 \u00B7 FALLO', detail: 'Si no encuentra la clave, la caché consulta el origen una vez, guarda la respuesta y la devuelve.' },
  { label: '4 \u00B7 LA APUESTA', detail: 'Costo esperado = tasa de aciertos \u00D7 económico + tasa de fallos \u00D7 costoso. Controlas la probabilidad (tasa de aciertos) y el riesgo (obsolescencia).' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'mm')
  const root = svg.append('g')

  const client = card(root, { x: 40, y: 96, w: 190, h: 92, eyebrow: 'CLIENTE', label: 'Solicitud', status: 'web, API, proceso', id: 'client' })
  const cache = card(root, { x: 445, y: 96, w: 190, h: 92, eyebrow: 'VALKEY', label: 'Ruta rápida', status: 'memoria, sub-ms', valkey: true, id: 'cache' })
  const origin = card(root, { x: 850, y: 96, w: 190, h: 92, eyebrow: 'ORIGEN', label: 'Ruta costosa', status: 'base de datos o modelo', id: 'origin' })

  const ask = flow(root, arc({ x: client.right.x, y: client.right.y - 18 }, { x: cache.left.x, y: cache.left.y - 18 }, -52), { tone: 'blue', prefix: 'mm' })
  const hit = flow(root, arc({ x: cache.left.x, y: cache.left.y + 20 }, { x: client.right.x, y: client.right.y + 20 }, 52), { tone: 'blue', prefix: 'mm' })
  const miss = flow(root, arc({ x: cache.right.x, y: cache.right.y - 18 }, { x: origin.left.x, y: origin.left.y - 18 }, -52), { tone: 'red', prefix: 'mm' })
  const fill = flow(root, arc({ x: origin.left.x, y: origin.left.y + 20 }, { x: cache.right.x, y: cache.right.y + 20 }, 52), { tone: 'red', prefix: 'mm' })

  const askPill = pill(root, 337, 50, 'GET key')
  const hitPill = pill(root, 337, 206, 'ACIERTO \u00B7 ~0.5 ms \u00B7 económico', { tone: 'blue' })
  const missPill = pill(root, 742, 50, 'FALLO \u00B7 calcular una vez', { tone: 'red' })
  const fillPill = pill(root, 742, 206, 'SET + TTL \u00B7 8 ms o 3 s', { tone: 'red' })

  // The bet: expected cost bars for a 90% hit ratio.
  const bet = root.append('g').attr('opacity', 0).attr('transform', 'translate(40,230)')
  bet.append('rect').attr('width', 1000).attr('height', 90).attr('fill', VK.cream).attr('stroke', VK.mist)
  bet.append('rect').attr('width', 5).attr('height', 90).attr('fill', VK.blue)
  text(bet, 22, 24, 'COSTO ESPERADO POR LECTURA \u00B7 EJEMPLO DE CACHÉ', { size: 10, color: VK.blue, weight: 800, mono: true })
  text(bet, 22, 50, '0.90 \u00D7 0.5 ms  +  0.10 \u00D7 8.5 ms  =  1.3 ms promedio  (antes 8 ms)', { size: 16, color: VK.purple, weight: 800, mono: true })
  text(bet, 560, 24, 'DOS VARIABLES QUE CONTROLAS', { size: 10, color: VK.red, weight: 800, mono: true })
  text(bet, 560, 50, 'probabilidad: tasa de aciertos', { size: 13, color: VK.black, weight: 600 })
  text(bet, 560, 72, 'riesgo: obsolescencia, limitada por TTL e invalidación', { size: 13, color: VK.black, weight: 600 })
  bet.append('rect').attr('x', 22).attr('y', 62).attr('width', 500).attr('height', 8).attr('rx', 4).attr('fill', VK.mist)
  const barHit = bet.append('rect').attr('x', 22).attr('y', 62).attr('width', 0).attr('height', 8).attr('rx', 4).attr('fill', VK.blue)
  const barMiss = bet.append('rect').attr('x', 22 + 450).attr('y', 62).attr('width', 0).attr('height', 8).attr('fill', VK.red)
  text(bet, 22 + 225, 83, '90% de aciertos', { size: 9, color: VK.blue, mono: true, anchor: 'middle' })
  text(bet, 22 + 475, 83, '10% de fallos', { size: 9, color: VK.red, mono: true, anchor: 'middle' })

  scene = { client, cache, origin, ask, hit, miss, fill, askPill, hitPill, missPill, fillPill, bet, barHit, barMiss, root }
}

async function animate(step) {
  const s = scene
  if (step === 1) await particle(s.root, s.ask.node, { tone: 'blue' })
  if (step === 2) await particle(s.root, s.hit.node, { tone: 'blue' })
  if (step === 3) {
    await particle(s.root, s.miss.node, { tone: 'red', duration: 900 })
    await particle(s.root, s.fill.node, { tone: 'red', duration: 900 })
    await particle(s.root, s.hit.node, { tone: 'blue' })
  }
}

function apply(step) {
  if (!scene) return
  const s = scene
  const state = (index, persistent = true) => (step >= index ? (step === index ? 'current' : persistent ? 'active' : 'hidden') : 'hidden')
  s.ask.setState(state(1))
  s.hit.setState(step === 2 || step === 3 ? 'current' : step > 3 ? 'active' : 'hidden')
  s.miss.setState(state(3))
  s.fill.setState(state(3))
  s.askPill.setState(state(1))
  s.hitPill.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden')
  s.missPill.setState(state(3))
  s.fillPill.setState(state(3))
  s.client.setState(step === 0 || step === 1 || step === 2 ? 'current' : 'idle')
  s.cache.setState([1, 2, 3].includes(step) ? 'current' : step === 4 ? 'good' : 'idle')
  s.origin.setState(step === 3 ? 'down' : 'idle')
  s.origin.setStatus(step === 3 ? 'lento y costoso' : 'base de datos o modelo', step === 3 ? VK.red : VK.muted)
  tr(s.bet, 360).attr('opacity', step >= 4 ? 1 : 0)
  tr(s.barHit, 700).attr('width', step >= 4 ? 450 : 0)
  tr(s.barMiss, 700).attr('width', step >= 4 ? 50 : 0)
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="mental-model">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Cliente, caché y origen: los aciertos regresan desde la caché; ante un fallo, se consulta el origen una vez y se almacena la respuesta" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.mental-model { width: 100%; }
.mental-model .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
