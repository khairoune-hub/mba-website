import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowIcon } from './icons'

type Variant = 'primary' | 'secondary' | 'onDark' | 'outlineLight' | 'ghost'

const styles: Record<Variant, string> = {
  primary: 'bg-green text-white hover:bg-green-deep',
  secondary: 'bg-white text-charcoal ring-1 ring-inset ring-charcoal/25 hover:ring-charcoal',
  onDark: 'bg-white text-ink hover:bg-green-soft',
  outlineLight: 'text-white ring-1 ring-inset ring-white/50 hover:ring-white hover:bg-white/10',
  ghost: 'text-charcoal hover:text-green',
}

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-md)] px-6 py-3 text-[0.95rem] font-semibold transition-colors duration-200'

type Common = { variant?: Variant; arrow?: boolean; className?: string; children: ReactNode }

const Arrow = () => <ArrowIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />

export function ButtonLink({ href, variant = 'primary', arrow = false, className = '', children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function Button({ variant = 'primary', arrow = false, className = '', children, ...rest }: Common & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${styles[variant]} disabled:pointer-events-none disabled:opacity-60 ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

/** Inline text link with an arrow that follows the reading direction. */
export function LinkArrow({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 font-semibold text-green hover:text-green-deep hover:underline ${className}`}>
      {children}
      <Arrow />
    </Link>
  )
}
