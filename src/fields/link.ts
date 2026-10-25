import type { Field } from 'payload'

export const routeOptions = [
  { label: { ar: 'الرئيسية', fr: 'Accueil' }, value: 'home' },
  { label: { ar: 'من نحن', fr: 'À propos' }, value: 'about' },
  { label: { ar: 'قيمنا', fr: 'Nos valeurs' }, value: 'values' },
  { label: { ar: 'الأخبار', fr: 'Actualités' }, value: 'news' },
  { label: { ar: 'الفعاليات', fr: 'Événements' }, value: 'events' },
  { label: { ar: 'اتصل بنا', fr: 'Contact' }, value: 'contact' },
  { label: { ar: 'الشروط والخصوصية', fr: 'Mentions légales' }, value: 'legal' },
] as any

/** A link that points to an internal route (localised automatically) or a custom URL. */
export const linkField = (name = 'link', opts: { label?: boolean } = { label: true }): Field => ({
  name,
  type: 'group',
  fields: [
    ...(opts.label ? [{ name: 'label', type: 'text', localized: true, required: true } as Field] : []),
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'radio', defaultValue: 'internal', options: [{ label: 'Internal', value: 'internal' }, { label: 'URL', value: 'custom' }] },
        { name: 'route', type: 'select', options: routeOptions, admin: { condition: (_, s) => s?.type !== 'custom' } },
        { name: 'url', type: 'text', admin: { condition: (_, s) => s?.type === 'custom' } },
      ],
    },
  ],
})
