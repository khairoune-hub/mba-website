import './lib/env'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig, type EmailAdapter } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { ar } from '@payloadcms/translations/languages/ar'
import { fr } from '@payloadcms/translations/languages/fr'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { Events } from './collections/Events'
import { Pages } from './collections/Pages'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { globals } from './globals'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** Public base URL for files in the bucket, e.g. https://<ref>.supabase.co/storage/v1/object/public/media */
export const s3PublicURL =
  process.env.S3_PUBLIC_URL ||
  (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.S3_BUCKET
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${process.env.S3_BUCKET}`
    : '')

function emailAdapter(): EmailAdapter | Promise<EmailAdapter> | undefined {
  const from = process.env.EMAIL_FROM || 'no-reply@mzab-alliance.dz'
  const fromName = process.env.EMAIL_FROM_NAME || 'MZAB Business Alliance'
  if (process.env.RESEND_API_KEY) {
    return resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: from, defaultFromName: fromName })
  }
  if (process.env.SMTP_HOST) {
    return nodemailerAdapter({
      defaultFromAddress: from,
      defaultFromName: fromName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
    })
  }
  return undefined // Payload logs emails to the console in development.
}

const useS3 = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    avatar: 'default', // no Gravatar requests
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — MBA',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/brand/favicon.svg' }],
      openGraph: { images: [{ url: '/brand/og-default.png' }] },
    },
    components: {
      graphics: { Logo: '@/components/admin/AdminLogo#AdminLogo', Icon: '@/components/admin/AdminIcon#AdminIcon' },
    },
    livePreview: {
      collections: ['posts', 'events', 'pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: { supportedLanguages: { ar, fr, en }, fallbackLanguage: 'fr' },
  localization: {
    locales: [
      { label: 'العربية', code: 'ar', rtl: true },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
  collections: [Posts, Events, Categories, Media, Pages, ContactSubmissions, Users],
  globals,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => f.key !== 'upload' && f.key !== 'heading'),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      UploadFeature({
        collections: { media: { fields: [{ name: 'caption', type: 'text', localized: true }] } },
      }),
      FixedToolbarFeature(),
    ],
  }),
  db: postgresAdapter({
    // Runtime: Supabase pooler (Supavisor, transaction mode, port 6543, ?pgbouncer=true).
    // Migrations: scripts/migrate.mjs swaps in DATABASE_URI_DIRECT (port 5432).
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: Number(process.env.DATABASE_POOL_MAX || 10),
      ssl: /supabase\.(co|com)/.test(process.env.DATABASE_URI || '') ? { rejectUnauthorized: false } : undefined,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Schema changes go through migrations (`pnpm migrate`) everywhere. Push is opt-in for quick local
    // experiments only: it prompts interactively and conflicts with migrations.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  email: emailAdapter(),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: false },
  cors: [serverURL],
  csrf: [serverURL],
  plugins: [
    s3Storage({
      enabled: useS3,
      collections: {
        media: {
          // Files are served straight from the public Supabase bucket, not proxied through Payload.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => [s3PublicURL, prefix, filename].filter(Boolean).join('/'),
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true, // required for Supabase
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
