import type { Field, FieldHook } from 'payload'
import { L } from './label'

/** Keeps Latin letters, digits and Arabic letters; strips diacritics/tatweel; collapses separators. */
export const slugify = (input: string) =>
  input
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '') // Arabic harakat + tatweel
    .replace(/[̀-ͯ]/g, '') // Latin diacritics
    .toLowerCase()
    .replace(/[’'"«»“”]/g, '')
    .replace(/[^a-z0-9ء-ي٠-٩]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof source === 'string' ? slugify(source) : value
  }

/** Localized slug, auto-generated from `title` (or another field) when left empty. */
export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  localized: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: L('يُولَّد تلقائياً من العنوان إن تُرك فارغاً.', 'Généré automatiquement à partir du titre s’il est laissé vide.', 'Generated from the title when left empty.'),
  },
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
})
