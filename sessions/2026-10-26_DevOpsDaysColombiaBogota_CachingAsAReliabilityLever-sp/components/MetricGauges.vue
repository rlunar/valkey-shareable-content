<script setup>
// Six operating targets for a read-heavy cache tier, shown as radial gauges that fill on click.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr, isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 400

const metrics = [
  { name: 'TASA DE ACIERTOS', value: 94, unit: '%', fraction: 0.94, target: 'meta: 90%+ en lecturas', note: 'Catálogos a escala de Amazon operan entre 95 y 99%. Una caída es una alerta temprana.', tone: VK.blue },
  { name: 'LATENCIA p99 CON ACIERTO', value: 0.6, unit: ' ms', fraction: 0.075, target: 'meta: menos de 1 ms', note: 'El origen ronda 8 ms. Monitorea ambas rutas por separado.', tone: VK.blue, format: (v) => v.toFixed(1) },
  { name: 'CONEXIONES AL ORIGEN', value: 45, unit: '%', fraction: 0.45, target: 'meta: menos de 60%', note: 'Margen para picos y una caché fría.', tone: VK.blue },
  { name: 'CPU DEL ORIGEN', value: 38, unit: '%', fraction: 0.38, target: 'meta estable: menos de 50%', note: 'Confirma que la caché protege la base de datos.', tone: VK.blue },
  { name: 'DESALOJOS / s', value: 0, unit: '', fraction: 0.72, target: 'meta: ~0, memoria < 75%', note: 'El conjunto de trabajo ya no cabe en la caché.', tone: VK.purple, format: (v) => Math.round(v).toString(), ring: 'memoria usada 72%' },
  { name: 'EXACTITUD SEMÁNTICA', value: 91.2, unit: '%', fraction: 0.912, target: 'meta: 90%+ cerca del umbral', note: 'Registra cada acierto y su puntaje. Audita casos cercanos al umbral.', tone: VK.blue, format: (v) => v.toFixed(1) },
]

let tiles = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const tileW = 350
  const tileH = 190
  const arcGen = d3.arc().innerRadius(44).outerRadius(56).startAngle(-Math.PI * 0.75).cornerRadius(6)
  tiles = metrics.map((m, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const g = svg.append('g').attr('transform', `translate(${col * (tileW + 15)},${row * (tileH + 20)})`).attr('opacity', 0)
    g.append('rect').attr('width', tileW).attr('height', tileH).attr('fill', VK.cream).attr('stroke', VK.mist)
    g.append('rect').attr('width', 5).attr('height', tileH).attr('fill', m.tone)
    const dial = g.append('g').attr('transform', 'translate(78,98)')
    dial.append('path').attr('d', arcGen({ endAngle: Math.PI * 0.75 })).attr('fill', VK.mist)
    const fill = dial.append('path').attr('fill', m.tone).attr('d', arcGen({ endAngle: -Math.PI * 0.75 }))
    const value = dial.append('text').attr('y', 8).attr('text-anchor', 'middle').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 22).attr('font-weight', 800).text('0')
    if (m.ring) dial.append('text').attr('y', 62).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 9).attr('font-weight', 700).text(m.ring)
    g.append('text').attr('x', 152).attr('y', 44).attr('fill', m.tone).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('letter-spacing', 1).text(m.name)
    g.append('text').attr('x', 152).attr('y', 78).attr('fill', VK.purple).attr('font-family', FONT_BODY).attr('font-size', 14).attr('font-weight', 700).text(m.target)
    const note = g.append('text').attr('x', 152).attr('y', 104).attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 12.5)
    wrap(note, m.note, 185)
    return { g, fill, value, m, arcGen }
  })
}

function wrap(textSel, content, width) {
  const words = content.split(' ')
  let lineWords = []
  let lineNo = 0
  let tspan = textSel.append('tspan').attr('x', 152).attr('dy', 0)
  for (const word of words) {
    lineWords.push(word)
    tspan.text(lineWords.join(' '))
    if (tspan.node().getComputedTextLength() > width && lineWords.length > 1) {
      lineWords.pop()
      tspan.text(lineWords.join(' '))
      lineWords = [word]
      lineNo += 1
      tspan = textSel.append('tspan').attr('x', 152).attr('dy', 17).text(word)
    }
  }
}

function apply(step) {
  if (!tiles) return
  tiles.forEach((t, i) => {
    const visible = step >= i + 1
    tr(t.g, 320).attr('opacity', visible ? 1 : 0)
    const endAngle = -Math.PI * 0.75 + (visible ? t.m.fraction : 0) * Math.PI * 1.5
    const format = t.m.format || ((v) => Math.round(v).toString())
    if (isStatic()) {
      t.fill.attr('d', t.arcGen({ endAngle }))
      t.value.text(visible ? `${format(t.m.value)}${t.m.unit}` : '0')
      return
    }
    t.fill.transition().duration(800).ease(d3.easeCubicOut).attrTween('d', function () {
      const current = this.__angle ?? -Math.PI * 0.75
      const interp = d3.interpolateNumber(current, endAngle)
      return (k) => { this.__angle = interp(k); return t.arcGen({ endAngle: interp(k) }) }
    })
    t.value.transition().duration(800).ease(d3.easeCubicOut).tween('text', function () {
      const from = Number(String(d3.select(this).text()).replace(/[^0-9.]/g, '')) || 0
      const interp = d3.interpolateNumber(from, visible ? t.m.value : 0)
      return (k) => d3.select(this).text(`${format(interp(k))}${visible ? t.m.unit : ''}`)
    })
  })
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <svg ref="svgRef" class="diagram metric-gauges" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Seis metas operativas para una capa de caché: tasa de aciertos, latencia p99, conexiones al origen, CPU del origen, desalojos y memoria, exactitud de los aciertos semánticos" />
</template>

<style scoped>
.metric-gauges { width: 100%; height: auto; display: block; }
</style>
