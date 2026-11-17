<script setup>
// macOS Terminal frame around a Shiki code block (Monokai body).
defineProps({
  title: { type: String, default: 'Terminal' },
})
</script>

<template>
  <div class="terminal">
    <div class="terminal__bar">
      <span class="terminal__lights"><i /><i /><i /></span>
      <span class="terminal__title">{{ title }}</span>
    </div>
    <div class="terminal__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.terminal {
  overflow: hidden;
  border: 1px solid #d3dde7;
  border-radius: 12px;
  background: #272822;
  box-shadow: 0 16px 44px rgb(26 32 38 / 18%);
}
.terminal__bar {
  position: relative;
  display: flex;
  height: 40px;
  align-items: center;
  padding: 0 14px;
  background: #eceff4;
  border-bottom: 1px solid #d3dde7;
}
.terminal__lights { display: flex; gap: 8px; }
.terminal__lights i { display: block; width: 12px; height: 12px; border-radius: 50%; }
.terminal__lights i:nth-child(1) { background: #ff5f57; }
.terminal__lights i:nth-child(2) { background: #febc2e; }
.terminal__lights i:nth-child(3) { background: #28c840; }
.terminal__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #596672;
  font-family: 'Cascadia Code', monospace;
  font-size: 12px;
  font-weight: 600;
}
.terminal__body { padding: 6px 10px 10px; }
</style>
