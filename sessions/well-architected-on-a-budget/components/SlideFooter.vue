<script setup>
import BrandLogo from './BrandLogo.vue'

defineProps({
  tone: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value),
  },
})
</script>

<template>
  <footer class="slide-footer" :class="`slide-footer--${tone}`">
    <span class="slide-footer__line" aria-hidden="true" />
    <BrandLogo :tone="tone" />
  </footer>
</template>
