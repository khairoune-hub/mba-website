import type { ReactNode } from 'react'

/** Card with the brand radius, subtle lift and a green hairline that appears on hover. */
export function Card({ children, className = '', interactive = true }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={`relative rounded-[var(--radius-card)] bg-white ring-1 ring-border ${
        interactive
          ? 'transition-[transform,box-shadow] duration-400 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:ring-green/60 focus-within:ring-green/60'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
