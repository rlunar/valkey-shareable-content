<script setup>
// Footer from the DevOpsDays Bogota 2026 organizer template (CONTENIDO layout, slide 12):
// wave strip along the bottom, event logo and slide number bottom-left, devopsdaysbogota.org
// bottom-right. Dividers pass :wave="false" because their background already carries the waves.
import { useNav } from '@slidev/client'

defineProps({ wave: { type: Boolean, default: true } })

const nav = useNav()
</script>

<template>
  <footer class="dod-footer">
    <img v-if="wave" class="dod-footer__wave" src="/devopsdays/footer-wave.png" alt="" />
    <img class="dod-footer__logo" src="/devopsdays/devopsdays-bogota-2026-logo.png" alt="DevOpsDays Bogotá 2026" />
    <span class="dod-footer__page">{{ nav.currentPage.value }}</span>
    <span class="dod-footer__url">devopsdaysbogota.org</span>
  </footer>
</template>
