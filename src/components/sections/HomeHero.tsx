import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import type { HomeContent } from '@/content/defaults'
import { GlassIcon } from '../brand/GlassIcon'
import { Hairlines } from '../motifs/Hairlines'
import { Blooms } from '../motifs/Blooms'
import { Parallax } from '../motion/Parallax'
import { SplitReveal } from '../motion/SplitReveal'
import { ButtonLink } from '../ui/Button'
import { Eyebrow } from '../ui/SectionHeader'

export function HomeHero({ locale, hero }: { locale: Locale; hero: HomeContent['hero'] }) {
  return (
    <section data-hero className="bg-radial-field relative isolate overflow-hidden" aria-labelledby="hero-title">
      <Blooms />
      <Hairlines preset="hero" animate="load" />
      <div className="container-mba relative grid items-center gap-10 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-12 lg:gap-6 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-7">
          <div className="animate-rise">
            <Eyebrow>
              <span dir="ltr">{hero.eyebrow}</span>
            </Eyebrow>
          </div>
          <div className="animate-rise" style={{ animationDelay: '50ms' }}>
            <h1 id="hero-title" className="t-display mt-5 text-charcoal">
              {hero.title}
            </h1>
          </div>
          <div className="animate-rise" style={{ animationDelay: '120ms' }}>
            <p className="mt-4 font-[family-name:var(--font-head)] text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] font-semibold leading-tight text-green-ink">
              <SplitReveal text={hero.subtitle} onLoad delay={0.35} />
            </p>
          </div>
          <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
            <ButtonLink href={href(locale, 'about')} arrow>
              {hero.primaryLabel}
            </ButtonLink>
            <ButtonLink href={href(locale, 'news')} variant="secondary">
              {hero.secondaryLabel}
            </ButtonLink>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[2%] h-10 rounded-[50%] bg-charcoal/10 blur-2xl" />
          <Parallax distance={36}>
            <div className="animate-glass-in">
              <GlassIcon float priority className="relative mx-auto w-[min(78vw,460px)] lg:w-full" sizes="(min-width: 1024px) 40vw, 78vw" />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  )
}
