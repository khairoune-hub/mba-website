'use client'

import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/** Moves its content slower/faster than the page while its section scrolls by (clamped to ±distance px). */
export function Parallax({ children, distance = 40, className }: { children: ReactNode; distance?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance])
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div ref={ref} style={{ y }} className={className}>
        {children}
      </m.div>
    </LazyMotion>
  )
}
