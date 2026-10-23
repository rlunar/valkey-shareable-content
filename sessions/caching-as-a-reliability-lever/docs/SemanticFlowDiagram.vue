<!--
  SemanticFlowDiagram.vue — D3 semantic-cache request-flow diagram for the Slidev deck.
  Slide: "Semantic caching: how it works".
  STUB: wiring is ready; implement the D3 drawing where marked TODO.
  See the D3 SPEC in that slide's speaker notes for the full description.

  Usage in the slide (set `clicks: 5` in the slide frontmatter):
    <SemanticFlowDiagram />

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

const width = 1000
const height = 480
const svg = ref(null)

const VK = {
  purple: '#30176E', red: '#642637', blue: '#6983FF',
  black: '#1A2026', lavender: '#BCB5E7', white3: '#F7FBFE',
}

// main chain, left to right
const chain = ['prompt', 'embed', 'vector', 'kNN search in cache']
// decision diamond + the two branches follow the chain

function draw(clicks) {
  const root = d3.select(svg.value)
  root.selectAll('*').remove()
  // TODO: lay out the 4 chain nodes on a manual x-grid (rounded rects,
  //       VK.white3 fill, VK.purple stroke), then the decision diamond
  //       "sim ≥ threshold?" (VK.purple stroke).
  // TODO: clicks >= 1: reveal prompt -> embed -> vector left to right
  //       (staggered fade + slideX ~350ms).
  // TODO: clicks >= 2: reveal the kNN node + the decision diamond.
  // TODO: clicks >= 3: reveal the HIT branch (VK.blue)
  //       "return cached answer · no inference" and pulse it once.
  // TODO: clicks >= 4: reveal the MISS branch (VK.red)
  //       "call model -> store (vector, answer)" + dashed return arrow
  //       from the store step back to the cache node.
  // TODO: clicks >= 5: draw a circle around the "prompt" node
  //       (stroke-dashoffset draw-on) to tie the stored pair to a future prompt.
  // D3: d3.line().curve(d3.curveStep) for branch edges; <marker> arrowheads;
  //     stroke-dashoffset tweens; transitions keyed on watch($clicks).
}

onMounted(() => draw($clicks.value))
watch($clicks, (c) => draw(c))
</script>
