<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'
import aivenLogo from '@valkey-assets/participants/aiven.svg'
import awsLogo from '@valkey-assets/participants/aws.svg'
import byteDanceLogo from '@valkey-assets/participants/bytedance.svg'
import digitalOceanLogo from '@valkey-assets/participants/digitalocean.svg'
import ericssonLogo from '@valkey-assets/participants/ericsson.svg'
import gcpLogo from '@valkey-assets/participants/gcp.svg'
import herokuLogo from '@valkey-assets/participants/heroku.svg'
import momentoLogo from '@valkey-assets/participants/momento.svg'
import netAppLogo from '@valkey-assets/participants/netapp_instaclustr.svg'
import oracleLogo from '@valkey-assets/participants/Oracle.svg'
import perconaLogo from '@valkey-assets/participants/percona.svg'
import upCloudLogo from '@valkey-assets/participants/upcloud.svg'

const participants = [
  { name: 'Aiven', logo: aivenLogo },
  { name: 'Alibaba Cloud', logo: 'https://valkey.io/img/alibaba.png' },
  { name: 'Amazon Web Services', logo: awsLogo },
  { name: 'BetterDB', logo: 'https://valkey.io/img/betterdb.svg' },
  { name: 'ByteDance', logo: byteDanceLogo },
  { name: 'DigitalOcean', logo: digitalOceanLogo },
  { name: 'Ericsson', logo: ericssonLogo },
  { name: 'Freshworks', logo: 'https://valkey.io/img/freshworks.png' },
  { name: 'Google Cloud', logo: gcpLogo },
  { name: 'Heroku', logo: herokuLogo },
  { name: 'IONOS Cloud', logo: 'https://valkey.io/img/ionos-cloud.svg' },
  { name: 'Momento', logo: momentoLogo },
  { name: 'NetApp Instaclustr', logo: netAppLogo },
  { name: 'Oracle', logo: oracleLogo },
  { name: 'Percona', logo: perconaLogo },
  { name: 'Solanica', logo: 'https://valkey.io/img/solanica.svg' },
  { name: 'Tencent Cloud', logo: 'https://valkey.io/img/tencent-cloud.svg' },
  { name: 'UpCloud', logo: upCloudLogo },
  { name: 'Vultr', logo: 'https://valkey.io/img/vultr.svg' },
  { name: 'anynines', logo: 'https://valkey.io/img/anynines.svg' },
  { name: 'k0rdent', logo: 'https://valkey.io/img/k0rdent.svg' },
]

const entryVectors = [
  [-260, -150, -8], [0, -220, 4], [260, -150, 8],
  [-300, 0, -6], [300, 0, 6],
  [-260, 150, 7], [0, 220, -4], [260, 150, -7],
]

const playing = ref(false)

const cardStyle = (index) => {
  const [x, y, rotation] = entryVectors[index % entryVectors.length]
  return {
    '--entry-x': `${x}px`,
    '--entry-y': `${y}px`,
    '--entry-rotation': `${rotation}deg`,
    '--entry-delay': `${(index % 7) * 58 + Math.floor(index / 7) * 120}ms`,
  }
}

const play = async () => {
  playing.value = false
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      playing.value = true
    })
  })
}

onMounted(play)
onSlideEnter(play)
onSlideLeave(() => {
  playing.value = false
})
</script>

<template>
  <div class="participant-constellation" :class="{ 'is-playing': playing }">
    <div class="participant-grid" role="list" aria-label="Valkey participating organizations">
      <div
        v-for="(participant, index) in participants"
        :key="participant.name"
        class="participant-card"
        :style="cardStyle(index)"
        :data-participant="participant.name"
        role="listitem"
      >
        <img :src="participant.logo" :alt="`${participant.name} logo`">
        <span>{{ participant.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.participant-constellation {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.participant-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
}

.participant-card {
  display: grid;
  min-width: 0;
  min-height: 105px;
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-items: center;
  padding: 13px 10px 9px;
  border: 1px solid #d3dde7;
  background: #fffdfa;
  box-shadow: none;
  opacity: 0;
  filter: grayscale(1);
  transform: translate(var(--entry-x), var(--entry-y)) rotate(var(--entry-rotation)) scale(0.68);
  transition:
    opacity 520ms ease var(--entry-delay),
    transform 760ms cubic-bezier(0.22, 1, 0.36, 1) var(--entry-delay),
    filter 600ms ease var(--entry-delay);
}

.is-playing .participant-card {
  opacity: 1;
  filter: grayscale(0);
  transform: translate(0, 0) rotate(0) scale(1);
}

.participant-card img {
  display: block;
  max-width: 112px;
  max-height: 49px;
  object-fit: contain;
}

.participant-card span {
  margin-top: 7px;
  overflow: hidden;
  color: #56636f;
  font-family: 'Open Sans', 'Segoe UI', sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .participant-card {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
  }
}
</style>
