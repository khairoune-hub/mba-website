import type { Locale } from './config'

/** Internal route keys. Folder names under app/(frontend)/[locale] use the `ar` segment. */
export type RouteKey = 'home' | 'about' | 'values' | 'news' | 'events' | 'contact' | 'legal'

export const segments: Record<RouteKey, Record<Locale, string>> = {
  home: { ar: '', fr: '' },
  about: { ar: 'about', fr: 'a-propos' },
  values: { ar: 'values', fr: 'valeurs' },
  news: { ar: 'news', fr: 'actualites' },
  events: { ar: 'events', fr: 'evenements' },
  contact: { ar: 'contact', fr: 'contact' },
  legal: { ar: 'legal', fr: 'mentions-legales' },
}

/** Builds a public URL path, e.g. href('fr', 'news', 'mon-article') → /fr/actualites/mon-article */
export function href(locale: Locale, key: RouteKey, slug?: string): string {
  const seg = segments[key][locale]
  return '/' + [locale, seg, slug].filter(Boolean).join('/')
}

/** Maps a public first segment to the internal folder segment (used by middleware rewrites). */
export function internalSegment(locale: Locale, publicSeg: string): string | null {
  for (const key of Object.keys(segments) as RouteKey[]) {
    if (segments[key][locale] === publicSeg) return segments[key].ar
  }
  return null
}

/** Maps a public first segment back to its route key. */
export function routeKeyFor(locale: Locale, publicSeg: string): RouteKey | null {
  for (const key of Object.keys(segments) as RouteKey[]) {
    if (segments[key][locale] === publicSeg) return key
  }
  return null
}
