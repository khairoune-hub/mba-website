import type { ReactNode } from 'react'

/** Flat card with a hairline border; interactive cards darken their border on hover. */
export function Card({ children, className = '', interactive = true }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={`relative rounded-[var(--radius-card)] bg-white ring-1 ring-border ${
        interactive ? 'transition-shadow duration-200 hover:shadow-[var(--shadow-lift)] hover:ring-charcoal/20 focus-within:ring-green' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
