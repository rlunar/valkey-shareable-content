<script setup>
import { computed } from 'vue'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  // 0 = three shards, 1 = scaled out to four, 2 = consolidated back to three.
  step: {
    type: Number,
    default: 0,
  },
})

const TOTAL_HASH_SLOTS = 16384
const SLOT_UNIT = 100
const SLOT_TOKEN_COUNT = Math.ceil(TOTAL_HASH_SLOTS / SLOT_UNIT)
const INITIAL_SLOT_COUNTS = [55, 55, 54]
const FINAL_SLOTS_PER_SHARD = 41
const GRID_STEP = 7

const currentStep = computed(() => Math.min(Math.max(Math.trunc(props.step), 0), 2))
const expanded = computed(() => currentStep.value === 1)
const contracted = computed(() => currentStep.value === 2)
const isRebalancing = computed(() => expanded.value || contracted.value)

const shardCount = computed(() => (expanded.value ? 4 : 3))
const shards = computed(() => Array.from({ length: shardCount.value }, (_, index) => index + 1))
const nodeCount = computed(() => shardCount.value * 3)

const slotTokens = Array.from({ length: SLOT_TOKEN_COUNT }, (_, id) => {
  const source = id < 55 ? 0 : id < 110 ? 1 : 2
  const sourceStart = source === 0 ? 0 : source === 1 ? 55 : 110
  const sourceIndex = id - sourceStart
  const finalOwner = sourceIndex < FINAL_SLOTS_PER_SHARD ? source : 3

  return {
    id,
    source,
    initialOwner: source,
    finalOwner,
    moved: finalOwner === 3,
  }
})

const positionedSlots = computed(() => {
  const columns = expanded.value ? 9 : 10
  const groups = Array.from({ length: shardCount.value }, () => [])

  for (const token of slotTokens) {
    const owner = expanded.value ? token.finalOwner : token.initialOwner
    groups[owner].push(token)
  }

  const positions = new Map()
  groups.forEach((group, owner) => {
    group.forEach((token, index) => {
      positions.set(token.id, {
        ...token,
        owner,
        column: index % columns,
        row: Math.floor(index / columns),
        columns,
      })
    })
  })

  return slotTokens.map((token) => positions.get(token.id))
})

const slotRange = (index) => {
  const start = Math.floor(((index - 1) * TOTAL_HASH_SLOTS) / shardCount.value)
  const end = Math.floor((index * TOTAL_HASH_SLOTS) / shardCount.value) - 1
  return `${start.toLocaleString()}–${end.toLocaleString()}`
}

const slotSummary = (shard) => {
  if (expanded.value) {
    if (shard === 4)
      return '41 received'

    const moved = INITIAL_SLOT_COUNTS[shard - 1] - FINAL_SLOTS_PER_SHARD
    return `41 kept · ${moved} moved`
  }

  if (contracted.value)
    return `${INITIAL_SLOT_COUNTS[shard - 1]} restored`

  return `${INITIAL_SLOT_COUNTS[shard - 1]} squares`
}

const eventCopy = computed(() => {
  if (expanded.value)
    return 'ALL 3 PRIMARIES → SHARD 04'

  if (contracted.value)
    return 'SHARD 04 → ALL 3 PRIMARIES'

  return 'PRESS → TO REDISTRIBUTE'
})

const slotStyle = (slot) => ({
  '--owner': slot.owner,
  '--count': shardCount.value,
  '--slot-x': `${slot.column * GRID_STEP}px`,
  '--slot-y': `${86 + slot.row * GRID_STEP}px`,
  '--grid-half': `${(slot.columns * GRID_STEP) / 2}px`,
  '--slot-delay': `${(slot.id % 19) * 7}ms`,
})
</script>

<template>
  <div class="cluster-morph" :class="{ 'is-expanded': expanded, 'is-contracted': contracted }">
    <div class="cluster-morph__summary">
      <div><strong :key="nodeCount">{{ nodeCount }}</strong><span>nodes</span></div>
      <div><strong :key="shardCount">{{ shardCount }}</strong><span>shards</span></div>
      <div><strong>2</strong><span>replicas / shard</span></div>
      <div class="cluster-morph__event">
        <span class="cluster-morph__event-copy">{{ eventCopy }}</span>
        <span class="cluster-morph__slot-unit"><i /> 1 square ≈ {{ SLOT_UNIT }} slots</span>
      </div>
    </div>

    <div class="cluster-morph__stage">
      <TransitionGroup name="shard">
        <section
          v-for="(shard, index) in shards"
          :key="shard"
          class="cluster-shard"
          :style="{ '--index': index, '--count': shardCount }"
        >
          <header>
            <span>SHARD {{ String(shard).padStart(2, '0') }}</span>
            <code>{{ slotRange(shard) }}</code>
          </header>

          <div class="cluster-node cluster-node--primary">
            <BrandLogo compact tone="dark" class="cluster-node__mark" />
            <div class="cluster-node__title"><span>P{{ shard }}</span><strong>Primary</strong></div>
            <small>{{ slotSummary(shard) }}</small>
          </div>

          <div class="cluster-link" aria-hidden="true"><i /><i /></div>

          <div class="cluster-replicas">
            <div class="cluster-node">
              <BrandLogo compact class="cluster-node__mark" />
              <span>R{{ shard }}A</span>
              <strong>Replica A</strong>
            </div>
            <div class="cluster-node">
              <BrandLogo compact class="cluster-node__mark" />
              <span>R{{ shard }}B</span>
              <strong>Replica B</strong>
            </div>
          </div>
        </section>
      </TransitionGroup>

      <div class="slot-layer" aria-label="Hash slot distribution">
        <i
          v-for="slot in positionedSlots"
          :key="slot.id"
          class="slot-token"
          :class="[
            `slot-token--source-${slot.source + 1}`,
            { 'slot-token--moved': slot.moved && isRebalancing },
          ]"
          :style="slotStyle(slot)"
          :data-slot="slot.id"
          :data-source-shard="slot.source + 1"
          :data-owner-shard="slot.owner + 1"
          :title="`Slot block ${slot.id + 1}: about ${SLOT_UNIT} slots`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cluster-morph {
  --cluster-ease: cubic-bezier(0.22, 1, 0.36, 1);
  width: 100%;
}

.cluster-morph__summary {
  display: grid;
  grid-template-columns: 105px 105px 155px 1fr;
  align-items: center;
  min-height: 58px;
  border: 1px solid rgb(188 181 231 / 28%);
  background: rgb(26 32 38 / 35%);
  color: #f7fbfe;
}

.cluster-morph__summary > div {
  display: flex;
  align-items: baseline;
  gap: 7px;
  padding: 0 14px;
  border-right: 1px solid rgb(188 181 231 / 20%);
}

.cluster-morph__summary strong {
  color: #e0a2af;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 25px;
  line-height: 1;
}

.cluster-morph__summary span {
  color: #d3dde7;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cluster-morph__event {
  justify-content: flex-end;
  border-right: 0 !important;
}

.cluster-morph__event-copy {
  color: #6983ff !important;
  font-family: 'Cascadia Code', monospace;
  transition: color 300ms ease;
}

.is-expanded .cluster-morph__event-copy {
  color: #8fd9ba !important;
}

.is-contracted .cluster-morph__event-copy {
  color: #e0a2af !important;
}

.cluster-morph__slot-unit {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #bcb5e7 !important;
  font-family: 'Cascadia Code', monospace;
}

.cluster-morph__slot-unit i {
  width: 6px;
  height: 6px;
  border: 1px solid rgb(255 255 255 / 48%);
  background: #6983ff;
}

.cluster-morph__stage {
  position: relative;
  height: 345px;
  margin-top: 13px;
  overflow: hidden;
}

.cluster-shard {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: calc((100% / var(--count)) * var(--index) + 6px);
  box-sizing: border-box;
  width: calc((100% / var(--count)) - 12px);
  padding: 12px;
  border: 1px solid rgb(188 181 231 / 33%);
  background: linear-gradient(180deg, rgb(48 23 110 / 66%) 0%, rgb(26 32 38 / 58%) 100%);
  transition: left 900ms var(--cluster-ease), width 900ms var(--cluster-ease), opacity 420ms ease, transform 900ms var(--cluster-ease);
}

.cluster-shard header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 9px;
  border-bottom: 1px solid rgb(188 181 231 / 24%);
}

.cluster-shard header span {
  color: #e0a2af;
  font-family: 'Cascadia Code', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.cluster-shard header code {
  color: #bcb5e7;
  font-family: 'Cascadia Code', monospace;
  font-size: 8px;
}

.cluster-node {
  position: relative;
  display: flex;
  box-sizing: border-box;
  min-height: 56px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #bcb5e7;
  background: #f7fbfe;
  color: #30176e;
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  transition: min-height 900ms var(--cluster-ease), font-size 900ms var(--cluster-ease);
}

.cluster-node--primary {
  position: relative;
  width: 74%;
  min-height: 116px;
  margin: 13px auto 0;
  justify-content: flex-start;
  padding-top: 8px;
  border: 2px solid #6983ff;
  background: #30176e;
  color: #fff;
}

.cluster-node__title {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.cluster-node span {
  color: #6983ff;
  font-family: 'Cascadia Code', monospace;
  font-size: 10px;
  font-weight: 700;
}

.cluster-node strong {
  margin-top: 4px;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 13px;
}

.cluster-node__mark {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 15px;
  height: 15px;
}

.cluster-node--primary small {
  position: absolute;
  right: 7px;
  bottom: 5px;
  left: 7px;
  color: #bcb5e7;
  font-family: 'Cascadia Code', monospace;
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  text-transform: uppercase;
}

.slot-layer {
  position: absolute;
  z-index: 3;
  inset: 0;
  pointer-events: none;
}

.slot-token {
  position: absolute;
  top: var(--slot-y);
  left: calc((100% / var(--count)) * var(--owner) + (100% / var(--count)) / 2 - var(--grid-half) + var(--slot-x));
  box-sizing: border-box;
  width: 5px;
  height: 5px;
  border: 1px solid rgb(255 255 255 / 42%);
  box-shadow: 0 1px 2px rgb(0 0 0 / 22%);
  transition:
    left 1050ms var(--cluster-ease) var(--slot-delay),
    top 1050ms var(--cluster-ease) var(--slot-delay),
    transform 300ms ease var(--slot-delay),
    box-shadow 300ms ease var(--slot-delay);
}

.slot-token--source-1 { background: #6983ff; }
.slot-token--source-2 { background: #e0a2af; }
.slot-token--source-3 { background: #bcb5e7; }

/* Slots in flight are emphasized on the way out and on the way home. */
.slot-token--moved {
  z-index: 4;
  box-shadow: 0 0 0 1px rgb(247 251 254 / 58%), 0 0 7px currentColor;
  transform: scale(1.22);
}

.cluster-link {
  position: relative;
  width: 72%;
  height: 28px;
  margin: 0 auto;
  border-bottom: 1px solid #6983ff;
}

.cluster-link::before {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  background: #6983ff;
  content: '';
}

.cluster-link i {
  position: absolute;
  bottom: -6px;
  width: 1px;
  height: 6px;
  background: #6983ff;
}

.cluster-link i:first-child { left: 0; }
.cluster-link i:last-child { right: 0; }

.cluster-replicas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.shard-enter-from,
.shard-leave-to {
  opacity: 0;
  transform: translateX(90px) scale(0.72);
}

.shard-leave-active {
  z-index: -1;
  /* Hold shard 04 on stage for a beat so its slots visibly drain home first. */
  transition-delay: 200ms;
}

@media (prefers-reduced-motion: reduce) {
  .cluster-shard,
  .cluster-node,
  .slot-token,
  .cluster-morph__event-copy {
    transition: none;
  }
}
</style>
