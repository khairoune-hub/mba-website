'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Media } from '@/payload-types'
import { ChevronIcon, CloseIcon } from './icons'
import { SlantReveal } from '../motion/SlantReveal'

type Labels = { close: string; prev: string; next: string }

/** Responsive grid + accessible lightbox (Esc, arrow keys honour reading direction). */
export function Gallery({ images, labels, dir }: { images: Media[]; labels: Labels; dir: 'rtl' | 'ltr' }) {
  const [index, setIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const open = index !== null

  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
      if (e.key === forward) go(1)
      if (e.key === back) go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, dir])

  const current = index !== null ? images[index] : null
  const src = (m: Media, size: 'card' | 'hero') => m.sizes?.[size]?.url || m.url || ''

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((m, i) => (
          <li key={m.id} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
            <SlantReveal rtl={dir === 'rtl'} delay={i * 0.08}>
              <button type="button" onClick={() => setIndex(i)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-md)] bg-mist">
                <Image src={src(m, 'card')} alt={m.alt || ''} fill sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '33vw'} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </button>
            </SlantReveal>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-navy/95 p-0 text-white backdrop:bg-navy/80"
      >
        {current && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-4 md:p-10">
            <div className="relative h-[75vh] w-full">
              <Image src={src(current, 'hero')} alt={current.alt || ''} fill sizes="100vw" className="object-contain" />
            </div>
            {(current.caption || current.alt) && <p className="max-w-2xl text-center text-white/80">{current.caption || current.alt}</p>}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => go(-1)} className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-white/30 hover:bg-white/10">
                <ChevronIcon className="size-5 rotate-180" />
                <span className="sr-only">{labels.prev}</span>
              </button>
              <span dir="ltr" className="text-sm text-white/70">
                {(index ?? 0) + 1} / {images.length}
              </span>
              <button type="button" onClick={() => go(1)} className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-white/30 hover:bg-white/10">
                <ChevronIcon className="size-5" />
                <span className="sr-only">{labels.next}</span>
              </button>
            </div>
            <button type="button" onClick={() => setIndex(null)} className="absolute end-4 top-4 inline-flex size-11 items-center justify-center rounded-full ring-1 ring-white/30 hover:bg-white/10">
              <CloseIcon />
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>
        )}
      </dialog>
    </>
  )
}
