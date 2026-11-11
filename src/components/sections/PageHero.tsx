import type { ReactNode } from 'react'
import { Eyebrow } from '../ui/SectionHeader'

/** Header band for inner pages: ink background with the static brand triangles, like the home hero. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section data-hero className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <div className="corner-tris" aria-hidden="true" />
      <div className="container-mba relative py-16 md:py-24">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="t-h1 mt-4 !text-white">{title}</h1>
          {lead && <p className="t-lead mt-6 max-w-2xl !text-white/75">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
