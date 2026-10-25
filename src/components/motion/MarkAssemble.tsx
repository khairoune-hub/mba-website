'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'
import { MARK_VIEWBOX, PATH_A, PATH_M, PATH_SUMMIT } from '../brand/mark-paths'
import { markFills, type MarkVariant } from '../brand/MbaMark'

const EASE = [0.22, 0.61, 0.36, 1] as const

/** The three shapes of the mark rise and settle one after another (M → A → summit). Never mirrored. */
export function MarkAssemble({ variant = 'color', className, delay = 0 }: { variant?: MarkVariant; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  const fills = markFills[variant]
  const paths = [PATH_M, PATH_A, PATH_SUMMIT]
  return (
    <LazyMotion features={domAnimation} strict>
      <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true" overflow="visible">
        {paths.map((d, i) => (
          <m.path
            key={i}
            d={d}
            fill={fills[i]}
            initial={reduce ? false : { opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.14 }}
          />
        ))}
      </svg>
    </LazyMotion>
  )
}
