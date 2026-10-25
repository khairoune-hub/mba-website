import { MARK_VIEWBOX, PATH_A, PATH_M, PATH_SUMMIT } from './mark-paths'

export type MarkVariant = 'color' | 'onDark' | 'onGreen' | 'mono' | 'white'

/** Fill per shape [M, A, summit], following the approved backgrounds in the brand book (slide 5). */
export const markFills: Record<MarkVariant, [string, string, string]> = {
  color: ['var(--color-green)', 'var(--color-charcoal)', 'var(--color-green)'],
  onDark: ['var(--color-green)', '#ffffff', 'var(--color-green)'],
  onGreen: ['#ffffff', 'var(--color-charcoal)', '#ffffff'],
  mono: ['var(--color-charcoal)', 'var(--color-charcoal)', 'var(--color-charcoal)'],
  white: ['#ffffff', '#ffffff', '#ffffff'],
}

type Props = {
  variant?: MarkVariant
  title?: string
  className?: string
}

/** The MBA icon. Never mirrored in RTL: a logo keeps its orientation. */
export function MbaMark({ variant = 'color', title, className }: Props) {
  const [m, a, s] = markFills[variant]
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path fill={m} d={PATH_M} />
      <path fill={a} d={PATH_A} />
      <path fill={s} d={PATH_SUMMIT} />
    </svg>
  )
}
