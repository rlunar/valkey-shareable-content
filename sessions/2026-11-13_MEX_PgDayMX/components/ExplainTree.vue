<script setup>
// EXPLAIN (ANALYZE, BUFFERS) of Q3 (90-day window) on airtravel_2y, PostgreSQL 18.6,
// drawn as a tree. Leaves on the left, the result on the right: rows flow left to right.
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import { VK, FONT_BODY, FONT_CODE, particle, tr } from './diagram-kit.js'

const props = defineProps({ step: { type: Number, default: 0 } })
const svgRef = ref(null)
const W = 1080
const H = 352
const BOX_W = 132
const BOX_H = 50

// `step` is the click that lights the node; `hot` marks the expensive ones.
const plan = {
  id: 'limit', title: 'Limit \u00B7 top-N', rows: '20 rows', step: 6,
  children: [{
    id: 'agg', title: 'GroupAggregate', rows: '717 groups', step: 6,
    children: [{
      id: 'sort', title: 'Sort \u00B7 ext. merge', rows: '160 MB on disk', step: 5, hot: true,
      children: [{
        id: 'nl', title: 'Nested Loop', rows: '3,278,688 rows', step: 4, hot: true,
        children: [
          {
            id: 'dims', title: 'Hash Joins + Memo', rows: '16,207 flights', step: 3,
            children: [
              {
                id: 'temporal', title: 'Hash Join \u00B7 @>', rows: '204,294 removed', step: 2,
                children: [
                  { id: 'flights', title: 'Seq Scan flights', rows: '16,207 of 135,571', step: 1 },
                  { id: 'routes', title: 'Seq Scan routes', rows: '7,242 rows', step: 1 },
                ],
              },
              { id: 'airports', title: 'Hash airports x2', rows: '5,501 each', step: 3 },
              { id: 'planes', title: 'Memoize airplanes', rows: '8 misses', step: 3 },
            ],
          },
          { id: 'segments', title: 'Index Scan segments', rows: 'x16,207 \u00B7 2.08M bufs', step: 4, hot: true },
        ],
      }],
    }],
  }],
}

const steps = [
  { label: 'EXPLAIN (ANALYZE, BUFFERS)', detail: 'Read a plan from the leaves to the root. Here rows flow left to right into the 20-row answer.' },
  { label: '1 \u00B7 SCAN', detail: 'Seq scan flights for the quarter: 16,207 of 135,571 rows. Routes is small: 7,242 rows hashed in memory.' },
  { label: '2 \u00B7 TEMPORAL JOIN', detail: 'route_no matches, then validity @> scheduled_departure filters 204,294 candidate pairs away.' },
  { label: '3 \u00B7 DIMENSIONS', detail: 'Airports hashed twice, airplanes memoized (8 misses). Cheap, but it runs on every request.' },
  { label: '4 \u00B7 THE HOT SPOT', detail: '16,207 index probes into segments return 3.28M rows and touch 2.08M buffers: 99.9% of the work.', tone: 'red' },
  { label: '5 \u00B7 SPILL', detail: 'Grouping by JSON-extracted city names needs a sort larger than work_mem: 160 MB written to temp files.', tone: 'red' },
  { label: '6 \u00B7 THE ANSWER', detail: '717 groups, top 20 kept. Seconds of CPU and I/O for a result that fits in a few KB. Compute once, keep it.' },
]

let scene = null
let lastStep = -1

function build() {
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const root = d3.hierarchy(plan)
  const depth = root.height
  const innerW = W - BOX_W - 16
  const layout = d3.tree().size([H - BOX_H - 12, innerW]).separation((a, b) => (a.parent === b.parent ? 1 : 1.15))
  layout(root)
  // Flip so the root sits on the right.
  root.each((n) => { n.px = innerW - (n.depth / depth) * innerW + 8; n.py = n.x + 6 })

  const linkGroup = svg.append('g')
  const nodeGroup = svg.append('g')

  const links = root.links().map((l) => {
    const d = d3.linkHorizontal()({ source: [l.target.px + BOX_W, l.target.py + BOX_H / 2], target: [l.source.px, l.source.py + BOX_H / 2] })
    const path = linkGroup.append('path').attr('d', d).attr('fill', 'none').attr('stroke', VK.mist).attr('stroke-width', 2)
    return { path, child: l.target.data, parent: l.source.data }
  })

  const nodes = root.descendants().map((n) => {
    const g = nodeGroup.append('g').attr('transform', `translate(${n.px},${n.py})`)
    const rect = g.append('rect').attr('width', BOX_W).attr('height', BOX_H).attr('rx', 2)
      .attr('fill', VK.white).attr('stroke', VK.lavender).attr('stroke-width', 1.6)
    g.append('text').attr('x', 9).attr('y', 20).attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 10.5).attr('font-weight', 700).text(n.data.title)
    const rows = g.append('text').attr('x', 9).attr('y', 38).attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 9.5).attr('font-weight', 700).text(n.data.rows)
    return { data: n.data, g, rect, rows }
  })

  scene = { links, nodes, svg }
}

function apply(step) {
  if (!scene) return
  for (const n of scene.nodes) {
    const lit = step >= n.data.step
    const current = step === n.data.step
    const hot = n.data.hot && lit
    const stroke = hot ? VK.red : current ? VK.blue : lit ? VK.lavender : VK.mist
    const fill = hot ? VK.redFill : current ? VK.current : VK.white
    tr(n.rect, 260).attr('stroke', stroke).attr('fill', fill).attr('stroke-width', current ? 2.4 : 1.6)
    tr(n.g, 260).attr('opacity', step === 0 || lit ? 1 : 0.35)
    n.rows.attr('fill', hot ? VK.red : current ? VK.purple : VK.muted)
  }
  for (const l of scene.links) {
    const lit = step >= l.child.step
    const hot = lit && l.child.hot
    tr(l.path, 300).attr('stroke', hot ? VK.red : lit ? VK.blue : VK.mist).attr('stroke-width', hot ? 4 : lit ? 2.5 : 2)
  }
  if (step === lastStep + 1) {
    scene.links.filter((l) => l.child.step === step).forEach((l) => particle(scene.svg, l.path.node(), { tone: l.child.hot ? 'red' : 'blue', r: 5 }))
  }
  lastStep = step
}

onMounted(() => { build(); lastStep = props.step - 1; apply(props.step) })
watch(() => props.step, apply)
</script>

<template>
  <div class="explain-tree">
    <svg ref="svgRef" class="diagram" :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Query plan tree for the six-way join: scans, a temporal hash join, an index nested loop over segments returning 3.28 million rows, a 160 megabyte sort spill, and a 20 row result" />
    <StepBar :steps="steps" :step="step" />
  </div>
</template>

<style scoped>
.explain-tree { width: 100%; }
.explain-tree .diagram {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d3dde7;
  background: linear-gradient(135deg, #fffdfa 0%, #f7fbfe 62%, #efedfa 100%);
}
</style>
