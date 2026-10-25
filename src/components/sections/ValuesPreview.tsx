import type { ValueItem } from '@/content/defaults'
import { Hairlines } from '../motifs/Hairlines'
import { ValueWord } from '../motifs/ValueWord'
import { LinkArrow } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'

/** Brand book slide 6: four values, ▲ set into each word, separated by fine diagonal lines. */
export function ValuesPreview({ eyebrow, title, items, moreHref, moreLabel }: { eyebrow: string; title: string; items: ValueItem[]; moreHref: string; moreLabel: string }) {
  return (
    <section className="bg-radial-field relative isolate overflow-hidden" aria-labelledby="values-title">
      <Hairlines preset="values" />
      <div className="container-mba section-y relative">
        <SectionHeader eyebrow={eyebrow} title={title} id="values-title" action={<LinkArrow href={moreHref}>{moreLabel}</LinkArrow>} />
        <ul className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {items.map((v, i) => (
            <Reveal as="li" key={v.key} delay={i * 0.07} className={`max-w-xl ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}>
              <h3 className="text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)] font-bold leading-tight text-charcoal [:lang(fr)_&]:font-semibold">
                <ValueWord before={v.before} after={v.after} title={v.title} />
              </h3>
              <p className="mt-3 text-lg text-charcoal">{v.motto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
