import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { ar: 'عنوان SEO', fr: 'Titre SEO' } as any },
    { name: 'description', type: 'textarea', localized: true, label: { ar: 'وصف SEO', fr: 'Description SEO' } as any, maxLength: 200 },
    { name: 'image', type: 'upload', relationTo: 'media', label: { ar: 'صورة المشاركة', fr: 'Image de partage' } as any },
  ],
}
