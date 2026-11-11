import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getAbout, getHome, getValues } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { WhoWeAre } from '@/components/sections/WhoWeAre'
import { MissionVision } from '@/components/sections/MissionVision'
import { ValuesPreview } from '@/components/sections/ValuesPreview'
import { Activities } from '@/components/sections/Activities'
import { MediaImage } from '@/components/ui/MediaImage'
import { ButtonLink } from '@/components/ui/Button'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const about = await getAbout(locale)
  return pageMetadata({ locale, route: 'about', title: about.intro.title, description: about.intro.lead })
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const [about, home, values] = await Promise.all([getAbout(locale), getHome(locale), getValues(locale)])

  return (
    <>
      <PageHero eyebrow={<span dir="ltr">MZAB BUSINESS ALLIANCE</span>} title={about.intro.title} lead={about.intro.lead} />

      {about.image && (
        <div className="container-mba pt-[var(--section-y)]">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[var(--radius-card)] bg-mist">
            <MediaImage media={about.image} size="hero" fill sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <WhoWeAre eyebrow={t.home.whoEyebrow} who={home.who} />
      <MissionVision mission={home.mission} vision={home.vision} />
      {/* Anchor target for the old /valeurs route, which redirects here. */}
      <div id="values" className="scroll-mt-20">
        {values.items.length > 0 && <ValuesPreview eyebrow={t.home.valuesEyebrow} items={values.items} />}
      </div>
      {home.activities.items.length > 0 && <Activities eyebrow={t.home.activitiesEyebrow} activities={home.activities} />}

      {about.team.length > 0 && (
        <section className="section-y" aria-labelledby="team">
          <div className="container-mba">
            <h2 id="team" className="t-h2">
              {locale === 'ar' ? 'فريق القيادة' : 'Équipe dirigeante'}
            </h2>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {about.team.map((m: any) => (
                <li key={m.id ?? m.name}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-mist">
                    {m.photo && <MediaImage media={m.photo} size="card" fill sizes="300px" className="object-cover" />}
                  </div>
                  <p className="mt-4 text-lg font-semibold text-charcoal">{m.name}</p>
                  {m.role && <p className="text-muted">{m.role}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="on-dark bg-ink text-white" aria-labelledby="about-cta">
        <div className="container-mba flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 id="about-cta" className="t-h2 !text-white">
              {home.cta.title}
            </h2>
            <p className="mt-4 text-white/75">{home.cta.body}</p>
          </div>
          <ButtonLink href={`${href(locale, 'home')}#adhesion`} arrow className="shrink-0">
            {t.cta.join}
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
