import type { Access, FieldAccess, PayloadRequest } from 'payload'

type MaybeUser = PayloadRequest['user'] | null | undefined

export const hasRole = (user: MaybeUser, role: 'admin' | 'editor') =>
  Boolean(user && Array.isArray((user as any).roles) && (user as any).roles.includes(role))

export const isAdminUser = (user: MaybeUser) => hasRole(user, 'admin')
export const isStaffUser = (user: MaybeUser) => hasRole(user, 'admin') || hasRole(user, 'editor')

export const anyone: Access = () => true
export const isAdmin: Access = ({ req }) => isAdminUser(req.user)
export const isStaff: Access = ({ req }) => isStaffUser(req.user)
export const isAdminField: FieldAccess = ({ req }) => isAdminUser(req.user)

/** Staff see drafts; the public sees published documents only. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaffUser(req.user)) return true
  return { _status: { equals: 'published' } }
}

export const isAdminOrSelf: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}
