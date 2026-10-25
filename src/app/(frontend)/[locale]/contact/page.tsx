import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { getFooter } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons'
import { TriCluster } from '@/components/motifs/Tri'
import { ContactForm } from './ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return pageMetadata({ locale, route: 'contact', title: t.contact.title, description: t.contact.lead })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const footer = await getFooter(locale)

  return (
    <>
      <PageHero eyebrow={t.nav.contact} title={t.contact.title} lead={t.contact.lead} />
      <section className="section-y !pt-14">
        <div className="container-mba grid gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <ContactForm locale={locale} t={t.contact} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-navy p-8 text-white/85">
              <TriCluster className="absolute end-5 top-5 w-14" />
              <h2 className="text-xl font-semibold !text-white">{t.contact.details}</h2>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-3">
                  <PhoneIcon className="mt-0.5 size-5 text-green" />
                  <a href={`tel:${footer.phone.replace(/\s/g, '')}`} dir="ltr" className="hover:text-green">{footer.phone}</a>
                </li>
                <li className="flex gap-3">
                  <MailIcon className="mt-0.5 size-5 text-green" />
                  <a href={`mailto:${footer.email}`} dir="ltr" className="break-all hover:text-green">{footer.email}</a>
                </li>
                <li className="flex gap-3">
                  <PinIcon className="mt-0.5 size-5 text-green" />
                  <span>
                    <span className="sr-only">{t.contact.address}: </span>
                    <span className="whitespace-pre-line">{footer.address}</span>
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
