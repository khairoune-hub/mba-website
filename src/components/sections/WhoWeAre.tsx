import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import type { HomeContent } from '@/content/defaults'
import { getDictionary } from '@/i18n'
import { MarkAssemble } from '../motion/MarkAssemble'
import { Hairlines } from '../motifs/Hairlines'
import { LinkArrow } from '../ui/Button'
import { Eyebrow } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { SplitReveal } from '../motion/SplitReveal'

/** Renders `body`, wrapping the first occurrence of `highlight` in a white box. */
function withHighlight(body: string, highlight?: string) {
  if (!highlight || !body.includes(highlight)) return body
  const [a, ...rest] = body.split(highlight)
  return (
    <>
      {a}
      <mark className="box-decoration-clone rounded-[4px] bg-white px-[0.2em] text-navy">{highlight}</mark>
      {rest.join(highlight)}
    </>
  )
}

/** Slide 2 of the brand book: green gradient band, white hairlines, mark on green. */
export function WhoWeAre({ locale, who }: { locale: Locale; who: HomeContent['who'] }) {
  const t = getDictionary(locale)
  return (
    <section className="bg-green-band relative isolate overflow-hidden text-navy" aria-labelledby="who-title">
      <Hairlines preset="band" tone="white" />
      <div className="container-mba section-y relative grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <MarkAssemble variant="onGreen" className="h-16 w-auto md:h-24" />
        </Reveal>
        <div className="lg:col-span-8">
          <Reveal>
            <p className="t-eyebrow !text-navy">{t.home.whoEyebrow}</p>
            <h2 id="who-title" className="t-h2 mt-3 !text-navy">
              <SplitReveal text={who.title} />
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-[clamp(1.15rem,1rem+0.6vw,1.45rem)] leading-[1.75] text-navy">{withHighlight(who.body, who.highlight)}</p>
          </Reveal>
          <Reveal delay={0.14} className="mt-8">
            <LinkArrow href={href(locale, 'about')} className="!text-navy hover:!text-charcoal">
              {t.cta.about}
            </LinkArrow>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
