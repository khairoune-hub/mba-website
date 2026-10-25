import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getCategories, getPosts } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { PostCard } from '@/components/cards/PostCard'
import { Pagination } from '@/components/ui/Pagination'
import { Reveal } from '@/components/ui/Reveal'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string; category?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  const sp = await searchParams
  return pageMetadata({ locale, route: 'news', title: t.news.title, description: t.news.lead, noIndex: Boolean(sp.category || (sp.page && sp.page !== '1')) })
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const category = sp.category || undefined
  const [posts, categories] = await Promise.all([getPosts(locale, { page, limit: 9, category }), getCategories(locale)])
  const base = href(locale, 'news')
  const qs = (p: number, c?: string) => {
    const s = new URLSearchParams()
    if (c) s.set('category', c)
    if (p > 1) s.set('page', String(p))
    const str = s.toString()
    return str ? `${base}?${str}` : base
  }
  const chip = 'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors'

  return (
    <>
      <PageHero eyebrow={t.nav.news} title={t.news.title} lead={t.news.lead} />
      <section className="section-y !pt-12">
        <div className="container-mba">
          {categories.length > 0 && (
            <nav aria-label={t.news.filterLabel}>
              <ul className="flex flex-wrap gap-2">
                {[{ id: 0, name: t.news.all, slug: undefined as string | undefined }, ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug ?? undefined }))].map((c) => {
                  const active = (c.slug ?? undefined) === category
                  return (
                    <li key={c.id}>
                      <Link href={qs(1, c.slug)} aria-current={active ? 'page' : undefined} className={`${chip} ${active ? 'bg-charcoal text-white' : 'bg-mist text-charcoal hover:bg-green-soft'}`}>
                        {c.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}
          {posts.docs.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((p, i) => (
                <Reveal as="li" key={p.id} delay={(i % 3) * 0.06}>
                  <PostCard post={p} locale={locale} priority={i < 3} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-muted">{t.home.noNews}</p>
          )}
          <Pagination page={posts.page} totalPages={posts.totalPages} makeHref={(p) => qs(p, category)} labels={t.pagination} />
        </div>
      </section>
    </>
  )
}
