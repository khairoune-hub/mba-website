import type { ElementType, ReactNode } from 'react'

export function Container({ as: Tag = 'div', className = '', children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={`container-mba ${className}`}>{children}</Tag>
}
