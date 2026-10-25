'use client'

// Client component: reading request headers here would turn every page under this layout dynamic.
import { useParams } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { GlassIcon } from '@/components/brand/GlassIcon'
import { Hairlines } from '@/components/motifs/Hairlines'
import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  const params = useParams<{ locale?: string }>()
  const locale: Locale = isLocale(params?.locale) ? params.locale : 'ar'
  const t = getDictionary(locale)
  return (
    <section className="bg-radial-field relative isolate overflow-hidden">
      <Hairlines preset="hero" />
      <div className="container-mba relative grid min-h-[70vh] items-center gap-10 py-20 lg:grid-cols-2">
        <div>
          <p className="font-[family-name:var(--font-inter)] text-7xl font-bold text-green-ink md:text-8xl" aria-hidden="true">
            404
          </p>
          <h1 className="t-h1 mt-4">{t.notFound.title}</h1>
          <p className="t-lead mt-5 max-w-lg">{t.notFound.lead}</p>
          <ButtonLink href={href(locale, 'home')} className="mt-10" arrow>
            {t.cta.backHome}
          </ButtonLink>
        </div>
        <GlassIcon float className="mx-auto w-[min(70vw,420px)]" />
      </div>
    </section>
  )
}
