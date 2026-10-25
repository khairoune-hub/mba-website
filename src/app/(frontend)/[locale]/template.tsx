'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Gentle fade + 8px rise between routes (re-mounts on every navigation). */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div initial={reduce ? false : { opacity: 0.001, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}>
        {children}
      </m.div>
    </LazyMotion>
  )
}
