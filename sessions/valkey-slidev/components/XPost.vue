<script setup>
import BrandLogo from './BrandLogo.vue'

defineProps({
  handle: {
    type: String,
    default: '@valkeyio',
  },
  name: {
    type: String,
    default: 'Valkey',
  },
  postedAt: {
    type: String,
    default: 'Demo post',
  },
  replies: {
    type: Number,
    default: 24,
  },
  reposts: {
    type: Number,
    default: 86,
  },
  likes: {
    type: Number,
    default: 412,
  },
})
</script>

<template>
  <article class="x-post">
    <div class="x-post__demo-label">OFFLINE DEMO</div>

    <header class="x-post__header">
      <div class="x-post__avatar"><BrandLogo compact /></div>
      <div class="x-post__identity">
        <strong>{{ name }} <span class="x-post__verified" aria-label="verified">✓</span></strong>
        <span>{{ handle }}</span>
      </div>
      <span class="x-post__brand" aria-hidden="true">𝕏</span>
    </header>

    <div class="x-post__body"><slot /></div>

    <p class="x-post__time">{{ postedAt }}</p>

    <footer class="x-post__metrics" aria-label="Example engagement metrics">
      <span><b>Reply</b> {{ replies }}</span>
      <span><b>Repost</b> {{ reposts }}</span>
      <span><b>Like</b> {{ likes }}</span>
    </footer>
  </article>
</template>

<style scoped>
.x-post {
  position: relative;
  box-sizing: border-box;
  min-height: 320px;
  padding: 24px 26px 20px;
  overflow: hidden;
  border: 1px solid #d3dde7;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 50px rgb(48 23 110 / 9%);
  color: #1a2026;
  font-family: 'Open Sans', sans-serif;
}

.x-post__demo-label {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 10px;
  background: #30176e;
  color: #fff;
  font-family: 'Cascadia Code', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.x-post__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.x-post__avatar {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 50%;
  background: #30176e;
}

.x-post__avatar :deep(.brand-logo) {
  width: 25px;
}

.x-post__identity {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  line-height: 1.25;
}

.x-post__identity strong {
  font-size: 16px;
}

.x-post__identity > span {
  color: #66717c;
  font-size: 13px;
}

.x-post__verified {
  display: inline-grid;
  width: 15px;
  height: 15px;
  place-items: center;
  border-radius: 50%;
  background: #6983ff;
  color: #fff;
  font-size: 9px;
  vertical-align: 2px;
}

.x-post__brand {
  margin-right: 3px;
  font-size: 25px;
  line-height: 1;
}

.x-post__body {
  margin-top: 22px;
  font-size: 20px;
  line-height: 1.45;
}

.x-post__body :deep(strong) {
  color: #30176e;
}

.x-post__body :deep(code) {
  padding: 2px 5px;
  border-radius: 4px;
  background: #f1effd;
  color: #30176e;
  font-family: 'Cascadia Code', monospace;
  font-size: 0.78em;
}

.x-post__time {
  margin-top: 24px !important;
  color: #66717c;
  font-size: 12px;
}

.x-post__metrics {
  display: flex;
  gap: 25px;
  margin-top: 15px;
  padding-top: 14px;
  border-top: 1px solid #e4eaf0;
  color: #66717c;
  font-size: 11px;
}

.x-post__metrics b {
  color: #34404b;
  font-weight: 600;
}
</style>
