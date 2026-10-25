import { roundedPath, slantDx } from '@/lib/geometry'
import { DrawPaths } from '../motion/DrawPaths'

type Preset = 'hero' | 'band' | 'section' | 'values' | 'footer'

const VB_W = 1440
const VB_H = 800
const R = 70

// Thin lines that run horizontally and then turn at 66° with a large radius (brand book backgrounds).
const presets: Record<Preset, string[]> = {
  hero: [
    roundedPath([[-10, 330, 0], [180, 330, R], [180 + slantDx(330), -10, 0]], false),
    roundedPath([[1450, 470, 0], [560, 470, R], [560 - slantDx(250), 220, R], [800, -10, 0]], false),
    roundedPath([[-10, 740, 0], [1010, 740, R], [1010 + slantDx(220), 520, 0]], false),
  ],
  band: [
    roundedPath([[-10, 520, 0], [210, 520, R], [210 + slantDx(530), -10, 0]], false),
    roundedPath([[1450, 640, 0], [900, 640, R], [900 - slantDx(300), 340, R], [1100, -10, 0]], false),
    roundedPath([[520, 810, 0], [520 + slantDx(260), 550, R], [900, 550, R], [900 + slantDx(260), 810, 0]], false),
  ],
  section: [
    roundedPath([[-10, 120, 0], [120, 120, R], [120 + slantDx(130), -10, 0]], false),
    roundedPath([[1450, 700, 0], [1180, 700, R], [1180 + slantDx(710), -10, 0]], false),
  ],
  values: [
    roundedPath([[900, -10, 0], [900 - slantDx(820), 810, 0]], false),
    roundedPath([[-10, 380, 0], [640, 380, R], [640 + slantDx(390), -10, 0]], false),
    roundedPath([[1450, 430, 0], [800, 430, R], [800 - slantDx(380), 810, 0]], false),
  ],
  footer: [roundedPath([[-10, 90, 0], [980, 90, R], [980 + slantDx(100), -10, 0]], false)],
}

export function Hairlines({
  preset = 'section',
  tone = 'green',
  className = '',
  animate = 'view',
}: {
  preset?: Preset
  tone?: 'green' | 'white'
  className?: string
  /** 'view': draw when scrolled into view · 'load': draw on page load · 'none': static */
  animate?: 'view' | 'load' | 'none'
}) {
  const stroke = tone === 'white' ? 'rgb(255 255 255 / .55)' : 'rgb(144 190 65 / .45)'
  const cls = `flip-rtl pointer-events-none absolute inset-0 h-full w-full ${className}`
  if (animate !== 'none') return <DrawPaths paths={presets[preset]} stroke={stroke} className={cls} onLoad={animate === 'load'} />
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      className={`flip-rtl pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {presets[preset].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
