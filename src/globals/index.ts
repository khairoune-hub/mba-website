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
          label: L('الواجهة', 'Héro', 'Hero'),
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'subtitle', type: 'textarea', localized: true },
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
                { name: 'body', type: 'textarea', localized: true, admin: { description: L('افصل الفقرات بسطر فارغ', 'Séparez les paragraphes par une ligne vide', 'Separate paragraphs with a blank line') } },
              ],
            },
          ],
        },
        {
          label: L('الرسالة والرؤية', 'Mission et vision', 'Mission & vision'),
          fields: (['mission', 'vision'] as const).map((name) => ({
            name,
            type: 'group' as const,
            fields: [
              { name: 'title', type: 'text' as const, localized: true },
              { name: 'body', type: 'textarea' as const, localized: true },
            ],
          })),
        },
        {
          label: L('الأنشطة', 'Activités', 'Activities'),
          fields: [
            {
              name: 'activities',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', localized: true },
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  maxRows: 8,
                  fields: [
                    { name: 'key', type: 'select', required: true, options: ['awareness', 'trips', 'export', 'establishment', 'fairs'].map((v) => ({ label: v, value: v })), admin: { description: L('يحدد الأيقونة', 'Détermine l’icône', 'Sets the icon') } },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: L('استمارة الانضمام', 'Formulaire d’adhésion', 'Membership form'),
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
                sectionToggle('values', 'القيم', 'Valeurs'),
                sectionToggle('activities', 'الأنشطة', 'Activités'),
                sectionToggle('news', 'الأخبار', 'Actualités'),
                sectionToggle('events', 'الفعاليات', 'Événements'),
                sectionToggle('cta', 'استمارة الانضمام', 'Formulaire d’adhésion'),
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
      maxRows: 6,
      label: L('القيم', 'Valeurs', 'Values'),
      fields: [
        { type: 'row', fields: [{ name: 'key', type: 'select', required: true, options: ['trust', 'cooperation', 'excellence'].map((v) => ({ label: v, value: v })), admin: { description: L('يحدد الأيقونة', 'Détermine l’icône', 'Sets the icon') } }, { name: 'title', type: 'text', required: true }] },
        { name: 'body', type: 'textarea', label: L('النص', 'Texte', 'Body') },
      ],
    },
  ],
}

export const About: GlobalConfig = {
  slug: 'about-page',
  label: L('صفحة من نحن', 'Page Qui sommes-nous', 'About page'),
  ...adminOnly,
  hooks: { afterChange: [revalidateGlobal('about-page')] },
  admin: {
    ...adminOnly.admin,
    description: L('النص والرسالة والرؤية والقيم تُعدَّل من الصفحة الرئيسية وصفحة القيم.', 'Le texte, la mission, la vision et les valeurs se modifient dans « Page d’accueil » et « Valeurs ».', 'Who-we-are text, mission, vision and values are edited in Home page and Values.'),
  },
  fields: [
    { name: 'intro', type: 'group', fields: [{ name: 'title', type: 'text', localized: true }, { name: 'lead', type: 'textarea', localized: true }] },
    { name: 'image', type: 'upload', relationTo: 'media', label: L('صورة', 'Image', 'Image') },
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
