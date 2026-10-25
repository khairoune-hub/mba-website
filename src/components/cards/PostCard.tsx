import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import { formatDate } from '@/lib/format'
import type { Post } from '@/payload-types'
import { MediaImage } from '../ui/MediaImage'
import { TraceBorder } from '../motifs/TraceBorder'
import { SlantReveal } from '../motion/SlantReveal'
import { Badge } from '../ui/Badge'
import { ArrowIcon } from '../ui/icons'
import { CardPlaceholder } from './CardPlaceholder'

export function PostCard({ post, locale, priority = false }: { post: Post; locale: Locale; priority?: boolean }) {
  const category = typeof post.category === 'object' ? post.category : null
  const url = href(locale, 'news', post.slug ?? '')
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ">
      <TraceBorder />
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <SlantReveal rtl={locale === 'ar'} className="absolute inset-0">
          {post.coverImage ? (
            <MediaImage media={post.coverImage} size="card" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" priority={priority} className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
          ) : (
            <CardPlaceholder />
          )}
        </SlantReveal>
        {/* Slanted corner accent echoing the icon's notch */}
        <span aria-hidden="true" className="absolute bottom-0 end-0 h-10 w-24 origin-bottom bg-white [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)] rtl:[clip-path:polygon(0_0,55%_0,100%_100%,0_100%)]" />
      </div>
      <div className="flex flex-1 flex-col p-6 pt-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {category && <Badge>{category.name}</Badge>}
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(locale, post.publishedAt)}</time>}
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-charcoal [:lang(ar)_&]:font-bold">
          <Link href={url} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 text-[0.975rem] text-charcoal/85">{post.excerpt}</p>}
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-green-ink">
          <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </article>
  )
}
