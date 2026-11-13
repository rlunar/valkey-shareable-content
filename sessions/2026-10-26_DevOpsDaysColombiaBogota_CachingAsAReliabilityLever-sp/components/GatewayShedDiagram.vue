<script setup>
// No cache for a while: the edge must shed load so fail-open does not take the origin down.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, flow, particle, pill, gauge, tr, text, line, arc, countUp } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 372
const OFFERED = 8000
const DB_CAPACITY = 2000

const steps = [
  { label: 'LISTO', detail: 'Un día normal: el API gateway admite todo, el 98% de las lecturas termina en Valkey y el origen recibe 160 solicitudes por segundo.' },
  { label: '1 \u00B7 CACHÉ NO DISPONIBLE', detail: 'Ventana de failover, reinicio en frío o un cambio de configuración defectuoso. Fail open ahora envía cada lectura al origen: 8,000 req/s a una base de datos que soporta 2,000. La caída evitada entra por la puerta trasera.', tone: 'red' },
  { label: '2 \u00B7 LIMITAR EN EL BORDE', detail: 'El API gateway admite lo que el origen puede atender y rechaza el resto con 429 y Retry-After. Los usuarios reciben un rechazo rápido, sin esperar a que venza el plazo, y la base de datos sigue disponible.' },
  { label: '3 \u00B7 LA CACHÉ SE RECARGA', detail: 'Valkey vuelve sin datos. Cada fallo de caché admitido recarga una clave; así, la tasa de aciertos sube de 0 a 98% y la carga del origen baja.' },
  { label: '4 \u00B7 AMPLIAR EL LÍMITE', detail: 'Aumenta el límite a medida que se recupera la tasa de aciertos. Fail open eliminó el freno natural; el limitador lo restablece de forma deliberada.' },
]

let s = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'gw')
  const root = svg.append('g')

  const clients = card(root, { x: 30, y: 140, w: 170, h: 92, eyebrow: 'CLIENTES', label: '8,000 req/s', status: 'tráfico pico', glyph: 'users', id: 'clients' })
  const gateway = card(root, { x: 280, y: 140, w: 190, h: 92, eyebrow: 'API GATEWAY', label: 'Control de admisión', status: 'admite todo', glyph: 'gateway', id: 'gw' })
  const app = card(root, { x: 550, y: 140, w: 170, h: 92, eyebrow: 'APLICACIÓN', label: 'Cliente fail open', status: 'primero la caché', id: 'app' })
  const valkey = card(root, { x: 820, y: 22, w: 220, h: 86, eyebrow: 'VALKEY', label: 'Capa de caché', status: 'caliente \u00B7 tasa de aciertos: 98%', valkey: true, id: 'vk' })
  const db = card(root, { x: 820, y: 222, w: 220, h: 92, eyebrow: 'BASE DE DATOS', label: 'Origen', status: 'capacidad 2,000 req/s', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 820, 326, 220, 10)
  const dbReadout = text(root, 930, 354, '', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  const inbound = flow(root, line({ x: clients.right.x, y: clients.right.y - 14 }, { x: gateway.left.x, y: gateway.left.y - 14 }), { tone: 'blue', prefix: 'gw' })
  const shed = flow(root, line({ x: gateway.left.x, y: gateway.left.y + 18 }, { x: clients.right.x, y: clients.right.y + 18 }), { tone: 'red', prefix: 'gw', width: 3 })
  const admitted = flow(root, line({ x: gateway.right.x, y: gateway.right.y }, { x: app.left.x, y: app.left.y }), { tone: 'blue', prefix: 'gw' })
  const toCache = flow(root, arc({ x: app.right.x, y: app.right.y - 24 }, { x: valkey.left.x, y: valkey.left.y + 10 }, -40), { tone: 'blue', prefix: 'gw' })
  const toDb = flow(root, arc({ x: app.right.x, y: app.right.y + 24 }, { x: db.left.x, y: db.left.y - 10 }, 40), { tone: 'red', prefix: 'gw' })

  const inboundPill = pill(root, 240, 100, '8,000 req/s', { tone: 'blue' })
  const shedPill = pill(root, 240, 268, '6,000 req/s \u2192 429 + Retry-After', { tone: 'red' })
  const admittedPill = pill(root, 510, 232, 'admite todo', { tone: 'blue' })
  const cachePill = pill(root, 770, 60, 'aquí se atiende el 98% de las lecturas', { tone: 'blue' })
  const dbPill = pill(root, 760, 300, '160 req/s', { tone: 'red' })

  s = { root, clients, gateway, app, valkey, db, dbGauge, dbReadout, inbound, shed, admitted, toCache, toDb, inboundPill, shedPill, admittedPill, cachePill, dbPill }
}

async function animate(step) {
  if (step === 1) {
    await particle(s.root, s.admitted.node, { tone: 'red' })
    await particle(s.root, s.toDb.node, { tone: 'red', duration: 700 })
  }
  if (step === 2) {
    particle(s.root, s.shed.node, { tone: 'red', duration: 700 })
    await particle(s.root, s.admitted.node, { tone: 'blue' })
  }
  if (step === 3) await particle(s.root, s.toCache.node, { tone: 'blue', duration: 700 })
  if (step === 4) await particle(s.root, s.inbound.node, { tone: 'blue' })
}

function apply(step) {
  if (!s) return
  const cacheDown = step === 1 || step === 2
  const throttled = step === 2 || step === 3
  s.inbound.setState(step >= 1 ? 'active' : 'current')
  s.inboundPill.setState(step === 0 || step === 4 ? 'current' : 'active')
  s.admitted.setState(step === 1 ? 'current' : 'active')
  s.admittedPill.setText(throttled ? 'admite 2,000 req/s' : 'admite 8,000 req/s')
  s.admittedPill.setState(step === 2 || step === 4 ? 'current' : 'active')
  s.shed.setState(throttled ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.shedPill.setState(throttled ? (step === 2 ? 'current' : 'active') : 'hidden')
  s.toCache.setState(cacheDown ? 'broken' : step === 3 ? 'current' : 'active')
  s.cachePill.setText(cacheDown ? 'no disponible' : step === 3 ? 'recarga con cada fallo' : 'aquí se atiende el 98% de las lecturas')
  s.cachePill.setState(cacheDown ? 'hidden' : step === 3 ? 'current' : 'active')
  s.toDb.setState(step === 1 ? 'current' : 'active')

  s.gateway.setStatus(throttled ? 'cubo de tokens: 2,000 req/s' : 'admite todo', throttled ? VK.purple : VK.muted)
  s.gateway.setState(step === 2 ? 'current' : throttled ? 'good' : 'idle')
  s.valkey.setState(cacheDown ? 'down' : step === 3 ? 'current' : 'idle')
  if (step === 3) {
    s.valkey.setStatus('0% \u00B7 tasa de aciertos en alza', VK.blue)
    countUp(s.valkey.statusText, 98, { from: 0, duration: 1400, format: (v) => Math.round(v).toString(), suffix: '% \u00B7 tasa de aciertos en alza' })
  } else {
    s.valkey.setStatus(cacheDown ? 'caída por falla o reinicio en frío' : 'caliente \u00B7 tasa de aciertos: 98%', cacheDown ? VK.red : VK.blue)
  }
  s.app.setStatus(cacheDown ? 'fail open: todo va al origen' : 'primero la caché', cacheDown ? VK.red : VK.muted)

  const load = step === 1 ? OFFERED : step === 2 ? DB_CAPACITY : step === 3 ? 900 : 160
  const ratio = load / DB_CAPACITY
  const tone = step === 1 ? 'red' : step === 2 ? 'purple' : 'blue'
  s.dbGauge.set(ratio, { tone })
  s.dbReadout.text(step === 1 ? '8,000 req/s sobre capacidad 2,000: satura en segundos' : step === 2 ? '2,000 req/s: al límite, sin excederlo' : step === 3 ? '900 req/s y bajando' : '160 req/s: solo fallos de caché')
    .attr('fill', step === 1 ? VK.red : step === 2 ? VK.purple : VK.blue)
  s.db.setState(step === 1 ? 'down' : step === 2 ? 'warn' : 'idle')
  s.db.setStatus(step === 1 ? 'sin conexiones, se forman colas' : step === 2 ? 'ocupada pero estable' : 'capacidad 2,000 req/s', step === 1 ? VK.red : VK.muted)
  s.dbPill.setText(step === 1 ? '8,000 req/s' : step === 2 ? '2,000 req/s' : step === 3 ? '900 req/s' : '160 req/s')
  s.dbPill.setState(step === 1 ? 'current' : 'active')
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="gateway-shed">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Con la caché no disponible, el API gateway limita el tráfico para mantener la base de datos dentro de su capacidad mientras Valkey se recupera" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.gateway-shed { width: 100%; }
.gateway-shed .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
