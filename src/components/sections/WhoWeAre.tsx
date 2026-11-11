import { paragraphs, type HomeContent } from '@/content/defaults'
import { LinkArrow } from '../ui/Button'
import { Eyebrow } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'

/** Two columns: heading on one side, the "Qui sommes-nous" paragraphs on the other. */
export function WhoWeAre({ eyebrow, who, more }: { eyebrow: string; who: HomeContent['who']; more?: { href: string; label: string } }) {
  const [lead, ...rest] = paragraphs(who.body)
  return (
    <section className="section-y" aria-labelledby="who-title">
      <Reveal className="container-mba grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="who-title" className="t-h2 mt-3">
            {who.title}
          </h2>
        </div>
        <div className="space-y-5 lg:col-span-8">
          {lead && <p className="t-lead !text-ink">{lead}</p>}
          {rest.map((p) => (
            <p key={p.slice(0, 32)} className="text-[1.0625rem] text-ink/80">
              {p}
            </p>
          ))}
          {more && (
            <p className="pt-3">
              <LinkArrow href={more.href}>{more.label}</LinkArrow>
            </p>
          )}
        </div>
      </Reveal>
    </section>
  )
}
