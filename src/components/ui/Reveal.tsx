'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * One quiet fade when a block first scrolls into view. No movement, no stagger.
 * Content is visible on the server render and when JS or IntersectionObserver is unavailable;
 * only blocks that start below the fold are hidden, so nothing above it ever flickers.
 */
export function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
  const ref = useRef<HTMLElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setHidden(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // @ts-expect-error -- polymorphic ref on an intrinsic element
    <Tag ref={ref} className={`reveal ${className}`} data-hidden={hidden || undefined}>
      {children}
    </Tag>
  )
}
