<!--
  PoolKneeChart.vue — D3 pool-saturation knee line chart for the Slidev deck.
  Slide: "The pool math, with numbers".
  STUB: wiring is ready; implement the D3 drawing where marked TODO.
  See the D3 SPEC in that slide's speaker notes for the full description.

  Usage in the slide (set `clicks: 5` in the slide frontmatter):
    <PoolKneeChart />

  npm i d3
-->
<template>
  <svg ref="svg" :width="width" :height="height" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const width = 900
const height = 520
const margin = { top: 30, right: 40, bottom: 50, left: 70 }
const svg = ref(null)

const VK = {
  purple: '#30176E', red: '#642637', blue: '#6983FF',
  black: '#1A2026', lavender: '#BCB5E7', white3: '#F7FBFE',
}

const POOL = 100
const OFFERED = 8000           // offered-load reference line (rps)
const markers = [
  { w: 4,  y: 25000, color: VK.blue, label: 'healthy · 4 ms · 25,000 rps' },
  { w: 40, y: 2500,  color: VK.red,  label: 'slowed 10× · 40 ms · 2,500 rps' },
]
// lambda_max = POOL / (W/1000) = 100000 / W
const lambdaMax = (wMs) => 100000 / wMs

function draw(clicks) {
  const root = d3.select(svg.value)
  root.selectAll('*').remove()
  // TODO: xScale = d3.scaleLinear([0,60] ms -> inner width);
  //       yScale = d3.scaleLinear([0,26000] rps -> inner height).
  // TODO: clicks >= 1: draw axes (VK.black) + muted gridlines.
  // TODO: clicks >= 2: draw the hyperbola y = lambdaMax(x) in VK.purple 3px,
  //       sampled ~120 pts, tweened in via stroke-dashoffset.
  // TODO: clicks >= 3: drop the healthy marker (VK.blue) + callout.
  // TODO: clicks >= 4: drop the slowed marker (VK.red) + flash the dashed
  //       OFFERED (8,000 rps) horizontal line.
  // TODO: clicks >= 5: d3.area() shade the region where curve < OFFERED in
  //       translucent VK.red (the danger zone / cliff).
}

onMounted(() => draw($clicks.value))
watch($clicks, (c) => draw(c))
</script>
