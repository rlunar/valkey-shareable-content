<script setup>
// Cost per million reads, indexed to the uncached database bill. Illustrative model, not a price quote.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, tr, countUp, isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 660
const H = 400
const BASE = 1.0
const DB_WITH = 0.45
const CACHE_WITH = 0.10

let s = null

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const y = d3.scaleLinear().domain([0, 1.15]).range([300, 40])
  const money = d3.format('$.2f')

  svg.append('text').attr('x', 20).attr('y', 24).attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('letter-spacing', 1)
    .text('COSTO POR MILLÓN DE LECTURAS \u00B7 INDEXADO AL COSTO DE LA BASE DE DATOS SIN CACHÉ')
  svg.append('line').attr('x1', 20).attr('x2', W - 20).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', VK.muted)

  const barW = 150
  const x0 = 80
  const x1 = 330
  const label = (x, t) => svg.append('text').attr('x', x + barW / 2).attr('y', y(0) + 22).attr('text-anchor', 'middle').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).text(t)
  label(x0, 'SIN CACHÉ')
  label(x1, 'CON VALKEY \u00B7 90% DE ACIERTOS')

  const base = svg.append('rect').attr('x', x0).attr('y', y(0)).attr('width', barW).attr('height', 0).attr('fill', VK.red)
  const baseValue = svg.append('text').attr('x', x0 + barW / 2).attr('y', y(BASE) - 10).attr('text-anchor', 'middle').attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 20).attr('font-weight', 800).attr('opacity', 0).text(money(BASE))
  const baseNote = svg.append('text').attr('x', x0 + barW / 2).attr('y', y(0) + 40).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 11).attr('opacity', 0).text('1,000,000 lecturas llegan a la base de datos')

  const dbWith = svg.append('rect').attr('x', x1).attr('y', y(0)).attr('width', barW).attr('height', 0).attr('fill', VK.red)
  const cacheWith = svg.append('rect').attr('x', x1).attr('y', y(0)).attr('width', barW).attr('height', 0).attr('fill', VK.blue)
  const withValue = svg.append('text').attr('x', x1 + barW / 2).attr('y', y(DB_WITH + CACHE_WITH) - 10).attr('text-anchor', 'middle').attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 20).attr('font-weight', 800).attr('opacity', 0).text(money(DB_WITH + CACHE_WITH))
  const dbSliceLabel = svg.append('text').attr('x', x1 + barW + 10).attr('y', y(DB_WITH / 2) + 4).attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('opacity', 0).text('base de datos $0.45 (-55%)')
  const dbSliceNote = svg.append('text').attr('x', x1 + barW + 10).attr('y', y(DB_WITH / 2) + 20).attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 10.5).attr('opacity', 0).text('10% de lecturas + escrituras')
  const cacheSliceLabel = svg.append('text').attr('x', x1 + barW + 10).attr('y', y(DB_WITH + CACHE_WITH / 2) + 4).attr('fill', VK.blue).attr('font-family', FONT_CODE).attr('font-size', 11).attr('font-weight', 800).attr('opacity', 0).text('capa de caché Valkey $0.10')
  const withNote = svg.append('text').attr('x', x1 + barW / 2).attr('y', y(0) + 40).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_BODY).attr('font-size', 11).attr('opacity', 0).text('100,000 lecturas llegan a la base de datos')

  // Hit ratio dial between the bars.
  const mid = svg.append('g').attr('transform', `translate(${(x0 + barW + x1) / 2},${y(0.55)})`).attr('opacity', 0)
  mid.append('text').attr('y', -26).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 800).text('TASA DE ACIERTOS')
  const hit = mid.append('text').attr('y', 10).attr('text-anchor', 'middle').attr('fill', VK.blue).attr('font-family', FONT_CODE).attr('font-size', 30).attr('font-weight', 800).text('0%')
  mid.append('text').attr('y', 34).attr('text-anchor', 'middle').attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).text('lecturas en el origen')
  const origin = mid.append('text').attr('y', 52).attr('text-anchor', 'middle').attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 14).attr('font-weight', 800).text('1,000,000')

  // Delta line and callout.
  const delta = svg.append('line').attr('x1', x0 + barW).attr('x2', x1 + barW).attr('y1', y(BASE)).attr('y2', y(BASE)).attr('stroke', VK.purple).attr('stroke-dasharray', '5 5').attr('opacity', 0)
  const callout = svg.append('g').attr('transform', `translate(${x1 + barW + 10},${y(BASE) + 6})`).attr('opacity', 0)
  callout.append('rect').attr('x', 0).attr('y', -16).attr('width', 162).attr('height', 40).attr('rx', 2).attr('fill', VK.purple)
  callout.append('text').attr('x', 81).attr('y', 0).attr('text-anchor', 'middle').attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).text('-45% costo total')
  callout.append('text').attr('x', 81).attr('y', 16).attr('text-anchor', 'middle').attr('fill', VK.candy).attr('font-family', FONT_CODE).attr('font-size', 10).text('-55% en base de datos')

  svg.append('text').attr('x', 20).attr('y', H - 10).attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 8.5)
    .text('Costos ilustrativos. El 55% es una meta de carga; mide la tasa de aciertos y ajusta la capacidad. Usa AWS Pricing Calculator.')

  s = { y, base, baseValue, baseNote, dbWith, cacheWith, withValue, dbSliceLabel, dbSliceNote, cacheSliceLabel, withNote, mid, hit, origin, delta, callout }
}

function apply(step) {
  if (!s) return
  const { y } = s
  const on = (sel, v, d = 300) => tr(sel, d).attr('opacity', v ? 1 : 0)
  tr(s.base, 700).attr('y', step >= 1 ? y(BASE) : y(0)).attr('height', step >= 1 ? y(0) - y(BASE) : 0)
  on(s.baseValue, step >= 1)
  on(s.baseNote, step >= 1)
  on(s.mid, step >= 2)
  if (step >= 2) {
    countUp(s.hit, 90, { from: step === 2 ? 0 : 90, duration: 1000, format: (v) => Math.round(v).toString(), suffix: '%' })
    countUp(s.origin, 100000, { from: step === 2 ? 1000000 : 100000, duration: 1000 })
  } else {
    s.hit.text('0%')
    s.origin.text('1,000,000')
  }
  const showWith = step >= 3
  tr(s.dbWith, 700).attr('y', showWith ? y(DB_WITH) : y(0)).attr('height', showWith ? y(0) - y(DB_WITH) : 0)
  tr(s.cacheWith, 700).attr('y', showWith ? y(DB_WITH + CACHE_WITH) : y(0)).attr('height', showWith ? y(DB_WITH) - y(DB_WITH + CACHE_WITH) : 0)
  on(s.withValue, showWith, 700)
  on(s.dbSliceLabel, showWith, 700)
  on(s.dbSliceNote, showWith, 700)
  on(s.cacheSliceLabel, showWith, 700)
  on(s.withNote, showWith, 700)
  on(s.delta, showWith, 700)
  on(s.callout, showWith, 700)
}

onMounted(() => { build(); apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <svg ref="svgRef" class="diagram cost-per-million" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Costo por millón de lecturas con y sin caché: el costo de la base de datos baja 55 por ciento y el costo total 45 por ciento con una tasa de aciertos de 90 por ciento" />
</template>

<style scoped>
.cost-per-million { width: 100%; height: auto; display: block; }
</style>
