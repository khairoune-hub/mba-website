import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'

const routeFor = { posts: 'news', events: 'events', pages: null } as const

/** URL the admin opens for draft / live preview. It sets Next draft mode, then redirects to the page. */
export function previewPath(collection: keyof typeof routeFor, slug: unknown, locale?: string) {
  const loc = (locale === 'fr' ? 'fr' : 'ar') as Locale
  const key = routeFor[collection]
  const path = typeof slug === 'string' && slug ? (key ? href(loc, key, slug) : `/${loc}/${slug}`) : `/${loc}`
  const params = new URLSearchParams({ path })
  return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/next/preview?${params.toString()}`
}
