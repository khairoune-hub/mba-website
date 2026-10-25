import type { Locale } from '@/i18n/config'
import { href, type RouteKey } from '@/i18n/routes'
import type { Page } from '@/payload-types'
import { RichText } from '../ui/RichText'
import { MediaImage } from '../ui/MediaImage'
import { ButtonLink } from '../ui/Button'
import { SlantMask } from '../motifs/SlantMask'
import { Hairlines } from '../motifs/Hairlines'
import { PageHero } from './PageHero'
import { Reveal } from '../ui/Reveal'

type Block = NonNullable<Page['layout']>[number]

/** Renders the block-based layout of a Payload page. */
export function Blocks({ blocks, locale }: { blocks: Page['layout']; locale: Locale }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((b: Block) => {
        switch (b.blockType) {
          case 'hero':
            return <PageHero key={b.id} eyebrow={b.eyebrow} title={b.title} lead={b.lead} />
          case 'richText':
            return (
              <section key={b.id} className="container-mba max-w-3xl py-12 md:py-16">
                <RichText data={b.content} locale={locale} />
              </section>
            )
          case 'cards':
            return (
              <section key={b.id} className="container-mba section-y">
                {b.title && <h2 className="t-h2">{b.title}</h2>}
                <ul className="mt-10 grid gap-6 md:grid-cols-3">
                  {(b.items ?? []).map((it, i) => (
                    <Reveal as="li" key={it.id ?? i} delay={i * 0.06} className="overflow-hidden rounded-[var(--radius-card)] bg-mist">
                      {it.image && (
                        <div className="relative aspect-[16/10]">
                          <MediaImage media={it.image} size="card" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                        </div>
                      )}
                      <div className="p-7">
                        <h3 className="t-h3">{it.title}</h3>
                        {it.body && <p className="mt-3 text-charcoal/90">{it.body}</p>}
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </section>
            )
          case 'cta': {
            const l = b.link
            const url = l?.type === 'custom' ? l.url || '#' : href(locale, (l?.route as RouteKey) || 'contact')
            return (
              <section key={b.id} className="container-mba pb-[var(--section-y)]">
                <div className="bg-green-band relative isolate overflow-hidden rounded-[var(--radius-lg)] px-6 py-14 sm:px-12">
                  <Hairlines preset="band" tone="white" />
                  <div className="relative max-w-2xl">
                    <h2 className="t-h2 !text-navy">{b.title}</h2>
                    {b.body && <p className="t-lead mt-4 !text-navy/90">{b.body}</p>}
                    {l?.label && (
                      <ButtonLink href={url} variant="navy" className="mt-8" arrow>
                        {l.label}
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </section>
            )
          }
          case 'imageText':
            return (
              <section key={b.id} className="container-mba section-y grid items-center gap-12 lg:grid-cols-2">
                <div className={b.imageSide === 'end' ? 'lg:order-2' : ''}>
                  <SlantMask ratio={4 / 3}>
                    <MediaImage media={b.image} size="card" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </SlantMask>
                </div>
                <div>
                  {b.title && <h2 className="t-h2">{b.title}</h2>}
                  <RichText data={b.content} locale={locale} className="mt-6" />
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
