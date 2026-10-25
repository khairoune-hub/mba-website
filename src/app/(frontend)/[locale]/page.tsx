import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getEvents, getFooter, getHome, getPosts, getValues } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { HomeHero } from '@/components/sections/HomeHero'
import { WhoWeAre } from '@/components/sections/WhoWeAre'
import { PillarsTriad } from '@/components/sections/PillarsTriad'
import { ValuesPreview } from '@/components/sections/ValuesPreview'
import { IconMeaning } from '@/components/sections/IconMeaning'
import { CtaBand } from '@/components/sections/CtaBand'
import { PostCard } from '@/components/cards/PostCard'
import { EventCard } from '@/components/cards/EventCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LinkArrow } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata({ locale, route: 'home' })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const [home, values, posts, events, footer] = await Promise.all([
    getHome(locale),
    getValues(locale),
    getPosts(locale, { limit: 3 }),
    getEvents(locale, { when: 'upcoming', limit: 2 }),
    getFooter(locale),
  ])
  const s = home.sections

  return (
    <>
      <HomeHero locale={locale} hero={home.hero} />
      <WhoWeAre locale={locale} who={home.who} />
      {s.pillars && <PillarsTriad eyebrow={t.home.pillarsEyebrow} title={t.home.pillarsTitle} pillars={home.pillars} />}
      {s.values && <ValuesPreview eyebrow={t.home.valuesEyebrow} title={t.home.valuesTitle} items={values.items} moreHref={href(locale, 'values')} moreLabel={t.nav.values} />}
      {s.iconMeaning && <IconMeaning data={home.iconMeaning} eyebrow={t.home.iconEyebrow} title={t.home.iconTitle} hint={t.home.iconHint} />}

      {s.news && (
        <section className="section-y bg-mist" aria-labelledby="news-title">
          <div className="container-mba">
            <SectionHeader eyebrow={t.home.newsEyebrow} title={t.home.newsTitle} id="news-title" action={<LinkArrow href={href(locale, 'news')}>{t.cta.allNews}</LinkArrow>} />
            {posts.docs.length ? (
              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.docs.map((p, i) => (
                  <Reveal as="li" key={p.id} delay={i * 0.07}>
                    <PostCard post={p} locale={locale} />
                  </Reveal>
                ))}
              </ul>
            ) : (
              <p className="mt-10 text-muted">{t.home.noNews}</p>
            )}
          </div>
        </section>
      )}

      {s.events && (
        <section className="section-y" aria-labelledby="events-title">
          <div className="container-mba">
            <SectionHeader eyebrow={t.home.eventsEyebrow} title={t.home.eventsTitle} id="events-title" action={<LinkArrow href={href(locale, 'events')}>{t.cta.allEvents}</LinkArrow>} />
            {events.docs.length ? (
              <ul className="mt-12 grid gap-6 lg:grid-cols-2">
                {events.docs.map((e, i) => (
                  <Reveal as="li" key={e.id} delay={i * 0.07}>
                    <EventCard event={e} locale={locale} />
                  </Reveal>
                ))}
              </ul>
            ) : (
              <p className="mt-10 text-muted">{t.home.noEvents}</p>
            )}
          </div>
        </section>
      )}

      {s.cta && <CtaBand title={home.cta.title} body={home.cta.body} buttonLabel={home.cta.buttonLabel} buttonHref={href(locale, 'contact')} phone={footer.phone} email={footer.email} />}
    </>
  )
}
