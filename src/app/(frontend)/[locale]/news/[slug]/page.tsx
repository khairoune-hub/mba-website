import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getLocalizedSlugs, getPostBySlug, getPosts } from '@/lib/queries'
import { formatDate, readingTime } from '@/lib/format'
import { pageMetadata, siteURL } from '@/lib/seo'
import { articleLd, JsonLd } from '@/lib/jsonld'
import { SetAlternates } from '@/components/layout/Alternates'
import { Hairlines } from '@/components/motifs/Hairlines'
import { Tri } from '@/components/motifs/Tri'
import { PostCard } from '@/components/cards/PostCard'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { Badge } from '@/components/ui/Badge'
import { ArrowBackIcon } from '@/components/ui/icons'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const dynamicParams = true
export const generateStaticParams = () => []

async function load(locale: Locale, rawSlug: string) {
  const slug = decodeURIComponent(rawSlug)
  const post = await getPostBySlug(locale, slug)
  if (!post) return null
  const slugs = await getLocalizedSlugs('posts', post.id)
  const paths = Object.fromEntries(locales.filter((l) => slugs[l]).map((l) => [l, href(l, 'news', slugs[l])])) as Partial<Record<Locale, string>>
  return { post, paths }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const data = await load(locale, slug)
  if (!data) return {}
  const { post, paths } = data
  return pageMetadata({
    locale,
    paths,
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    image: post.seo?.image || post.coverImage,
    type: 'article',
    publishedTime: post.publishedAt,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const data = await load(locale, slug)
  if (!data) notFound()
  const { post, paths } = data
  const t = getDictionary(locale)
  const category = typeof post.category === 'object' ? post.category : null
  const author = typeof post.author === 'object' && post.author ? post.author.name : null
  const minutes = readingTime(locale, post.content)
  const url = `${siteURL}${paths[locale] ?? href(locale, 'news', post.slug ?? '')}`
  const related = await getPosts(locale, { limit: 3, category: category?.slug ?? undefined, exclude: post.id })

  return (
    <>
      <SetAlternates {...paths} />
      <article>
        <header className="bg-radial-field relative isolate overflow-hidden">
          <Hairlines preset="section" />
          <div className="container-mba relative max-w-4xl pb-12 pt-12 md:pt-16">
            <Link href={href(locale, 'news')} className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink hover:text-charcoal">
              <ArrowBackIcon className="size-4" />
              {t.cta.backToNews}
            </Link>
            <div className="animate-rise">
              {category && (
                <div className="mt-8">
                  <Badge>{category.name}</Badge>
                </div>
              )}
              <h1 className="t-h1 mt-5">{post.title}</h1>
              {post.excerpt && <p className="t-lead mt-5">{post.excerpt}</p>}
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal">
                {author && (
                  <li className="flex items-center gap-2">
                    <span className="text-muted">{t.news.by}</span>
                    <span className="font-semibold">{author}</span>
                  </li>
                )}
                {post.publishedAt && (
                  <li className="flex items-center gap-2">
                    <Tri className="size-[0.55em]" />
                    <time dateTime={post.publishedAt}>{formatDate(locale, post.publishedAt)}</time>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Tri className="size-[0.55em]" />
                  {t.news.readingTime(minutes)}
                </li>
              </ul>
            </div>
          </div>
        </header>
        {post.coverImage && (
          <div className="container-mba -mt-2 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-mist">
              <MediaImage media={post.coverImage} size="hero" fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
            </div>
          </div>
        )}
        <div className="container-mba max-w-3xl py-14 md:py-20">
          <RichText data={post.content} locale={locale} />
          <div className="mt-14 border-t border-border pt-8">
            <ShareButtons url={url} title={post.title} labels={{ share: t.news.share, copy: t.news.copyLink, copied: t.news.copied }} />
          </div>
        </div>
      </article>
      {related.docs.length > 0 && (
        <section className="section-y bg-mist" aria-labelledby="related">
          <div className="container-mba">
            <h2 id="related" className="t-h2">{t.news.related}</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.docs.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <JsonLd data={articleLd(locale, post, url)} />
    </>
  )
}
