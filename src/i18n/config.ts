export const locales = ['ar', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v)
export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr')
export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'fr' : 'ar')
/** BCP-47 tags used for Intl formatting and hreflang. Arabic keeps Western digits (common in Algeria). */
export const intlTag: Record<Locale, string> = { ar: 'ar-DZ-u-nu-latn', fr: 'fr-DZ' }
export const hreflang: Record<Locale, string> = { ar: 'ar-DZ', fr: 'fr-DZ' }
