import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from './i18n/config'
import { internalSegment, segments } from './i18n/routes'

const COOKIE = 'NEXT_LOCALE'

/**
 * - `/` → `/{cookie locale | ar}`
 * - unprefixed paths → default locale
 * - localized public segments (/fr/a-propos) are rewritten to internal folders (/fr/about)
 * - internal segments used under the wrong locale (/fr/about) redirect to the public one
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const parts = pathname.split('/').filter(Boolean)
  const first = parts[0]

  if (!isLocale(first)) {
    const cookie = req.cookies.get(COOKIE)?.value
    const locale: Locale = isLocale(cookie) ? cookie : defaultLocale
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
    url.search = search
    return NextResponse.redirect(url)
  }

  const locale = first
  const seg = parts[1]
  let res: NextResponse
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-locale', locale)

  if (seg) {
    const internal = internalSegment(locale, seg)
    const wrongLocaleKey = (Object.keys(segments) as (keyof typeof segments)[]).find(
      (k) => segments[k].ar === seg && segments[k][locale] !== seg && segments[k][locale],
    )
    if (!internal && wrongLocaleKey) {
      const url = req.nextUrl.clone()
      url.pathname = '/' + [locale, segments[wrongLocaleKey][locale], ...parts.slice(2)].join('/')
      return NextResponse.redirect(url, 308)
    }
    if (internal && internal !== seg) {
      const url = req.nextUrl.clone()
      url.pathname = '/' + [locale, internal, ...parts.slice(2)].join('/')
      res = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    } else {
      res = NextResponse.next({ request: { headers: requestHeaders } })
    }
  } else {
    res = NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (req.cookies.get(COOKIE)?.value !== locale) {
    res.cookies.set(COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  }
  return res
}

export const config = {
  // Skip Payload (admin + API), Next internals, preview routes and files with an extension.
  matcher: ['/((?!admin|api|next|_next|.*\\..*).*)'],
}
