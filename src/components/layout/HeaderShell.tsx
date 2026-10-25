'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Sticky header behaviour: compacts with a hairline after 24px of scroll and, on small screens,
 * hides while scrolling down and returns when scrolling up.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const mobile = window.matchMedia('(max-width: 1023px)').matches
      setHidden(mobile && y > 160 && y > last.current + 4)
      if (y < last.current - 4 || y < 160) setHidden(false)
      last.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={`group/header sticky top-0 z-40 border-b transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out)] ${
        scrolled ? 'border-border bg-white/90 shadow-[0_6px_24px_-18px_rgb(15_23_42/0.35)] backdrop-blur-md' : 'border-transparent bg-white/70 backdrop-blur-md'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {children}
    </header>
  )
}
