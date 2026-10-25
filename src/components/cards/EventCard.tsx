import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import { dateParts, formatTime } from '@/lib/format'
import type { Event } from '@/payload-types'
import { MediaImage } from '../ui/MediaImage'
import { TraceBorder } from '../motifs/TraceBorder'
import { SlantReveal } from '../motion/SlantReveal'
import { ClockIcon, PinIcon } from '../ui/icons'
import { CardPlaceholder } from './CardPlaceholder'

export function EventCard({ event, locale, layout = 'row' }: { event: Event; locale: Locale; layout?: 'row' | 'stack' }) {
  const d = dateParts(locale, event.startDate)
  const url = href(locale, 'events', event.slug ?? '')
  return (
    <article
      className={`group relative grid overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]  ${
        layout === 'row' ? 'sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : ''
      }`}
    >
      <TraceBorder />
      <div className={`relative overflow-hidden bg-mist ${layout === 'row' ? 'aspect-[16/10] sm:aspect-auto sm:min-h-[240px]' : 'aspect-[16/10]'}`}>
        <SlantReveal rtl={locale === 'ar'} className="absolute inset-0">
          {event.coverImage ? (
            <MediaImage media={event.coverImage} size="card" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          ) : (
            <CardPlaceholder />
          )}
        </SlantReveal>
        <div className="absolute start-4 top-4 flex min-w-16 flex-col items-center rounded-[16px] bg-white/95 px-3 py-2 text-center shadow-[var(--shadow-soft)] backdrop-blur">
          <span className="font-[family-name:var(--font-inter)] text-2xl font-bold leading-none text-charcoal">{d.day}</span>
          <span className="mt-1 text-xs font-semibold text-green-ink">{d.month}</span>
          <span className="text-[0.7rem] text-muted">{d.year}</span>
        </div>
      </div>
      <div className="flex flex-col p-6">
        <h3 className="text-xl font-semibold leading-snug text-charcoal [:lang(ar)_&]:font-bold">
          <Link href={url} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {event.title}
          </Link>
        </h3>
        {event.excerpt && <p className="mt-3 line-clamp-2 text-charcoal/85">{event.excerpt}</p>}
        <ul className="mt-auto space-y-2 pt-5 text-sm text-charcoal">
          <li className="flex items-center gap-2">
            <ClockIcon className="size-4 text-green-ink" />
            <span dir="ltr">{formatTime(locale, event.startDate)}</span>
          </li>
          {event.location && (
            <li className="flex items-center gap-2">
              <PinIcon className="size-4 text-green-ink" />
              {event.location}
            </li>
          )}
        </ul>
      </div>
    </article>
  )
}
