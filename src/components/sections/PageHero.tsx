import type { ReactNode } from 'react'
import { Hairlines } from '../motifs/Hairlines'
import { SlantCorner } from '../motifs/SlantCorner'
import { Eyebrow } from '../ui/SectionHeader'

/** Header band for inner pages: soft radial field, hairlines and a slanted green corner. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section data-hero className="bg-radial-field relative isolate overflow-hidden">
      <Hairlines preset="section" />
      <SlantCorner corner="bottom-end" className="w-[min(30vw,300px)] opacity-90" />
      <div className="container-mba relative pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="animate-rise max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="t-h1 mt-4">{title}</h1>
          {lead && <p className="t-lead mt-6 max-w-2xl">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
