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
    let ticking = false
    let anchor = window.scrollY // scroll position where the current direction started
    let dir = 0
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        // Ignore iOS rubber-band overscroll and the scroll lock applied while the drawer is open.
        const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight))
        if (document.documentElement.style.overflow === 'hidden') return
        setScrolled(y > 24)
        const mobile = window.matchMedia('(max-width: 1023px)').matches
        if (!mobile || y < 160) {
          setHidden(false)
          anchor = y
          return
        }
        const d = Math.sign(y - last.current)
        if (d !== 0 && d !== dir) {
          dir = d
          anchor = last.current
        }
        last.current = y
        // Only flip after a deliberate swipe, so small jitters don't toggle the header.
        if (dir > 0 && y - anchor > 64) setHidden(true)
        else if (dir < 0 && anchor - y > 48) setHidden(false)
      })
    }
    last.current = window.scrollY
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={`group/header sticky top-0 z-40 border-b will-change-transform transition-[transform,background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out)] ${
        scrolled ? 'border-border bg-white/90 shadow-[0_6px_24px_-18px_rgb(15_23_42/0.35)] backdrop-blur-md' : 'border-transparent bg-white/70 backdrop-blur-md'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {children}
    </header>
  )
}
