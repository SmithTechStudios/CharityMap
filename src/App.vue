<template>
  <UApp>
    <div v-if="isLoading"
      class="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-lucide-loader-circle" class="h-10 w-10 animate-spin text-primary" />
        <p class="text-sm text-muted">Loading charities&hellip;</p>
      </div>
    </div>

    <div v-else-if="error"
      class="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div class="flex flex-col items-center gap-4 max-w-md text-center">
        <UIcon name="i-lucide-circle-alert" class="h-10 w-10 text-red-500" />
        <p class="text-sm text-muted">{{ error }}</p>
        <UButton label="Retry" color="primary" @click="retry" />
      </div>
    </div>

    <div v-else class="charity-map-embed relative flex min-h-[900px] w-full max-w-full overflow-visible bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <UButton :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" color="neutral" variant="ghost" size="lg"
        class="absolute top-4 right-4 z-50" @click="toggleDarkMode" />
      <div
        class="flex h-full w-1/2 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <header class="relative z-20 shrink-0 overflow-visible border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <p class="text-lg font-semibold text-highlighted">Charities</p>
          <p class="mt-1 text-sm text-muted">Browse organisations on the map and in the list.</p>
          <div v-if="selectedCounty" class="mt-2 flex items-center gap-2">
            <UBadge :label="`Filtered by: ${selectedCounty}`" color="primary" variant="subtle" size="md" />
            <UButton label="Clear" color="neutral" variant="ghost" size="xs" @click="clearCountyFilter" />
          </div>
          <div class="mt-4 flex gap-3">
            <UFormField label="Search & filter" class="relative z-20 flex-1">
              <UInputMenu v-model="displayedKeys" v-model:open="menuOpen" :items="selectItems" label-key="name"
                value-key="key" multiple placeholder="Search charities..." icon="i-lucide-search" class="w-full"
                portal="body" :ui="menuUi" :content="menuContent" @focus="menuOpen = true" @click="menuOpen = true" />
            </UFormField>
            <UFormField label="Tags" class="relative z-20 flex-1">
              <UInputMenu v-model="displayedTagKeys" v-model:open="tagMenuOpen" :items="tagSelectItems" label-key="name"
                value-key="key" multiple placeholder="Filter by tags..." icon="i-lucide-tag" class="w-full"
                portal="body" :ui="menuUi" :content="menuContent" @focus="tagMenuOpen = true"
                @click="tagMenuOpen = true" />
            </UFormField>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <UAlert v-if="filteredCharities.length === 0" color="neutral" variant="subtle"
            description="No charities match this filter." />

          <ul v-else class="flex flex-col gap-4">
            <li v-for="charity in filteredCharities" :key="charity.name" @click="toggleCharity(charity)"
              @mouseenter="hoveredCharity = charity" @mouseleave="hoveredCharity = null" class="cursor-pointer">
              <UCard :title="charity.name" :description="charity.address"
                class="transition-shadow hover:shadow-md hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
                :class="{ 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-md': selectedCharity === charity }">
                <template #header>
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <img :src="charity.logo" :alt="`${charity.name} logo`"
                        class="max-h-full max-w-full object-contain p-1" loading="lazy" />
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-highlighted">{{ charity.name }}</p>
                      <p class="text-sm text-muted">{{ charity.address }}</p>
                    </div>
                    <p class="text-xs text-muted">
                      {{ selectedCharity === charity ? 'Click to deselect' : 'Click to show on map' }}
                    </p>
                  </div>
                </template>

                <dl class="space-y-2 text-sm">
                  <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-muted">Chief executive</dt>
                    <dd>{{ charity.ceo }}</dd>
                  </div>
                  <div v-if="charity.tags.length">
                    <dt class="text-xs font-medium uppercase tracking-wide text-muted">Tags</dt>
                    <dd class="mt-1 flex flex-wrap gap-1">
                      <UBadge v-for="tag in charity.tags" :key="tag" :label="tag" color="primary" variant="subtle"
                        size="sm" />
                    </dd>
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
        <Map :markers="headOfficeMarkers" :highlighted-counties="highlightedCounties" :selected-county="selectedCounty"
          @county-click="toggleCounty" @marker-hover="onMarkerHover" @marker-click="onMarkerClick" />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import Map from './map.vue'
import { useCharities, type Charity } from './useCharities'

const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const getCharities = inject<() => Charity[]>('getCharities', () => [])
const { charities, isLoading, error, retry } = useCharities(getCharities)

const menuUi = { content: 'z-[10000]' }
const menuContent = { side: 'bottom' as const, sideOffset: 8, collisionPadding: 16, position: 'popper' as const, strategy: 'fixed' as const }

const ALL_KEY = '__all__'

const charityKeys = computed(() => charities.value.map((c) => c.name))

const allTags = computed(() => [...new Set(charities.value.flatMap((c) => c.tags))].sort())

const selectItems = computed(() => [
  { name: 'All charities', key: ALL_KEY },
  ...charities.value.map((c) => ({ name: c.name, key: c.name })),
])

const selectedCharityKeys = ref<string[]>([ALL_KEY])
const menuOpen = ref(false)

const ALL_TAGS_KEY = '__all_tags__'

const tagSelectItems = computed(() => [
  { name: 'All tags', key: ALL_TAGS_KEY },
  ...allTags.value.map((t) => ({ name: t, key: t })),
])

const selectedTagKeys = ref<string[]>([ALL_TAGS_KEY])
const tagMenuOpen = ref(false)

const displayedTagKeys = computed({
  get() {
    return selectedTagKeys.value.includes(ALL_TAGS_KEY)
      ? [ALL_TAGS_KEY]
      : selectedTagKeys.value
  },
  set(newVal: string[]) {
    onTagSelectionChange(newVal)
  },
})

function onTagSelectionChange(newVal: string[]) {
  const hadAll = selectedTagKeys.value.includes(ALL_TAGS_KEY)
  const hasAll = newVal.includes(ALL_TAGS_KEY)
  const individuals = newVal.filter((k) => k !== ALL_TAGS_KEY)

  if (hadAll && hasAll && individuals.length > 0) {
    selectedTagKeys.value = individuals
  } else if (!hadAll && hasAll) {
    selectedTagKeys.value = [ALL_TAGS_KEY]
  } else if (individuals.length === 0) {
    selectedTagKeys.value = [ALL_TAGS_KEY]
  } else {
    const allSelected = allTags.value.every((t) => individuals.includes(t))
    selectedTagKeys.value = allSelected ? [ALL_TAGS_KEY] : individuals
  }
}

const displayedKeys = computed({
  get() {
    return selectedCharityKeys.value.includes(ALL_KEY)
      ? [ALL_KEY]
      : selectedCharityKeys.value
  },
  set(newVal: string[]) {
    onSelectionChange(newVal)
  },
})

function onSelectionChange(newVal: string[]) {
  const hadAll = selectedCharityKeys.value.includes(ALL_KEY)
  const hasAll = newVal.includes(ALL_KEY)
  const individuals = newVal.filter((k) => k !== ALL_KEY)

  if (hadAll && hasAll && individuals.length > 0) {
    selectedCharityKeys.value = individuals
  } else if (!hadAll && hasAll) {
    selectedCharityKeys.value = [ALL_KEY]
  } else if (individuals.length === 0) {
    selectedCharityKeys.value = [ALL_KEY]
  } else {
    const allIndividualsSelected = charityKeys.value.every((k) => individuals.includes(k))
    selectedCharityKeys.value = allIndividualsSelected ? [ALL_KEY] : individuals
  }
}

const filteredCharities = computed(() => {
  let result = charities.value
  if (!selectedCharityKeys.value.includes(ALL_KEY) && selectedCharityKeys.value.length > 0) {
    result = result.filter((c) => selectedCharityKeys.value.includes(c.name))
  }
  if (!selectedTagKeys.value.includes(ALL_TAGS_KEY) && selectedTagKeys.value.length > 0) {
    result = result.filter((c) => c.tags.some((t) => selectedTagKeys.value.includes(t)))
  }
  if (selectedCounty.value) {
    result = result.filter((c) => c.activeCounties.includes(selectedCounty.value!))
  }
  return result
})

const selectedCharity = ref<Charity | null>(null)
const hoveredCharity = ref<Charity | null>(null)

function toggleCharity(charity: Charity) {
  selectedCharity.value = selectedCharity.value === charity ? null : charity
  selectedCounty.value = null
}

function onMarkerHover(markerId: string | null) {
  if (markerId) {
    hoveredCharity.value = charities.value.find((c) => c.name === markerId) ?? null
  } else {
    hoveredCharity.value = null
  }
}

function onMarkerClick(markerId: string) {
  const charity = charities.value.find((c) => c.name === markerId)
  if (!charity) return
  selectedCharityKeys.value = [charity.name]
}

const selectedCounty = ref<string | null>(null)

function clearCountyFilter() {
  selectedCounty.value = null
}

function toggleCounty(countyName: string) {
  selectedCounty.value = selectedCounty.value === countyName ? null : countyName
  selectedCharity.value = null
}

const highlightedCounties = computed(() => {
  const active = hoveredCharity.value ?? selectedCharity.value
  return active?.activeCounties ?? []
})

const headOfficeMarkers = computed(() =>
  filteredCharities.value.map((c) => ({
    id: c.name,
    label: c.name,
    lat: c.headOffice.lat,
    lon: c.headOffice.lon,
    address: c.address,
    ceo: c.ceo,
    tags: c.tags,
    activeCounties: c.activeCounties,
  })),
)
</script>
