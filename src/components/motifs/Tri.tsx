/** The small green ▲ accent glyph from the brand book. */
type Props = { className?: string; tone?: 'green' | 'gold' | 'white' | 'charcoal'; title?: string }

const tones = { green: 'var(--color-green)', gold: 'var(--color-gold)', white: '#fff', charcoal: 'var(--color-charcoal)' }

export function Tri({ className = 'size-[0.7em]', tone = 'green', title }: Props) {
  return (
    <svg
      viewBox="0 0 100 88"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      <path
        fill={tones[tone]}
        d="M39.6 9.7a12 12 0 0 1 20.8 0l37.2 62.6A10.5 10.5 0 0 1 88.6 88H11.4a10.5 10.5 0 0 1-9-15.7z"
      />
    </svg>
  )
}

/** A list whose markers are small triangles. */
export function TriList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3">
          <Tri className="size-[0.6em] translate-y-[-0.05em]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Corner ornament: one filled triangle with two small outlined ones (from the invitation cards). */
export function TriCluster({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={`flip-rtl ${className}`} aria-hidden="true">
      <path d="M6 34 L18 8 L30 34 Z" fill="var(--color-green)" strokeLinejoin="round" stroke="var(--color-green)" strokeWidth="3" />
      <path d="M37 16 L44 12 L44 20 Z" fill="none" stroke="var(--color-green)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M49 16 L56 12 L56 20 Z" fill="none" stroke="var(--color-green)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
