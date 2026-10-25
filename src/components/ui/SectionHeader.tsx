import type { ReactNode } from 'react'
import { Tri } from '../motifs/Tri'
import { SplitReveal } from '../motion/SplitReveal'

export function Eyebrow({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'light' }) {
  return (
    <p className={`t-eyebrow inline-flex items-center gap-2 ${tone === 'light' ? '!text-white' : ''}`}>
      <Tri className="size-[0.7em]" tone={tone === 'light' ? 'white' : 'green'} />
      {children}
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'start',
  as: Tag = 'h2',
  id,
  action,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  align?: 'start' | 'center'
  as?: 'h1' | 'h2'
  id?: string
  action?: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${align === 'center' ? 'items-center text-center md:flex-col md:items-center' : ''}`}>
      <div className={`max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag id={id} className={`${Tag === 'h1' ? 't-h1' : 't-h2'} mt-3`}>
          {typeof title === 'string' && Tag === 'h2' ? <SplitReveal text={title} /> : title}
        </Tag>
        {lead && <p className="t-lead mt-5 max-w-2xl">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
