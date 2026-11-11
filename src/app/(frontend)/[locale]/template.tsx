import type { ReactNode } from 'react'

/** No route transition: pages render immediately. */
export default function Template({ children }: { children: ReactNode }) {
  return <>{children}</>
}
