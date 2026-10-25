'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '@/i18n/config'

type Alt = Partial<Record<Locale, string>>
const Ctx = createContext<{ alt: Alt | null; setAlt: (a: Alt | null) => void }>({ alt: null, setAlt: () => {} })

export function AlternatesProvider({ children }: { children: ReactNode }) {
  const [alt, setAlt] = useState<Alt | null>(null)
  return <Ctx.Provider value={{ alt, setAlt }}>{children}</Ctx.Provider>
}

export const useAlternates = () => useContext(Ctx).alt

/** Declares the URL of the current page in each locale (used by the language switcher). */
export function SetAlternates(props: Alt) {
  const { setAlt } = useContext(Ctx)
  const key = JSON.stringify(props)
  useEffect(() => {
    setAlt(JSON.parse(key))
    return () => setAlt(null)
  }, [key, setAlt])
  return null
}
