import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getFooter, getHeader } from '@/lib/queries'
import { MbaLogo } from '../brand/MbaLogo'
import { Hairlines } from '../motifs/Hairlines'
import { Tri } from '../motifs/Tri'
import { MailIcon, PhoneIcon, PinIcon, SocialIcon } from '../ui/icons'
import { navLinks } from './nav'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const [footer, header] = await Promise.all([getFooter(locale), getHeader(locale)])
  const links = navLinks(locale, t, header.navItems)
  const year = new Date().getFullYear()

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-navy text-white/80">
      <Hairlines preset="footer" className="opacity-40" />
      <div className="container-mba relative grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <MbaLogo variant="onDark" className="h-12 w-auto" />
          <p className="mt-6 max-w-sm text-white/70">{footer.blurb || t.meta.description}</p>
          <p className="mt-6 font-[family-name:var(--font-head)] text-xl text-white">
            {t.meta.tagline} <span className="text-gold">— {t.meta.subline}</span>
          </p>
        </div>
        <nav aria-label={t.footer.explore} className="md:col-span-3">
          <h2 className="text-sm font-semibold !text-white">{t.footer.explore}</h2>
          <ul className="mt-5 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-2 transition-colors hover:text-green">
                  <Tri className="size-[0.5em]" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold !text-white">{t.footer.reach}</h2>
          <ul className="mt-5 space-y-4">
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 size-5 text-green" />
              <a href={`tel:${footer.phone.replace(/\s/g, '')}`} dir="ltr" className="hover:text-green">
                {footer.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MailIcon className="mt-0.5 size-5 text-green" />
              <a href={`mailto:${footer.email}`} dir="ltr" className="break-all hover:text-green">
                {footer.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <PinIcon className="mt-0.5 size-5 text-green" />
              <span className="whitespace-pre-line">{footer.address}</span>
            </li>
          </ul>
          {footer.socials.length > 0 && (
            <div className="mt-8">
              <h2 className="sr-only">{t.footer.follow}</h2>
              <ul className="flex gap-3">
                {footer.socials.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex size-10 items-center justify-center rounded-full ring-1 ring-white/20 transition hover:bg-green hover:text-navy hover:ring-green">
                      <SocialIcon name={s.platform} />
                      <span className="sr-only">{s.platform}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-mba flex flex-col gap-3 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} MZAB Business Alliance. {footer.legalNote || t.footer.rights}
          </p>
          <Link href={href(locale, 'legal')} className="hover:text-green">
            {t.nav.legal}
          </Link>
        </div>
      </div>
    </footer>
  )
}
