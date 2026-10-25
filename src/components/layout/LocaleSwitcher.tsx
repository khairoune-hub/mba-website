'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { otherLocale, type Locale } from '@/i18n/config'
import { routeKeyFor, segments } from '@/i18n/routes'
import { useAlternates } from './Alternates'
import { GlobeIcon } from '../ui/icons'

/** Switches language while keeping the current page (static routes are mapped; detail pages declare their alternates). */
export function LocaleSwitcher({ locale, label, ariaLabel, className = '' }: { locale: Locale; label: string; ariaLabel: string; className?: string }) {
  const pathname = usePathname()
  const alternates = useAlternates()
  const target = otherLocale(locale)

  let hrefTarget = alternates?.[target]
  if (!hrefTarget) {
    const parts = pathname.split('/').filter(Boolean)
    const seg = parts[1]
    // usePathname returns the public URL; map either the public or the internal segment.
    const key = seg ? routeKeyFor(locale, seg) ?? routeKeyFor('ar', seg) : 'home'
    if (key) {
      const rest = parts.slice(2)
      // Detail slugs differ per locale; without declared alternates, fall back to the listing.
      hrefTarget = '/' + [target, segments[key][target], ...(key === 'news' || key === 'events' ? [] : rest)].filter(Boolean).join('/')
    } else {
      hrefTarget = `/${target}`
    }
  }

  return (
    <Link
      href={hrefTarget}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-charcoal ring-1 ring-inset ring-charcoal/15 transition-colors hover:ring-green-ink ${className}`}
      prefetch={false}
    >
      <GlobeIcon className="size-4 text-green-ink" />
      <span className={target === 'ar' ? 'font-[family-name:var(--font-themix)]' : 'font-[family-name:var(--font-inter)]'}>{label}</span>
    </Link>
  )
}
