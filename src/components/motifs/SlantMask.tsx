import { useId, type ReactNode } from 'react'
import { roundedPath, slantDx } from '@/lib/geometry'

/**
 * Clips its content to the icon's slanted slab: flat top and bottom, sides leaning at 66°, rounded corners.
 * `ratio` is width / height of the rendered box so the radius stays circular. Mirrored in RTL.
 */
export function SlantMask({ children, ratio = 4 / 3, radius = 28, className = '' }: { children: ReactNode; ratio?: number; radius?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  const h = 1000
  const w = h * ratio
  const dx = Math.min(slantDx(h) * 0.5, w * 0.25)
  const r = radius * (h / 400)
  const d = roundedPath([
    [dx, 0, r],
    [w, 0, r],
    [w - dx, h, r],
    [0, h, r],
  ])
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: String(ratio) }}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={d} transform={`scale(${1 / w} ${1 / h})`} />
        </clipPath>
      </svg>
      <div className="flip-rtl absolute inset-0" style={{ clipPath: `url(#${id})` }}>
        <div className="flip-rtl absolute inset-0">{children}</div>
      </div>
    </div>
  )
}
