import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '@/access'
import { L } from '@/fields/label'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: L('وسائط', 'Média', 'Media'), plural: L('الوسائط', 'Médias', 'Media') },
  admin: { group: L('المحتوى', 'Contenu', 'Content'), defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  upload: {
    // Used only when S3 storage is not configured (local development).
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 800, height: 500, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true, label: L('النص البديل', 'Texte alternatif', 'Alt text') },
    { name: 'caption', type: 'text', localized: true, label: L('تعليق', 'Légende', 'Caption') },
  ],
}
