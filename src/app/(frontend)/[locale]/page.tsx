import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getEvents, getFooter, getHome, getPosts, getValues } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { HomeHero } from '@/components/sections/HomeHero'
import { WhoWeAre } from '@/components/sections/WhoWeAre'
import { MissionVision } from '@/components/sections/MissionVision'
import { ValuesPreview } from '@/components/sections/ValuesPreview'
import { Activities } from '@/components/sections/Activities'
import { CtaBand } from '@/components/sections/CtaBand'
import { PostCard } from '@/components/cards/PostCard'
import { EventCard } from '@/components/cards/EventCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LinkArrow } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from './contact/ContactForm'

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
      <WhoWeAre eyebrow={t.home.whoEyebrow} who={home.who} more={{ href: href(locale, 'about'), label: t.cta.about }} />
      <MissionVision mission={home.mission} vision={home.vision} />
      {s.values && values.items.length > 0 && <ValuesPreview eyebrow={t.home.valuesEyebrow} items={values.items} />}
      {s.activities && home.activities.items.length > 0 && <Activities eyebrow={t.home.activitiesEyebrow} activities={home.activities} />}

      {/* News and events only appear once there is something to show. */}
      {s.news && posts.docs.length > 0 && (
        <section className="section-y" aria-labelledby="news-title">
          <div className="container-mba">
            <SectionHeader eyebrow={t.home.newsEyebrow} title={t.home.newsTitle} id="news-title" action={<LinkArrow href={href(locale, 'news')}>{t.cta.allNews}</LinkArrow>} />
            <Reveal as="div" className="mt-12">
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.docs.map((p) => (
                  <li key={p.id}>
                    <PostCard post={p} locale={locale} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {s.events && events.docs.length > 0 && (
        <section className={`section-y ${s.news && posts.docs.length > 0 ? 'bg-mist' : ''}`} aria-labelledby="events-title">
          <div className="container-mba">
            <SectionHeader eyebrow={t.home.eventsEyebrow} title={t.home.eventsTitle} id="events-title" action={<LinkArrow href={href(locale, 'events')}>{t.cta.allEvents}</LinkArrow>} />
            <Reveal as="div" className="mt-12">
              <ul className="grid gap-6 lg:grid-cols-2">
                {events.docs.map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} locale={locale} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {s.cta && (
        <CtaBand eyebrow={t.home.joinEyebrow} title={home.cta.title} body={home.cta.body} phone={footer.phone} email={footer.email}>
          <ContactForm locale={locale} t={t.contact} variant="membership" submitLabel={home.cta.buttonLabel} />
        </CtaBand>
      )}
    </>
  )
}
