import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '@/access'
import { L } from '@/fields/label'

/** Written by the contact form (server action, Local API). Read-only for editors. */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: L('طلب', 'Demande', 'Submission'), plural: L('الطلبات والرسائل', 'Demandes et messages', 'Requests & messages') },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'sector', 'subject', 'createdAt'],
    group: L('الإدارة', 'Administration', 'Administration'),
  },
  access: { create: isAdmin, read: isStaff, update: isAdmin, delete: isAdmin },
  fields: [
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true, label: L('الاسم', 'Nom', 'Name') }, { name: 'email', type: 'email', required: true }] },
    { type: 'row', fields: [{ name: 'phone', type: 'text', label: L('الهاتف', 'Téléphone', 'Phone') }, { name: 'company', type: 'text', label: L('الشركة', 'Entreprise', 'Company') }] },
    { name: 'sector', type: 'text', label: L('مجال النشاط', 'Domaine d’activité', 'Sector') },
    {
      name: 'subject',
      type: 'select',
      label: L('الموضوع', 'Objet', 'Subject'),
      options: [
        { label: L('الانضمام', 'Adhésion', 'Membership'), value: 'membership' },
        { label: L('شراكة', 'Partenariat', 'Partnership'), value: 'partnership' },
        { label: L('إعلام', 'Presse', 'Press'), value: 'press' },
        { label: L('أخرى', 'Autre', 'Other'), value: 'other' },
      ],
    },
    { name: 'message', type: 'textarea', label: L('الرسالة', 'Message', 'Message') },
    { name: 'locale', type: 'text', admin: { position: 'sidebar' } },
    { name: 'emailed', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', readOnly: true } },
  ],
}
