'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// A wipe whose leading edge leans at the brand's 66° (≈ 24% horizontal run over the full height).
const hiddenLTR = 'polygon(0% 0%, 0% 0%, -24% 100%, -24% 100%)'
const shownLTR = 'polygon(0% 0%, 124% 0%, 100% 100%, -24% 100%)'
const hiddenRTL = 'polygon(100% 0%, 100% 0%, 124% 100%, 124% 100%)'
const shownRTL = 'polygon(100% 0%, -24% 0%, 0% 100%, 124% 100%)'

/** Reveals media with a slanted wipe that travels in the reading direction. */
export function SlantReveal({ children, rtl = false, className, delay = 0 }: { children: ReactNode; rtl?: boolean; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  // The viewport trigger sits on an unclipped wrapper: a fully clipped element never reports as intersecting.
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className={className} initial={reduce ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
        <m.div
          className="h-full w-full"
          variants={{ hidden: { clipPath: rtl ? hiddenRTL : hiddenLTR }, shown: { clipPath: rtl ? shownRTL : shownLTR } }}
          transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1], delay }}
        >
          {children}
        </m.div>
      </m.div>
    </LazyMotion>
  )
}
