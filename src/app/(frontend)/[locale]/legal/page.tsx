import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n'
import { getPageBySlug } from '@/lib/queries'
import { pageMetadata } from '@/lib/seo'
import { PageHero } from '@/components/sections/PageHero'
import { Blocks } from '@/components/sections/Blocks'

type Props = { params: Promise<{ locale: string }> }

/** Fallback text until a Payload page with slug "legal" is published. */
const fallback: Record<Locale, { h: string; p: string }[]> = {
  ar: [
    { h: 'ناشر الموقع', p: 'يُنشر هذا الموقع من طرف MZAB Business Alliance، غرداية، الجزائر.' },
    { h: 'المعطيات الشخصية', p: 'تُستعمل المعلومات المرسلة عبر نموذج الاتصال حصرياً للرد على طلبكم، ولا تُنقل إلى أي طرف ثالث. يمكنكم طلب الاطلاع على معطياتكم أو تصحيحها أو حذفها عبر صفحة الاتصال، وفقاً للقانون الجزائري رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.' },
    { h: 'ملفات تعريف الارتباط', p: 'لا يستعمل الموقع سوى ملف تعريف ارتباط تقني لحفظ اللغة المختارة.' },
    { h: 'الملكية الفكرية', p: 'الشعار والهوية البصرية والمحتويات ملك لـ MZAB Business Alliance، ولا يجوز استعمالها دون إذن مسبق.' },
  ],
  fr: [
    { h: 'Éditeur du site', p: 'Ce site est édité par MZAB Business Alliance, Ghardaïa, Algérie.' },
    { h: 'Données personnelles', p: 'Les informations transmises via le formulaire de contact servent uniquement à répondre à votre demande et ne sont jamais cédées à des tiers. Conformément à la loi algérienne n° 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vous pouvez demander l’accès, la rectification ou la suppression de vos données via la page Contact.' },
    { h: 'Cookies', p: 'Le site n’utilise qu’un cookie technique pour mémoriser la langue choisie.' },
    { h: 'Propriété intellectuelle', p: 'Le logo, l’identité visuelle et les contenus sont la propriété de MZAB Business Alliance et ne peuvent être utilisés sans autorisation préalable.' },
  ],
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata({ locale, route: 'legal', title: getDictionary(locale).nav.legal })
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const page = await getPageBySlug(locale, 'legal')
  if (page?.layout?.length) return <Blocks blocks={page.layout} locale={locale} />

  return (
    <>
      <PageHero eyebrow={t.meta.brand} title={t.nav.legal} />
      <div className="container-mba max-w-3xl py-14 md:py-20">
        <div className="prose-mba">
          {fallback[locale].map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
