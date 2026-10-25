import { intlTag, type Locale } from '@/i18n/config'

const TZ = 'Africa/Algiers'

export function formatDate(locale: Locale, value: string | Date | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!value) return ''
  return new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, ...opts }).format(new Date(value))
}

export function formatTime(locale: Locale, value: string | Date | null | undefined) {
  if (!value) return ''
  return new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value))
}

export function formatDateRange(locale: Locale, start: string, end?: string | null) {
  const fmt = new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' })
  if (!end) return fmt.format(new Date(start))
  try {
    return fmt.formatRange(new Date(start), new Date(end))
  } catch {
    return `${fmt.format(new Date(start))} – ${fmt.format(new Date(end))}`
  }
}

/** Day / short-month parts for date badges. */
export function dateParts(locale: Locale, value: string) {
  const d = new Date(value)
  return {
    day: new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, day: '2-digit' }).format(d),
    month: new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, month: 'short' }).format(d),
    year: new Intl.DateTimeFormat(intlTag[locale], { timeZone: TZ, year: 'numeric' }).format(d),
  }
}

/** Reading time in minutes from Lexical JSON (Arabic ≈ 180 wpm, French ≈ 220 wpm). */
export function readingTime(locale: Locale, content: unknown): number {
  const text: string[] = []
  const walk = (node: any) => {
    if (!node) return
    if (typeof node.text === 'string') text.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(walk)
    if (node.root) walk(node.root)
  }
  walk(content)
  const words = text.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / (locale === 'ar' ? 180 : 220)))
}
