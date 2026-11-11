import type { ValueItem, ValueKey } from '@/content/defaults'
import { LinkArrow } from '../ui/Button'
import { AwardIcon, HandshakeIcon, NetworkIcon } from '../ui/icons'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'

const icons: Record<ValueKey, typeof HandshakeIcon> = { trust: HandshakeIcon, cooperation: NetworkIcon, excellence: AwardIcon }

/** The alliance's values in equal columns, each with a line icon. */
export function ValuesPreview({ eyebrow, title, items, more }: { eyebrow: string; title?: string; items: ValueItem[]; more?: { href: string; label: string } }) {
  return (
    <section className="section-y" aria-labelledby="values-title">
      <div className="container-mba">
        <SectionHeader eyebrow={title ? eyebrow : undefined} title={title || eyebrow} id="values-title" action={more && <LinkArrow href={more.href}>{more.label}</LinkArrow>} />
        <Reveal as="div" className="mt-12">
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-border ring-1 ring-border md:grid-cols-3">
            {items.map((v) => {
              const Icon = icons[v.key] ?? AwardIcon
              return (
                <li key={v.key + v.title} className="bg-white p-8 md:p-10">
                  <span className="inline-flex size-12 items-center justify-center rounded-[var(--radius-md)] bg-green-soft text-green">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="t-h3 mt-6">{v.title}</h3>
                  {v.body && <p className="mt-3 text-ink/75">{v.body}</p>}
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
