'use client'

import { useEffect, useState } from 'react'

/** Dev helper: reports whether each TheMixArab weight actually loaded in this browser. */
export function FontCheck() {
  const [rows, setRows] = useState<{ weight: string; ok: boolean }[] | null>(null)
  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-themix').split(',')[0].trim()
    Promise.all(
      ['400', '700', '900'].map(async (weight) => {
        await document.fonts.load(`${weight} 24px ${family}`, 'تحالف').catch(() => [])
        const ok = [...document.fonts].some((f) => f.family.replace(/['"]/g, '') === family.replace(/['"]/g, '') && f.weight === weight && f.status === 'loaded')
        return { weight, ok }
      }),
    ).then(setRows)
  }, [])
  return (
    <ul className="flex flex-wrap gap-3 text-sm font-semibold" aria-live="polite">
      {(rows ?? []).map((r) => (
        <li key={r.weight} className={`rounded-full px-3 py-1 ${r.ok ? 'bg-green-soft text-[#41681a]' : 'bg-red-100 text-red-800'}`}>
          TheMixArab {r.weight}: {r.ok ? 'loaded ✓' : 'NOT loaded ✗'}
        </li>
      ))}
      {!rows && <li className="text-muted">checking fonts…</li>}
    </ul>
  )
}
