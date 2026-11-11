/**
 * Default bilingual content. Used (1) as the fallback when a Payload global is still empty and
 * (2) by the seed script. Copy supplied by the alliance (FR + AR); lines marked DRAFT were written
 * to fill gaps in that copy and still need the responsibles' approval.
 */
import type { Locale } from '@/i18n/config'

export type ActivityKey = 'awareness' | 'trips' | 'export' | 'establishment' | 'fairs'
export type ValueKey = 'trust' | 'cooperation' | 'excellence'

export interface HomeContent {
  hero: { eyebrow: string; title: string; subtitle: string; primaryLabel: string; secondaryLabel: string }
  /** Paragraphs separated by a blank line. */
  who: { title: string; body: string }
  mission: { title: string; body: string }
  vision: { title: string; body: string }
  activities: { title: string; items: { key: ActivityKey; title: string }[] }
  cta: { title: string; body: string; buttonLabel: string }
  sections: { values: boolean; activities: boolean; news: boolean; events: boolean; cta: boolean }
}

export interface ValueItem {
  key: ValueKey
  title: string
  body: string
}

export interface AboutContent {
  intro: { title: string; lead: string }
  team: { name: string; role: string }[]
}

const sections = { values: true, activities: true, news: true, events: true, cta: true }

export const homeDefaults: Record<Locale, HomeContent> = {
  ar: {
    hero: {
      eyebrow: 'MZAB BUSINESS ALLIANCE',
      title: 'تحالف اقتصادي جزائري نحو آفاق إفريقية',
      // DRAFT
      subtitle: 'شركات جزائرية في الصناعة والتجارة والخدمات، تتّحد لتفتح لنفسها أسواق إفريقيا بقوة جماعية.',
      primaryLabel: 'انضم إلى التحالف',
      secondaryLabel: 'تعرّف على التحالف',
    },
    who: {
      title: 'من نحن؟',
      body: [
        'MZAB BUSINESS ALLIANCE هو تحالف اقتصادي يجمع شركات جزائرية تنشط في قطاعات متنوعة، تشمل الصناعة والتجارة والخدمات، ضمن إطار مؤسسي موحّد يهدف إلى تعزيز التعاون بين أعضائه، وتوحيد قدراتهم، وفتح آفاق جديدة للتوسع في الأسواق الإفريقية.',
        'يقوم التحالف على رؤية مشتركة تجعل من التكامل الاقتصادي، والثقة المتبادلة، والنزاهة في التعاملات ركائز أساسية لبناء شراكات مستدامة وتطوير علاقات تجارية قائمة على المصداقية والمصالح المشتركة.',
        'ومن خلال قوته الجماعية وتنوّع خبرات أعضائه، يسعى MZAB BUSINESS ALLIANCE إلى تمثيل المصالح الاقتصادية لشركاته، وتسهيل وصولها إلى الفرص الاستثمارية والتجارية، وتعزيز حضور المؤسسات الجزائرية في الأسواق الإقليمية والدولية، بما يرسّخ مكانة الجزائر كشريك اقتصادي موثوق في إفريقيا.',
      ].join('\n\n'),
    },
    mission: {
      title: 'رسالتنا',
      body: 'توحيد الشركات الجزائرية ذات القيم المشتركة في تحالفٍ اقتصادي منظّم، يفتح لها أسواق غرب إفريقيا بقوةٍ جماعية، ويحمي مصالحها كتكتل اقتصادي فاعل داخل الجزائر وخارجها.',
    },
    vision: {
      title: 'رؤيتنا',
      body: 'أن نصبح المرجعَ الأول للثقة والشراكة الاقتصادية بين شمال إفريقيا وغربها، وأن يصير اسمنا مرادفاً للأمانة والجدارة في كل صفقةٍ نوقّعها.',
    },
    activities: {
      title: 'الأنشطة',
      items: [
        { key: 'awareness', title: 'التوعية والتحسيس' },
        { key: 'trips', title: 'تنظيم رحلات الأعمال' },
        { key: 'export', title: 'المساعدة في عمليات التصدير' },
        { key: 'establishment', title: 'المرافقة في تأسيس وتطوير النشاط الاقتصادي في إفريقيا' },
        // DRAFT: missing from the Arabic copy, translated from the French.
        { key: 'fairs', title: 'تنظيم المعارض والصالونات في إفريقيا' },
      ],
    },
    cta: {
      title: 'انضم إلى التحالف',
      // DRAFT
      body: 'شركتك جزائرية وتطمح إلى التوسع في إفريقيا؟ اترك لنا بياناتك وسنتواصل معك.',
      buttonLabel: 'إرسال الطلب',
    },
    sections,
  },
  fr: {
    hero: {
      eyebrow: 'MZAB BUSINESS ALLIANCE',
      title: 'Une alliance économique algérienne tournée vers l’Afrique',
      // DRAFT
      subtitle: 'Des entreprises algériennes de l’industrie, du commerce et des services, unies pour s’ouvrir ensemble aux marchés africains.',
      primaryLabel: 'Rejoindre l’alliance',
      secondaryLabel: 'Découvrir l’alliance',
    },
    who: {
      title: 'Qui sommes-nous ?',
      body: [
        'MZAB BUSINESS ALLIANCE est une alliance économique réunissant des entreprises algériennes opérant dans divers secteurs, notamment l’industrie, le commerce et les services, au sein d’un cadre institutionnel commun visant à renforcer la coopération entre ses membres, à mutualiser leurs capacités et à ouvrir de nouvelles perspectives de développement sur les marchés africains.',
        'L’Alliance repose sur une vision partagée qui place la complémentarité économique, la confiance mutuelle et l’intégrité dans les relations d’affaires au cœur de la construction de partenariats durables et du développement de relations commerciales fondées sur la crédibilité et les intérêts communs.',
        'Forte de sa dynamique collective et de la diversité des expertises de ses membres, MZAB BUSINESS ALLIANCE ambitionne de représenter et de défendre les intérêts économiques de ses entreprises membres, de faciliter leur accès aux opportunités d’investissement et d’affaires, et de renforcer la présence des entreprises algériennes sur les marchés régionaux et internationaux, contribuant ainsi à consolider la position de l’Algérie en tant que partenaire économique fiable en Afrique.',
      ].join('\n\n'),
    },
    mission: {
      title: 'Notre mission',
      body: 'Fédérer des entreprises algériennes partageant des valeurs communes au sein d’une alliance économique structurée, afin de leur ouvrir les marchés d’Afrique de l’Ouest grâce à une force collective et de défendre leurs intérêts en tant que groupement économique influent, en Algérie comme à l’international.',
    },
    vision: {
      title: 'Notre vision',
      body: 'Devenir la référence incontournable en matière de confiance et de partenariat économique entre l’Afrique du Nord et l’Afrique de l’Ouest, et faire de notre nom un symbole d’intégrité et de fiabilité dans chaque accord que nous concluons.',
    },
    activities: {
      title: 'Nos activités',
      items: [
        { key: 'awareness', title: 'Sensibilisation' },
        { key: 'trips', title: 'Organisation de voyages d’affaires' },
        { key: 'export', title: 'Assistance dans les opérations d’export' },
        { key: 'establishment', title: 'Accompagnement dans l’implantation en Afrique' },
        { key: 'fairs', title: 'Organisation de foires et salons en Afrique' },
      ],
    },
    cta: {
      title: 'Rejoindre l’alliance',
      // DRAFT
      body: 'Vous êtes une entreprise algérienne et souhaitez vous développer en Afrique ? Laissez-nous vos coordonnées, nous vous recontacterons.',
      buttonLabel: 'Envoyer la demande',
    },
    sections,
  },
}

// Value names from the supplied copy; the one-line descriptions are DRAFT.
export const valuesDefaults: Record<Locale, ValueItem[]> = {
  ar: [
    { key: 'trust', title: 'الثقة', body: 'كلمةٌ تُحترم والتزاماتٌ تُوفى: أساس كل علاقة تجارية نبنيها.' },
    { key: 'cooperation', title: 'التعاون', body: 'نوحّد قدراتنا وشبكاتنا لنمضي معاً إلى أبعد مما تبلغه كل مؤسسة بمفردها.' },
    { key: 'excellence', title: 'التميز', body: 'التزامٌ بالجودة والموثوقية في كل صفقة نوقّعها.' },
  ],
  fr: [
    { key: 'trust', title: 'Confiance', body: 'Une parole tenue et des engagements respectés : la base de chaque relation d’affaires que nous construisons.' },
    { key: 'cooperation', title: 'Coopération', body: 'Mutualiser nos capacités et nos réseaux pour aller plus loin ensemble que chacun seul.' },
    { key: 'excellence', title: 'Excellence', body: 'Une exigence de qualité et de fiabilité dans chaque accord que nous concluons.' },
  ],
}

export const aboutDefaults: Record<Locale, AboutContent> = {
  ar: {
    intro: { title: 'من نحن', lead: 'تحالف اقتصادي جزائري نحو آفاق إفريقية.' },
    team: [],
  },
  fr: {
    intro: { title: 'Qui sommes-nous', lead: 'Une alliance économique algérienne tournée vers l’Afrique.' },
    team: [],
  },
}

export const footerDefaults = {
  phone: '+213 558 245 372',
  email: 'contact@mzab-alliance.dz',
  address: { ar: 'غرداية، الجزائر', fr: 'Ghardaïa, Algérie' },
  socials: [] as { platform: string; url: string }[],
}

/** Splits a textarea into paragraphs (blank-line separated). */
export const paragraphs = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
