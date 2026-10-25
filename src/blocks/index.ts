import type { Block } from 'payload'
import { linkField } from '@/fields/link'
import { L } from '@/fields/label'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: L('بطل', 'Bandeau héro', 'Hero'), plural: L('أبطال', 'Bandeaux', 'Heroes') },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'lead', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: L('نص', 'Texte riche', 'Rich text'), plural: L('نصوص', 'Textes', 'Rich texts') },
  fields: [{ name: 'content', type: 'richText', localized: true }],
}

export const CardsBlock: Block = {
  slug: 'cards',
  labels: { singular: L('بطاقات', 'Cartes', 'Cards'), plural: L('بطاقات', 'Cartes', 'Cards') },
  fields: [
    { name: 'title', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: L('دعوة', 'Appel à l’action', 'Call to action'), plural: L('دعوات', 'Appels', 'CTAs') },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'body', type: 'textarea', localized: true },
    linkField('link'),
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: L('صورة ونص', 'Image et texte', 'Image + text'), plural: L('صورة ونص', 'Images et textes', 'Image + text') },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'imageSide', type: 'select', defaultValue: 'start', options: [{ label: 'Start', value: 'start' }, { label: 'End', value: 'end' }] },
  ],
}

export const pageBlocks = [HeroBlock, RichTextBlock, CardsBlock, CTABlock, ImageTextBlock]
