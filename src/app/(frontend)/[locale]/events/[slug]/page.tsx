import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dirOf, isLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getEventBySlug, getLocalizedSlugs } from '@/lib/queries'
import { formatDateRange, formatTime } from '@/lib/format'
import { pageMetadata, siteURL } from '@/lib/seo'
import { eventLd, JsonLd } from '@/lib/jsonld'
import { SetAlternates } from '@/components/layout/Alternates'
import { Hairlines } from '@/components/motifs/Hairlines'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { Gallery } from '@/components/ui/Gallery'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowBackIcon, CalendarIcon, ClockIcon, PinIcon } from '@/components/ui/icons'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const dynamicParams = true
export const generateStaticParams = () => []

async function load(locale: Locale, rawSlug: string) {
  const event = await getEventBySlug(locale, decodeURIComponent(rawSlug))
  if (!event) return null
  const slugs = await getLocalizedSlugs('events', event.id)
  const paths = Object.fromEntries(locales.filter((l) => slugs[l]).map((l) => [l, href(l, 'events', slugs[l])])) as Partial<Record<Locale, string>>
  return { event, paths }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const data = await load(locale, slug)
  if (!data) return {}
  const { event, paths } = data
  return pageMetadata({ locale, paths, title: event.seo?.title || event.title, description: event.seo?.description || event.excerpt, image: event.seo?.image || event.coverImage })
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const data = await load(locale, slug)
  if (!data) notFound()
  const { event, paths } = data
  const t = getDictionary(locale)
  const gallery = (event.gallery ?? []).filter((g): g is Media => typeof g === 'object' && g !== null)
  const isPast = new Date(event.endDate ?? event.startDate) < new Date()
  const url = `${siteURL}${paths[locale] ?? href(locale, 'events', event.slug ?? '')}`
  const time = [formatTime(locale, event.startDate), event.endDate ? formatTime(locale, event.endDate) : null].filter(Boolean).join(' – ')

  return (
    <>
      <SetAlternates {...paths} />
      <article>
        <header className="bg-radial-field relative isolate overflow-hidden">
          <Hairlines preset="section" />
          <div className="container-mba relative pb-14 pt-12 md:pt-16">
            <Link href={href(locale, 'events')} className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink hover:text-charcoal">
              <ArrowBackIcon className="size-4" />
              {t.cta.backToEvents}
            </Link>
            <div className="animate-rise mt-8 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h1 className="t-h1">{event.title}</h1>
                {event.excerpt && <p className="t-lead mt-5">{event.excerpt}</p>}
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <dl className="space-y-5 rounded-[var(--radius-card)] bg-white/80 p-6 ring-1 ring-border backdrop-blur">
                  <div className="flex gap-3">
                    <CalendarIcon className="mt-0.5 size-5 shrink-0 text-green-ink" />
                    <div>
                      <dt className="text-sm text-muted">{t.events.date}</dt>
                      <dd className="font-semibold text-charcoal">{formatDateRange(locale, event.startDate, event.endDate)}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <ClockIcon className="mt-0.5 size-5 shrink-0 text-green-ink" />
                    <div>
                      <dt className="text-sm text-muted">{t.events.time}</dt>
                      <dd className="font-semibold text-charcoal" dir="ltr">{time}</dd>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex gap-3">
                      <PinIcon className="mt-0.5 size-5 shrink-0 text-green-ink" />
                      <div>
                        <dt className="text-sm text-muted">{t.events.location}</dt>
                        <dd className="font-semibold text-charcoal">{event.location}</dd>
                        {event.mapUrl && (
                          <dd className="mt-1">
                            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-green-ink underline decoration-gold underline-offset-4">
                              {t.cta.viewMap}
                            </a>
                          </dd>
                        )}
                      </div>
                    </div>
                  )}
                  {event.registrationUrl && !isPast && (
                    <ButtonLink href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="w-full" arrow>
                      {t.cta.register}
                    </ButtonLink>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </header>
        {event.coverImage && (
          <div className="container-mba">
            <div className="relative aspect-[21/9] overflow-hidden rounded-[var(--radius-lg)] bg-mist">
              <MediaImage media={event.coverImage} size="hero" fill priority sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className="container-mba max-w-3xl py-14 md:py-20">
          <RichText data={event.description} locale={locale} />
        </div>
        {gallery.length > 0 && (
          <section className="container-mba pb-[var(--section-y)]" aria-labelledby="gallery">
            <h2 id="gallery" className="t-h2 mb-8">{t.events.gallery}</h2>
            <Gallery images={gallery} dir={dirOf(locale)} labels={{ close: t.common.lightboxClose, prev: t.common.lightboxPrev, next: t.common.lightboxNext }} />
          </section>
        )}
      </article>
      <JsonLd data={eventLd(locale, event, url)} />
    </>
  )
}
