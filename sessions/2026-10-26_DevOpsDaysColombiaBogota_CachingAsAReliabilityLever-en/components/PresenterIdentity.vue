<script setup>
const speaker = __PRESENTER_NAME__
const title = __PRESENTER_TITLE__
const company = __PRESENTER_COMPANY__
const role = [title, company ? `@ ${company}` : ''].filter(Boolean).join(' ')
</script>

<template>
  <div class="presenter-identity">
    <strong>{{ speaker }}</strong>
    <span v-if="role">{{ role }}</span>
  </div>
</template>
