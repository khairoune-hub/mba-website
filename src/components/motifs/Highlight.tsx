import type { ReactNode } from 'react'

/** Green box behind a key word (brand book slide 4), or a gold underline. Charcoal text keeps AA contrast. */
export function Highlight({ children, variant = 'box' }: { children: ReactNode; variant?: 'box' | 'underline' }) {
  if (variant === 'underline') {
    return (
      <span className="bg-[linear-gradient(var(--color-gold),var(--color-gold))] bg-[length:100%_0.12em] bg-bottom bg-no-repeat pb-[0.05em]">
        {children}
      </span>
    )
  }
  return <mark className="box-decoration-clone rounded-[4px] bg-green px-[0.25em] text-charcoal">{children}</mark>
}
