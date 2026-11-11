import type { HomeContent } from '@/content/defaults'
import { Reveal } from '../ui/Reveal'

/** Mission (ink) and vision (green), side by side. */
export function MissionVision({ mission, vision }: { mission: HomeContent['mission']; vision: HomeContent['vision'] }) {
  const blocks = [
    { id: 'mission', ...mission, cls: 'bg-ink' },
    { id: 'vision', ...vision, cls: 'bg-green' },
  ]
  return (
    <section className="section-y bg-mist" aria-label={`${mission.title} · ${vision.title}`}>
      <Reveal className="container-mba grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <article key={b.id} className={`on-dark rounded-[var(--radius-card)] p-8 text-white md:p-12 ${b.cls}`} aria-labelledby={`${b.id}-title`}>
            <h2 id={`${b.id}-title`} className="t-h3 !text-white">
              {b.title}
            </h2>
            <span aria-hidden="true" className="mt-5 block h-px w-12 bg-white/50" />
            <p className="mt-6 text-[clamp(1.075rem,1rem+0.4vw,1.25rem)] leading-relaxed text-white/90">{b.body}</p>
          </article>
        ))}
      </Reveal>
    </section>
  )
}
