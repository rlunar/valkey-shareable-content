<script setup>
// Multi-AZ Valkey: lose a zone, promote a replica, and fail open to the origin in between.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, flow, particle, pill, gauge, tr, text, line } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 384

const steps = [
  { label: 'LISTO', detail: 'Una instancia primaria en la zona de disponibilidad a recibe lecturas y escrituras. Las réplicas de las zonas de disponibilidad b y c replican cada cambio. La aplicación protege las llamadas a la caché con fail open.' },
  { label: '1 \u00B7 ESTADO ESTABLE', detail: 'Los aciertos se atienden desde la instancia primaria en mucho menos de un milisegundo. El origen solo recibe fallos de caché.' },
  { label: '2 \u00B7 CAE LA ZONA DE DISPONIBILIDAD a', detail: 'Una falla eléctrica o de red, o un despliegue defectuoso, hace que la instancia primaria deje de responder. Las llamadas a la caché vencen tras un tiempo de espera breve configurado a propósito.', tone: 'red' },
  { label: '3 \u00B7 FAIL OPEN', detail: 'La aplicación maneja los tiempos de espera y la función de carga consulta el origen. Los usuarios ven lentitud, no una caída. Hay que proteger el origen durante el failover; se explica en la siguiente diapositiva.', tone: 'red' },
  { label: '4 \u00B7 RÉPLICA PROMOVIDA', detail: 'En segundos, la réplica de la zona de disponibilidad b se convierte en la nueva instancia primaria y la réplica restante la sigue. Los datos ya estaban ahí.' },
  { label: '5 \u00B7 RECUPERADO', detail: 'Los clientes se reconectan a la nueva instancia primaria, se reanudan los aciertos y el origen vuelve a recibir solo fallos de caché. La instancia de la zona de disponibilidad a regresa luego como réplica.' },
]

let s = null
let lastStep = -1

function azBox(root, x, y, w, h, label) {
  const g = root.append('g')
  const rect = g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h).attr('rx', 4).attr('fill', 'none').attr('stroke', VK.mist).attr('stroke-dasharray', '6 5').attr('stroke-width', 1.5)
  const t = text(g, x + 10, y + 15, label, { size: 10, color: VK.muted, mono: true, weight: 800 })
  return {
    setState(state) {
      tr(rect, 300).attr('stroke', state === 'down' ? VK.red : state === 'good' ? VK.blue : VK.mist).attr('fill', state === 'down' ? VK.redFill : 'none')
      t.attr('fill', state === 'down' ? VK.red : state === 'good' ? VK.blue : VK.muted)
    },
  }
}

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  addMarkers(svg, 'fo')
  const root = svg.append('g')

  const app = card(root, { x: 40, y: 146, w: 190, h: 92, eyebrow: 'APLICACIÓN', label: 'Cliente de caché', status: 'protección fail open', id: 'app' })
  const zoneA = azBox(root, 430, 10, 222, 106, 'ZONA DE DISPONIBILIDAD a')
  const zoneB = azBox(root, 430, 136, 222, 106, 'ZONA DE DISPONIBILIDAD b')
  const zoneC = azBox(root, 430, 262, 222, 106, 'ZONA DE DISPONIBILIDAD c')
  const primary = card(root, { x: 446, y: 32, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 PRIMARIA', label: 'Lecturas + escrituras', status: 'todas las claves en memoria', valkey: true, id: 'a' })
  const replicaB = card(root, { x: 446, y: 158, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 RÉPLICA', label: 'Sigue a la primaria', status: 'promoción ante una falla', valkey: true, id: 'b' })
  const replicaC = card(root, { x: 446, y: 284, w: 190, h: 76, eyebrow: 'VALKEY \u00B7 RÉPLICA', label: 'Sigue a la primaria', status: 'más capacidad de lectura', valkey: true, id: 'c' })
  const db = card(root, { x: 850, y: 146, w: 190, h: 92, eyebrow: 'BASE DE DATOS', label: 'Origen', status: 'solo fallos de caché', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 850, 250, 190, 10)
  const dbReadout = text(root, 945, 278, '160 lecturas / s', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  const toPrimary = flow(root, line({ x: app.right.x, y: app.right.y - 24 }, { x: primary.left.x, y: primary.left.y + 10 }), { tone: 'blue', prefix: 'fo' })
  const toB = flow(root, line({ x: app.right.x, y: app.right.y }, { x: replicaB.left.x, y: replicaB.left.y }), { tone: 'blue', prefix: 'fo' })
  const replAB = flow(root, line({ x: primary.bottom.x, y: primary.bottom.y }, { x: replicaB.top.x, y: replicaB.top.y }), { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const replBC = flow(root, line({ x: replicaB.bottom.x, y: replicaB.bottom.y }, { x: replicaC.top.x, y: replicaC.top.y }), { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const replAC = flow(root, `M ${primary.right.x} ${primary.right.y + 20} C 700 120, 700 290, ${replicaC.right.x} ${replicaC.right.y}`, { tone: 'purple', prefix: 'fo', width: 2, dashed: true })
  const fallback = flow(root, `M ${app.bottom.x} ${app.bottom.y} L ${app.bottom.x} 376 L ${db.bottom.x} 376 L ${db.bottom.x} ${db.bottom.y + 2}`, { tone: 'red', prefix: 'fo' })
  const misses = flow(root, line({ x: primary.right.x, y: primary.right.y - 12 }, { x: db.left.x, y: db.left.y - 30 }), { tone: 'red', prefix: 'fo', width: 2 })
  const missesB = flow(root, line({ x: replicaB.right.x, y: replicaB.right.y - 12 }, { x: db.left.x, y: db.left.y - 12 }), { tone: 'red', prefix: 'fo', width: 2 })

  const readPill = pill(root, 330, 118, 'GET / SET \u00B7 < 1 ms', { tone: 'blue' })
  const timeoutPill = pill(root, 330, 118, 'tiempo límite: 50 ms', { tone: 'red' })
  const fallbackPill = pill(root, 540, 376, 'fail open: carga desde el origen', { tone: 'red' })
  const promotePill = pill(root, 745, 150, 'promovida en segundos', { tone: 'blue' })
  const replPill = pill(root, 598, 252, 'replicación', { tone: 'purple' })

  s = { root, app, zoneA, zoneB, zoneC, primary, replicaB, replicaC, db, dbGauge, dbReadout, toPrimary, toB, replAB, replBC, replAC, fallback, misses, missesB, readPill, timeoutPill, fallbackPill, promotePill, replPill }
}

async function animate(step) {
  if (step === 1) {
    await particle(s.root, s.toPrimary.node, { tone: 'blue' })
    particle(s.root, s.replAB.node, { tone: 'purple', r: 4 })
    await particle(s.root, s.replAC.node, { tone: 'purple', r: 4 })
  }
  if (step === 3) await particle(s.root, s.fallback.node, { tone: 'red', duration: 1100 })
  if (step === 4) await particle(s.root, s.replBC.node, { tone: 'purple', r: 4 })
  if (step === 5) await particle(s.root, s.toB.node, { tone: 'blue' })
}

function apply(step) {
  if (!s) return
  const lost = step >= 2
  const promoted = step >= 4
  const recovered = step >= 5
  s.zoneA.setState(lost ? 'down' : 'idle')
  s.zoneB.setState(promoted ? 'good' : 'idle')
  s.zoneC.setState('idle')
  s.primary.setState(lost ? 'down' : step === 1 ? 'current' : 'idle')
  s.primary.setStatus(lost ? (recovered ? 'vuelve después como réplica' : 'inaccesible') : 'todas las claves en memoria', lost && !recovered ? VK.red : VK.muted)
  s.primary.setEyebrow(lost ? 'VALKEY \u00B7 CAÍDA' : 'VALKEY \u00B7 PRIMARIA', lost ? VK.red : VK.purple)
  s.replicaB.setEyebrow(promoted ? 'VALKEY \u00B7 NUEVA PRIMARIA' : 'VALKEY \u00B7 RÉPLICA', promoted ? VK.blue : VK.purple)
  s.replicaB.setLabel(promoted ? 'Lecturas + escrituras' : 'Sigue a la primaria')
  s.replicaB.setStatus(promoted ? 'mismos datos, ya disponibles' : 'promoción ante una falla', promoted ? VK.blue : VK.muted)
  s.replicaB.setState(promoted ? (recovered ? 'current' : 'good') : 'idle')
  s.replicaC.setStatus(promoted ? 'sigue a la nueva primaria' : 'más capacidad de lectura')
  s.app.setStatus(step === 3 ? 'tiempo agotado, usa el origen' : step === 2 ? 'tiempo de espera agotado' : 'protección fail open', step === 2 || step === 3 ? VK.red : VK.muted)
  s.app.setState(step >= 1 ? 'current' : 'idle')

  s.toPrimary.setState(step === 1 ? 'current' : lost ? (recovered ? 'hidden' : 'broken') : step >= 1 ? 'active' : 'hidden')
  s.toB.setState(recovered ? 'current' : 'hidden')
  s.replAB.setState(step >= 1 && !lost ? 'active' : lost ? 'hidden' : 'hidden')
  s.replAC.setState(step >= 1 && !lost ? 'active' : 'hidden')
  s.replBC.setState(promoted ? (step === 4 ? 'current' : 'active') : 'hidden')
  s.fallback.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.misses.setState(step >= 1 && !lost ? 'active' : 'hidden')
  s.missesB.setState(recovered ? 'active' : 'hidden')

  s.readPill.setState(step === 1 ? 'current' : step >= 1 && !lost ? 'active' : 'hidden')
  s.timeoutPill.setState(step === 2 ? 'current' : step === 3 ? 'active' : 'hidden')
  s.fallbackPill.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  s.promotePill.setState(step === 4 ? 'current' : step > 4 ? 'active' : 'hidden')
  s.replPill.setState(step === 1 ? 'current' : step >= 1 && (!lost || promoted) ? 'active' : 'hidden')

  if (step === 3 || step === 4) {
    s.dbGauge.set(0.72, { tone: 'red' })
    s.dbReadout.text('todas las lecturas llegan aquí \u00B7 limita la tasa').attr('fill', VK.red)
    s.db.setState('warn')
    s.db.setStatus('lento, pero disponible', VK.red)
  } else if (step >= 1) {
    s.dbGauge.set(0.04, { tone: 'blue' })
    s.dbReadout.text('160 lecturas / s \u00B7 solo fallos de caché').attr('fill', VK.blue)
    s.db.setState('idle')
    s.db.setStatus('solo fallos de caché')
  } else {
    s.dbGauge.set(0)
    s.dbReadout.text('160 lecturas / s').attr('fill', VK.muted)
    s.db.setState('idle')
  }
  if (step === lastStep + 1) animate(step)
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="failover">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Failover multizona de Valkey: se pierde la instancia primaria en la zona de disponibilidad a, la aplicación aplica fail open y consulta la base de datos, se promueve la réplica de la zona de disponibilidad b y se recupera el tráfico" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.failover { width: 100%; }
.failover .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
