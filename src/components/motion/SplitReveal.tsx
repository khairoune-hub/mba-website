'use client'

import { domAnimation, LazyMotion, m, useReducedMotion } from 'framer-motion'

/**
 * Words rise from a mask one after another. Splits on spaces only — never inside a word —
 * so Arabic letters stay joined.
 */
export function SplitReveal({ text, delay = 0, onLoad = false, stagger = 0.06 }: { text: string; delay?: number; onLoad?: boolean; stagger?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{text}</>
  const words = text.split(/(\s+)/)
  let n = 0
  return (
    <LazyMotion features={domAnimation} strict>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          if (/^\s+$/.test(w)) return w
          const idx = n++
          const target = { y: '0%', opacity: 1 }
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
              <m.span
                className="inline-block"
                initial={{ y: '105%', opacity: 0 }}
                {...(onLoad ? { animate: target } : { whileInView: target, viewport: { once: true, margin: '0px 0px -8% 0px' } })}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: delay + idx * stagger }}
              >
                {w}
              </m.span>
            </span>
          )
        })}
      </span>
    </LazyMotion>
  )
}
