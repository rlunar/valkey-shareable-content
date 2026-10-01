<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value),
  },
})

// Horizontal "no smile" variants of the AWS Open Source logo: black text on light slides, white text on dark slides.
const source = computed(() => (props.tone === 'dark' ? '/logos/aws-open-source-white.svg' : '/logos/aws-open-source-black.svg'))
</script>

<template>
  <img class="org-logo" :src="source" alt="AWS Open Source" />
</template>
