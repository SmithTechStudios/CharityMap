<template>
  <UApp>
    <div class="flex h-screen w-screen bg-slate-50 text-slate-900">
      <div class="flex h-full w-1/2 flex-col border-r border-slate-200 bg-white shadow-sm">
        <header class="shrink-0 border-b border-slate-100 px-6 py-5">
          <p class="text-lg font-semibold text-highlighted">Charities</p>
          <p class="mt-1 text-sm text-muted">Browse organisations on the map and in the list.</p>
          <div class="mt-4">
            <UFormField label="Show">
              <USelect v-model="selectedCharityKey" :items="selectItems" label-key="name" value-key="key"
                class="w-full" />
            </UFormField>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <UAlert v-if="filteredCharities.length === 0" color="neutral" variant="subtle"
            description="No charities match this filter." />

          <ul v-else class="flex flex-col gap-4">
            <li v-for="charity in filteredCharities" :key="charity.name">
              <UCard :title="charity.name" :description="charity.address">
                <template #header>
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <img :src="charity.logo" :alt="`${charity.name} logo`"
                        class="max-h-full max-w-full object-contain p-1" loading="lazy" />
                    </div>
                    <div>
                      <p class="font-semibold text-highlighted">{{ charity.name }}</p>
                      <p class="text-sm text-muted">{{ charity.address }}</p>
                    </div>
                  </div>
                </template>

                <dl class="space-y-2 text-sm">
                  <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-muted">Chief executive</dt>
                    <dd>{{ charity.ceo }}</dd>
                  </div>
                </dl>

                <template #footer>
                  <div class="flex flex-wrap gap-1.5">
                    <UBadge v-for="county in charity.activeCounties" :key="county" :label="county" color="info"
                      variant="soft" size="sm" />
                  </div>
                </template>
              </UCard>
            </li>
          </ul>
        </div>
      </div>
      <div class="h-full w-1/2 flex justify-center">
        <Map />
      </div>
    </div>
  </UApp>
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

const ALL_KEY = '__all__'

const selectItems = computed(() => [
  { name: 'All charities', key: ALL_KEY },
  ...charities.value.map((c) => ({ name: c.name, key: c.name })),
])

const selectedCharityKey = ref(ALL_KEY)

const filteredCharities = computed(() => {
  if (selectedCharityKey.value === ALL_KEY) return charities.value
  return charities.value.filter((c) => c.name === selectedCharityKey.value)
})
</script>
