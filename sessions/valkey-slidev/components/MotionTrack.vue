<script setup>
import BrandLogo from './BrandLogo.vue'
</script>

<template>
  <div class="motion-stage">
    <div class="motion-rail" />
    <div class="motion-stop motion-stop--app"><span>01</span><strong>APP</strong></div>
    <div class="motion-stop motion-stop--cache"><span>02</span><strong>VALKEY</strong></div>
    <div class="motion-stop motion-stop--response"><span>03</span><strong>RESPONSE</strong></div>

    <div
      v-motion
      class="motion-packet"
      :initial="{ x: 0, scale: 0.88, opacity: 0 }"
      :enter="{ x: 0, scale: 1, opacity: 1 }"
      :click-1="{ x: 260, scale: 1.08 }"
      :click-2="{ x: 520, scale: 1 }"
    >
      <BrandLogo compact tone="dark" />
    </div>
  </div>
</template>
