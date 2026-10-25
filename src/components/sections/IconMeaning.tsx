'use client'

import { useState } from 'react'
import { MARK_VIEWBOX, PATH_A, PATH_M, PATH_SUMMIT } from '../brand/mark-paths'
import type { HomeContent, ShapeKey } from '@/content/defaults'
import { Tri } from '../motifs/Tri'

const shapes: { key: ShapeKey; d: string; fill: string }[] = [
  { key: 'm', d: PATH_M, fill: 'var(--color-green)' },
  { key: 'a', d: PATH_A, fill: 'var(--color-charcoal)' },
  { key: 'summit', d: PATH_SUMMIT, fill: 'var(--color-green)' },
]

function withKeyword(body: string, keyword: string) {
  const i = body.indexOf(keyword)
  if (i < 0) return body
  return (
    <>
      {body.slice(0, i)}
      <mark className="box-decoration-clone rounded-[4px] bg-green px-[0.2em] font-semibold text-charcoal">{keyword}</mark>
      {body.slice(i + keyword.length)}
    </>
  )
}

/** Brand book slide 4. Hovering or focusing a shape (or its caption) highlights the pair. */
export function IconMeaning({ data, eyebrow, title, hint }: { data: HomeContent['iconMeaning']; eyebrow: string; title: string; hint: string }) {
  const [active, setActive] = useState<ShapeKey | null>(null)
  const byShape = Object.fromEntries(data.items.map((it) => [it.shape, it])) as Record<ShapeKey, (typeof data.items)[number] | undefined>

  return (
    <section className="section-y relative" aria-labelledby="icon-title">
      <div className="container-mba grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="t-eyebrow inline-flex items-center gap-2">
            <Tri className="size-[0.7em]" />
            {eyebrow}
          </p>
          <h2 id="icon-title" className="t-h2 mt-3">
            {title}
          </h2>
          <div className="mt-10" onMouseLeave={() => setActive(null)}>
            {/* Mark stays left-to-right in every locale. */}
            <svg viewBox={MARK_VIEWBOX} className="h-auto w-full max-w-md overflow-visible" role="group" aria-label={hint}>
              {shapes.map((s) => {
                const item = byShape[s.key]
                const dim = active && active !== s.key
                return (
                  <path
                    key={s.key}
                    d={s.d}
                    fill={s.fill}
                    tabIndex={0}
                    role="button"
                    aria-pressed={active === s.key}
                    aria-label={item?.keyword ?? s.key}
                    onMouseEnter={() => setActive(s.key)}
                    onFocus={() => setActive(s.key)}
                    onBlur={() => setActive(null)}
                    className="cursor-pointer outline-none transition-[opacity,transform] duration-500 ease-[var(--ease-out)] focus-visible:[stroke:var(--color-green-ink)] focus-visible:[stroke-width:6]"
                    style={{ opacity: dim ? 0.18 : 1, transform: active === s.key ? 'translateY(-10px)' : undefined, transformBox: 'fill-box' }}
                  />
                )
              })}
            </svg>
            <p className="mt-6 text-sm text-muted">{hint}</p>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="space-y-4">
            {shapes.map((s) => {
              const item = byShape[s.key]
              if (!item) return null
              const on = active === s.key
              return (
                <li
                  key={s.key}
                  onMouseEnter={() => setActive(s.key)}
                  onMouseLeave={() => setActive(null)}
                  className={`flex gap-4 rounded-[var(--radius-md)] p-5 transition-[background-color,box-shadow,opacity] duration-400 ${on ? 'bg-mist shadow-[var(--shadow-soft)]' : ''} ${active && !on ? 'opacity-50' : ''}`}
                >
                  <Tri className="mt-[0.45em] size-[0.85em] flip-rtl rotate-90" />
                  <p className="text-[1.075rem] leading-[1.9] text-ink">{withKeyword(item.body, item.keyword)}</p>
                </li>
              )
            })}
          </ol>
          <p className="mt-8 ps-5 font-[family-name:var(--font-head)] text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-bold text-gold-ink">{data.closing}</p>
        </div>
      </div>
    </section>
  )
}
