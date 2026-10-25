import type { HomeContent } from '@/content/defaults'
import { CountUp } from '../motion/CountUp'
import { Tri } from '../motifs/Tri'
import { Reveal } from '../ui/Reveal'

/** Key figures with count-up numbers, on navy. */
export function StatsBand({ stats, label }: { stats: HomeContent['stats']; label: string }) {
  if (!stats?.length) return null
  return (
    <section aria-label={label} className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <div className="container-mba grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:py-16 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="relative border-white/10 ps-5 lg:border-s lg:first:border-s-0 lg:first:ps-0">
            <p className="font-[family-name:var(--font-inter)] text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] font-bold leading-none text-green">
              <CountUp value={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
            </p>
            <p className="mt-3 flex items-start gap-2 text-white/80">
              <Tri className="mt-[0.5em] size-[0.5em] shrink-0" tone="gold" />
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
