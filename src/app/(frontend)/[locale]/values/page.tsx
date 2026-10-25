import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getValues } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { ValueWord } from '@/components/motifs/ValueWord'
import { Hairlines } from '@/components/motifs/Hairlines'
import { PATH_A, PATH_M, PATH_SUMMIT } from '@/components/brand/mark-paths'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return pageMetadata({ locale, route: 'values', title: t.nav.values, description: t.home.valuesTitle })
}

// One of the icon's shapes accompanies each value.
const ornaments = [
  { d: PATH_M, box: '0 0 380 534', fill: 'var(--color-green)' },
  { d: PATH_A, box: '258 0 380 534', fill: 'var(--color-charcoal)' },
  { d: PATH_SUMMIT, box: '515 200 280 334', fill: 'var(--color-green)' },
  { d: PATH_M, box: '0 0 380 534', fill: 'var(--color-gold)' },
]

export default async function ValuesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const { intro, items } = await getValues(locale)

  return (
    <>
      <PageHero eyebrow={t.nav.values} title={t.home.valuesTitle} lead={intro || undefined} />
      {items.map((v, i) => {
        const o = ornaments[i % ornaments.length]
        const alt = i % 2 === 1
        return (
          <section key={v.key} aria-labelledby={`value-${v.key}`} className={`relative isolate overflow-hidden ${alt ? 'bg-mist' : 'bg-white'}`}>
            {alt && <Hairlines preset="section" className="opacity-70" />}
            <div className="container-mba section-y relative grid items-center gap-12 lg:grid-cols-12">
              <Reveal className={`lg:col-span-7 ${alt ? 'lg:order-2 lg:col-start-6' : ''}`}>
                <p className="font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[0.2em] text-green-ink">0{i + 1}</p>
                <h2 id={`value-${v.key}`} className="mt-4 text-[clamp(3rem,2rem+4.5vw,6rem)] font-bold leading-[1.15] text-charcoal [:lang(fr)_&]:font-semibold">
                  <ValueWord before={v.before} after={v.after} title={v.title} />
                </h2>
                <p className="mt-6 max-w-xl text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] font-semibold leading-relaxed text-charcoal">{v.motto}</p>
                {v.body && <p className="mt-6 max-w-2xl text-lg leading-[1.85] text-ink/90">{v.body}</p>}
              </Reveal>
              <Reveal delay={0.1} className={`flex justify-center lg:col-span-4 ${alt ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9'}`}>
                <svg viewBox={o.box} className="h-48 w-auto md:h-64" aria-hidden="true">
                  <path d={o.d} fill={o.fill} opacity="0.9" />
                </svg>
              </Reveal>
            </div>
          </section>
        )
      })}
      <section className="container-mba section-y text-center">
        <p className="t-h3 mx-auto max-w-2xl">{t.meta.tagline}</p>
        <ButtonLink href={href(locale, 'about')} className="mt-8" arrow>
          {t.cta.about}
        </ButtonLink>
      </section>
    </>
  )
}
