<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import DevOpsDaysFooter from './components/DevOpsDaysFooter.vue'

const nav = useNav()
const slideClass = computed(() => String(nav.currentSlideRoute.value?.meta?.slide?.frontmatter?.class || ''))
// The organizer template footer goes on every light slide. The cover and closing carry their own
// event branding, and the Prime Day slide is a full-bleed dark photo.
const show = computed(() => !/cover-slide|closing-slide|prime-slide/.test(slideClass.value))
const divider = computed(() => /section-slide/.test(slideClass.value))
</script>

<template>
  <DevOpsDaysFooter v-if="show" :wave="!divider" />
</template>
