import { RichText as LexicalRichText, LinkJSXConverter, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routes'
import type { Media } from '@/payload-types'
import { MediaImage } from './MediaImage'

const converters =
  (locale: Locale): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const doc = linkNode.fields.doc
        const value = doc?.value as { slug?: string } | undefined
        if (!doc || !value?.slug) return '#'
        if (doc.relationTo === 'posts') return href(locale, 'news', value.slug)
        if (doc.relationTo === 'events') return href(locale, 'events', value.slug)
        return `/${locale}/${value.slug}`
      },
    }),
    upload: ({ node }) => {
      const media = node.value as Media
      if (!media || typeof media !== 'object' || !media.mimeType?.startsWith('image')) return null
      const caption = (node.fields as { caption?: string } | undefined)?.caption || media.caption
      return (
        <figure className="my-10">
          <MediaImage media={media} size="hero" sizes="(min-width: 768px) 760px, 100vw" className="h-auto w-full rounded-[var(--radius-card)]" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    },
  })

export function RichText({ data, locale, className = '' }: { data: unknown; locale: Locale; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as SerializedEditorState} converters={converters(locale)} className={`prose-mba ${className}`} />
}
