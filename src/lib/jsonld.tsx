import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { footerDefaults } from '@/content/defaults'
import { mediaURL, siteURL } from './seo'
import type { Event, Post } from '@/payload-types'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export function organizationLd(locale: Locale) {
  const t = getDictionary(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MZAB Business Alliance',
    alternateName: ['MBA', 'تحالف أعمال ميزاب'],
    url: `${siteURL}/${locale}`,
    logo: `${siteURL}/brand/icon-512.png`,
    slogan: t.meta.tagline,
    description: t.meta.description,
    telephone: footerDefaults.phone,
    address: { '@type': 'PostalAddress', addressCountry: 'DZ', addressLocality: 'Ghardaïa' },
    areaServed: ['DZ', 'ECOWAS'],
  }
}

export function articleLd(locale: Locale, post: Post, url: string) {
  const author = typeof post.author === 'object' && post.author ? post.author.name : 'MZAB Business Alliance'
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt ?? undefined,
    inLanguage: locale,
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    image: mediaURL(post.coverImage, 'hero') ?? `${siteURL}/brand/og-default.png`,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'MZAB Business Alliance', logo: { '@type': 'ImageObject', url: `${siteURL}/brand/icon-512.png` } },
    mainEntityOfPage: url,
  }
}

export function eventLd(locale: Locale, event: Event, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt ?? undefined,
    inLanguage: locale,
    startDate: event.startDate,
    endDate: event.endDate ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location ? { '@type': 'Place', name: event.location, address: event.location } : undefined,
    image: mediaURL(event.coverImage, 'hero') ?? `${siteURL}/brand/og-default.png`,
    organizer: { '@type': 'Organization', name: 'MZAB Business Alliance', url: siteURL },
    ...(event.registrationUrl ? { offers: { '@type': 'Offer', url: event.registrationUrl, availability: 'https://schema.org/InStock' } } : {}),
    url,
  }
}
