import { roundedPath, slantDx } from '@/lib/geometry'

type Tone = 'green' | 'gold' | 'navy' | 'charcoal' | 'mist'
type Corner = 'top-start' | 'bottom-end' | 'top-end' | 'bottom-start'

const W = 400
const H = 190
// Solid band along the top edge whose inner side leans at 66° and turns with a large radius (brand book slides 3, 7, 13).
const PATH = roundedPath([
  [0, 0, 0],
  [W, 0, 0],
  [W - slantDx(H), H, 42],
  [0, H, 0],
])

const gradients: Record<Tone, [string, string]> = {
  green: ['#84c42b', '#b9de87'],
  gold: ['#b8ab2e', '#cbbf5c'],
  navy: ['#0f172a', '#1d2740'],
  charcoal: ['#3a3a3b', '#4c4c4d'],
  mist: ['#e8eae5', '#f3f4f2'],
}

/**
 * Decorative slanted corner shape. Positioned with logical insets and mirrored in RTL so the slant always opens
 * toward the reading direction.
 */
export function SlantCorner({
  corner = 'top-start',
  tone = 'green',
  className = 'w-[min(34vw,380px)]',
}: {
  corner?: Corner
  tone?: Tone
  className?: string
}) {
  const id = `sc-${tone}-${corner}`
  const [a, b] = gradients[tone]
  const pos = {
    'top-start': 'top-0 start-0',
    'top-end': 'top-0 end-0 -scale-x-100',
    'bottom-start': 'bottom-0 start-0 -scale-y-100',
    'bottom-end': 'bottom-0 end-0 rotate-180',
  }[corner]
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${pos} ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="flip-rtl block h-auto w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        <path d={PATH} fill={`url(#${id})`} />
      </svg>
    </div>
  )
}
