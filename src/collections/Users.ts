import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelf, isAdminUser } from '@/access'
import { L } from '@/fields/label'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: L('مستخدم', 'Utilisateur', 'User'), plural: L('المستخدمون', 'Utilisateurs', 'Users') },
  auth: { tokenExpiration: 60 * 60 * 8 },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: L('الإدارة', 'Administration', 'Administration'),
    hidden: ({ user }) => !isAdminUser(user as any),
  },
  defaultPopulate: { name: true },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account becomes an admin.
      async ({ req, data, operation }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.roles = ['admin']
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: L('الاسم', 'Nom', 'Name') },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      access: { create: isAdminField, update: isAdminField },
      label: L('الأدوار', 'Rôles', 'Roles'),
      options: [
        { label: L('مدير', 'Administrateur', 'Admin'), value: 'admin' },
        { label: L('محرر', 'Éditeur', 'Editor'), value: 'editor' },
      ],
    },
  ],
}
