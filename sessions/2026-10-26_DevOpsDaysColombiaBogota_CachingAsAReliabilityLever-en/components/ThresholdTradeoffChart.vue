<template>
  <svg ref="svg" class="diagram" :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Semantic cache threshold trade-off chart: cost savings rise as the threshold loosens while cached-answer accuracy holds, then drops at 0.50" />
</template>

<script setup>
// Measured proof from the AWS Database Blog evaluation (ElastiCache as a semantic cache with Bedrock).
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_CODE, FONT_BODY, isStatic } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svg = ref(null)
const width = 1080
const height = 400
const margin = { top: 44, right: 85, bottom: 56, left: 78 }
const data = [
  { threshold: 0.99, savings: 15.8, accuracy: 92.1 },
  { threshold: 0.95, savings: 51.9, accuracy: 92.6 },
  { threshold: 0.90, savings: 72.5, accuracy: 92.3 },
  { threshold: 0.80, savings: 84.6, accuracy: 91.8 },
  { threshold: 0.75, savings: 86.3, accuracy: 91.2 },
  { threshold: 0.50, savings: 88.0, accuracy: 87.5 },
]

function draw(step) {
  const root = d3.select(svg.value)
  root.selectAll('*').remove()

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const x = d3.scaleLinear().domain([0.99, 0.50]).range([0, innerWidth])
  const savingsY = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])
  const accuracyY = d3.scaleLinear().domain([80, 100]).range([innerHeight, 0])
  const chart = root.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  chart.append('g').selectAll('line').data(savingsY.ticks(5)).join('line').attr('x1', 0).attr('x2', innerWidth)
    .attr('y1', (d) => savingsY(d)).attr('y2', (d) => savingsY(d)).attr('stroke', VK.mist)
  chart.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x).tickValues(data.map((d) => d.threshold)).tickFormat(d3.format('.2f')))
  chart.append('g').call(d3.axisLeft(savingsY).ticks(5).tickFormat((d) => `${d}%`))
  chart.append('g').attr('transform', `translate(${innerWidth},0)`).call(d3.axisRight(accuracyY).ticks(5).tickFormat((d) => `${d}%`))
  chart.selectAll('.domain, .tick line').attr('stroke', VK.muted)
  chart.selectAll('.tick text').attr('fill', VK.black).attr('font-family', FONT_CODE).attr('font-size', 11)
  root.append('text').attr('x', 18).attr('y', height / 2).attr('transform', `rotate(-90,18,${height / 2})`).attr('text-anchor', 'middle').attr('fill', VK.blue).attr('font-family', FONT_BODY).attr('font-size', 13).attr('font-weight', 800).text('Cost savings')
  root.append('text').attr('x', width - 14).attr('y', height / 2).attr('transform', `rotate(90,${width - 14},${height / 2})`).attr('text-anchor', 'middle').attr('fill', VK.red).attr('font-family', FONT_BODY).attr('font-size', 13).attr('font-weight', 800).text('Cached-answer accuracy')
  root.append('text').attr('x', margin.left + innerWidth / 2).attr('y', height - 8).attr('text-anchor', 'middle').attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 13).attr('font-weight', 600).text('Similarity threshold: tighter on the left, looser on the right')

  if (step >= 4) {
    chart.append('rect').attr('x', x(0.75)).attr('y', 0).attr('width', innerWidth - x(0.75)).attr('height', innerHeight).attr('fill', VK.red).attr('opacity', 0.08)
    chart.append('text').attr('x', innerWidth - 10).attr('y', innerHeight - 16).attr('text-anchor', 'end').attr('fill', VK.red).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).text('ACCURACY CLIFF: +1.7 pts savings, -3.7 pts accuracy')
  }

  if (step >= 1) drawSeries(chart, x, savingsY, 'savings', VK.blue, step === 1)
  if (step >= 2) drawSeries(chart, x, accuracyY, 'accuracy', VK.red, step === 2)

  if (step >= 3) {
    const kneeX = x(0.75)
    chart.append('rect').attr('x', kneeX - 13).attr('y', 0).attr('width', 26).attr('height', innerHeight).attr('fill', VK.purple).attr('opacity', 0.18)
    chart.append('line').attr('x1', kneeX).attr('x2', kneeX).attr('y1', 0).attr('y2', innerHeight).attr('stroke', VK.purple).attr('stroke-width', 2)
    const label = chart.append('g').attr('transform', `translate(${kneeX - 135},8)`)
    label.append('rect').attr('width', 270).attr('height', 48).attr('rx', 3).attr('fill', VK.purple)
    label.append('text').attr('x', 135).attr('y', 20).attr('text-anchor', 'middle').attr('fill', VK.white).attr('font-family', FONT_CODE).attr('font-size', 13).attr('font-weight', 800).text('THE KNEE: threshold 0.75')
    label.append('text').attr('x', 135).attr('y', 38).attr('text-anchor', 'middle').attr('fill', VK.lavender).attr('font-family', FONT_CODE).attr('font-size', 12).text('86.3% savings, 88.3% faster, 91.2% accuracy')
  }

  const legend = root.append('g').attr('transform', `translate(${margin.left + 5},16)`)
  if (step >= 1) addLegend(legend, 0, VK.blue, 'cost savings')
  if (step >= 2) addLegend(legend, 150, VK.red, 'cached-answer accuracy')
}

function drawSeries(chart, x, y, field, color, animate) {
  const path = chart.append('path').datum(data).attr('d', d3.line().x((d) => x(d.threshold)).y((d) => y(d[field])).curve(d3.curveMonotoneX))
    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 4)
  if (animate && !isStatic()) {
    const length = path.node().getTotalLength()
    path.attr('stroke-dasharray', length).attr('stroke-dashoffset', length).transition().duration(650).attr('stroke-dashoffset', 0)
  }
  chart.selectAll(`circle.${field}`).data(data).join('circle').attr('class', field).attr('cx', (d) => x(d.threshold)).attr('cy', (d) => y(d[field]))
    .attr('r', 6).attr('fill', color).attr('stroke', VK.white).attr('stroke-width', 2)
  chart.selectAll(`text.${field}`).data(data).join('text').attr('class', field).attr('x', (d) => x(d.threshold) + (d.threshold === 0.99 ? 24 : 0)).attr('y', (d) => y(d[field]) + (field === 'savings' ? -12 : 20))
    .attr('text-anchor', 'middle').attr('fill', color).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 700).text((d) => `${d[field]}%`)
}

function addLegend(group, offset, color, label) {
  group.append('line').attr('x1', offset).attr('x2', offset + 28).attr('y1', 0).attr('y2', 0).attr('stroke', color).attr('stroke-width', 4)
  group.append('text').attr('x', offset + 36).attr('y', 5).attr('fill', color).attr('font-family', FONT_CODE).attr('font-size', 12).attr('font-weight', 800).text(label)
}

onMounted(() => draw(props.step))
watch(() => props.step, draw)
</script>
