import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { href } from '@/i18n/routes'
import { getHeader } from '@/lib/queries'
import { MbaLogo } from '../brand/MbaLogo'
import { ButtonLink } from '../ui/Button'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'
import { navLinks, resolveLink } from './nav'
import { HeaderShell } from './HeaderShell'

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const header = await getHeader(locale)
  const links = navLinks(locale, t, header.navItems)
  const cta = header.cta?.label ? resolveLink(locale, header.cta) : { label: t.cta.joinShort, href: `${href(locale, 'home')}#adhesion` }

  const switcher = <LocaleSwitcher locale={locale} label={t.nav.switchTo} ariaLabel={t.nav.switchToLabel} />

  return (
    <HeaderShell>
      <div className="container-mba flex h-[68px] items-center justify-between gap-6 lg:h-[80px]">
        <Link href={href(locale, 'home')} className="shrink-0 rounded-md" aria-label={t.meta.brand}>
          <MbaLogo className="h-8 w-auto lg:h-10" title={t.meta.brand} />
        </Link>
        <nav aria-label={t.nav.primary} className="hidden lg:block">
          <NavLinks links={links} className="flex items-center gap-7" />
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {switcher}
          <ButtonLink href={cta.href} className="!px-5 !py-2.5">
            {cta.label}
          </ButtonLink>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {switcher}
          <MobileNav links={links} labels={{ menu: t.nav.menu, close: t.nav.close }}>
            <ButtonLink href={cta.href} className="w-full">
              {cta.label}
            </ButtonLink>
          </MobileNav>
        </div>
      </div>
    </HeaderShell>
  )
}
