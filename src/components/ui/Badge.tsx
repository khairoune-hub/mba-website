import type { ReactNode } from 'react'

export function Badge({ children, tone = 'soft' }: { children: ReactNode; tone?: 'soft' | 'green' | 'gold' | 'dark' }) {
  const t = {
    soft: 'bg-green-soft text-[#41681a]',
    green: 'bg-green text-charcoal',
    gold: 'bg-gold/15 text-[#6f6418]',
    dark: 'bg-navy text-white',
  }[tone]
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${t}`}>{children}</span>
}
