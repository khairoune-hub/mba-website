export type MarkVariant = 'color' | 'white'

type Props = {
  variant?: MarkVariant
  title?: string
  className?: string
}

/** The "A" + triangle from the logo, used as a compact mark (icons, placeholders). Never mirrored in RTL. */
export function MbaMark({ variant = 'color', title, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static vector, no optimisation needed
    <img src={`/brand/mark-${variant}.svg`} width={389} height={202} alt={title ?? ''} aria-hidden={title ? undefined : true} className={className} decoding="async" draggable={false} />
  )
}
