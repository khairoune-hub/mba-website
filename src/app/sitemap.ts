import type { MetadataRoute } from 'next'
import { hreflang, locales, type Locale } from '@/i18n/config'
import { href, type RouteKey } from '@/i18n/routes'
import { getSitemapEntries } from '@/lib/queries'
import { siteURL } from '@/lib/seo'

export const revalidate = 3600

const staticRoutes: RouteKey[] = ['home', 'about', 'values', 'news', 'events', 'contact', 'legal']

function entry(paths: Partial<Record<Locale, string>>, lastModified?: string, priority = 0.6): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.filter((l) => paths[l]).map((l) => [hreflang[l], encodeURI(`${siteURL}${paths[l]}`)]))
  return locales
    .filter((l) => paths[l])
    .map((l) => ({ url: encodeURI(`${siteURL}${paths[l]}`), lastModified: lastModified ? new Date(lastModified) : new Date(), alternates: { languages }, priority }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, events, pages } = await getSitemapEntries()
  const localized = (key: RouteKey | null, slug: Partial<Record<Locale, string>>) =>
    Object.fromEntries(locales.filter((l) => slug?.[l]).map((l) => [l, key ? href(l, key, slug[l]) : `/${l}/${slug[l]}`])) as Partial<Record<Locale, string>>

  return [
    ...staticRoutes.flatMap((r) => entry(Object.fromEntries(locales.map((l) => [l, href(l, r)])), undefined, r === 'home' ? 1 : 0.8)),
    ...posts.flatMap((p) => entry(localized('news', p.slug), p.updatedAt, 0.7)),
    ...events.flatMap((e) => entry(localized('events', e.slug), e.updatedAt, 0.7)),
    ...pages.filter((p) => p.slug?.ar !== 'legal').flatMap((p) => entry(localized(null, p.slug), p.updatedAt, 0.5)),
  ]
}
