import type { Charity, CharityDataSource } from './useCharities'

const DEFAULT_DATA_URL = '/sample-charities.json'
const DEFAULT_JSON_ID = 'charity-map-data'

function parseInlineJson(text: string): Charity[] {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) {
    throw new Error('Charity data must be a JSON array')
  }
  return data
}

export function resolveDataSource(mountEl: HTMLElement): CharityDataSource {
  const jsonId = mountEl.dataset.jsonId || DEFAULT_JSON_ID
  const jsonEl = document.getElementById(jsonId)

  if (jsonEl?.textContent?.trim()) {
    return { type: 'inline', data: parseInlineJson(jsonEl.textContent) }
  }

  const queryDataUrl = new URLSearchParams(window.location.search).get('data')
  const url = queryDataUrl || mountEl.dataset.src || DEFAULT_DATA_URL
  return { type: 'url', url }
}
