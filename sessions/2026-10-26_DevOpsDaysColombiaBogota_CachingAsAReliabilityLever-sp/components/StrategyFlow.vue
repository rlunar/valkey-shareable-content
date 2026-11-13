<script setup>
// Click-driven request traces for the three strategies that are not cache-aside.
// Narratives follow animations/Valkey_Demo_Library (C01 cache-aside reads, C02 write-through, C04 write-back).
import { computed, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, addMarkers, card, arc, flow, particle, pill } from './diagram-kit.js'

const props = defineProps({
  scenario: { type: String, default: 'read-through' },
  step: { type: Number, default: 0 },
})
const svgRef = ref(null)
const W = 1080
const H = 320
const NODE_W = 180
const NODE_H = 92
const NODE_Y = 112
const NODE_X = [40, 320, 600, 880]

const scenes = {
  'read-through': {
    nodes: [
      { eyebrow: 'CLIENTE', label: 'Página de producto', status: 'leer producto 42' },
      { eyebrow: 'APLICACIÓN', label: 'Ruta de lectura', status: 'solo consulta la caché' },
      { eyebrow: 'VALKEY', label: 'Caché read-through', status: 'controla la consulta a BD', valkey: true },
      { eyebrow: 'BASE DE DATOS', label: 'Fuente de verdad', status: 'autoritativa', glyph: 'db' },
    ],
    steps: [
      { label: 'LISTO', detail: 'La capa de caché controla el cargador. La aplicación usa una interfaz y nunca consulta la base de datos para leer.' },
      { label: '1 \u00B7 CONSULTAR', detail: 'La aplicación consulta el producto 42 en la caché.', moves: [['f12', 'leer producto 42', 'blue'], ['f23', 'GET product:42', 'blue']], nodes: [0, 1, 2] },
      { label: '2 \u00B7 FALLO, LA CACHÉ CARGA', detail: 'La clave no existe, así que la capa de caché llama al cargador para consultar el origen. La aplicación no sabe que hubo un fallo.', moves: [['f34', 'fallo: cargador ejecuta SELECT', 'red']], nodes: [2, 3], status: { 2: ['cargando desde el origen', VK.red], 3: ['lee una vez', VK.red] } },
      { label: '3 \u00B7 LLENAR + TTL', detail: 'El valor regresa y se almacena con expiración. La vigencia depende de una política, no de una sincronización automática.', moves: [['b43', 'v1', 'red']], nodes: [2, 3], status: { 2: ['v1 \u00B7 TTL 60 s', VK.blue], 3: ['autoritativa', VK.muted] } },
      { label: '4 \u00B7 DEVOLVER', detail: 'La caché responde a la aplicación, que responde al cliente.', moves: [['b32', 'v1', 'blue'], ['b21', 'respuesta', 'blue']], nodes: [0, 1, 2] },
      { label: '5 \u00B7 ACIERTO EN CALIENTE', detail: 'La siguiente lectura se sirve desde memoria. El origen no se consulta. Un acierto aún puede devolver datos obsoletos: el TTL limita por cuánto tiempo.', moves: [['f12', 'leer producto 42', 'blue'], ['f23', 'GET \u2192 acierto', 'blue'], ['b32', 'v1 desde memoria', 'blue'], ['b21', 'respuesta', 'blue']], nodes: [0, 1, 2], status: { 3: ['inactivo: sin consultas', VK.blue] } },
    ],
  },
  'write-through': {
    nodes: [
      { eyebrow: 'CLIENTE', label: 'Escribir v2', status: 'actualizar producto 42' },
      { eyebrow: 'ADAPTADOR DE ESCRITURA', label: 'Coordinador', status: 'de la aplicación' },
      { eyebrow: 'VALKEY', label: 'Caché', status: 'v1 \u00B7 TTL 60 s', valkey: true },
      { eyebrow: 'BASE DE DATOS', label: 'Fuente de verdad', status: 'v1', glyph: 'db' },
    ],
    steps: [
      { label: 'LISTO', detail: 'Las escrituras pasan por un coordinador que espera a ambos sistemas antes de confirmar la operación al cliente. Los lectores nunca ven la caché rezagada respecto a la base de datos.' },
      { label: '1 \u00B7 ESCRIBIR', detail: 'El cliente envía v2 al adaptador de escritura.', moves: [['f12', 'PUT product:42 = v2', 'blue']], nodes: [0, 1], status: { 1: ['v2 pendiente', VK.red] } },
      { label: '2 \u00B7 CONFIRMAR EN ORIGEN', detail: 'Esta implementación confirma primero en la base de datos. Los dos almacenes no comparten una transacción.', moves: [['f24', 'COMMIT v2', 'red']], nodes: [1, 3], status: { 3: ['v2 confirmada', VK.blue] } },
      { label: '3 \u00B7 ACTUALIZAR LA CACHÉ', detail: 'Luego, el adaptador almacena v2 en Valkey y renueva el TTL. Entre ambas escrituras hay una breve brecha de visibilidad.', moves: [['f23', 'SET v2 EX 60', 'blue']], nodes: [1, 2], status: { 2: ['v2 \u00B7 TTL 60 s', VK.blue] } },
      { label: '4 \u00B7 CONFIRMAR ÉXITO', detail: 'Solo cuando ambos sistemas confirman, se notifica al cliente que la operación tuvo éxito. La latencia de escritura ahora suma las latencias de la base de datos y la caché.', moves: [['b21', 'ambos confirmados', 'blue']], nodes: [0, 1], status: { 1: ['latencia = BD + caché', VK.purple] } },
      { label: '5 \u00B7 LEER v2', detail: 'El siguiente lector encuentra v2 en la caché. Riesgo: si SET falla después de confirmar en el origen, registra la reparación y no reportes éxito.', moves: [['f12', 'leer producto 42', 'blue'], ['f23', 'GET \u2192 v2', 'blue'], ['b32', 'v2', 'blue'], ['b21', 'respuesta', 'blue']], nodes: [0, 1, 2] },
    ],
  },
  'write-behind': {
    nodes: [
      { eyebrow: 'CLIENTE', label: 'Escribir v2', status: 'actualizar producto 42' },
      { eyebrow: 'ADAPTADOR DE ESCRITURA', label: 'Acepta escrituras', status: 'de la aplicación' },
      { eyebrow: 'VALKEY', label: 'Búfer de escritura', status: 'pendiente + intención', valkey: true },
      { eyebrow: 'PROCESO DE BD', label: 'Vaciado asíncrono', status: 'base de datos aún en v1', glyph: 'db' },
    ],
    steps: [
      { label: 'LISTO', detail: 'Confirma antes de persistir en la base de datos; luego procesa los cambios pendientes de forma asíncrona. La durabilidad pasa a depender del búfer.' },
      { label: '1 \u00B7 ESCRIBIR', detail: 'El cliente envía v2.', moves: [['f12', 'PUT product:42 = v2', 'blue']], nodes: [0, 1] },
      { label: '2 \u00B7 BÚFER', detail: 'El adaptador registra v2 y la intención de vaciado en Valkey. Un SET simple no es una canalización write-back: necesitas un protocolo explícito de trabajo pendiente.', moves: [['f23', 'v2 + intención de vaciado', 'blue']], nodes: [1, 2], status: { 2: ['v2 pendiente', VK.purple] } },
      { label: '3 \u00B7 CONFIRMAR ANTES', detail: 'El cliente recibe confirmación en cerca de un milisegundo. La base de datos aún tiene v1.', moves: [['b21', 'aceptado', 'blue']], nodes: [0, 1], status: { 0: ['listo en ~1 ms', VK.blue], 3: ['aún v1 \u00B7 rezagada', VK.red] } },
      { label: '4 \u00B7 VACIAR', detail: 'Un proceso en segundo plano confirma el lote de forma idempotente y luego reconoce la tarea pendiente. Los lotes pueden combinar escrituras si la semántica lo permite.', moves: [['f34', 'el proceso vacía el lote', 'red']], nodes: [2, 3], status: { 2: ['rezago \u2192 0', VK.blue], 3: ['v2 persistida', VK.blue] } },
      { label: '5 \u00B7 EL RIESGO', detail: 'Si el búfer se pierde antes del vaciado, v2 desaparece después de informar al cliente que la escritura tuvo éxito. Usa un registro duradero y reprocesable, o acepta esto solo donde la ventana de pérdida sea tolerable.', tone: 'red', nodes: [2], down: [2], status: { 2: ['búfer perdido antes del vaciado', VK.red], 3: ['nunca recibe v2', VK.red] } },
    ],
  },
}

const scene = computed(() => scenes[props.scenario] || scenes['read-through'])
const steps = computed(() => scene.value.steps)
let built = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const prefix = `sf-${props.scenario}`
  addMarkers(svg, prefix)
  const root = svg.append('g')
  const nodes = scene.value.nodes.map((n, i) => card(root, { x: NODE_X[i], y: NODE_Y, w: NODE_W, h: NODE_H, ...n, id: `n${i}` }))
  // Flatter arcs: start near the vertical middle and bulge only modestly, so short gaps do not read as circles.
  const fwd = (a, b, bulge) => arc({ x: nodes[a].right.x, y: nodes[a].right.y - 12 }, { x: nodes[b].left.x, y: nodes[b].left.y - 12 }, bulge)
  const back = (a, b, bulge) => arc({ x: nodes[a].left.x, y: nodes[a].left.y + 14 }, { x: nodes[b].right.x, y: nodes[b].right.y + 14 }, bulge)
  const defs = {
    f12: [fwd(0, 1, -16), 'blue', 270, 96],
    f23: [fwd(1, 2, -16), 'blue', 550, 96],
    f34: [fwd(2, 3, -16), 'red', 830, 96],
    f24: [fwd(1, 3, -108), 'red', 690, 52],
    b21: [back(1, 0, 16), 'blue', 270, 224],
    b32: [back(2, 1, 16), 'blue', 550, 224],
    b43: [back(3, 2, 16), 'red', 830, 224],
  }
  const flows = {}
  const pills = {}
  for (const [id, [d, tone, px, py]] of Object.entries(defs)) {
    flows[id] = flow(root, d, { tone, prefix })
    pills[id] = pill(root, px, py, '', { tone })
  }
  built = { root, nodes, flows, pills }
}

async function animate(step) {
  const spec = steps.value[step]
  if (!spec?.moves) return
  for (const [id, , tone] of spec.moves) {
    await particle(built.root, built.flows[id].node, { tone, duration: 620 })
  }
}

function apply(step) {
  if (!built) return
  const list = steps.value
  const bounded = Math.min(Math.max(step, 0), list.length - 1)
  const spec = list[bounded]
  // Flows: used by the current step are bright; used by earlier steps rest at low opacity.
  const usedBefore = new Set()
  for (let i = 1; i < bounded; i++) for (const [id] of list[i].moves || []) usedBefore.add(id)
  const usedNow = new Map((spec.moves || []).map(([id, label, tone]) => [id, { label, tone }]))
  for (const [id, f] of Object.entries(built.flows)) {
    if (usedNow.has(id)) f.setState('current')
    else if (usedBefore.has(id)) f.setState('active')
    else f.setState('hidden')
    const p = built.pills[id]
    if (usedNow.has(id)) {
      p.setText(usedNow.get(id).label)
      p.setState('current')
    } else if (usedBefore.has(id)) {
      // keep the most recent label used for this flow
      let label = ''
      for (let i = 1; i < bounded; i++) for (const [mid, mlabel] of list[i].moves || []) if (mid === id) label = mlabel
      p.setText(label)
      p.setState('active')
    } else {
      p.setState('hidden')
    }
  }
  // Node status accumulates across steps.
  built.nodes.forEach((n, i) => {
    let status = [scene.value.nodes[i].status, VK.muted]
    for (let s = 1; s <= bounded; s++) {
      const st = list[s].status?.[i]
      if (st) status = st
    }
    n.setStatus(status[0], status[1])
    const down = (spec.down || []).includes(i)
    const current = (spec.nodes || []).includes(i)
    n.setState(down ? 'down' : current ? 'current' : 'idle')
  })
  if (bounded === lastStep + 1) animate(bounded)
  lastStep = bounded
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
watch(() => props.scenario, () => { build(); lastStep = -1; apply(props.step) })
</script>

<template>
  <div class="strategy-flow">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`Traza animada de solicitudes: ${scenario}`" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.strategy-flow { width: 100%; }
.strategy-flow .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
