import { withPayload } from '@payloadcms/next/withPayload'

const mediaHost = (() => {
  try {
    return new URL(process.env.S3_PUBLIC_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname
  } catch {
    return null
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      ...(mediaHost ? [{ protocol: 'https', hostname: mediaHost }] : []),
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

const config = withPayload({ ...nextConfig, poweredByHeader: false }, { devBundleServerPackages: false })

// Payload sends `Critical-CH: Sec-CH-Prefers-Color-Scheme` on every route (for the admin theme), which makes
// browsers retry each page request. Keep those client-hint headers on the admin only.
const payloadHeaders = config.headers
config.headers = async () => {
  const rules = (await payloadHeaders?.()) ?? []
  return rules.map((r) => (r.source === '/:path*' ? { ...r, source: '/admin/:path*' } : r))
}

export default config
