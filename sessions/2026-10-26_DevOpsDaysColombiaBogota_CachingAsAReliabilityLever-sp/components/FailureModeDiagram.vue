<script setup>
// Stampede, penetration and avalanche, each as a click-driven trace with a database load gauge.
import { computed, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_CODE, addMarkers, card, flow, particle, pill, gauge, tr, text, line, arc } from './diagram-kit.js'

const props = defineProps({
  mode: { type: String, default: 'stampede' },
  step: { type: Number, default: 0 },
})
const svgRef = ref(null)
const W = 1080
const H = 330
const CLIENTS = 12

const specs = {
  stampede: {
    valkey: { eyebrow: 'VALKEY', label: 'Clave caliente', status: 'product:42 \u00B7 v1 \u00B7 TTL 300 s' },
    steps: [
      { label: 'LISTO', detail: 'Una clave caliente, muchos lectores simultáneos. Mientras la clave está vigente, el origen permanece inactivo.' },
      { label: '1 \u00B7 ACIERTOS', detail: '12 lectores, 12 aciertos. Cero consultas a la base de datos.' },
      { label: '2 \u00B7 LA CLAVE EXPIRA', detail: 'El TTL vence en el momento de mayor carga. Las siguientes 12 lecturas no encuentran la clave, todas a la vez.' },
      { label: '3 \u00B7 ESTAMPIDA', detail: 'Cada lector ejecuta al mismo tiempo la misma consulta costosa contra el origen. 12 respuestas idénticas, calculadas 12 veces.', tone: 'red' },
      { label: '4 \u00B7 SOLUCIÓN: SINGLE-FLIGHT', detail: 'La primera solicitud que falla en caché obtiene un bloqueo breve (SET lock:key NX EX 10) y recalcula. Las demás esperan unos milisegundos y leen el valor repuesto. 1 consulta, no 12.' },
    ],
  },
  penetration: {
    valkey: { eyebrow: 'VALKEY', label: 'Caché', status: 'contiene claves existentes' },
    steps: [
      { label: 'LISTO', detail: 'Llegan solicitudes para product:999, que no existe. Enlaces rotos, rastreadores o un atacante que adivina identificadores.' },
      { label: '1 \u00B7 FALLO DE CACHÉ', detail: 'La caché no tiene una entrada; la base de datos responde "no such row" y no se almacena nada. La siguiente solicitud repite el recorrido.' },
      { label: '2 \u00B7 SIEMPRE', detail: 'Las claves inexistentes pasan de largo por la caché en cada solicitud. 12 solicitudes, 12 consultas al origen, para siempre.', tone: 'red' },
      { label: '3 \u00B7 SOLUCIÓN A: CACHÉ NEGATIVA', detail: 'Guarda el resultado negativo con un TTL corto: product:999 = nothing, 60 s. Las repeticiones terminan en la caché.' },
      { label: '4 \u00B7 SOLUCIÓN B: FILTRO DE BLOOM', detail: 'Un filtro compacto antes de la caché responde "definitivamente no está aquí" sin tocar la caché ni el origen. Puede haber falsos positivos, pero nunca falsos negativos.' },
    ],
  },
  avalanche: {
    valkey: { eyebrow: 'VALKEY', label: 'Conjunto de trabajo', status: '24 claves \u00B7 mismo TTL' },
    steps: [
      { label: 'LISTO', detail: 'La caché contiene todo el conjunto de trabajo, cargado por un despliegue al mismo tiempo y con el mismo TTL.' },
      { label: '1 \u00B7 OLA DE EXPIRACIÓN', detail: 'Todas las claves expiran en el mismo segundo. O cae un nodo y se las lleva.', tone: 'red' },
      { label: '2 \u00B7 AVALANCHA', detail: 'El origen recibe de golpe las solicitudes de todo el conjunto de trabajo debido a los fallos de caché. Es la cascada del inicio, disparada por la propia caché.', tone: 'red' },
      { label: '3 \u00B7 SOLUCIÓN: TTL VARIABLE + RÉPLICAS', detail: 'Variar el TTL distribuye las recargas durante varios minutos. Una réplica en otra zona de disponibilidad toma el control si se pierde un nodo; así, las claves no desaparecen juntas.' },
      { label: '4 \u00B7 SOLUCIÓN: LÍMITE EN EL ORIGEN', detail: 'Limita las recargas simultáneas en el origen. Así, una caché fría hace más lento el sistema, pero no lo derriba.' },
    ],
  },
}

const modeNames = {
  stampede: 'estampida',
  penetration: 'penetración',
  avalanche: 'avalancha',
}
const spec = computed(() => specs[props.mode] || specs.stampede)
const steps = computed(() => spec.value.steps)
const ariaLabel = computed(() => `Falla animada de caché: ${modeNames[props.mode] || modeNames.stampede} y su solución`)
let built = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const prefix = `fm-${props.mode}`
  addMarkers(svg, prefix)
  const root = svg.append('g')

  // Clients column.
  const clientX = 70
  const clientYs = d3.range(CLIENTS).map((i) => 46 + i * 21)
  text(root, clientX, 24, '12 LECTORES SIMULTÁNEOS', { size: 10, color: VK.purple, weight: 800, mono: true, anchor: 'middle' })
  const clients = clientYs.map((y) => root.append('circle').attr('cx', clientX).attr('cy', y).attr('r', 6).attr('fill', VK.white).attr('stroke', VK.purple).attr('stroke-width', 2))

  const valkey = card(root, { x: 420, y: 118, w: 200, h: 92, ...spec.value.valkey, valkey: true, id: 'valkey' })
  const db = card(root, { x: 850, y: 118, w: 200, h: 92, eyebrow: 'BASE DE DATOS', label: 'Origen', status: '0 consultas', glyph: 'db', id: 'db' })
  const dbGauge = gauge(root, 850, 222, 200, 10)
  const dbReadout = text(root, 950, 250, '0 consultas / s', { size: 11, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })

  // Fan-in from clients to the cache, and the cache-to-origin trunk.
  const fanTarget = { x: valkey.left.x, y: valkey.left.y }
  const fanPaths = clientYs.map((y) => flow(root, arc({ x: clientX + 8, y }, fanTarget, 0), { tone: 'blue', prefix, width: 1.5 }))
  const trunk = flow(root, line({ x: valkey.right.x, y: valkey.right.y - 10 }, { x: db.left.x, y: db.left.y - 10 }), { tone: 'red', prefix, width: 3 })
  const trunkBack = flow(root, line({ x: db.left.x, y: db.left.y + 14 }, { x: valkey.right.x, y: valkey.right.y + 14 }), { tone: 'red', prefix, width: 2 })
  const trunkPill = pill(root, 735, 128, '', { tone: 'red' })
  const fixPill = pill(root, 520, 76, '', { tone: 'blue' })

  // Mode-specific extras.
  const extras = {}
  if (props.mode === 'stampede') {
    extras.waiting = d3.range(CLIENTS - 1).map((i) => root.append('circle').attr('cx', 360 + (i % 4) * 14).attr('cy', 150 + Math.floor(i / 4) * 14).attr('r', 5).attr('fill', VK.blue).attr('stroke', VK.white).attr('stroke-width', 1.5).attr('opacity', 0))
    extras.waitLabel = text(root, 380, 220, 'espera ~5 ms', { size: 9, color: VK.blue, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }
  if (props.mode === 'penetration') {
    extras.bloom = card(root, { x: 200, y: 118, w: 150, h: 92, eyebrow: 'FILTRO DE BLOOM', label: 'Definitivamente no', status: 'bits: ausente', id: 'bloom' })
    extras.bloom.show(false)
    extras.rejected = text(root, 275, 236, '12 de 12 rechazadas en el filtro', { size: 10, color: VK.purple, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }
  if (props.mode === 'avalanche') {
    const grid = root.append('g').attr('transform', 'translate(428,226)')
    extras.keys = d3.range(24).map((i) => grid.append('rect').attr('x', (i % 12) * 16).attr('y', Math.floor(i / 12) * 16).attr('width', 13).attr('height', 13).attr('rx', 2).attr('fill', VK.blue))
    extras.keysLabel = text(root, 520, 274, 'conjunto de trabajo', { size: 9, color: VK.muted, mono: true, anchor: 'middle', weight: 700 })
    extras.replica = card(root, { x: 440, y: 20, w: 200, h: 80, eyebrow: 'VALKEY \u00B7 RÉPLICA', label: 'Zona de disponibilidad b', status: 'se promueve si cae el nodo', valkey: true, id: 'replica' })
    extras.replica.show(false)
    extras.limiter = root.append('g').attr('opacity', 0).attr('transform', 'translate(700,154)')
    extras.limiter.append('rect').attr('x', -14).attr('y', -14).attr('width', 28).attr('height', 28).attr('rx', 4).attr('fill', VK.white).attr('stroke', VK.purple).attr('stroke-width', 2)
    extras.limiter.append('path').attr('d', 'M-8 0 h4 l3 -6 l3 12 l3 -6 h3').attr('fill', 'none').attr('stroke', VK.purple).attr('stroke-width', 2)
    extras.limiterLabel = text(root, 735, 200, 'máx. 8 recargas simultáneas', { size: 9, color: VK.purple, mono: true, anchor: 'middle', weight: 700, opacity: 0 })
  }

  built = { root, clients, fanPaths, trunk, trunkBack, trunkPill, fixPill, valkey, db, dbGauge, dbReadout, extras, prefix }
}

function setDb(load, label, tone) {
  built.dbGauge.set(load, { tone })
  built.dbReadout.text(label).attr('fill', tone === 'red' ? VK.red : tone === 'blue' ? VK.blue : VK.muted)
  built.db.setStatus(label, tone === 'red' ? VK.red : VK.muted)
  built.db.setState(load >= 0.9 ? 'down' : load > 0 ? 'current' : 'idle')
}

async function fanIn(tone, through, count = CLIENTS) {
  const b = built
  const runs = b.fanPaths.slice(0, count).map((f, i) => new Promise((r) => setTimeout(() => particle(b.root, f.node, { tone, duration: 520, r: 5 }).then(r), i * 45)))
  await Promise.all(runs)
  if (through) {
    await particle(b.root, b.trunk.node, { tone: 'red', duration: 500 })
    await particle(b.root, b.trunkBack.node, { tone: 'red', duration: 500 })
  }
}

function applyStampede(step, animate) {
  const b = built
  const { extras: e } = b
  b.fanPaths.forEach((f) => f.setState(step >= 1 ? (step === 1 || step === 3 ? 'current' : 'active') : 'hidden'))
  b.trunk.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.trunkBack.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.valkey.setStatus(step >= 4 ? 'product:42 \u00B7 v2 \u00B7 TTL 300 s' : step >= 2 ? 'product:42 \u00B7 EXPIRADA' : 'product:42 \u00B7 v1 \u00B7 TTL 300 s', step >= 4 ? VK.blue : step >= 2 ? VK.red : VK.blue)
  b.valkey.setState(step === 2 || step === 3 ? 'warn' : step >= 1 ? 'current' : 'idle')
  b.trunkPill.setText(step === 3 ? '12 consultas idénticas a la vez' : '1 consulta, 11 esperan')
  b.trunkPill.setState(step === 3 ? 'current' : step === 4 ? 'active' : 'hidden')
  b.fixPill.setText('SET lock:product:42 1 NX EX 10')
  b.fixPill.setState(step >= 4 ? 'current' : 'hidden')
  e.waiting.forEach((w, i) => tr(w, 300 + i * 30).attr('opacity', step === 4 ? 1 : 0))
  tr(e.waitLabel, 300).attr('opacity', step === 4 ? 1 : 0)
  if (step === 3) setDb(1.2, '12 consultas \u00B7 p99 en aumento', 'red')
  else if (step === 4) setDb(1 / 12, '1 consulta', 'blue')
  else setDb(0, '0 consultas', 'muted')
  if (animate && step === 1) fanIn('blue', false)
  if (animate && step === 3) fanIn('red', true)
  if (animate && step === 4) particle(b.root, b.fanPaths[0].node, { tone: 'blue', duration: 500 }).then(() => particle(b.root, b.trunk.node, { tone: 'blue', duration: 500 })).then(() => particle(b.root, b.trunkBack.node, { tone: 'blue', duration: 500 }))
}

function applyPenetration(step, animate) {
  const b = built
  const { extras: e } = b
  const blocked = step >= 4
  b.fanPaths.forEach((f) => f.setState(blocked ? 'faded' : step >= 1 ? (step === 1 ? 'current' : 'active') : 'hidden'))
  b.trunk.setState(step === 1 || step === 2 ? 'current' : step >= 3 ? 'faded' : 'hidden')
  b.trunkBack.setState(step === 1 || step === 2 ? 'current' : step >= 3 ? 'faded' : 'hidden')
  b.trunkPill.setText(step === 2 ? 'cada solicitud llega al origen' : 'SELECT ... = no row')
  b.trunkPill.setState(step === 1 || step === 2 ? 'current' : 'hidden')
  b.valkey.setStatus(step >= 3 ? 'product:999 = nothing \u00B7 TTL 60 s' : step >= 1 ? 'sin entrada, nada almacenado' : 'contiene claves existentes', step >= 3 ? VK.blue : step >= 1 ? VK.red : VK.muted)
  b.valkey.setState(blocked ? 'faded' : step === 3 ? 'good' : step >= 1 ? 'current' : 'idle')
  b.fixPill.setText('caché negativa: 12 de 12 terminan aquí')
  b.fixPill.setState(step === 3 ? 'current' : 'hidden')
  e.bloom.show(blocked)
  e.bloom.setState(blocked ? 'good' : 'idle')
  tr(e.rejected, 300).attr('opacity', blocked ? 1 : 0)
  if (step === 1) setDb(1 / 12, '1 consulta, nada en caché', 'red')
  else if (step === 2) setDb(1.2, '12 de 12 llegan al origen', 'red')
  else setDb(0, '0 consultas', 'muted')
  if (animate && step === 1) particle(b.root, b.fanPaths[0].node, { tone: 'red', duration: 500 }).then(() => particle(b.root, b.trunk.node, { tone: 'red', duration: 500 })).then(() => particle(b.root, b.trunkBack.node, { tone: 'red', duration: 500 }))
  if (animate && step === 2) fanIn('red', true)
  if (animate && step === 3) fanIn('blue', false)
}

function applyAvalanche(step, animate) {
  const b = built
  const { extras: e } = b
  b.fanPaths.forEach((f) => f.setState(step === 2 ? 'current' : step > 2 ? 'active' : 'hidden'))
  b.trunk.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.trunkBack.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.trunkPill.setText(step === 2 ? 'todo el conjunto genera fallos de caché' : step >= 4 ? 'recargas limitadas: lento, disponible' : 'recargas distribuidas en minutos')
  b.trunkPill.setState(step === 2 ? 'current' : step >= 3 ? 'active' : 'hidden')
  b.valkey.setStatus(step === 1 || step === 2 ? '24 claves \u00B7 TODAS EXPIRADAS' : step >= 3 ? '24 claves \u00B7 TTL 300 \u00B1 60 s' : '24 claves \u00B7 mismo TTL', step === 1 || step === 2 ? VK.red : step >= 3 ? VK.blue : VK.muted)
  b.valkey.setState(step === 1 || step === 2 ? 'warn' : step >= 3 ? 'good' : 'idle')
  const rng = d3.randomLcg(3)
  const pattern = d3.range(24).map(() => rng() > 0.45)
  e.keys.forEach((k, i) => tr(k, 300 + i * 20).attr('fill', step === 1 || step === 2 ? VK.mist : step >= 3 ? (pattern[i] ? VK.blue : VK.mist) : VK.blue))
  e.replica.show(step >= 3)
  e.replica.setState(step >= 3 ? 'good' : 'idle')
  tr(e.limiter, 300).attr('opacity', step >= 4 ? 1 : 0)
  tr(e.limiterLabel, 300).attr('opacity', step >= 4 ? 1 : 0)
  b.fixPill.setText('TTL variable + réplica multizona')
  b.fixPill.setState(step >= 3 ? (step === 3 ? 'current' : 'active') : 'hidden')
  if (step === 2) setDb(1.3, 'todo el conjunto a la vez', 'red')
  else if (step === 3) setDb(0.45, 'recargas distribuidas', 'blue')
  else if (step === 4) setDb(0.33, 'máximo 8 recargas simultáneas', 'blue')
  else setDb(0, '0 consultas', 'muted')
  if (animate && step === 2) fanIn('red', true)
  if (animate && step === 3) fanIn('blue', true, 5)
}

function apply(step) {
  if (!built) return
  const bounded = Math.min(Math.max(step, 0), steps.value.length - 1)
  const animate = bounded === lastStep + 1
  if (props.mode === 'stampede') applyStampede(bounded, animate)
  else if (props.mode === 'penetration') applyPenetration(bounded, animate)
  else applyAvalanche(bounded, animate)
  lastStep = bounded
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
watch(() => props.mode, () => { build(); lastStep = -1; apply(props.step) })
</script>

<template>
  <div class="failure-mode">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="ariaLabel" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.failure-mode { width: 100%; }
.failure-mode .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
