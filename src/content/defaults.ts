/**
 * Default bilingual content. Used (1) as the fallback when a Payload global is still empty and
 * (2) by the seed script. Arabic copy is taken verbatim from the MBA brand book where it exists.
 */
import type { Locale } from '@/i18n/config'

export type ShapeKey = 'm' | 'a' | 'summit'
export type PillarKey = 'industry' | 'trade' | 'services'
export type ValueKey = 'integrity' | 'trust' | 'prudence' | 'solidarity'

export interface HomeContent {
  hero: { eyebrow: string; title: string; subtitle: string; primaryLabel: string; secondaryLabel: string }
  who: { title: string; body: string; highlight: string }
  pillars: { key: PillarKey; title: string; body: string }[]
  iconMeaning: { items: { shape: ShapeKey; keyword: string; body: string }[]; closing: string }
  cta: { title: string; body: string; buttonLabel: string }
  stats: { value: number; prefix?: string; suffix?: string; label: string }[]
  sections: { stats: boolean; pillars: boolean; values: boolean; iconMeaning: boolean; news: boolean; events: boolean; cta: boolean }
}

export interface ValueItem {
  key: ValueKey
  title: string
  /** Word split around the ▲ glyph: before + ▲ + after (Arabic uses tatweel ـ). */
  before: string
  after: string
  motto: string
  body: string
}

export interface AboutContent {
  intro: { title: string; lead: string }
  story: { title: string; body: string }
  heritage: { title: string; body: string }
  vision: { title: string; body: string; points: string[] }
  model: { title: string; body: string; points: string[] }
  logo: { title: string; body: string }
  timeline: { year: string; title: string; body: string }[]
  team: { name: string; role: string }[]
}

const sections = { stats: true, pillars: true, values: true, iconMeaning: true, news: true, events: true, cta: true }

export const homeDefaults: Record<Locale, HomeContent> = {
  ar: {
    hero: {
      eyebrow: 'MZAB BUSINESS ALLIANCE',
      title: 'تحالف الثقة',
      subtitle: 'أسواق بلا حدود',
      primaryLabel: 'تعرّف على التحالف',
      secondaryLabel: 'آخر الأخبار',
    },
    who: {
      title: 'علامةٌ مظلّة، ولوبي اقتصادي',
      highlight: 'رأس مالها الأول ليس رؤوس الأموال، بل الثقة',
      body: 'MZAB BUSINESS ALLIANCE علامةٌ مظلّة تجمع شركاتٍ جزائرية متنوّعة — صناعة، وتجارة، وخدمات — تحت راية واحدة، لتدخل أسواق مجموعة CEDEAO بثقل جماعي ونفوذٍ اقتصادي منظّم. رأس مالها الأول ليس رؤوس الأموال، بل الثقة التي بناها الميزابيون في التجارة على مدى قرون.',
    },
    pillars: [
      { key: 'industry', title: 'الصناعة', body: 'مصانع ووحدات إنتاج جزائرية تبحث عن أسواق أوسع لمنتجاتها، بمعايير جودة ثابتة وقدرة على التوريد المنتظم.' },
      { key: 'trade', title: 'التجارة', body: 'شبكات توزيع واستيراد وتصدير تحمل إرث القوافل الميزابية، وتفتح الطريق نحو غرب إفريقيا.' },
      { key: 'services', title: 'الخدمات', body: 'نقل، لوجستيك، استشارة، وتمويل — خدمات ترافق المؤسسات في كل مرحلة من مراحل دخولها إلى الأسواق.' },
    ],
    iconMeaning: {
      items: [
        { shape: 'm', keyword: 'MZAB', body: 'تعكس الأيقونة فكرة الاتحاد والتكامل التي تقوم عليها MZAB BUSINESS ALLIANCE، من خلال تكوين بصري مستوحى من حرف “M” في كلمة MZAB.' },
        { shape: 'a', keyword: 'ALLIANCE', body: 'يظهر حرف “A” داخل التصميم بشكل مميز، ليعزز حضور كلمة ALLIANCE ويربط الرمز مباشرة باسم التحالف وهويته.' },
        { shape: 'summit', keyword: 'القمة (SUMMIT)', body: 'الشكل الصاعد للأيقونة، فيوحي بـ القمة (SUMMIT)، في إشارة إلى الطموح، المكانة، والتقاء رجال الأعمال وصناع القرار حول أهداف وفرص مشتركة.' },
      ],
      closing: 'الهوية، التحالف، والطموح نحو القمة.',
    },
    cta: {
      title: 'حين تتقاطع مصالح المؤسسات، يصبح العمل المشترك أكثر تأثيراً',
      body: 'لأن بعض التحديات لا تواجهها مؤسسة بمفردها، وبعض الفرص تصبح أكبر عندما نبني بشكل جماعي.',
      buttonLabel: 'انضم إلى التحالف',
    },
    stats: [
      { value: 15, label: 'دولة في مجموعة CEDEAO' },
      { value: 400, prefix: '+', suffix: ' M', label: 'مستهلك في غرب إفريقيا' },
      { value: 3, label: 'قطاعات: صناعة، تجارة، خدمات' },
      { value: 1000, prefix: '+', label: 'عام من تقاليد التجارة الميزابية' },
    ],
    sections,
  },
  fr: {
    hero: {
      eyebrow: 'MZAB BUSINESS ALLIANCE',
      title: 'L’alliance de la confiance',
      subtitle: 'Des marchés sans frontières',
      primaryLabel: 'Découvrir l’alliance',
      secondaryLabel: 'Dernières actualités',
    },
    who: {
      title: 'Une marque ombrelle, un lobby économique',
      highlight: 'son premier capital n’est pas l’argent, mais la confiance',
      body: 'MZAB BUSINESS ALLIANCE est une marque ombrelle qui réunit des entreprises algériennes diverses — industrie, commerce et services — sous une même bannière, pour entrer sur les marchés de la CEDEAO avec un poids collectif et une influence économique organisée. Son premier capital n’est pas l’argent, mais la confiance que les commerçants mozabites ont bâtie au fil des siècles.',
    },
    pillars: [
      { key: 'industry', title: 'Industrie', body: 'Des unités de production algériennes qui cherchent des débouchés plus larges, avec une qualité constante et une capacité d’approvisionnement régulière.' },
      { key: 'trade', title: 'Commerce', body: 'Des réseaux de distribution, d’import et d’export héritiers des caravanes mozabites, tournés vers l’Afrique de l’Ouest.' },
      { key: 'services', title: 'Services', body: 'Transport, logistique, conseil et financement : des services qui accompagnent les entreprises à chaque étape de leur entrée sur les marchés.' },
    ],
    iconMeaning: {
      items: [
        { shape: 'm', keyword: 'MZAB', body: 'Le symbole exprime l’union et la complémentarité qui fondent MZAB BUSINESS ALLIANCE, à travers une composition inspirée de la lettre « M » du mot MZAB.' },
        { shape: 'a', keyword: 'ALLIANCE', body: 'La lettre « A » se distingue au cœur du dessin : elle affirme le mot ALLIANCE et relie directement le symbole au nom de l’alliance et à son identité.' },
        { shape: 'summit', keyword: 'Le sommet (SUMMIT)', body: 'La forme ascendante évoque le sommet : l’ambition, le rang, et la rencontre des chefs d’entreprise et des décideurs autour d’objectifs et d’opportunités partagés.' },
      ],
      closing: 'L’identité, l’alliance et l’ambition du sommet.',
    },
    cta: {
      title: 'Quand les intérêts des entreprises se rejoignent, l’action commune gagne en influence',
      body: 'Certains défis ne se relèvent pas seul, et certaines opportunités grandissent lorsque l’on bâtit ensemble.',
      buttonLabel: 'Rejoindre l’alliance',
    },
    stats: [
      { value: 15, label: 'pays de la CEDEAO' },
      { value: 400, prefix: '+', suffix: ' M', label: 'consommateurs en Afrique de l’Ouest' },
      { value: 3, label: 'secteurs : industrie, commerce, services' },
      { value: 1000, prefix: '+', label: 'ans de tradition commerciale mozabite' },
    ],
    sections,
  },
}

export const valuesDefaults: Record<Locale, ValueItem[]> = {
  ar: [
    { key: 'integrity', title: 'الاستقامة', before: 'الاستـ', after: 'ـقامة', motto: 'نزاهةٌ في المعاملة واعتدالٌ في الربح — إرثُ الإباضية في التجارة.', body: 'لم يكن التاجر الميزابي يقيس نجاحه بحجم ربحه، بل بسلامة معاملته. نحمل هذا الإرث إلى كل صفقة: شفافية في الأسعار، وضوح في الشروط، وربح معتدل يحفظ العلاقة قبل أن يحفظ الهامش.' },
    { key: 'trust', title: 'الأمانة', before: 'الأمـ', after: 'ـانة', motto: 'الكلمة عقد، والوفاء بها هو رأس مالنا الأول.', body: 'في أسواق غرداية القديمة كانت الكلمة تكفي لإتمام صفقة. نؤمن أن هذه الثقة هي ما يميّز المؤسسات المنضوية تحت رايتنا: التزام بالمواعيد، احترام للعقود، ووفاء للشركاء.' },
    { key: 'prudence', title: 'الحصافة', before: 'الحصـ', after: 'ـافة', motto: 'حكمةٌ في المال، وصبرٌ في البناء، ورؤيةٌ بعيدة المدى.', body: 'لا نبحث عن الفرص السريعة، بل عن الأسس المتينة. ندرس الأسواق بعناية، ونبني الشراكات خطوة بخطوة، ونخطط لأجيال لا لمواسم.' },
    { key: 'solidarity', title: 'التضامن', before: 'التضـ', after: 'ـامن', motto: 'قوة الجماعة تحمي الفرد؛ ننهض معاً أو لا ننهض.', body: 'حين تدخل مؤسسة جزائرية سوقاً جديدة، فهي لا تدخلها وحدها. يتقاسم أعضاء التحالف المعلومة والشبكة والمخاطرة، لأن نجاح كل عضو هو نجاح للجميع.' },
  ],
  fr: [
    { key: 'integrity', title: 'Intégrité', before: 'Inté', after: 'grité', motto: 'Droiture dans les échanges et modération dans le profit — l’héritage ibadite du commerce.', body: 'Le marchand mozabite ne mesurait pas sa réussite à l’ampleur de son gain, mais à la droiture de ses échanges. Nous portons cet héritage dans chaque transaction : des prix transparents, des conditions claires et un profit mesuré qui préserve la relation avant la marge.' },
    { key: 'trust', title: 'Loyauté', before: 'Loy', after: 'auté', motto: 'La parole donnée est un contrat ; la tenir est notre premier capital.', body: 'Dans les anciens marchés de Ghardaïa, la parole suffisait à conclure une affaire. Cette confiance distingue les entreprises réunies sous notre bannière : respect des délais, respect des contrats, fidélité aux partenaires.' },
    { key: 'prudence', title: 'Prudence', before: 'Pru', after: 'dence', motto: 'Sagesse dans la gestion, patience dans la construction, vision à long terme.', body: 'Nous ne cherchons pas les gains rapides, mais des fondations solides. Nous étudions les marchés avec soin, construisons les partenariats pas à pas et planifions pour des générations, non pour des saisons.' },
    { key: 'solidarity', title: 'Solidarité', before: 'Soli', after: 'darité', motto: 'La force du groupe protège l’individu ; nous nous élevons ensemble, ou pas du tout.', body: 'Lorsqu’une entreprise algérienne aborde un nouveau marché, elle ne le fait pas seule. Les membres de l’alliance partagent l’information, le réseau et le risque, car la réussite de chacun est celle de tous.' },
  ],
}

export const aboutDefaults: Record<Locale, AboutContent> = {
  ar: {
    intro: { title: 'من نحن', lead: 'فضاء اقتصادي جزائري يجمع المؤسسات حول المصالح والتحديات المشتركة، ويعمل على تعزيز التعاون، تبادل الخبرات، وبناء صوت اقتصادي أكثر حضورًا وتأثيرًا.' },
    story: { title: 'قصتنا ورسالتنا', body: 'وُلد تحالف أعمال ميزاب من قناعة بسيطة: أن المؤسسات الجزائرية، مهما بلغت قوتها منفردة، تكون أقوى حين تتحدث بصوت واحد. رسالتنا أن نمنح الشركات الجزائرية — صغيرةً كانت أم كبيرة — مظلّةً مؤسساتية تفتح لها الأبواب، وتختصر عليها الطريق، وتمثّلها لدى الشركاء والمؤسسات في الداخل والخارج.' },
    heritage: { title: 'إرث التجارة الميزابية', body: 'منذ قرون، عبرت قوافل تجّار وادي ميزاب الصحراء نحو أسواق الساحل وغرب إفريقيا، حاملةً بضاعتها وسمعتها معاً. لم تكن العقود المكتوبة هي الضامن، بل الكلمة والاستقامة وشبكة الثقة بين العائلات والمدن. هذا الإرث هو رأس مالنا الأول، ونحن نعيد بناءه بلغة المؤسسات الحديثة.' },
    vision: { title: 'رؤيتنا نحو CEDEAO', body: 'تضم المجموعة الاقتصادية لدول غرب إفريقيا (CEDEAO) أكثر من 400 مليون مستهلك وخمس عشرة دولة. نعمل لتكون المؤسسة الجزائرية حاضرة في هذه الأسواق بثقل جماعي منظّم:', points: ['بعثات اقتصادية ولقاءات أعمال مشتركة', 'تمثيل موحّد لدى المؤسسات والهيئات', 'تقاسم المعلومة والدراسات والشبكات', 'مرافقة لوجستية وقانونية وتمويلية'] },
    model: { title: 'نموذج العلامة المظلّة', body: 'لا يذيب التحالف هوية أعضائه، بل يمنحهم راية مشتركة. تحتفظ كل مؤسسة باسمها واستقلاليتها، وتستفيد في الوقت نفسه من قوة العلامة الجماعية:', points: ['شبكة شركات', 'صوت اقتصادي', 'فرص شراكة'] },
    logo: { title: 'قصة الشعار', body: 'يجمع الشعار ثلاثة أشكال صاعدة: الأول يستحضر حرف “M” في كلمة MZAB، والثاني يرسم حرف “A” في كلمة ALLIANCE، والمثلث الصغير يوحي بالقمة. بهذا يجمع الشعار بين ثلاث أفكار أساسية: الهوية، التحالف، والطموح نحو القمة.' },
    timeline: [
      { year: 'القرن 11', title: 'قوافل وادي ميزاب', body: 'تجّار ميزاب يربطون الشمال بأسواق الساحل الإفريقي.' },
      { year: '2025', title: 'ميلاد الفكرة', body: 'مؤسسات جزائرية تتفق على بناء مظلّة مشتركة.' },
      { year: '2026', title: 'اللقاء الرسمي الأول', body: 'إطلاق التحالف وهويته البصرية: قيمٌ راسخة، أسواقٌ بلا حدود.' },
      { year: 'غداً', title: 'نحو CEDEAO', body: 'بعثات اقتصادية وشراكات في أسواق غرب إفريقيا.' },
    ],
    team: [],
  },
  fr: {
    intro: { title: 'À propos', lead: 'Un espace économique algérien qui réunit les entreprises autour d’intérêts et de défis communs, pour renforcer la coopération, partager l’expérience et faire entendre une voix économique plus présente et plus influente.' },
    story: { title: 'Notre histoire, notre mission', body: 'MZAB Business Alliance est née d’une conviction simple : les entreprises algériennes, aussi solides soient-elles seules, sont plus fortes lorsqu’elles parlent d’une même voix. Notre mission est d’offrir aux entreprises algériennes — petites ou grandes — une ombrelle institutionnelle qui ouvre les portes, raccourcit les chemins et les représente auprès des partenaires et des institutions, en Algérie comme à l’étranger.' },
    heritage: { title: 'L’héritage du commerce mozabite', body: 'Depuis des siècles, les caravanes des marchands de la vallée du M’zab traversent le Sahara vers les marchés du Sahel et de l’Afrique de l’Ouest, portant à la fois leurs marchandises et leur réputation. Le garant n’était pas le contrat écrit, mais la parole, la droiture et le réseau de confiance entre familles et cités. Cet héritage est notre premier capital ; nous le reconstruisons dans le langage des institutions modernes.' },
    vision: { title: 'Notre vision : la CEDEAO', body: 'La Communauté économique des États de l’Afrique de l’Ouest (CEDEAO) réunit quinze pays et plus de 400 millions de consommateurs. Nous voulons que l’entreprise algérienne y soit présente avec un poids collectif organisé :', points: ['Missions économiques et rencontres d’affaires communes', 'Une représentation unifiée auprès des institutions', 'Le partage de l’information, des études et des réseaux', 'Un accompagnement logistique, juridique et financier'] },
    model: { title: 'Le modèle de la marque ombrelle', body: 'L’alliance ne dissout pas l’identité de ses membres : elle leur offre une bannière commune. Chaque entreprise garde son nom et son indépendance, tout en profitant de la force de la marque collective :', points: ['Un réseau d’entreprises', 'Une voix économique', 'Des opportunités de partenariat'] },
    logo: { title: 'L’histoire du logo', body: 'Le logo assemble trois formes ascendantes : la première évoque le « M » de MZAB, la deuxième dessine le « A » d’ALLIANCE, et le petit triangle suggère le sommet. Le symbole réunit ainsi trois idées essentielles : l’identité, l’alliance et l’ambition du sommet.' },
    timeline: [
      { year: 'XIᵉ siècle', title: 'Les caravanes du M’zab', body: 'Les marchands mozabites relient le Nord aux marchés du Sahel.' },
      { year: '2025', title: 'Naissance de l’idée', body: 'Des entreprises algériennes s’accordent pour bâtir une ombrelle commune.' },
      { year: '2026', title: 'La première rencontre officielle', body: 'Lancement de l’alliance et de son identité : des valeurs ancrées, des marchés sans frontières.' },
      { year: 'Demain', title: 'Cap sur la CEDEAO', body: 'Missions économiques et partenariats en Afrique de l’Ouest.' },
    ],
    team: [],
  },
}

export const footerDefaults = {
  phone: '+213 558 245 372',
  email: 'contact@mzab-alliance.dz',
  address: { ar: 'غرداية، الجزائر', fr: 'Ghardaïa, Algérie' },
  socials: [] as { platform: string; url: string }[],
}
