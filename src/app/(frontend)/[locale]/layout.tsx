import type { Metadata, Viewport } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import '@/styles/globals.css'
import { fahkwang, inter, themix } from '@/lib/fonts'
import { dirOf, isLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { AlternatesProvider } from '@/components/layout/Alternates'
import { PreviewBar } from '@/components/layout/PreviewBar'
import { JsonLd, organizationLd } from '@/lib/jsonld'
import { baseMetadata } from '@/lib/seo'

export const revalidate = 3600
export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return baseMetadata(locale)
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const { isEnabled: draft } = await draftMode()

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${themix.variable} ${inter.variable} ${fahkwang.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-[60] rounded-full bg-green px-5 py-3 font-semibold text-charcoal focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {t.nav.skip}
        </a>
        {draft && <PreviewBar label={t.common.draftBanner} exitLabel={t.common.exitPreview} path={`/${locale}`} />}
        <AlternatesProvider>
          <SiteHeader locale={locale} />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter locale={locale} />
        </AlternatesProvider>
        <JsonLd data={organizationLd(locale)} />
      </body>
    </html>
  )
}
