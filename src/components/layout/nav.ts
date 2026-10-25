import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { href, type RouteKey } from '@/i18n/routes'
import type { NavLink } from '@/lib/queries'

export type ResolvedLink = { label: string; href: string; external?: boolean }

const defaultNav: RouteKey[] = ['about', 'values', 'news', 'events', 'contact']

export function resolveLink(locale: Locale, link: NavLink): ResolvedLink {
  if (link.type === 'custom' && link.url) return { label: link.label, href: link.url, external: /^https?:/.test(link.url) }
  return { label: link.label, href: href(locale, (link.route as RouteKey) || 'home') }
}

export function navLinks(locale: Locale, t: Dictionary, cms: NavLink[]): ResolvedLink[] {
  if (cms.length) return cms.map((l) => resolveLink(locale, l))
  return defaultNav.map((k) => ({ label: t.nav[k], href: href(locale, k) }))
}
