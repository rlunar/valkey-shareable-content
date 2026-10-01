<script setup>
import BrandLogo from './BrandLogo.vue'
import linuxFoundationLogo from '../../../external-assets/LFMainLogo/Stacked/lf-stacked-color.svg'

const props = defineProps({
  // Reveal step: 1 shows ORIGIN, 2 adds GOVERNANCE, 3 adds COMMUNITY.
  // Defaults to 3 so the triptych stays complete if no clicks are wired.
  step: {
    type: Number,
    default: 3,
  },
})

const revealClass = (index) => ({
  'is-revealed': props.step >= index,
  'is-current': props.step === index,
})
</script>

<template>
  <div class="foundation-pillars">
    <article class="foundation-pillar" data-pillar="origin" :class="revealClass(1)">
      <span class="foundation-pillar__number">01</span>
      <div class="foundation-pillar__visual foundation-pillar__visual--valkey">
        <BrandLogo />
      </div>
      <p class="foundation-pillar__eyebrow">ORIGIN</p>
      <h2>Redis OSS fork <strong>7.2.4</strong></h2>
      <p class="foundation-pillar__copy">A community continuation of the open source codebase.</p>
    </article>

    <article class="foundation-pillar" data-pillar="governance" :class="revealClass(2)">
      <span class="foundation-pillar__number">02</span>
      <div class="foundation-pillar__visual foundation-pillar__visual--lf">
        <img :src="linuxFoundationLogo" alt="Linux Foundation">
      </div>
      <p class="foundation-pillar__eyebrow">GOVERNANCE</p>
      <h2>Backed by the Linux Foundation</h2>
      <p class="foundation-pillar__copy">Neutral stewardship supports durable, open governance.</p>
    </article>

    <article class="foundation-pillar" data-pillar="community" :class="revealClass(3)">
      <span class="foundation-pillar__number">03</span>
      <div class="foundation-pillar__visual foundation-pillar__visual--globe">
        <svg viewBox="0 0 96 96" role="img" aria-labelledby="community-globe-title">
          <title id="community-globe-title">Community globe</title>
          <circle cx="48" cy="48" r="35" />
          <ellipse cx="48" cy="48" rx="17" ry="35" />
          <path d="M13 48h70M20 29h56M20 67h56" />
        </svg>
      </div>
      <p class="foundation-pillar__eyebrow">COMMUNITY</p>
      <h2>Built by the community</h2>
      <p class="foundation-pillar__copy foundation-pillar__copy--emphasis">for the community.</p>
    </article>
  </div>
</template>

<style scoped>
.foundation-pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
}

.foundation-pillar {
  position: relative;
  display: flex;
  min-height: 342px;
  flex-direction: column;
  padding: 22px 24px 24px;
  border: 1px solid #d3dde7;
  background: #f1f3f3;
  color: #1a2026;
  opacity: 0;
  transform: translateY(26px) scale(0.985);
  transition:
    opacity 380ms ease,
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 620ms ease,
    box-shadow 620ms ease;
}

.foundation-pillar.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.foundation-pillar.is-current {
  border-color: #6983ff;
  box-shadow: 0 10px 30px -18px rgba(48, 23, 110, 0.45);
}

/* Inner elements cascade after the tile has landed. */
.foundation-pillar__number,
.foundation-pillar__visual,
.foundation-pillar__eyebrow,
.foundation-pillar h2,
.foundation-pillar__copy {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 340ms ease var(--reveal-delay, 0ms),
    transform 480ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
}

.foundation-pillar.is-revealed .foundation-pillar__number,
.foundation-pillar.is-revealed .foundation-pillar__visual,
.foundation-pillar.is-revealed .foundation-pillar__eyebrow,
.foundation-pillar.is-revealed h2,
.foundation-pillar.is-revealed .foundation-pillar__copy {
  opacity: 1;
  transform: translateY(0);
}

.foundation-pillar__visual {
  --reveal-delay: 120ms;
}

.foundation-pillar__eyebrow {
  --reveal-delay: 200ms;
}

.foundation-pillar h2 {
  --reveal-delay: 260ms;
}

.foundation-pillar__copy {
  --reveal-delay: 330ms;
}

.foundation-pillar__number {
  --reveal-delay: 380ms;
}

.foundation-pillar__number {
  position: absolute;
  top: 18px;
  right: 20px;
  color: #30176e;
  font-family: 'Cascadia Code', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.foundation-pillar__visual {
  display: flex;
  height: 94px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.foundation-pillar__visual--valkey :deep(.brand-logo) {
  width: 154px;
}

.foundation-pillar__visual--lf img {
  display: block;
  width: 190px;
  max-height: 82px;
  object-fit: contain;
  object-position: left center;
}

.foundation-pillar__visual--globe svg {
  width: 82px;
  height: 82px;
  fill: none;
  stroke: #6983ff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.foundation-pillar__eyebrow {
  margin-top: 20px;
  color: #30176e;
  font-family: 'Cascadia Code', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.foundation-pillar h2 {
  max-width: 280px;
  margin-top: 15px;
  color: #1a2026;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.16;
}

.foundation-pillar h2 strong {
  color: #6983ff;
  font-size: 30px;
  white-space: nowrap;
}

.foundation-pillar__copy {
  max-width: 285px;
  margin-top: auto;
  padding-top: 16px;
  color: #56636f;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.foundation-pillar__copy--emphasis {
  color: #30176e;
  font-size: 16px;
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .foundation-pillar,
  .foundation-pillar__number,
  .foundation-pillar__visual,
  .foundation-pillar__eyebrow,
  .foundation-pillar h2,
  .foundation-pillar__copy {
    transition: none;
    transform: none;
  }

  .foundation-pillar.is-revealed,
  .foundation-pillar.is-revealed .foundation-pillar__number,
  .foundation-pillar.is-revealed .foundation-pillar__visual,
  .foundation-pillar.is-revealed .foundation-pillar__eyebrow,
  .foundation-pillar.is-revealed h2,
  .foundation-pillar.is-revealed .foundation-pillar__copy {
    opacity: 1;
  }
}
</style>
