import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getPageBySlug } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { Blocks } from '@/components/sections/Blocks'

type Props = { params: Promise<{ locale: string; slug: string[] }> }

export const dynamicParams = true
export const generateStaticParams = () => []

/** Block-built pages from the Payload "pages" collection, at /{locale}/{slug}. Anything else is a 404. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale) || slug.length !== 1) return {}
  const page = await getPageBySlug(locale, decodeURIComponent(slug[0]))
  if (!page) return {}
  return pageMetadata({ locale, paths: { [locale]: `/${locale}/${page.slug}` }, title: page.seo?.title || page.title, description: page.seo?.description, image: page.seo?.image })
}

export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale) || slug.length !== 1) notFound()
  const page = await getPageBySlug(locale, decodeURIComponent(slug[0]))
  if (!page) notFound()
  return <Blocks blocks={page.layout} locale={locale} />
}
