import type { Metadata } from 'next'
import { hreflang, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href, type RouteKey } from '@/i18n/routes'
import type { Media } from '@/payload-types'

export const siteURL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export function mediaURL(m: unknown, size?: 'thumbnail' | 'card' | 'hero'): string | null {
  if (!m || typeof m !== 'object') return null
  const media = m as Media
  const url = (size && media.sizes?.[size]?.url) || media.url
  if (!url) return null
  return url.startsWith('http') ? url : `${siteURL}${url}`
}

/** hreflang map for a page, given its path in each locale. */
export function languageAlternates(paths: Partial<Record<Locale, string>>) {
  const languages: Record<string, string> = {}
  for (const l of locales) if (paths[l]) languages[hreflang[l]] = encodeURI(`${siteURL}${paths[l]}`)
  if (paths.ar) languages["x-default"] = encodeURI(`${siteURL}${paths.ar}`)
  return languages
}

export function baseMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale)
  return {
    metadataBase: new URL(siteURL),
    title: { default: `${t.meta.brand} — ${t.meta.tagline}`, template: `%s — ${t.meta.brand}` },
    description: t.meta.description,
    applicationName: t.meta.brand,
    openGraph: {
      siteName: t.meta.brand,
      locale: locale === 'ar' ? 'ar_DZ' : 'fr_DZ',
      alternateLocale: locale === 'ar' ? ['fr_DZ'] : ['ar_DZ'],
      type: 'website',
      images: [{ url: '/brand/og-default.png', width: 1200, height: 630, alt: t.meta.brand }],
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  }
}

type PageMetaArgs = {
  locale: Locale
  title?: string
  description?: string | null
  image?: unknown
  /** For static routes. */
  route?: RouteKey
  /** For detail pages: the localized paths. */
  paths?: Partial<Record<Locale, string>>
  type?: 'website' | 'article'
  publishedTime?: string | null
  noIndex?: boolean
}

export function pageMetadata({ locale, title, description, image, route, paths, type = 'website', publishedTime, noIndex }: PageMetaArgs): Metadata {
  const titleMeta = title ? { title } : {}
  const t = getDictionary(locale)
  const p = paths ?? (route ? Object.fromEntries(locales.map((l) => [l, href(l, route)])) : {})
  const img = mediaURL(image, 'hero')
  return {
    ...titleMeta,
    description: description || t.meta.description,
    alternates: { canonical: p[locale] ? encodeURI(`${siteURL}${p[locale]}`) : undefined, languages: languageAlternates(p) },
    openGraph: {
      title: title ?? `${t.meta.brand} — ${t.meta.tagline}`,
      description: description || t.meta.description,
      url: p[locale] ? `${siteURL}${p[locale]}` : undefined,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(img ? { images: [{ url: img }] } : {}),
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
