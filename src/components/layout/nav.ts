import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { href, type RouteKey } from '@/i18n/routes'
import type { NavLink } from '@/lib/queries'

export type ResolvedLink = { label: string; href: string; external?: boolean }

export function resolveLink(locale: Locale, link: NavLink): ResolvedLink {
  if (link.type === 'custom' && link.url) return { label: link.label, href: link.url, external: /^https?:/.test(link.url) }
  // `values` was merged into About; old CMS nav entries pointing to it land on the right section.
  if (link.route === 'values') return { label: link.label, href: `${href(locale, 'about')}#values` }
  return { label: link.label, href: href(locale, (link.route as RouteKey) || 'home') }
}

/** Default nav (used when the Header global has no items). "Activités" is a section of the home page. */
export function navLinks(locale: Locale, t: Dictionary, cms: NavLink[]): ResolvedLink[] {
  if (cms.length) return cms.map((l) => resolveLink(locale, l))
  return [
    { label: t.nav.home, href: href(locale, 'home') },
    { label: t.nav.about, href: href(locale, 'about') },
    { label: t.nav.activities, href: `${href(locale, 'home')}#activities` },
    { label: t.nav.news, href: href(locale, 'news') },
    { label: t.nav.events, href: href(locale, 'events') },
    { label: t.nav.contact, href: href(locale, 'contact') },
  ]
}
