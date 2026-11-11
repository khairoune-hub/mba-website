import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import type { HomeContent } from '@/content/defaults'
import { ButtonLink } from '../ui/Button'
import { Eyebrow } from '../ui/SectionHeader'

/** Ink hero with the brand book's static green corner triangles. No photo yet: a CMS image can be added later. */
export function HomeHero({ locale, hero }: { locale: Locale; hero: HomeContent['hero'] }) {
  return (
    <section data-hero className="on-dark relative isolate overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
      <div className="corner-tris" aria-hidden="true" />
      <div className="container-mba relative py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl">
          <Eyebrow tone="light">
            <span dir="ltr">{hero.eyebrow}</span>
          </Eyebrow>
          <h1 id="hero-title" className="t-display mt-6 !text-white">
            {hero.title}
          </h1>
          {hero.subtitle && <p className="t-lead mt-6 max-w-2xl !text-white/75">{hero.subtitle}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`${href(locale, 'home')}#adhesion`} arrow>
              {hero.primaryLabel}
            </ButtonLink>
            <ButtonLink href={href(locale, 'about')} variant="outlineLight">
              {hero.secondaryLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
