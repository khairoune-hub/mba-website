export type LogoVariant = 'color' | 'white' | 'onGreen' | 'mono'

type Props = {
  /** color: on white · white: on ink/dark · onGreen: all white on brand green · mono: single ink. */
  variant?: LogoVariant
  title?: string
  className?: string
}

/**
 * Full lockup: "MBA" + BUSINESS ALLIANCE, extracted from brand book v1.2 (scripts/extract-logo-pdf.py).
 * Served as static SVGs from /brand so the browser caches them once. Never mirrored in RTL.
 */
export function MbaLogo({ variant = 'color', title = 'MZAB Business Alliance', className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static vector, no optimisation needed
    <img src={`/brand/logo-${variant}.svg`} width={1088} height={312} alt={title} className={className} decoding="async" draggable={false} />
  )
}
