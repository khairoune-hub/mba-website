import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import { formatDate } from '@/lib/format'
import type { Post } from '@/payload-types'
import { MediaImage } from '../ui/MediaImage'
import { Badge } from '../ui/Badge'
import { ArrowIcon } from '../ui/icons'
import { CardPlaceholder } from './CardPlaceholder'

export function PostCard({ post, locale, priority = false }: { post: Post; locale: Locale; priority?: boolean }) {
  const category = typeof post.category === 'object' ? post.category : null
  const url = href(locale, 'news', post.slug ?? '')
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-border transition-shadow duration-200 hover:shadow-[var(--shadow-lift)] hover:ring-charcoal/20 ">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
          {post.coverImage ? (
            <MediaImage media={post.coverImage} size="card" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" priority={priority} className="object-cover" />
          ) : (
            <CardPlaceholder />
          )}
      </div>
      <div className="flex flex-1 flex-col p-6">
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
          <ArrowIcon className="size-4" />
        </span>
      </div>
    </article>
  )
}
