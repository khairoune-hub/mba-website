import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { isLocale } from '@/i18n/config'
import { valuesDefaults } from '@/content/defaults'
import { MbaLogo } from '@/components/brand/MbaLogo'
import { MbaMark, type MarkVariant } from '@/components/brand/MbaMark'
import { GlassIcon } from '@/components/brand/GlassIcon'
import { Hairlines } from '@/components/motifs/Hairlines'
import { SlantCorner } from '@/components/motifs/SlantCorner'
import { SlantMask } from '@/components/motifs/SlantMask'
import { PatternField } from '@/components/motifs/PatternField'
import { Highlight } from '@/components/motifs/Highlight'
import { Tri, TriCluster, TriList } from '@/components/motifs/Tri'
import { ValueWord } from '@/components/motifs/ValueWord'
import { Button, ButtonLink, LinkArrow } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArrowIcon, CalendarIcon, ClockIcon, GlobeIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/ui/icons'

export const metadata = { title: 'Styleguide', robots: { index: false, follow: false } }

const colors = [
  ['charcoal', '#424243', 'Primary · text, dark surfaces', 'text-white'],
  ['green', '#90BE41', 'Primary · accent, CTAs (charcoal text on it)', 'text-charcoal'],
  ['gold', '#BEAD41', 'Accent · underlines, key words (decorative on light)', 'text-navy'],
  ['navy', '#0F172A', 'Accent · dark sections, footer', 'text-white'],
  ['mist', '#F3F4F2', 'Soft section background', 'text-charcoal'],
  ['paper', '#FFFFFF', 'Base', 'text-charcoal'],
  ['green-ink', '#4E7A1F', 'Derived · green text on white (5.1:1)', 'text-white'],
  ['gold-ink', '#7F7318', 'Derived · gold text on white (4.8:1)', 'text-white'],
] as const

const backgrounds: { bg: string; variant: MarkVariant; label: string }[] = [
  { bg: 'bg-white ring-1 ring-border', variant: 'color', label: 'White' },
  { bg: 'bg-green', variant: 'onGreen', label: 'Green' },
  { bg: 'bg-navy', variant: 'onDark', label: 'Navy' },
  { bg: 'bg-black', variant: 'onDark', label: 'Black' },
]

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-14">
      <h2 className="t-h3 mb-8">{title}</h2>
      {children}
    </section>
  )
}

export default async function Styleguide({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (process.env.NODE_ENV === 'production' || !isLocale(locale)) notFound()
  const values = valuesDefaults[locale]

  return (
    <div className="container-mba py-16">
      <SectionHeader as="h1" eyebrow="MBA design system" title="Styleguide" lead={`Locale: ${locale} · dir: ${locale === 'ar' ? 'rtl' : 'ltr'}. Dev only.`} />

      <Block title="Colours">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map(([name, hex, use, text]) => (
            <li key={name} className="overflow-hidden rounded-[var(--radius-card)] ring-1 ring-border">
              <div className={`flex h-28 items-end p-4 font-semibold ${text}`} style={{ background: hex }}>
                <span dir="ltr">{hex}</span>
              </div>
              <div className="p-4 text-sm">
                <p className="font-semibold" dir="ltr">--color-{name}</p>
                <p className="mt-1 text-muted">{use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Typography">
        <div className="space-y-6">
          <p className="t-display">{locale === 'ar' ? 'تحالف الثقة' : 'L’alliance de la confiance'}</p>
          <p className="t-h1">{locale === 'ar' ? 'عنوان رئيسي — Heading 1' : 'Titre principal — Heading 1'}</p>
          <p className="t-h2">{locale === 'ar' ? 'عنوان قسم — Heading 2' : 'Titre de section — Heading 2'}</p>
          <p className="t-h3">{locale === 'ar' ? 'عنوان فرعي — Heading 3' : 'Sous-titre — Heading 3'}</p>
          <p className="t-lead max-w-2xl">{locale === 'ar' ? 'نص تمهيدي: علامةٌ مظلّة تجمع شركاتٍ جزائرية متنوّعة تحت راية واحدة.' : 'Texte d’introduction : une marque ombrelle qui réunit des entreprises algériennes sous une même bannière.'}</p>
          <p className="max-w-2xl">{locale === 'ar' ? 'نص أساسي بخط TheMixArab بارتفاع سطر 1.8. Latin inside Arabic falls back to Inter: CEDEAO, MZAB BUSINESS ALLIANCE.' : 'Corps de texte en Inter, interlignage 1,6. Les titres latins utilisent Fahkwang.'}</p>
          <p className="t-eyebrow">Eyebrow · {locale === 'ar' ? 'عنوان صغير' : 'Surtitre'}</p>
        </div>
      </Block>

      <Block title="Logo — approved backgrounds">
        <ul className="grid gap-4 sm:grid-cols-2">
          {backgrounds.map((b) => (
            <li key={b.label} className={`flex flex-col gap-3 rounded-[var(--radius-card)] p-8 ${b.bg}`}>
              <MbaLogo variant={b.variant} className="h-16 w-auto self-start" />
              <span className={`text-xs ${b.variant === 'onDark' ? 'text-white/70' : 'text-charcoal/70'}`}>{b.label} · variant “{b.variant}”</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-end gap-8">
          <MbaLogo layout="stacked" className="h-40 w-auto" />
          {(['color', 'mono'] as const).map((v) => (
            <MbaMark key={v} variant={v} className="h-16 w-auto" />
          ))}
          <GlassIcon className="w-56" />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted">Clear space: at least the width of the small triangle on every side. The logotype never mirrors in RTL.</p>
      </Block>

      <Block title="Motifs">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-radial-field relative h-64 overflow-hidden rounded-[var(--radius-card)]">
            <Hairlines preset="hero" />
            <span className="absolute bottom-4 start-4 text-sm font-semibold">Radial field + hairlines</span>
          </div>
          <div className="relative h-64 overflow-hidden rounded-[var(--radius-card)] bg-mist">
            <SlantCorner corner="top-start" className="w-56" />
            <SlantCorner corner="bottom-end" tone="gold" className="w-40" />
            <span className="absolute bottom-4 start-4 text-sm font-semibold">Slanted corners (mirror in RTL)</span>
          </div>
          <SlantMask ratio={16 / 9} className="bg-green-band">
            <div className="flex h-full items-center justify-center text-sm font-semibold">Slant mask</div>
          </SlantMask>
          <div className="relative h-64 overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-border">
            <PatternField />
            <TriCluster className="absolute end-4 top-4 w-16" />
            <span className="absolute bottom-4 start-4 text-sm font-semibold">Pattern field + ▲ cluster</span>
          </div>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-5xl font-bold">
              <ValueWord before={values[1].before} after={values[1].after} title={values[1].title} />
            </p>
            <TriList className="mt-6" items={values.map((v) => v.title)} />
          </div>
          <p className="text-xl leading-loose">
            <Highlight>MZAB</Highlight> · <Highlight variant="underline">{locale === 'ar' ? 'الثقة' : 'confiance'}</Highlight> · <Tri /> <Tri tone="gold" /> <Tri tone="charcoal" />
          </p>
        </div>
      </Block>

      <Block title="Components">
        <div className="flex flex-wrap items-center gap-4">
          <Button arrow>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="navy" arrow>Navy</Button>
          <ButtonLink href="#" variant="ghost">Ghost</ButtonLink>
          <LinkArrow href="#">{locale === 'ar' ? 'رابط مع سهم' : 'Lien fléché'}</LinkArrow>
          <Badge>Soft</Badge>
          <Badge tone="green">Green</Badge>
          <Badge tone="gold">Gold</Badge>
          <Badge tone="dark">Dark</Badge>
        </div>
        <div className="mt-8 flex gap-4 text-green-ink">
          {[ArrowIcon, CalendarIcon, ClockIcon, PinIcon, PhoneIcon, MailIcon, GlobeIcon].map((I, i) => (
            <I key={i} className="size-6" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-8">
              <p className="t-h3">Card {n}</p>
              <p className="mt-2 text-muted">Radius 28px · hover lift + green hairline.</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-[var(--radius-card)] bg-navy p-8">
          <ButtonLink href="#" variant="onDark">On dark</ButtonLink>
        </div>
      </Block>
    </div>
  )
}
