import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { L } from '@/fields/label'
import { revalidateCollection, revalidateCollectionDelete } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: L('تصنيف', 'Catégorie', 'Category'), plural: L('التصنيفات', 'Catégories', 'Categories') },
  admin: { useAsTitle: 'name', group: L('المحتوى', 'Contenu', 'Content') },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateCollection('posts')], afterDelete: [revalidateCollectionDelete('posts')] },
  fields: [{ name: 'name', type: 'text', required: true, localized: true, label: L('الاسم', 'Nom', 'Name') }, slugField('name')],
}
