import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowIcon } from './icons'

type Variant = 'primary' | 'secondary' | 'onDark' | 'navy' | 'ghost'

const styles: Record<Variant, string> = {
  // Charcoal on green = 4.6:1 (AA). White on green is not allowed for text.
  primary: 'bg-green text-charcoal hover:bg-[#9cc853] shadow-[0_1px_0_rgb(0_0_0/0.04)]',
  secondary: 'bg-white/70 text-charcoal ring-1 ring-inset ring-charcoal/20 hover:ring-green-ink backdrop-blur',
  onDark: 'bg-white text-navy hover:bg-green',
  navy: 'bg-navy text-white hover:bg-charcoal',
  ghost: 'text-charcoal hover:text-green-ink',
}

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-[background-color,box-shadow,color,transform] duration-300 ease-[var(--ease-out)] hover:-translate-y-px'

type Common = { variant?: Variant; arrow?: boolean; className?: string; children: ReactNode }

export function ButtonLink({ href, variant = 'primary', arrow = false, className = '', children, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
      {arrow && <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />}
    </Link>
  )
}

export function Button({ variant = 'primary', arrow = false, className = '', children, ...rest }: Common & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${styles[variant]} disabled:pointer-events-none disabled:opacity-60 ${className}`} {...rest}>
      {children}
      {arrow && <ArrowIcon className="size-4" />}
    </button>
  )
}

/** Inline text link with an arrow that follows the reading direction. */
export function LinkArrow({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 font-semibold text-green-ink hover:text-charcoal ${className}`}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] rtl:bg-right">
        {children}
      </span>
      <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  )
}
