import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/** Tags used by src/lib/queries.ts. Revalidation is skipped outside a Next.js request (seed, migrations). */
function safeRevalidate(tags: string[], req: { payload: { logger: { info: (m: string) => void } }; context?: Record<string, unknown> }) {
  if (req.context?.disableRevalidate) return
  import('next/cache')
    .then(({ revalidateTag }) => {
      for (const tag of tags) revalidateTag(tag)
      req.payload.logger.info(`revalidated: ${tags.join(', ')}`)
    })
    .catch(() => {})
}

export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    try {
      safeRevalidate([tag, `${tag}:${doc.id}`], req)
    } catch {
      /* not in a Next.js context */
    }
    return doc
  }

export const revalidateCollectionDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc, req }) => {
    try {
      safeRevalidate([tag, `${tag}:${doc?.id}`], req)
    } catch {
      /* not in a Next.js context */
    }
    return doc
  }

export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc, req }) => {
    try {
      safeRevalidate([`global:${slug}`], req)
    } catch {
      /* not in a Next.js context */
    }
    return doc
  }
