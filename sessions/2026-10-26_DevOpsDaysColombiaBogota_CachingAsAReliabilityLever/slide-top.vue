<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const nav = useNav()
const slideClass = computed(() => String(nav.currentSlideRoute.value?.meta?.slide?.frontmatter?.class || ''))
const dark = computed(() => /section-slide|closing-slide|prime-slide/.test(slideClass.value))
const show = computed(() => nav.currentPage.value > 1 && nav.currentPage.value < nav.total.value && !/prime-slide/.test(slideClass.value))
</script>

<template>
  <footer v-if="show" class="deck-footer" :class="{ 'deck-footer--dark': dark }">
    <span class="deck-footer__line" aria-hidden="true" />
    <span class="deck-footer__page">{{ nav.currentPage.value }} / {{ nav.total.value }}</span>
    <BrandLogo :tone="dark ? 'dark' : 'light'" />
  </footer>
</template>
