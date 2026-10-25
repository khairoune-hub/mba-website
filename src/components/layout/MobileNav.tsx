'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { CloseIcon, MenuIcon } from '../ui/icons'
import { NavLinks } from './NavLinks'
import type { ResolvedLink } from './nav'
import { MbaMark } from '../brand/MbaMark'
import { Hairlines } from '../motifs/Hairlines'

/** Drawer that slides in from the inline-end edge (right in LTR, left in RTL). */
export function MobileNav({ links, labels, children }: { links: ResolvedLink[]; labels: { menu: string; close: string }; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab') {
        const f = focusables()
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      document.documentElement.style.overscrollBehavior = ''
      window.removeEventListener('keydown', onKey)
      buttonRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex size-11 items-center justify-center rounded-full text-charcoal ring-1 ring-inset ring-charcoal/15"
      >
        <MenuIcon />
        <span className="sr-only">{labels.menu}</span>
      </button>
      {/* Portal: the sticky header's backdrop-filter would otherwise contain these fixed layers. */}
      {mounted &&
        createPortal(
          <>
      <div
        className={`fixed inset-0 z-50 bg-navy/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      {/* Clipping wrapper: keeps the off-screen drawer from widening the page. */}
      <div className={`fixed inset-0 z-50 overflow-hidden ${open ? '' : 'pointer-events-none'}`} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div
        id="mobile-nav"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        className={`absolute inset-y-0 end-0 flex w-[min(88vw,380px)] flex-col overflow-hidden bg-white shadow-2xl will-change-transform transition-[transform,visibility] duration-300 ease-[var(--ease-out)] ${
          open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        } ${open ? '' : 'invisible'}`}
      >
        <Hairlines preset="section" className="opacity-60" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <MbaMark className="h-8 w-auto" />
          <button type="button" onClick={() => setOpen(false)} className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-inset ring-charcoal/15">
            <CloseIcon />
            <span className="sr-only">{labels.close}</span>
          </button>
        </div>
        <nav className="relative flex-1 px-6 py-4">
          <NavLinks links={links} onNavigate={() => setOpen(false)} className="flex flex-col gap-2 text-xl [&_a]:text-xl" />
        </nav>
        <div className="relative border-t border-border px-6 py-6">{children}</div>
      </div>
      </div>
          </>,
          document.body,
        )}
    </div>
  )
}
