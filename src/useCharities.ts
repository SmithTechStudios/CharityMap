import { ref, type Ref } from 'vue'

export type Charity = {
  name: string
  logo: string
  address: string
  ceo: string
  activeCounties: string[]
  headOffice: { lat: number; lon: number }
  tags: string[]
}

export function useCharities(getCharities: () => Charity[]) {
  const charities = ref<Charity[]>([]) as Ref<Charity[]>
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  function load() {
    isLoading.value = true
    error.value = null

    try {
      charities.value = getCharities()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      isLoading.value = false
    }
  }

  load()

  return { charities, isLoading, error, retry: load }
}
