import type { HomeContent, PillarKey } from '@/content/defaults'
import { PATH_A, PATH_M, PATH_SUMMIT } from '../brand/mark-paths'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'

const shape: Record<PillarKey, { d: string; fill: string; box: string }> = {
  industry: { d: PATH_M, fill: 'var(--color-green)', box: '0 0 380 534' },
  trade: { d: PATH_A, fill: 'var(--color-charcoal)', box: '258 0 380 534' },
  services: { d: PATH_SUMMIT, fill: 'var(--color-green)', box: '515 200 280 334' },
}

/** Three cards echoing the three shapes of the icon. */
export function PillarsTriad({ eyebrow, title, pillars }: { eyebrow: string; title: string; pillars: HomeContent['pillars'] }) {
  return (
    <section className="section-y" aria-labelledby="pillars-title">
      <div className="container-mba">
        <SectionHeader eyebrow={eyebrow} title={title} id="pillars-title" />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => {
            const s = shape[p.key] ?? shape.industry
            return (
              <Reveal as="li" key={p.key} delay={i * 0.08} className="group relative overflow-hidden rounded-[var(--radius-card)] bg-mist p-8 pb-10 ring-1 ring-transparent transition-[box-shadow,transform] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] hover:ring-green/50 md:min-h-[360px]">
                <svg viewBox={s.box} className="h-24 w-auto transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1" aria-hidden="true">
                  <path d={s.d} fill={s.fill} />
                </svg>
                <span aria-hidden="true" className="absolute end-8 top-8 font-[family-name:var(--font-inter)] text-sm font-semibold text-charcoal/40">
                  0{i + 1}
                </span>
                <h3 className="t-h3 mt-10">{p.title}</h3>
                <p className="mt-3 text-charcoal/90">{p.body}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
