'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'

/** Thin brand hairlines that draw themselves when they enter the viewport. */
export function DrawPaths({ paths, stroke, className, onLoad = false }: { paths: string[]; stroke: string; className?: string; onLoad?: boolean }) {
  const reduce = useReducedMotion()
  const target = { pathLength: 1, opacity: 1 }
  return (
    <LazyMotion features={domAnimation} strict>
      <svg aria-hidden="true" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className={className}>
        {paths.map((d, i) => (
          <m.path
            key={i}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            {...(onLoad ? { animate: target } : { whileInView: target, viewport: { once: true, amount: 0.2 } })}
            transition={{ pathLength: { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 + i * 0.25 }, opacity: { duration: 0.3, delay: 0.2 + i * 0.25 } }}
          />
        ))}
      </svg>
    </LazyMotion>
  )
}
