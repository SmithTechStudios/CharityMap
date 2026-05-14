<template>
  <div class="flex h-screen w-screen bg-slate-50 text-slate-900">
    <div class="flex h-full w-1/2 flex-col border-r border-slate-200 bg-white shadow-sm">
      <header class="shrink-0 border-b border-slate-100 px-6 py-5">
        <h1 class="text-lg font-semibold tracking-tight text-slate-800">Charities</h1>
        <p class="mt-1 text-sm text-slate-500">Browse organisations on the map and in the list.</p>
        <label class="mt-4 block">
          <span class="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Show</span>
          <select v-model="selectedCharityKey"
            class="w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
            <option value="">All charities</option>
            <option v-for="c in charities" :key="c.name" :value="c.name">{{ c.name }}</option>
          </select>
        </label>
      </header>

      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div v-if="filteredCharities.length === 0"
          class="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
          No charities match this filter.
        </div>

        <ul v-else class="flex flex-col gap-4">
          <li v-for="charity in filteredCharities" :key="charity.name"
            class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <article class="flex gap-4 p-4 sm:p-5">
              <div
                class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-24 sm:w-24">
                <img :src="charity.logo" :alt="`${charity.name} logo`" class="max-h-full max-w-full object-contain p-2"
                  loading="lazy" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-base font-semibold leading-tight text-slate-900 sm:text-lg">
                  {{ charity.name }}
                </h2>
                <dl class="mt-3 space-y-2.5 text-sm">
                  <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Address</dt>
                    <dd class="mt-0.5 text-slate-700">{{ charity.address }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Chief executive</dt>
                    <dd class="mt-0.5 text-slate-700">{{ charity.ceo }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">Active counties</dt>
                    <dd class="mt-1.5 flex flex-wrap gap-1.5">
                      <span v-for="county in charity.activeCounties" :key="county"
                        class="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800 ring-1 ring-inset ring-sky-100">
                        {{ county }}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </div>
    <div class="h-full w-1/2">
      <Map />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Map from './map.vue'

export type Charity = {
  name: string
  logo: string
  address: string
  ceo: string
  activeCounties: string[]
}

const charities = ref<Charity[]>([
  {
    name: 'Charity 1',
    logo: 'https://picsum.photos/200',
    address: '123 Main St, Anytown, USA',
    ceo: 'John Doe',
    activeCounties: ['NY', 'NJ', 'CT'],
  },
  {
    name: 'Charity 2',
    logo: 'https://picsum.photos/200',
    address: '456 Oak Ave, Somewhere, USA',
    ceo: 'Jane Smith',
    activeCounties: ['CA', 'OR', 'WA'],
  },
  {
    name: 'Charity 3',
    logo: 'https://picsum.photos/200',
    address: '789 River Rd, Elsewhere, USA',
    ceo: 'Alex Johnson',
    activeCounties: ['TX', 'FL', 'GA'],
  },
])

/** Empty string means “all charities”. */
const selectedCharityKey = ref('')

const filteredCharities = computed(() => {
  if (!selectedCharityKey.value) return charities.value
  return charities.value.filter((c) => c.name === selectedCharityKey.value)
})
</script>
