'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Drops the ▲ into its value word with a soft spring when the word appears. */
export function TriDrop({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <LazyMotion features={domAnimation} strict>
      <m.span
        className={`inline-flex ${className ?? ''}`}
        initial={reduce ? false : { y: '-1.2em', opacity: 0, rotate: -25 }}
        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.25 }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}
