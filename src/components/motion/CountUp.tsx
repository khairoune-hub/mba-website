'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/** Counts from 0 to `value` once when visible. Western digits in both locales. */
export function CountUp({ value, prefix = '', suffix = '', duration = 1.8 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, value, { duration, ease: [0.22, 0.61, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, value, duration])
  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {prefix}
      {n.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
