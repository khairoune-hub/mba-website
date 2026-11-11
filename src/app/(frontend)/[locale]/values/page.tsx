import { notFound, permanentRedirect } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { href } from '@/i18n/routes'

type Props = { params: Promise<{ locale: string }> }

/** Values now live on the About page; keep old links working. */
export default async function ValuesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  permanentRedirect(`${href(locale, 'about')}#values`)
}
