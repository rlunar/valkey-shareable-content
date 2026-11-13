<!--
  CascadeFlow.vue — D3 degradation-cascade diagram for the Slidev deck.
  Slide: "The degradation cascade".
  STUB: wiring is ready; implement the D3 drawing where marked TODO.
  See the D3 SPEC in that slide's speaker notes for the full description.

  Usage in the slide (set `clicks: 6` in the slide frontmatter):
    <CascadeFlow />

  npm i d3
-->
<template>
  <svg ref="svg" :width="width" :height="height" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
// Slidev injects the current click count on each slide.
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const width = 1000
const height = 560
const svg = ref(null)

// Valkey palette
const VK = {
  purple: '#30176E', red: '#642637', blue: '#6983FF',
  black: '#1A2026', lavender: '#BCB5E7', white3: '#F7FBFE',
}

const stages = [
  '1 · Page fan-out: many reads per view',
  '2 · Redundant DB work: identical answers recomputed 200k×',
  "3 · Connection pool drains (Little's Law)",
  '4 · Queues form, p99/p999 blow out (the knee)',
  '5 · Origin contends: CPU pins, locks ↺ feeds back into 3',
  '6 · Timeouts → retry storm → DOWN (on-call paged)',
]

function draw(clicks) {
  const root = d3.select(svg.value)
  root.selectAll('*').remove()
  // TODO: render the 6 stage nodes (rounded rects) top-to-bottom.
  //   - fill VK.white3, stroke VK.purple; stage 6 fill VK.red, white text.
  //   - reveal node i when clicks >= i (fade + translateY 20->0, 400ms).
  // TODO: draw straight purple connectors down the chain.
  // TODO: on clicks >= 5, draw the feedback arc stage 5 -> stage 3 in VK.red
  //   using d3.line().curve(d3.curveBasis) + a <marker> arrowhead, animated
  //   via stroke-dasharray / stroke-dashoffset. Label it "slower service time".
  // TODO: on clicks >= 6, fade in the WITH-CACHE panel on the right and dim
  //   the left column to ~40% opacity.
}

onMounted(() => draw($clicks.value))
watch($clicks, (c) => draw(c))
</script>
