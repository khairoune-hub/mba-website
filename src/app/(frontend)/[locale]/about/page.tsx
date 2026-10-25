import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getAbout, getFooter, getHome } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { CtaBand } from '@/components/sections/CtaBand'
import { MbaLogo } from '@/components/brand/MbaLogo'
import { GlassIcon } from '@/components/brand/GlassIcon'
import { Hairlines } from '@/components/motifs/Hairlines'
import { SlantMask } from '@/components/motifs/SlantMask'
import { Tri, TriList } from '@/components/motifs/Tri'
import { MediaImage } from '@/components/ui/MediaImage'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/SectionHeader'
import { ScrollTimeline } from '@/components/motion/ScrollTimeline'
import { SlantReveal } from '@/components/motion/SlantReveal'
import { MarkAssemble } from '@/components/motion/MarkAssemble'
import { SplitReveal } from '@/components/motion/SplitReveal'

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
  const [about, home, footer] = await Promise.all([getAbout(locale), getHome(locale), getFooter(locale)])

  return (
    <>
      <PageHero eyebrow={t.meta.brand} title={about.intro.title} lead={about.intro.lead} />

      {/* Story & mission */}
      <section className="section-y" aria-labelledby="story">
        <div className="container-mba grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{t.nav.about}</Eyebrow>
            <h2 id="story" className="t-h2 mt-3"><SplitReveal text={about.story.title} /></h2>
            <p className="mt-6 text-lg leading-[1.85]">{about.story.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            {about.image ? (
              <SlantReveal rtl={locale === 'ar'}>
                <SlantMask ratio={4 / 5}>
                  <MediaImage media={about.image} size="card" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
                </SlantMask>
              </SlantReveal>
            ) : (
              <div className="bg-radial-field relative overflow-hidden rounded-[var(--radius-lg)] p-10">
                <GlassIcon className="mx-auto w-full max-w-sm" />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Mozabite heritage — navy band */}
      <section className="on-dark relative isolate overflow-hidden bg-navy text-white/85" aria-labelledby="heritage">
        <Hairlines preset="band" tone="white" className="opacity-30" />
        <div className="container-mba section-y relative grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <MarkAssemble variant="onDark" className="h-20 w-auto" />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-8">
            <h2 id="heritage" className="t-h2 !text-white"><SplitReveal text={about.heritage.title} /></h2>
            <p className="mt-6 text-lg leading-[1.9]">{about.heritage.body}</p>
          </Reveal>
        </div>
      </section>

      {/* CEDEAO vision + umbrella model */}
      <section className="section-y" aria-label={`${about.vision.title} · ${about.model.title}`}>
        <div className="container-mba grid gap-8 lg:grid-cols-2">
          {[about.vision, about.model].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className="rounded-[var(--radius-card)] bg-mist p-8 md:p-10">
              <h2 className="t-h3">{b.title}</h2>
              <p className="mt-4 leading-[1.85]">{b.body}</p>
              <TriList items={b.points} className="mt-6 font-medium text-charcoal" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      {about.timeline.length > 0 && (
        <section className="bg-radial-field relative isolate overflow-hidden" aria-labelledby="timeline">
          <div className="container-mba section-y relative">
            <h2 id="timeline" className="t-h2">{locale === 'ar' ? 'محطات' : 'Repères'}</h2>
            <ScrollTimeline className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
              {about.timeline.map((step, i) => (
                <Reveal as="li" key={step.year + step.title} delay={i * 0.08} className="relative ps-10 md:ps-0 md:pt-10">
                  <span aria-hidden="true" className="absolute start-0 top-1 md:top-0">
                    <Tri className="size-4" tone={i === about.timeline.length - 1 ? 'gold' : 'green'} />
                  </span>
                  <p className="font-[family-name:var(--font-head)] text-2xl font-bold text-green-ink">{step.year}</p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-charcoal/85">{step.body}</p>
                </Reveal>
              ))}
            </ScrollTimeline>
          </div>
        </section>
      )}

      {/* Logo story */}
      <section className="section-y" aria-labelledby="logo-story">
        <div className="container-mba grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="rounded-[var(--radius-lg)] bg-white p-10 ring-1 ring-border md:p-14">
              <MbaLogo className="h-auto w-full" />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8">
            <h2 id="logo-story" className="t-h2">{about.logo.title}</h2>
            <p className="mt-6 text-lg leading-[1.85]">{about.logo.body}</p>
          </Reveal>
        </div>
      </section>

      {/* Leadership (optional) */}
      {about.team.length > 0 && (
        <section className="section-y bg-mist" aria-labelledby="team">
          <div className="container-mba">
            <h2 id="team" className="t-h2">{locale === 'ar' ? 'فريق القيادة' : 'Équipe dirigeante'}</h2>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {about.team.map((m: any) => (
                <li key={m.id ?? m.name}>
                  <SlantMask ratio={4 / 5} className="bg-white">
                    {m.photo ? <MediaImage media={m.photo} size="card" fill sizes="300px" className="object-cover" /> : <div className="bg-radial-field absolute inset-0" />}
                  </SlantMask>
                  <p className="mt-4 text-lg font-semibold text-charcoal">{m.name}</p>
                  {m.role && <p className="text-muted">{m.role}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={home.cta.title} body={home.cta.body} buttonLabel={home.cta.buttonLabel} buttonHref={href(locale, 'contact')} phone={footer.phone} email={footer.email} />
    </>
  )
}
