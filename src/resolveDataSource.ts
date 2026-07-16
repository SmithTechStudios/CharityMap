import type { Charity } from './useCharities'

const DEFAULT_JSON_ID = 'charity-map-data'

function parseInlineJson(text: string): Charity[] {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) {
    throw new Error('Charity data must be a JSON array')
  }
  return data
}

export function resolveCharities(mountEl: HTMLElement): Charity[] {
  const jsonId = mountEl.dataset.jsonId || DEFAULT_JSON_ID
  const jsonEl = document.getElementById(jsonId)

  if (!jsonEl) {
    throw new Error(
      `Missing #${jsonId} script tag. Add your JSON array in <script id="${jsonId}" type="application/json">...</script> before charity-map.js.`,
    )
  }

  const raw = jsonEl.textContent?.trim()
  if (!raw) {
    throw new Error(`#${jsonId} is empty. Paste your JSON array inside the script tag.`)
  }

  try {
    return parseInlineJson(raw)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`Invalid JSON in #${jsonId}: ${message}`)
  }
}
