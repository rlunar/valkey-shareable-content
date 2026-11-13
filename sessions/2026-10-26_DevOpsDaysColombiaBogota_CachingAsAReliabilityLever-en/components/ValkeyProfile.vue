<script setup>
import BrandLogo from './BrandLogo.vue'
import performanceIcon from '@valkey-slide-icons/performance.svg'
import hashIcon from '@valkey-slide-icons/data-hash.svg'
import memoryIcon from '@valkey-slide-icons/memory-efficiency.svg'
import listIcon from '@valkey-slide-icons/data-list.svg'
import durabilityIcon from '@valkey-slide-icons/durability.svg'
import migrationIcon from '@valkey-slide-icons/migration.svg'
import communityIcon from '@valkey-slide-icons/community.svg'
import awsLogo from '@valkey-assets/participants/aws.svg'
import googleCloudLogo from '@valkey-assets/participants/gcp.svg'
import oracleLogo from '@valkey-assets/participants/Oracle.svg'
import ericssonLogo from '@valkey-assets/participants/ericsson.svg'
import perconaLogo from '@valkey-assets/participants/percona.svg'

const props = defineProps({ step: { type: Number, default: 3 } })

const capabilities = [
  { icon: performanceIcon, label: 'HIGH PERFORMANCE' },
  { icon: hashIcon, label: 'KEY / VALUE' },
  { icon: memoryIcon, label: 'CACHING' },
  { icon: listIcon, label: 'MESSAGE QUEUES' },
  { icon: durabilityIcon, label: 'PRIMARY DATABASE' },
]

// Technical Steering Committee affiliations, per MAINTAINERS.md in valkey-io/valkey.
const committee = [
  { name: 'AWS', logo: awsLogo, shape: 'mark' },
  { name: 'Google Cloud', logo: googleCloudLogo, shape: 'wide' },
  { name: 'Oracle', logo: oracleLogo, shape: 'wide' },
  { name: 'Alibaba Cloud', logo: '/logos/tsc/alibaba-cloud.png', shape: 'wide' },
  { name: 'Tencent Cloud', logo: '/logos/tsc/tencent-cloud.svg', shape: 'wide' },
  { name: 'Ericsson', logo: ericssonLogo, shape: 'mark' },
  { name: 'Percona', logo: perconaLogo, shape: 'mark' },
  { name: 'Apple', label: 'Apple®', shape: 'text' },
]

const revealed = (index) => ({ 'is-revealed': props.step >= index, 'is-current': props.step === index })
</script>

<template>
  <div class="valkey-profile" role="img" aria-label="Valkey: an open source, BSD-licensed, high-performance key/value datastore for caching, message queues, and primary-database workloads, backed by the Linux Foundation and created by the community eight days after the Redis license change">
    <header class="valkey-profile__identity">
      <BrandLogo tone="light" class="valkey-profile__logo" />
      <div class="valkey-profile__backing" :class="revealed(2)">
        <span class="valkey-profile__pill">BSD-3-CLAUSE</span>
        <div class="valkey-profile__lf">
          <small>BACKED BY</small>
          <img src="/logos/linux-foundation.svg" alt="The Linux Foundation" />
          <small>OPEN SOURCE FOREVER</small>
        </div>
      </div>
    </header>

    <ul class="valkey-profile__capabilities" :class="revealed(1)">
      <li v-for="(item, index) in capabilities" :key="item.label" :style="{ '--i': index }">
        <img :src="item.icon" alt="" />
        <strong>{{ item.label }}</strong>
      </li>
    </ul>

    <div class="valkey-profile__community" :class="revealed(3)">
      <article class="valkey-profile__origin">
        <img :src="migrationIcon" alt="" />
        <div>
          <span>MARCH 2024 · REDIS CHANGES ITS LICENSE</span>
          <strong>8 days</strong>
          <small>later the community launched Valkey: vendor neutral, under the Linux Foundation.</small>
        </div>
      </article>
      <article class="valkey-profile__tsc">
        <img :src="communityIcon" alt="" />
        <div>
          <span>TECHNICAL STEERING COMMITTEE</span>
          <ul>
            <li v-for="company in committee" :key="company.name" :class="`is-${company.shape}`">
              <span v-if="company.label" class="valkey-profile__company-name">{{ company.label }}</span>
              <img v-else :src="company.logo" :alt="company.name" :title="company.name" />
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.valkey-profile { display: grid; width: 100%; gap: 16px; }
.valkey-profile__identity { display: flex; align-items: center; justify-content: space-between; min-height: 52px; }
.valkey-profile__logo { width: 186px; }
.valkey-profile__backing { display: flex; align-items: center; gap: 16px; opacity: 0; transform: translateX(12px); transition: opacity 240ms ease, transform 320ms cubic-bezier(.22, 1, .36, 1); }
.valkey-profile__backing.is-revealed { opacity: 1; transform: none; }
.valkey-profile__pill { padding: 7px 11px; border: 1px solid #6983ff; border-radius: 999px; color: #30176e; font-family: 'Cascadia Code', monospace; font-size: 9px; font-weight: 700; letter-spacing: .1em; }
.valkey-profile__lf { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border: 1px solid #d3dde7; background: #f7fbfe; }
.valkey-profile__lf img { width: auto; height: 17px; }
.valkey-profile__lf small { color: #66727e; font-family: 'Cascadia Code', monospace; font-size: 8px; font-weight: 700; letter-spacing: .1em; }
.valkey-profile__capabilities { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.valkey-profile__capabilities li { display: flex; min-height: 188px; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 16px 10px; border: 1px solid #d3dde7; border-top: 5px solid #6983ff; background: #f7fbfe; opacity: 0; transform: translateY(10px); transition: opacity 240ms ease, transform 320ms cubic-bezier(.22, 1, .36, 1); transition-delay: calc(var(--i) * 60ms); }
.valkey-profile__capabilities.is-revealed li { opacity: 1; transform: none; }
.valkey-profile__capabilities img { width: 68px; height: 68px; }
.valkey-profile__capabilities strong { color: #30176e; font-family: 'Cascadia Code', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: .1em; text-align: center; }
.valkey-profile__community { display: grid; grid-template-columns: 39% 61%; gap: 12px; opacity: 0; transform: translateY(10px); transition: opacity 240ms ease, transform 320ms cubic-bezier(.22, 1, .36, 1); }
.valkey-profile__community.is-revealed { opacity: 1; transform: none; }
.valkey-profile__community article { display: flex; align-items: center; gap: 18px; padding: 16px 20px; border: 1px solid #d3dde7; border-left: 6px solid #e0a2af; background: #f7fbfe; }
.valkey-profile__community article > img { width: 56px; height: 56px; flex: none; }
.valkey-profile__tsc { border-left-color: #30176e !important; }
.valkey-profile__tsc > div { flex: 1; }
.valkey-profile__community span { color: #6983ff; font-family: 'Cascadia Code', monospace; font-size: 8.5px; font-weight: 700; letter-spacing: .1em; }
.valkey-profile__origin strong { display: block; margin-top: 2px; color: #30176e; font-size: 38px; line-height: 1; }
.valkey-profile__origin small { display: block; margin-top: 6px; color: #53606c; font-size: 11.5px; line-height: 1.35; }
.valkey-profile__tsc ul { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 9px 0 0; padding: 0; list-style: none; }
.valkey-profile__tsc li { display: flex; height: 40px; align-items: center; justify-content: center; padding: 6px 12px; border: 1px solid #d3dde7; border-radius: 6px; background: #fff; }
.valkey-profile__tsc li img { display: block; width: auto; max-width: 100%; max-height: 100%; object-fit: contain; }
.valkey-profile__tsc li.is-mark img { max-height: 30px; }
.valkey-profile__tsc li.is-wide img { max-height: 20px; }
.valkey-profile__company-name { color: #111 !important; font-family: Arial, sans-serif !important; font-size: 15px !important; font-weight: 600 !important; letter-spacing: -.02em !important; line-height: 1; white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .valkey-profile__backing,
  .valkey-profile__capabilities li,
  .valkey-profile__community { opacity: 1; transform: none; transition: none; }
}
</style>
