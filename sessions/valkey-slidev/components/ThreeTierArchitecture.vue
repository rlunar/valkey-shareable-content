<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { easeCubicOut, select } from 'd3'
import valkeyMarkWhite from '@valkey-assets/logos/valkey-icon-white.svg'

const props = defineProps({
  step: {
    type: Number,
    default: 0,
  },
})

const svgRef = ref(null)

const WIDTH = 1060
const HEIGHT = 390
const NODE_WIDTH = 188
const NODE_HEIGHT = 54
const TIER_WIDTH = 286
const TIER_TOP = 47
const TIER_HEIGHT = 282
const tierX = [173, 530, 887]
const nodeY = [105, 195, 285]

const tiers = [
  { id: 'presentation', label: 'PRESENTATION TIER', caption: 'User-facing clients', fill: '#f7fbfe' },
  { id: 'application', label: 'APPLICATION TIER', caption: 'Services and business logic', fill: '#f1effd' },
  { id: 'data', label: 'DATA TIER', caption: 'Fast state and durable records', fill: '#faedf0' },
]

const nodes = [
  { id: 'web', tier: 0, row: 0, label: 'Web app', detail: 'Browser UI' },
  { id: 'mobile', tier: 0, row: 1, label: 'Mobile app', detail: 'Native client' },
  { id: 'client', tier: 0, row: 2, label: 'API client', detail: 'Machine caller' },
  { id: 'api', tier: 1, row: 0, label: 'API service', detail: 'Request boundary' },
  { id: 'logic', tier: 1, row: 1, label: 'Business logic', detail: 'Domain operations' },
  { id: 'worker', tier: 1, row: 2, label: 'Worker', detail: 'Async processing' },
  { id: 'valkey', tier: 2, row: 0, label: 'Valkey', detail: 'Hot shared state', accent: true },
  { id: 'database', tier: 2, row: 1, label: 'Primary database', detail: 'Durable records' },
  { id: 'objects', tier: 2, row: 2, label: 'Object storage', detail: 'Large artifacts' },
].map((node) => ({ ...node, x: tierX[node.tier], y: nodeY[node.row] }))

const links = [
  { source: 'web', target: 'api', reveal: 1 },
  { source: 'mobile', target: 'logic', reveal: 1 },
  { source: 'client', target: 'worker', reveal: 1 },
  { source: 'api', target: 'valkey', reveal: 2, label: 'GET / SET' },
  { source: 'logic', target: 'valkey', reveal: 2 },
  { source: 'logic', target: 'database', reveal: 2, label: 'MISS / WRITE' },
  { source: 'worker', target: 'database', reveal: 2 },
  { source: 'worker', target: 'objects', reveal: 2 },
]

const nodeById = new Map(nodes.map((node) => [node.id, node]))

const linkPath = (link) => {
  const source = nodeById.get(link.source)
  const target = nodeById.get(link.target)
  const startX = source.x + NODE_WIDTH / 2
  const endX = target.x - NODE_WIDTH / 2
  const middleX = (startX + endX) / 2
  return `M${startX},${source.y} C${middleX},${source.y} ${middleX},${target.y} ${endX},${target.y}`
}

const draw = () => {
  if (!svgRef.value)
    return

  const svg = select(svgRef.value)
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    .attr('role', 'img')
    .attr('aria-label', 'Three-tier architecture with presentation, application, and data tiers')

  svg.selectAll('*').remove()

  const defs = svg.append('defs')
  defs.append('marker')
    .attr('id', 'three-tier-arrow')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 7)
    .attr('markerHeight', 7)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M0,0 L10,5 L0,10 Z')
    .attr('fill', '#6983ff')

  const tierGroups = svg.append('g').attr('class', 'architecture-tiers')
    .selectAll('g')
    .data(tiers)
    .join('g')
    .attr('class', 'architecture-tier')
    .attr('data-tier', (tier) => tier.id)

  tierGroups.append('rect')
    .attr('x', (_, index) => tierX[index] - TIER_WIDTH / 2)
    .attr('y', TIER_TOP)
    .attr('width', TIER_WIDTH)
    .attr('height', TIER_HEIGHT)
    .attr('fill', (tier) => tier.fill)
    .attr('stroke', '#d3dde7')
    .attr('stroke-width', 1)

  tierGroups.append('text')
    .attr('x', (_, index) => tierX[index])
    .attr('y', 22)
    .attr('text-anchor', 'middle')
    .attr('fill', '#30176e')
    .attr('font-family', 'Open Sans, sans-serif')
    .attr('font-size', 11)
    .attr('font-weight', 700)
    .attr('letter-spacing', '0.11em')
    .text((tier) => tier.label)

  tierGroups.append('text')
    .attr('x', (_, index) => tierX[index])
    .attr('y', 39)
    .attr('text-anchor', 'middle')
    .attr('fill', '#66727e')
    .attr('font-family', 'Open Sans, sans-serif')
    .attr('font-size', 10)
    .text((tier) => tier.caption)

  const linkGroups = svg.append('g').attr('class', 'architecture-links')
    .selectAll('g')
    .data(links)
    .join('g')
    .attr('class', 'architecture-link')
    .attr('data-reveal', (link) => link.reveal)

  linkGroups.append('path')
    .attr('d', linkPath)
    .attr('fill', 'none')
    .attr('stroke', '#6983ff')
    .attr('stroke-width', 2.25)
    .attr('stroke-linecap', 'round')
    .attr('marker-end', 'url(#three-tier-arrow)')
    .attr('pathLength', 1)
    .attr('stroke-dasharray', 1)
    .attr('stroke-dashoffset', 1)

  linkGroups.filter((link) => Boolean(link.label))
    .append('text')
    .attr('x', (link) => (nodeById.get(link.source).x + nodeById.get(link.target).x) / 2)
    .attr('y', (link) => (nodeById.get(link.source).y + nodeById.get(link.target).y) / 2 - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#30176e')
    .attr('font-family', 'Cascadia Code, monospace')
    .attr('font-size', 9)
    .attr('font-weight', 700)
    .attr('opacity', 0)
    .text((link) => link.label)

  const nodeGroups = svg.append('g').attr('class', 'architecture-nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'architecture-node')
    .attr('data-node', (node) => node.id)
    .attr('data-tier', (node) => tiers[node.tier].id)
    .attr('transform', (node) => `translate(${node.x - NODE_WIDTH / 2 - 14},${node.y - NODE_HEIGHT / 2})`)
    .attr('opacity', 0)

  nodeGroups.append('rect')
    .attr('width', NODE_WIDTH)
    .attr('height', NODE_HEIGHT)
    .attr('fill', (node) => node.accent ? '#30176e' : '#fffdfa')
    .attr('stroke', (node) => node.accent ? '#6983ff' : '#bcb5e7')
    .attr('stroke-width', (node) => node.accent ? 2 : 1)

  nodeGroups.append('text')
    .attr('x', 14)
    .attr('y', 23)
    .attr('fill', (node) => node.accent ? '#f7fbfe' : '#1a2026')
    .attr('font-family', 'Open Sans, sans-serif')
    .attr('font-size', 14)
    .attr('font-weight', 700)
    .text((node) => node.label)

  nodeGroups.append('text')
    .attr('x', 14)
    .attr('y', 41)
    .attr('fill', (node) => node.accent ? '#bcb5e7' : '#66727e')
    .attr('font-family', 'Open Sans, sans-serif')
    .attr('font-size', 10)
    .text((node) => node.detail)

  nodeGroups.filter((node) => node.id === 'valkey')
    .append('image')
    .attr('href', valkeyMarkWhite)
    .attr('x', NODE_WIDTH - 31)
    .attr('y', 8)
    .attr('width', 20)
    .attr('height', 20)

  svg.append('text')
    .attr('class', 'architecture-step')
    .attr('x', WIDTH / 2)
    .attr('y', 372)
    .attr('text-anchor', 'middle')
    .attr('fill', '#66727e')
    .attr('font-family', 'Cascadia Code, monospace')
    .attr('font-size', 9)

  update()
}

const update = () => {
  if (!svgRef.value)
    return

  const step = Math.min(Math.max(props.step, 0), 2)
  const svg = select(svgRef.value)

  svg.selectAll('.architecture-tier')
    .transition()
    .duration(350)
    .ease(easeCubicOut)
    .attr('opacity', (_, index) => index <= step ? 1 : 0.28)

  svg.selectAll('.architecture-node')
    .interrupt()
    .transition()
    .delay((node) => node.row * 65)
    .duration(420)
    .ease(easeCubicOut)
    .attr('opacity', (node) => node.tier <= step ? 1 : 0)
    .attr('transform', (node) => {
      const offset = node.tier <= step ? 0 : -14
      return `translate(${node.x - NODE_WIDTH / 2 + offset},${node.y - NODE_HEIGHT / 2})`
    })

  svg.selectAll('.architecture-link path')
    .interrupt()
    .transition()
    .duration(520)
    .ease(easeCubicOut)
    .attr('stroke-dashoffset', (link) => link.reveal <= step ? 0 : 1)
    .attr('opacity', (link) => link.reveal <= step ? 1 : 0)

  svg.selectAll('.architecture-link text')
    .interrupt()
    .transition()
    .delay(260)
    .duration(220)
    .attr('opacity', (link) => link.reveal <= step ? 1 : 0)

  svg.select('.architecture-step')
    .text(`${step + 1} / 3 · ${tiers[step].label}`)
}

onMounted(async () => {
  await nextTick()
  draw()
})

watch(() => props.step, update)
</script>

<template>
  <div class="three-tier-architecture">
    <svg ref="svgRef" class="three-tier-architecture__svg" />
  </div>
</template>

<style scoped>
.three-tier-architecture {
  width: 100%;
  border: 1px solid #d3dde7;
  background: #fffdfa;
}

.three-tier-architecture__svg {
  display: block;
  width: 100%;
  height: 390px;
}

@media (prefers-reduced-motion: reduce) {
  .three-tier-architecture__svg :deep(*) {
    transition: none !important;
  }
}
</style>
