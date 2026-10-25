import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { L } from '@/fields/label'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { previewPath } from '@/lib/preview'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: L('مقال', 'Article', 'Post'), plural: L('الأخبار', 'Actualités', 'News') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: L('المحتوى', 'Contenu', 'Content'),
    livePreview: { url: ({ data, locale }) => previewPath('posts', data?.slug, locale?.code) },
    preview: (data, { locale }) => previewPath('posts', data?.slug as string, locale),
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateCollection('posts')], afterDelete: [revalidateCollectionDelete('posts')] },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: L('العنوان', 'Titre', 'Title') },
    { name: 'excerpt', type: 'textarea', localized: true, label: L('المقتطف', 'Extrait', 'Excerpt'), maxLength: 320 },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: L('صورة الغلاف', 'Image de couverture', 'Cover image') },
    { name: 'content', type: 'richText', localized: true, label: L('المحتوى', 'Contenu', 'Content') },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: L('تاريخ النشر', 'Date de publication', 'Published at'),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: { beforeChange: [({ value, siblingData }) => value || (siblingData._status === 'published' ? new Date().toISOString() : value)] },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: L('التصنيف', 'Catégorie', 'Category'), admin: { position: 'sidebar' } },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: L('الكاتب', 'Auteur', 'Author'),
      admin: { position: 'sidebar' },
      defaultValue: ({ user }) => user?.id,
    },
    seoField,
  ],
}
