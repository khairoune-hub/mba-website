import type { GlobalConfig } from 'payload'
import { anyone, isAdmin, isAdminUser } from '@/access'
import { linkField } from '@/fields/link'
import { L } from '@/fields/label'
import { revalidateGlobal } from '@/hooks/revalidate'

const siteGroup = L('الموقع', 'Site', 'Site')
const adminOnly = {
  access: { read: anyone, update: isAdmin },
  admin: { group: siteGroup, hidden: ({ user }: { user: any }) => !isAdminUser(user) },
}

export const Header: GlobalConfig = {
  slug: 'header',
  label: L('الترويسة', 'En-tête', 'Header'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('header')] },
  fields: [
    { name: 'navItems', type: 'array', label: L('روابط التنقل', 'Liens de navigation', 'Navigation'), maxRows: 8, fields: [linkField('link')] },
    { ...linkField('cta'), label: L('زر الدعوة', 'Bouton d’action', 'CTA') } as any,
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: L('التذييل', 'Pied de page', 'Footer'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('footer')] },
  fields: [
    { name: 'blurb', type: 'textarea', localized: true, label: L('نبذة', 'Présentation', 'Blurb') },
    { type: 'row', fields: [{ name: 'phone', type: 'text', label: L('الهاتف', 'Téléphone', 'Phone') }, { name: 'email', type: 'email', label: 'Email' }] },
    { name: 'address', type: 'textarea', localized: true, label: L('العنوان', 'Adresse', 'Address') },
    {
      name: 'socials',
      type: 'array',
      label: L('الشبكات الاجتماعية', 'Réseaux sociaux', 'Socials'),
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'platform', type: 'select', required: true, options: ['linkedin', 'facebook', 'instagram', 'x', 'youtube', 'whatsapp'].map((v) => ({ label: v, value: v })) },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'legalNote', type: 'text', localized: true, label: L('ملاحظة قانونية', 'Mention légale', 'Legal note') },
  ],
}

const sectionToggle = (name: string, ar: string, fr: string) => ({ name, type: 'checkbox' as const, defaultValue: true, label: L(ar, fr) })

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: L('الصفحة الرئيسية', 'Page d’accueil', 'Home page'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('home-page')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('البطل', 'Héro', 'Hero'),
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'text', localized: true },
                { type: 'row', fields: [{ name: 'primaryLabel', type: 'text', localized: true }, { name: 'secondaryLabel', type: 'text', localized: true }] },
              ],
            },
          ],
        },
        {
          label: L('من نحن', 'Qui sommes-nous', 'Who we are'),
          fields: [
            {
              name: 'who',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'body', type: 'textarea', localized: true },
                { name: 'highlight', type: 'text', localized: true, admin: { description: L('جزء من النص يُبرز بالأخضر', 'Partie du texte mise en évidence', 'Phrase highlighted in green') } },
              ],
            },
          ],
        },
        {
          label: L('الركائز', 'Piliers', 'Pillars'),
          fields: [
            {
              name: 'pillars',
              type: 'array',
              localized: true,
              maxRows: 3,
              fields: [
                { name: 'key', type: 'select', required: true, options: ['industry', 'trade', 'services'].map((v) => ({ label: v, value: v })) },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: L('معنى الرمز', 'Sens du symbole', 'Icon meaning'),
          fields: [
            {
              name: 'iconMeaning',
              type: 'group',
              fields: [
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  maxRows: 3,
                  fields: [
                    { name: 'shape', type: 'select', required: true, options: [{ label: 'M', value: 'm' }, { label: 'A', value: 'a' }, { label: 'Summit', value: 'summit' }] },
                    { name: 'keyword', type: 'text', required: true },
                    { name: 'body', type: 'textarea' },
                  ],
                },
                { name: 'closing', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: L('الأرقام', 'Chiffres clés', 'Key figures'),
          fields: [
            {
              name: 'stats',
              type: 'array',
              localized: true,
              maxRows: 4,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'number', required: true },
                    { name: 'prefix', type: 'text', admin: { width: '20%' } },
                    { name: 'suffix', type: 'text', admin: { width: '20%' } },
                  ],
                },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: L('الدعوة الختامية', 'Bandeau final', 'Closing CTA'),
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'body', type: 'textarea', localized: true },
                { name: 'buttonLabel', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: L('الأقسام', 'Sections', 'Sections'),
          fields: [
            {
              name: 'sections',
              type: 'group',
              fields: [
                sectionToggle('stats', 'الأرقام', 'Chiffres clés'),
                sectionToggle('pillars', 'الركائز', 'Piliers'),
                sectionToggle('values', 'القيم', 'Valeurs'),
                sectionToggle('iconMeaning', 'معنى الرمز', 'Sens du symbole'),
                sectionToggle('news', 'الأخبار', 'Actualités'),
                sectionToggle('events', 'الفعاليات', 'Événements'),
                sectionToggle('cta', 'الدعوة الختامية', 'Bandeau final'),
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const Values: GlobalConfig = {
  slug: 'values',
  label: L('القيم', 'Valeurs', 'Values'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('values')] },
  fields: [
    { name: 'intro', type: 'textarea', localized: true, label: L('مقدمة', 'Introduction', 'Intro') },
    {
      name: 'items',
      type: 'array',
      localized: true,
      minRows: 0,
      maxRows: 4,
      label: L('القيم', 'Valeurs', 'Values'),
      fields: [
        { type: 'row', fields: [{ name: 'key', type: 'select', required: true, options: ['integrity', 'trust', 'prudence', 'solidarity'].map((v) => ({ label: v, value: v })) }, { name: 'title', type: 'text', required: true }] },
        {
          type: 'row',
          fields: [
            { name: 'before', type: 'text', required: true, admin: { description: L('الجزء قبل ▲ (مثال: الأمـ)', 'Partie avant le ▲', 'Text before ▲') } },
            { name: 'after', type: 'text', required: true, admin: { description: L('الجزء بعد ▲ (مثال: ـانة)', 'Partie après le ▲', 'Text after ▲') } },
          ],
        },
        { name: 'motto', type: 'text', required: true, label: L('الشعار', 'Devise', 'Motto') },
        { name: 'body', type: 'textarea', label: L('النص', 'Texte', 'Body') },
      ],
    },
  ],
}

export const About: GlobalConfig = {
  slug: 'about-page',
  label: L('صفحة من نحن', 'Page À propos', 'About page'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('about-page')] },
  fields: [
    { name: 'intro', type: 'group', fields: [{ name: 'title', type: 'text', localized: true }, { name: 'lead', type: 'textarea', localized: true }] },
    ...(['story', 'heritage', 'logo'] as const).map((name) => ({
      name,
      type: 'group' as const,
      fields: [
        { name: 'title', type: 'text' as const, localized: true },
        { name: 'body', type: 'textarea' as const, localized: true },
      ],
    })),
    ...(['vision', 'model'] as const).map((name) => ({
      name,
      type: 'group' as const,
      fields: [
        { name: 'title', type: 'text' as const, localized: true },
        { name: 'body', type: 'textarea' as const, localized: true },
        { name: 'points', type: 'array' as const, localized: true, fields: [{ name: 'text', type: 'text' as const, required: true }] },
      ],
    })),
    { name: 'image', type: 'upload', relationTo: 'media', label: L('صورة', 'Image', 'Image') },
    {
      name: 'timeline',
      type: 'array',
      localized: true,
      label: L('المسار', 'Repères', 'Timeline'),
      fields: [
        { type: 'row', fields: [{ name: 'year', type: 'text', required: true }, { name: 'title', type: 'text', required: true }] },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'team',
      type: 'array',
      label: L('فريق القيادة', 'Équipe dirigeante', 'Leadership'),
      fields: [
        { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'role', type: 'text', localized: true }] },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: L('إعدادات الموقع', 'Réglages du site', 'Site settings'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('site-settings')] },
  fields: [
    { name: 'siteName', type: 'text', localized: true },
    { name: 'defaultTitle', type: 'text', localized: true, label: L('العنوان الافتراضي', 'Titre par défaut', 'Default title') },
    { name: 'defaultDescription', type: 'textarea', localized: true, label: L('الوصف الافتراضي', 'Description par défaut', 'Default description') },
    { name: 'ogImage', type: 'upload', relationTo: 'media', label: L('صورة المشاركة', 'Image de partage', 'OG image') },
    { name: 'contactRecipient', type: 'email', label: L('بريد استقبال الرسائل', 'Destinataire des messages', 'Contact recipient') },
  ],
}

export const globals = [Header, Footer, HomePage, Values, About, SiteSettings]
