import { ar, type Dictionary } from './ar'
import { fr } from './fr'
import type { Locale } from './config'

const dictionaries: Record<Locale, Dictionary> = { ar, fr }
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]
export type { Dictionary }
export * from './config'
export * from './routes'
