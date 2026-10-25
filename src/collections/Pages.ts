import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminUser, publishedOrStaff } from '@/access'
import { pageBlocks } from '@/blocks'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { L } from '@/fields/label'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { previewPath } from '@/lib/preview'

/** Block-based pages, served at /{locale}/{slug}. The page with slug "legal" powers the legal/privacy page. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: L('صفحة', 'Page', 'Page'), plural: L('الصفحات', 'Pages', 'Pages') },
  admin: {
    useAsTitle: 'title',
    group: L('الموقع', 'Site', 'Site'),
    hidden: ({ user }) => !isAdminUser(user as any),
    livePreview: { url: ({ data, locale }) => previewPath('pages', data?.slug, locale?.code) },
  },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterChange: [revalidateCollection('pages')], afterDelete: [revalidateCollectionDelete('pages')] },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: L('العنوان', 'Titre', 'Title') },
    { name: 'layout', type: 'blocks', blocks: pageBlocks, label: L('المحتوى', 'Contenu', 'Layout') },
    slugField(),
    seoField,
  ],
}
