'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ResolvedLink } from './nav'

export function NavLinks({ links, className = '', onNavigate }: { links: ResolvedLink[]; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className={className}>
      {links.map((l) => {
        const active = !l.external && (pathname === l.href || pathname.startsWith(l.href + '/'))
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              className="group relative inline-flex py-2 text-[0.95rem] font-medium text-charcoal transition-colors hover:text-green-ink aria-[current=page]:text-green-ink"
            >
              {l.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0.5 h-px ltr:origin-left rtl:origin-right scale-x-0 bg-green transition-transform duration-300 group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
