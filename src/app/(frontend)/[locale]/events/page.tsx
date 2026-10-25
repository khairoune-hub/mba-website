import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getEvents } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { EventCard } from '@/components/cards/EventCard'
import { Pagination } from '@/components/ui/Pagination'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string; page?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  const sp = await searchParams
  return pageMetadata({ locale, route: 'events', title: t.events.title, description: t.events.lead, noIndex: Boolean(sp.tab || sp.page) })
}

export default async function EventsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const sp = await searchParams
  const when = sp.tab === 'past' ? 'past' : 'upcoming'
  const page = Math.max(1, Number(sp.page) || 1)
  const events = await getEvents(locale, { when, page, limit: 8 })
  const base = href(locale, 'events')
  const tabs = [
    { key: 'upcoming', label: t.events.upcoming, href: base },
    { key: 'past', label: t.events.past, href: `${base}?tab=past` },
  ]

  return (
    <>
      <PageHero eyebrow={t.nav.events} title={t.events.title} lead={t.events.lead} />
      <section className="section-y !pt-12">
        <div className="container-mba">
          <nav aria-label={t.events.tabsLabel}>
            <ul className="inline-flex rounded-full bg-mist p-1">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <Link
                    href={tab.href}
                    aria-current={when === tab.key ? 'page' : undefined}
                    className={`inline-flex rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${when === tab.key ? 'bg-white text-charcoal shadow-[var(--shadow-soft)]' : 'text-charcoal/70 hover:text-charcoal'}`}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {events.docs.length ? (
            <ul className="mt-10 grid gap-6 lg:grid-cols-2">
              {events.docs.map((e, i) => (
                <Reveal as="li" key={e.id} delay={(i % 2) * 0.06}>
                  <EventCard event={e} locale={locale} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-muted">{t.events.none}</p>
          )}
          <Pagination
            page={events.page}
            totalPages={events.totalPages}
            makeHref={(p) => `${base}?${new URLSearchParams({ ...(when === 'past' ? { tab: 'past' } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`}
            labels={t.pagination}
          />
        </div>
      </section>
    </>
  )
}
