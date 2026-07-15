<template>
  <UApp>
    <div class="relative flex h-screen w-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <UButton
        :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
        color="neutral"
        variant="ghost"
        size="lg"
        class="absolute top-4 right-4 z-50"
        @click="toggleDarkMode"
      />
      <div class="flex h-full w-1/2 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <header class="shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <p class="text-lg font-semibold text-highlighted">Charities</p>
          <p class="mt-1 text-sm text-muted">Browse organisations on the map and in the list.</p>
          <div v-if="selectedCounty" class="mt-2 flex items-center gap-2">
            <UBadge :label="`Filtered by: ${selectedCounty}`" color="primary" variant="subtle" size="md" />
            <UButton label="Clear" color="neutral" variant="ghost" size="xs" @click="selectedCounty = null" />
          </div>
          <div class="mt-4 flex gap-3">
            <UFormField label="Search & filter" class="flex-1">
              <UInputMenu v-model="displayedKeys" v-model:open="menuOpen" :items="selectItems" label-key="name" value-key="key"
                multiple placeholder="Search charities..." icon="i-lucide-search" class="w-full"
                @focus="menuOpen = true" @click="menuOpen = true" />
            </UFormField>
            <UFormField label="Tags" class="flex-1">
              <UInputMenu v-model="displayedTagKeys" v-model:open="tagMenuOpen" :items="tagSelectItems" label-key="name" value-key="key"
                multiple placeholder="Filter by tags..." icon="i-lucide-tag" class="w-full"
                @focus="tagMenuOpen = true" @click="tagMenuOpen = true" />
            </UFormField>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <UAlert v-if="filteredCharities.length === 0" color="neutral" variant="subtle"
            description="No charities match this filter." />

          <ul v-else class="flex flex-col gap-4">
            <li v-for="charity in filteredCharities" :key="charity.name" @click="toggleCharity(charity)"
              @mouseenter="hoveredCharity = charity" @mouseleave="hoveredCharity = null"
              class="cursor-pointer">
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
                    <p class="text-xs text-muted">{{ selectedCharity === charity ? 'Click to deselect' : 'Click to show on map' }}</p>
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
                      <UBadge v-for="tag in charity.tags" :key="tag" :label="tag" color="primary" variant="subtle" size="sm" />
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
        <Map :markers="headOfficeMarkers" :highlighted-counties="highlightedCounties"
          :selected-county="selectedCounty" @county-click="toggleCounty"
          @marker-hover="onMarkerHover" @marker-click="onMarkerClick" />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Map from './map.vue'

const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

export type Charity = {
  name: string
  logo: string
  address: string
  ceo: string
  activeCounties: string[]
  headOffice: { lat: number; lon: number }
  tags: string[]
}

const charities = ref<Charity[]>([
  {
    name: 'Bright Futures Trust',
    logo: 'https://picsum.photos/seed/bf/200',
    address: '14 King Street, London',
    ceo: 'Eleanor Hughes',
    activeCounties: ['Greater London', 'Surrey', 'Kent'],
    headOffice: { lat: 51.5074, lon: -0.1278 },
    tags: ['education', 'youth', 'community'],
  },
  {
    name: 'Northern Hearts Foundation',
    logo: 'https://picsum.photos/seed/nh/200',
    address: '82 Deansgate, Manchester',
    ceo: 'David Butterworth',
    activeCounties: ['Lancashire', 'Cheshire', 'Derbyshire'],
    headOffice: { lat: 53.4808, lon: -2.2426 },
    tags: ['health', 'elderly', 'wellbeing'],
  },
  {
    name: 'Green Coast Alliance',
    logo: 'https://picsum.photos/seed/gc/200',
    address: '7 Harbour View, Plymouth',
    ceo: 'Sarah Penrose',
    activeCounties: ['Devon', 'Cornwall', 'Dorset'],
    headOffice: { lat: 50.3755, lon: -4.1427 },
    tags: ['environment', 'wildlife', 'conservation'],
  },
  {
    name: 'Midlands Youth Network',
    logo: 'https://picsum.photos/seed/my/200',
    address: '31 Corporation Street, Birmingham',
    ceo: 'Marcus Taylor',
    activeCounties: ['Warwickshire', 'Staffordshire', 'Worcestershire'],
    headOffice: { lat: 52.4862, lon: -1.8904 },
    tags: ['youth', 'education', 'sport'],
  },
  {
    name: 'Harbour Hope',
    logo: 'https://picsum.photos/seed/hh/200',
    address: '5 Quayside, Bristol',
    ceo: 'Fiona Watts',
    activeCounties: ['Somerset', 'Wiltshire', 'Devon'],
    headOffice: { lat: 51.4545, lon: -2.5879 },
    tags: ['homelessness', 'community', 'wellbeing'],
  },
  {
    name: 'Scottish Wildlife Rescue',
    logo: 'https://picsum.photos/seed/sw/200',
    address: '19 Royal Mile, Edinburgh',
    ceo: 'Angus MacLeod',
    activeCounties: ['Scotland', 'Northumberland', 'Cumbria'],
    headOffice: { lat: 55.9533, lon: -3.1883 },
    tags: ['wildlife', 'conservation', 'environment'],
  },
  {
    name: 'Stepping Stones Autism',
    logo: 'https://picsum.photos/seed/ss/200',
    address: '22 Park Lane, Leeds',
    ceo: 'Rachel Okonkwo',
    activeCounties: ['Yorkshire', 'Lancashire', 'Derbyshire'],
    headOffice: { lat: 53.8008, lon: -1.5491 },
    tags: ['autism', 'disability', 'education'],
  },
  {
    name: 'Thames Valley Carers',
    logo: 'https://picsum.photos/seed/tv/200',
    address: '88 Bridge Street, Reading',
    ceo: 'Jonathan Webb',
    activeCounties: ['Berkshire', 'Oxfordshire', 'Buckinghamshire'],
    headOffice: { lat: 51.4543, lon: -0.9781 },
    tags: ['elderly', 'health', 'carers'],
  },
  {
    name: 'Lakeland Community Trust',
    logo: 'https://picsum.photos/seed/lc/200',
    address: '3 Market Square, Kendal',
    ceo: 'Patricia Hodgson',
    activeCounties: ['Cumbria', 'Lancashire', 'Yorkshire'],
    headOffice: { lat: 54.3269, lon: -2.7461 },
    tags: ['community', 'environment', 'sport'],
  },
  {
    name: 'East Anglia Mind Matters',
    logo: 'https://picsum.photos/seed/ea/200',
    address: '41 Elm Hill, Norwich',
    ceo: 'Simon Blackwell',
    activeCounties: ['Norfolk', 'Suffolk', 'Cambridgeshire'],
    headOffice: { lat: 52.6309, lon: 1.2974 },
    tags: ['mental health', 'wellbeing', 'youth'],
  },
  {
    name: 'Welsh Valleys Aid',
    logo: 'https://picsum.photos/seed/wv/200',
    address: '15 High Street, Merthyr Tydfil',
    ceo: 'Rhiannon Davies',
    activeCounties: ['Wales', 'Herefordshire', 'Shropshire'],
    headOffice: { lat: 51.7485, lon: -3.3781 },
    tags: ['community', 'education', 'homelessness'],
  },
  {
    name: 'Sunrise Disability Support',
    logo: 'https://picsum.photos/seed/sd/200',
    address: '60 Queen Street, Cardiff',
    ceo: 'Owen Griffiths',
    activeCounties: ['Wales', 'Somerset', 'Herefordshire'],
    headOffice: { lat: 51.4816, lon: -3.1791 },
    tags: ['disability', 'autism', 'carers'],
  },
  {
    name: 'Pennine Rescue Dogs',
    logo: 'https://picsum.photos/seed/pr/200',
    address: '9 Chapel Walk, Sheffield',
    ceo: 'Karen Mitchell',
    activeCounties: ['Yorkshire', 'Derbyshire', 'Nottinghamshire'],
    headOffice: { lat: 53.3811, lon: -1.4701 },
    tags: ['wildlife', 'conservation', 'community'],
  },
  {
    name: 'Highlands Heritage Fund',
    logo: 'https://picsum.photos/seed/hf/200',
    address: '2 Castle Road, Inverness',
    ceo: 'Iain Campbell',
    activeCounties: ['Scotland', 'Northumberland', 'Durham'],
    headOffice: { lat: 57.4778, lon: -4.2247 },
    tags: ['heritage', 'community', 'environment'],
  },
  {
    name: 'Liverpool Kids First',
    logo: 'https://picsum.photos/seed/lk/200',
    address: '33 Bold Street, Liverpool',
    ceo: 'Tracey O\'Brien',
    activeCounties: ['Lancashire', 'Cheshire', 'Staffordshire'],
    headOffice: { lat: 53.4084, lon: -2.9916 },
    tags: ['youth', 'education', 'sport'],
  },
  {
    name: 'Sussex Dementia Care',
    logo: 'https://picsum.photos/seed/sdc/200',
    address: '12 The Lanes, Brighton',
    ceo: 'Michael Ashworth',
    activeCounties: ['Sussex', 'Surrey', 'Kent'],
    headOffice: { lat: 50.8225, lon: -0.1372 },
    tags: ['elderly', 'health', 'carers'],
  },
  {
    name: 'Tyne & Wear Foodbank',
    logo: 'https://picsum.photos/seed/tw/200',
    address: '27 Grey Street, Newcastle',
    ceo: 'Laura Henderson',
    activeCounties: ['Northumberland', 'Durham', 'Yorkshire'],
    headOffice: { lat: 54.9783, lon: -1.6178 },
    tags: ['homelessness', 'community', 'health'],
  },
  {
    name: 'Cotswold Conservation',
    logo: 'https://picsum.photos/seed/cc/200',
    address: '8 Market Place, Cirencester',
    ceo: 'Helen Barker',
    activeCounties: ['Oxfordshire', 'Wiltshire', 'Worcestershire'],
    headOffice: { lat: 51.7143, lon: -1.9686 },
    tags: ['conservation', 'environment', 'heritage'],
  },
  {
    name: 'Belfast Together',
    logo: 'https://picsum.photos/seed/bt/200',
    address: '50 Donegall Place, Belfast',
    ceo: 'Conor Murray',
    activeCounties: ['Northern Ireland', 'Scotland', 'Cumbria'],
    headOffice: { lat: 54.5973, lon: -5.9301 },
    tags: ['community', 'youth', 'mental health'],
  },
  {
    name: 'Fenland Sports Foundation',
    logo: 'https://picsum.photos/seed/fs/200',
    address: '4 Cathedral Square, Peterborough',
    ceo: 'James Whitfield',
    activeCounties: ['Cambridgeshire', 'Lincolnshire', 'Norfolk'],
    headOffice: { lat: 52.5695, lon: -0.2405 },
    tags: ['sport', 'youth', 'disability'],
  },
])

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
