import Link from 'next/link'
import { ChevronIcon } from './icons'

export function Pagination({ page, totalPages, makeHref, labels }: { page: number; totalPages: number; makeHref: (p: number) => string; labels: { label: string; prev: string; next: string; page: (n: number) => string } }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const item = 'inline-flex min-w-11 h-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors'
  return (
    <nav aria-label={labels.label} className="mt-14 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className={`${item} ring-1 ring-inset ring-border hover:ring-green-ink`} rel="prev">
          <ChevronIcon className="size-4 rotate-180" />
          <span className="sr-only">{labels.prev}</span>
        </Link>
      )}
      {pages.map((p) => (
        <Link key={p} href={makeHref(p)} aria-current={p === page ? 'page' : undefined} aria-label={labels.page(p)} className={`${item} ${p === page ? 'bg-charcoal text-white' : 'ring-1 ring-inset ring-border hover:ring-green-ink'}`}>
          <span dir="ltr">{p}</span>
        </Link>
      ))}
      {page < totalPages && (
        <Link href={makeHref(page + 1)} className={`${item} ring-1 ring-inset ring-border hover:ring-green-ink`} rel="next">
          <ChevronIcon className="size-4" />
          <span className="sr-only">{labels.next}</span>
        </Link>
      )}
    </nav>
  )
}
