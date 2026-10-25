import Image from 'next/image'
import type { Media } from '@/payload-types'

type Size = 'thumbnail' | 'card' | 'hero'

/** next/image for a Payload media document (Supabase public URL in production, /api/media locally). */
export function MediaImage({
  media,
  size,
  sizes = '100vw',
  className = '',
  fill = false,
  priority = false,
  alt,
}: {
  media: Media | number | null | undefined
  size?: Size
  sizes?: string
  className?: string
  fill?: boolean
  priority?: boolean
  alt?: string
}) {
  if (!media || typeof media !== 'object') return null
  const variant = size ? media.sizes?.[size] : undefined
  const src = variant?.url || media.url
  if (!src) return null
  const width = variant?.width || media.width || 1200
  const height = variant?.height || media.height || 800
  const focal = media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined
  const common = { alt: alt ?? media.alt ?? '', className, sizes, priority, style: focal ? { objectPosition: focal } : undefined }
  return fill ? <Image src={src} fill {...common} /> : <Image src={src} width={width} height={height} {...common} />
}
