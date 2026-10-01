<script setup>
import { computed } from 'vue'
import colorLogo from '@valkey-assets/logos/valkey-horizontal-color.png'
import lightLogo from '@valkey-assets/logos/valkey-horizontal-color-light.png'
import periwinkleMark from '@valkey-assets/logos/valkey-icon-periwinkle.svg'
import whiteMark from '@valkey-assets/logos/valkey-icon-white.svg'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
  tone: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value),
  },
})

const source = computed(() => {
  if (props.compact) {
    return props.tone === 'dark' ? whiteMark : periwinkleMark
  }

  return props.tone === 'dark' ? lightLogo : colorLogo
})
</script>

<template>
  <img
    class="brand-logo"
    :class="{ 'brand-logo--compact': compact }"
    :src="source"
    alt="Valkey"
  />
</template>
