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
