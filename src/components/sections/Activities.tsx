import type { ActivityKey, HomeContent } from '@/content/defaults'
import { BuildingIcon, ExportIcon, MegaphoneIcon, PlaneIcon, StandIcon } from '../ui/icons'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'

const icons: Record<ActivityKey, typeof PlaneIcon> = {
  awareness: MegaphoneIcon,
  trips: PlaneIcon,
  export: ExportIcon,
  establishment: BuildingIcon,
  fairs: StandIcon,
}

/** Numbered list of the alliance's activities. `id="activities"` is the nav anchor. */
export function Activities({ eyebrow, activities }: { eyebrow: string; activities: HomeContent['activities'] }) {
  const n = activities.items.length
  return (
    <section id="activities" className="section-y scroll-mt-20 bg-mist" aria-labelledby="activities-title">
      <div className="container-mba">
        <SectionHeader eyebrow={eyebrow} title={activities.title} id="activities-title" />
        <Reveal as="div" className="mt-12">
          <ol className={`grid gap-4 sm:grid-cols-2 ${n >= 5 ? 'lg:grid-cols-5' : n === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {activities.items.map((a, i) => {
              const Icon = icons[a.key] ?? ExportIcon
              return (
                <li key={a.key + i} className="flex flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-border">
                  <div className="flex items-center justify-between">
                    <Icon className="size-8 text-green" />
                    <span className="font-[family-name:var(--font-head)] text-sm font-semibold text-muted" dir="ltr">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-[1.075rem] font-semibold leading-snug">{a.title}</h3>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
