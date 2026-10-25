import type { CollectionConfig } from 'payload'
import { isStaff, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { L } from '@/fields/label'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'
import { previewPath } from '@/lib/preview'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: L('فعالية', 'Événement', 'Event'), plural: L('الفعاليات', 'Événements', 'Events') },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', '_status'],
    group: L('المحتوى', 'Contenu', 'Content'),
    livePreview: { url: ({ data, locale }) => previewPath('events', data?.slug, locale?.code) },
    preview: (data, { locale }) => previewPath('events', data?.slug as string, locale),
  },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateCollection('events')], afterDelete: [revalidateCollectionDelete('events')] },
  defaultSort: 'startDate',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: L('العنوان', 'Titre', 'Title') },
    { name: 'excerpt', type: 'textarea', localized: true, label: L('ملخص', 'Résumé', 'Summary'), maxLength: 320 },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true, label: L('البداية', 'Début', 'Start'), admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endDate', type: 'date', label: L('النهاية', 'Fin', 'End'), admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', localized: true, label: L('المكان', 'Lieu', 'Location') },
        { name: 'mapUrl', type: 'text', label: L('رابط الخريطة', 'Lien de la carte', 'Map URL') },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: L('صورة الغلاف', 'Image de couverture', 'Cover image') },
    { name: 'description', type: 'richText', localized: true, label: L('الوصف', 'Description', 'Description') },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: L('معرض الصور', 'Galerie', 'Gallery') },
    { name: 'registrationUrl', type: 'text', label: L('رابط التسجيل', 'Lien d’inscription', 'Registration URL') },
    slugField(),
    seoField,
  ],
}
