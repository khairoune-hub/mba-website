'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Fade + 12px rise, once, when scrolled into view. LazyMotion keeps the Framer Motion payload small. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
  const reduce = useReducedMotion()
  const M = m[as]
  return (
    <LazyMotion features={domAnimation} strict>
      <M
        className={className}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1], delay }}
      >
        {children}
      </M>
    </LazyMotion>
  )
}
