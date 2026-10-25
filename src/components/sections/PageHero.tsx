import type { ReactNode } from 'react'
import { Hairlines } from '../motifs/Hairlines'
import { SlantCorner } from '../motifs/SlantCorner'
import { Blooms } from '../motifs/Blooms'
import { Parallax } from '../motion/Parallax'
import { Eyebrow } from '../ui/SectionHeader'

/** Header band for inner pages: soft radial field, hairlines and a slanted green corner. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section data-hero className="bg-radial-field relative isolate overflow-hidden">
      <Blooms className="opacity-60" />
      <Hairlines preset="section" animate="load" />
      <Parallax distance={24} className="pointer-events-none absolute inset-0">
        <SlantCorner corner="bottom-end" className="w-[min(30vw,300px)] opacity-90" />
      </Parallax>
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
