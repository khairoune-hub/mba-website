import 'server-only'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import type { Locale } from '@/i18n/config'
import type { Category, Event, Page, Post } from '@/payload-types'
import { aboutDefaults, homeDefaults, valuesDefaults, footerDefaults } from '@/content/defaults'

const REVALIDATE = 3600

/** Runs `fn` through the Next data cache (tagged), unless draft mode is on. Fails soft when the DB is unreachable. */
async function cached<T>(key: string[], tags: string[], fn: (draft: boolean) => Promise<T>, fallback: T): Promise<T> {
  let draft = false
  try {
    draft = (await draftMode()).isEnabled
  } catch {
    /* outside a request */
  }
  // Failures are not cached: the fallback is returned for this request only.
  try {
    if (draft) return await fn(true)
    return await unstable_cache(() => fn(false), key, { tags, revalidate: REVALIDATE })()
  } catch (err) {
    console.error(`[queries] ${key.join(':')} failed:`, (err as Error).message)
    return fallback
  }
}

/* ---------------- Globals (merged with code defaults per locale) ---------------- */

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

/** Deep-merges CMS data over defaults: empty CMS values fall back to the default. */
function withDefaults<T>(defaults: T, data: unknown): T {
  if (isEmpty(data)) return defaults
  if (Array.isArray(defaults)) return (Array.isArray(data) && data.length ? data : defaults) as T
  if (typeof defaults === 'object' && defaults !== null && typeof data === 'object' && data !== null) {
    const out: Record<string, unknown> = { ...(data as object) }
    for (const [k, v] of Object.entries(defaults)) out[k] = withDefaults(v, (data as Record<string, unknown>)[k])
    return out as T
  }
  return (typeof data === typeof defaults ? data : defaults) as T
}

async function findGlobal(slug: string, locale: Locale, draft: boolean, depth = 1) {
  const payload = await getPayloadClient()
  // No locale fallback here: an untranslated field uses the code default of the same language.
  return payload.findGlobal({ slug: slug as any, locale, fallbackLocale: false as any, depth, draft })
}

export const getHome = (locale: Locale) =>
  cached(['home', locale], ['global:home-page'], async (d) => withDefaults(homeDefaults[locale], await findGlobal('home-page', locale, d)), homeDefaults[locale])

export const getValues = (locale: Locale) =>
  cached(
    ['values', locale],
    ['global:values'],
    async (d) => {
      const g: any = await findGlobal('values', locale, d)
      return { intro: (g?.intro as string) || '', items: withDefaults(valuesDefaults[locale], g?.items) }
    },
    { intro: '', items: valuesDefaults[locale] },
  )

export const getAbout = (locale: Locale) =>
  cached(
    ['about', locale],
    ['global:about-page'],
    async (d) => {
      const g: any = await findGlobal('about-page', locale, d)
      const base = withDefaults(aboutDefaults[locale], g)
      const pts = (p: any, def: string[]) => (Array.isArray(p) && p.length ? p.map((x: any) => x.text) : def)
      return {
        ...base,
        vision: { ...base.vision, points: pts(g?.vision?.points, aboutDefaults[locale].vision.points) },
        model: { ...base.model, points: pts(g?.model?.points, aboutDefaults[locale].model.points) },
        image: g?.image && typeof g.image === 'object' ? g.image : null,
        team: Array.isArray(g?.team) ? g.team : [],
      }
    },
    { ...aboutDefaults[locale], image: null, team: [] as any[] },
  )

export type NavLink = { label: string; type?: 'internal' | 'custom' | null; route?: string | null; url?: string | null }

export const getHeader = (locale: Locale) =>
  cached(
    ['header', locale],
    ['global:header'],
    async (d) => {
      const g: any = await findGlobal('header', locale, d, 0)
      return {
        navItems: (g?.navItems ?? []).map((n: any) => n.link as NavLink).filter((l: NavLink) => l?.label),
        cta: g?.cta?.label ? (g.cta as NavLink) : null,
      }
    },
    { navItems: [] as NavLink[], cta: null as NavLink | null },
  )

export const getFooter = (locale: Locale) =>
  cached(
    ['footer', locale],
    ['global:footer'],
    async (d) => {
      const g: any = await findGlobal('footer', locale, d, 0)
      return {
        blurb: (g?.blurb as string) || '',
        phone: g?.phone || footerDefaults.phone,
        email: g?.email || footerDefaults.email,
        address: g?.address || footerDefaults.address[locale],
        socials: (g?.socials as { platform: string; url: string }[]) ?? [],
        legalNote: (g?.legalNote as string) || '',
      }
    },
    { blurb: '', phone: footerDefaults.phone, email: footerDefaults.email, address: footerDefaults.address[locale], socials: [], legalNote: '' },
  )

export const getSiteSettings = (locale: Locale) =>
  cached(['site-settings', locale], ['global:site-settings'], async (d) => (await findGlobal('site-settings', locale, d)) as any, null as any)

/* ---------------- Collections ---------------- */

const published = (draft: boolean): Where => (draft ? {} : { _status: { equals: 'published' } })

export const getCategories = (locale: Locale) =>
  cached(
    ['categories', locale],
    ['posts'],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'categories', locale, limit: 50, sort: 'name', depth: 0 })
      return res.docs as Category[]
    },
    [] as Category[],
  )

export const getPosts = (locale: Locale, opts: { page?: number; limit?: number; category?: string; exclude?: number } = {}) =>
  cached(
    ['posts', locale, JSON.stringify(opts)],
    ['posts'],
    async (d) => {
      const payload = await getPayloadClient()
      const and: Where[] = [published(d)]
      if (opts.category) {
        const cat = await payload.find({ collection: 'categories', locale, where: { slug: { equals: opts.category } }, limit: 1, depth: 0 })
        and.push({ category: { equals: cat.docs[0]?.id ?? -1 } })
      }
      if (opts.exclude) and.push({ id: { not_equals: opts.exclude } })
      const res = await payload.find({
        collection: 'posts',
        locale,
        draft: d,
        where: { and },
        sort: '-publishedAt',
        page: opts.page ?? 1,
        limit: opts.limit ?? 9,
        depth: 1,
        select: { title: true, slug: true, excerpt: true, coverImage: true, category: true, publishedAt: true, author: true },
      })
      return res as unknown as { docs: Post[]; totalPages: number; page: number; totalDocs: number }
    },
    { docs: [] as Post[], totalPages: 0, page: 1, totalDocs: 0 },
  )

export const getPostBySlug = (locale: Locale, slug: string) =>
  cached(
    ['post', locale, slug],
    ['posts'],
    async (d) => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'posts', locale, draft: d, where: { and: [{ slug: { equals: slug } }, published(d)] }, limit: 1, depth: 2 })
      return (res.docs[0] as Post) ?? null
    },
    null as Post | null,
  )

export const getEvents = (locale: Locale, opts: { when: 'upcoming' | 'past'; limit?: number; page?: number }) =>
  cached(
    ['events', locale, JSON.stringify(opts), new Date().toISOString().slice(0, 13)],
    ['events'],
    async (d) => {
      const payload = await getPayloadClient()
      const now = new Date().toISOString()
      // An event is "upcoming" until it ends (or starts, if it has no end date).
      const timeWhere: Where =
        opts.when === 'upcoming'
          ? { or: [{ endDate: { greater_than_equal: now } }, { and: [{ endDate: { exists: false } }, { startDate: { greater_than_equal: now } }] }] }
          : { or: [{ endDate: { less_than: now } }, { and: [{ endDate: { exists: false } }, { startDate: { less_than: now } }] }] }
      const res = await payload.find({
        collection: 'events',
        locale,
        draft: d,
        where: { and: [published(d), timeWhere] },
        sort: opts.when === 'upcoming' ? 'startDate' : '-startDate',
        limit: opts.limit ?? 9,
        page: opts.page ?? 1,
        depth: 1,
      })
      return res as unknown as { docs: Event[]; totalPages: number; page: number }
    },
    { docs: [] as Event[], totalPages: 0, page: 1 },
  )

export const getEventBySlug = (locale: Locale, slug: string) =>
  cached(
    ['event', locale, slug],
    ['events'],
    async (d) => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'events', locale, draft: d, where: { and: [{ slug: { equals: slug } }, published(d)] }, limit: 1, depth: 2 })
      return (res.docs[0] as Event) ?? null
    },
    null as Event | null,
  )

export const getPageBySlug = (locale: Locale, slug: string) =>
  cached(
    ['page', locale, slug],
    ['pages'],
    async (d) => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'pages', locale, draft: d, where: { and: [{ slug: { equals: slug } }, published(d)] }, limit: 1, depth: 2 })
      return (res.docs[0] as Page) ?? null
    },
    null as Page | null,
  )

/** Slugs of a document in every locale, for the language switcher and hreflang. */
export const getLocalizedSlugs = (collection: 'posts' | 'events' | 'pages', id: number) =>
  cached(
    ['slugs', collection, String(id)],
    [collection],
    async () => {
      const payload = await getPayloadClient()
      const doc: any = await payload.findByID({ collection, id, locale: 'all' as any, depth: 0, select: { slug: true } as any })
      return (doc?.slug ?? {}) as Partial<Record<Locale, string>>
    },
    {} as Partial<Record<Locale, string>>,
  )

type SitemapDoc = { slug: Partial<Record<Locale, string>>; updatedAt: string }

/** Everything for the sitemap. */
export const getSitemapEntries = () =>
  cached(
    ['sitemap'],
    ['posts', 'events', 'pages'],
    async () => {
      const payload = await getPayloadClient()
      const opts = { locale: 'all' as any, depth: 0, limit: 1000, where: { _status: { equals: 'published' } } as Where, select: { slug: true, updatedAt: true } as any }
      const [posts, events, pages] = await Promise.all([
        payload.find({ collection: 'posts', ...opts }),
        payload.find({ collection: 'events', ...opts }),
        payload.find({ collection: 'pages', ...opts }),
      ])
      const map = (r: any): SitemapDoc[] => r.docs.map((x: any) => ({ slug: x.slug ?? {}, updatedAt: x.updatedAt as string }))
      return { posts: map(posts), events: map(events), pages: map(pages) }
    },
    { posts: [], events: [], pages: [] } as { posts: SitemapDoc[]; events: SitemapDoc[]; pages: SitemapDoc[] },
  )
