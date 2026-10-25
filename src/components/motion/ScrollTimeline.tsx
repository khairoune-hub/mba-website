'use client'

import { domAnimation, LazyMotion, m, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/**
 * Timeline whose green line draws as the list scrolls through the viewport:
 * vertical on mobile, horizontal (growing from the inline start) on md+.
 */
export function ScrollTimeline({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <LazyMotion features={domAnimation} strict>
      <ol ref={ref} className={`relative ${className}`}>
        <span aria-hidden="true" className="absolute inset-y-0 start-[7px] w-px bg-green/15 md:inset-x-0 md:start-0 md:top-[7px] md:h-px md:w-auto" />
        {/* vertical (mobile) */}
        <m.span aria-hidden="true" style={reduce ? undefined : { scaleY: progress }} className="absolute inset-y-0 start-[7px] w-px origin-top bg-green md:hidden" />
        {/* horizontal (md+), grows from the inline start */}
        <m.span aria-hidden="true" style={reduce ? undefined : { scaleX: progress }} className="absolute inset-x-0 top-[7px] hidden h-px bg-green ltr:origin-left rtl:origin-right md:block" />
        {children}
      </ol>
    </LazyMotion>
  )
}
