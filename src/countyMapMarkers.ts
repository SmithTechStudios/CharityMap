/**
 * Returns the center of the bounding box for an SVG county path, in the same
 * user units as the map's viewBox. `countyPathId` must match the path's `id`
 * (e.g. "GB-OX" for Oxfordshire).
 */
export function getCountyBBoxCenter(countyPathId: string): { cx: number; cy: number } | null {
  if (typeof document === 'undefined') return null
  const el = document.getElementById(countyPathId)
  if (!(el instanceof SVGGraphicsElement)) return null
  const { x, y, width, height } = el.getBBox()
  return { cx: x + width / 2, cy: y + height / 2 }
}

// Geo bounds from the SVG's mapsvg:geoViewBox attribute
const GEO_MIN_LON = -10.476709
const GEO_MAX_LAT = 60.845981
const GEO_MAX_LON = 1.769373
const GEO_MIN_LAT = 49.954480

// SVG viewBox dimensions
const SVG_WIDTH = 770.396
const SVG_HEIGHT = 1214.0623

/**
 * Converts a geographic coordinate (lat/lon) to SVG user-space coordinates
 * using the linear mapping defined by the map's geoViewBox and viewBox.
 */
export function geoToSvg(lat: number, lon: number): { cx: number; cy: number } {
  const cx = ((lon - GEO_MIN_LON) / (GEO_MAX_LON - GEO_MIN_LON)) * SVG_WIDTH
  const cy = ((GEO_MAX_LAT - lat) / (GEO_MAX_LAT - GEO_MIN_LAT)) * SVG_HEIGHT
  return { cx, cy }
}
