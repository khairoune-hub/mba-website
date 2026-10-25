/**
 * Seeds an admin user, globals (AR + FR), categories, 3 posts and events with branded sample images.
 * Images go through Payload, so they land in Supabase Storage when S3_* is configured.
 *
 *   pnpm seed                    # skips content that already exists
 *   SEED_RESET=true pnpm seed    # deletes posts/events/categories/media/pages first
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { aboutDefaults, homeDefaults, valuesDefaults, footerDefaults } from '../src/content/defaults'
import { PATH_A, PATH_M, PATH_SUMMIT } from '../src/components/brand/mark-paths'

type Loc = 'ar' | 'fr'
const ctx = { disableRevalidate: true }

/* ---------- Lexical helpers ---------- */
const text = (t: string, format = 0) => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const block = (type: string, dir: 'rtl' | 'ltr', children: unknown[], extra: Record<string, unknown> = {}) => ({ type, format: '', indent: 0, version: 1, direction: dir, children, ...extra })
const p = (dir: 'rtl' | 'ltr', t: string) => block('paragraph', dir, [text(t)], { textFormat: 0 })
const h2 = (dir: 'rtl' | 'ltr', t: string) => block('heading', dir, [text(t)], { tag: 'h2' })
const quote = (dir: 'rtl' | 'ltr', t: string) => block('quote', dir, [text(t)])
const ul = (dir: 'rtl' | 'ltr', items: string[]) =>
  block('list', dir, items.map((it, i) => block('listitem', dir, [text(it)], { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })
const upload = (id: number) => ({ type: 'upload', relationTo: 'media', value: id, fields: null, format: '', version: 3 })
const doc = (dir: 'rtl' | 'ltr', children: unknown[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: dir, children } })

/* ---------- Branded sample images (generated, no stock photos) ---------- */
const mark = (fills: [string, string, string]) =>
  `<path fill="${fills[0]}" d="${PATH_M}"/><path fill="${fills[1]}" d="${PATH_A}"/><path fill="${fills[2]}" d="${PATH_SUMMIT}"/>`

function hairline(w: number, h: number, stroke: string) {
  const dx = (h * 0.55) * Math.tan((24 * Math.PI) / 180)
  return `<path d="M0 ${h * 0.62} H${w * 0.55} a60 60 0 0 0 54 -36 L${w * 0.55 + dx + 54} -10" fill="none" stroke="${stroke}" stroke-width="2"/>
  <path d="M${w} ${h * 0.82} H${w * 0.3} a60 60 0 0 1 -54 36 L${w * 0.3 - 120} ${h + 10}" fill="none" stroke="${stroke}" stroke-width="2"/>`
}

async function makeImage(kind: 'field' | 'green' | 'navy' | 'charcoal' | 'mist', w = 1600, h = 1000, withGlass = false) {
  const bgs: Record<string, string> = {
    field: `<radialGradient id="c" cx="50%" cy="45%" r="70%"><stop offset="35%" stop-color="#fff"/><stop offset="100%" stop-color="#e6e6e5"/></radialGradient>
      <radialGradient id="g1" cx="0%" cy="25%" r="50%"><stop offset="0%" stop-color="#90BE41" stop-opacity=".7"/><stop offset="100%" stop-color="#90BE41" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2" cx="100%" cy="90%" r="50%"><stop offset="0%" stop-color="#90BE41" stop-opacity=".7"/><stop offset="100%" stop-color="#90BE41" stop-opacity="0"/></radialGradient>`,
    green: `<linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="#c9e19c"/><stop offset=".45" stop-color="#90BE41"/><stop offset="1" stop-color="#5e8f2a"/></linearGradient>`,
    navy: `<linearGradient id="c" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#1b2540"/></linearGradient>`,
    charcoal: `<linearGradient id="c" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3a3a3b"/><stop offset="1" stop-color="#4d4d4e"/></linearGradient>`,
    mist: `<linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="#f3f4f2"/><stop offset="1" stop-color="#e3e6df"/></linearGradient>`,
  }
  const fills: Record<string, [string, string, string]> = {
    field: ['#90BE41', '#424243', '#90BE41'],
    green: ['#ffffff', '#424243', '#ffffff'],
    navy: ['#90BE41', '#ffffff', '#90BE41'],
    charcoal: ['#90BE41', '#ffffff', '#90BE41'],
    mist: ['#90BE41', '#424243', '#90BE41'],
  }
  const stroke = kind === 'field' || kind === 'mist' ? 'rgba(144,190,65,.55)' : 'rgba(255,255,255,.45)'
  const s = (h * 0.42) / 534
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${bgs[kind]}</defs>
    <rect width="${w}" height="${h}" fill="url(#c)"/>${kind === 'field' ? '<rect width="100%" height="100%" fill="url(#g1)"/><rect width="100%" height="100%" fill="url(#g2)"/>' : ''}
    ${hairline(w, h, stroke)}
    ${withGlass ? '' : `<g transform="translate(${(w - 794 * s) / 2} ${(h - 534 * s) / 2}) scale(${s})">${mark(fills[kind])}</g>`}</svg>`
  let img = sharp(Buffer.from(svg))
  if (withGlass) {
    const glass = await sharp(path.resolve('public/brand/glass.webp')).resize({ height: Math.round(h * 0.62) }).toBuffer()
    const meta = await sharp(glass).metadata()
    img = sharp(await img.png().toBuffer()).composite([{ input: glass, left: Math.round((w - (meta.width ?? 0)) / 2), top: Math.round(h * 0.18) }])
  }
  return img.webp({ quality: 86 }).toBuffer()
}

async function uploadImage(payload: Payload, name: string, data: Buffer, alt: Record<Loc, string>) {
  const created = await payload.create({
    collection: 'media',
    data: { alt: alt.ar },
    locale: 'ar',
    file: { data, mimetype: 'image/webp', name: `${name}.webp`, size: data.length },
    context: ctx,
  })
  await payload.update({ collection: 'media', id: created.id, locale: 'fr', data: { alt: alt.fr }, context: ctx })
  return created.id as number
}

async function localized<T extends 'posts' | 'events' | 'categories' | 'pages'>(payload: Payload, collection: T, ar: Record<string, unknown>, fr: Record<string, unknown>) {
  const created = await payload.create({ collection, data: ar as any, locale: 'ar', context: ctx, draft: false })
  await payload.update({ collection, id: created.id, data: fr as any, locale: 'fr', context: ctx })
  return created
}

async function seed() {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  if (process.env.SEED_RESET === 'true') {
    for (const c of ['posts', 'events', 'categories', 'pages', 'media'] as const) {
      await payload.delete({ collection: c, where: { id: { exists: true } }, context: ctx })
    }
    log('reset done')
  }

  /* Admin user */
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@mzab-alliance.dz'
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_ADMIN_PASSWORD) throw new Error('Set SEED_ADMIN_PASSWORD when seeding production')
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe-MBA-2026!'
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  let adminId: number
  if (existing.docs[0]) {
    adminId = existing.docs[0].id as number
    log(`admin exists: ${email}`)
  } else {
    const u = await payload.create({ collection: 'users', data: { email, password, name: 'MBA Admin', roles: ['admin'] } })
    adminId = u.id as number
    log(`admin created: ${email}`)
  }
  const editorEmail = process.env.SEED_EDITOR_EMAIL || 'editor@mzab-alliance.dz'
  if (!(await payload.find({ collection: 'users', where: { email: { equals: editorEmail } }, limit: 1 })).docs.length) {
    await payload.create({ collection: 'users', data: { email: editorEmail, password, name: 'فريق التحرير', roles: ['editor'] } })
    log(`editor created: ${editorEmail}`)
  }

  /* Globals */
  for (const loc of ['ar', 'fr'] as Loc[]) {
    const h = homeDefaults[loc]
    await payload.updateGlobal({ slug: 'home-page', locale: loc, context: ctx, data: { hero: h.hero, who: h.who, pillars: h.pillars, iconMeaning: h.iconMeaning, cta: h.cta, sections: h.sections } as any })
    await payload.updateGlobal({ slug: 'values', locale: loc, context: ctx, data: { items: valuesDefaults[loc] } as any })
    const a = aboutDefaults[loc]
    await payload.updateGlobal({
      slug: 'about-page',
      locale: loc,
      context: ctx,
      data: {
        intro: a.intro,
        story: a.story,
        heritage: a.heritage,
        logo: a.logo,
        vision: { ...a.vision, points: a.vision.points.map((text) => ({ text })) },
        model: { ...a.model, points: a.model.points.map((text) => ({ text })) },
        timeline: a.timeline,
      } as any,
    })
    await payload.updateGlobal({
      slug: 'footer',
      locale: loc,
      context: ctx,
      data: {
        phone: footerDefaults.phone,
        email: footerDefaults.email,
        address: footerDefaults.address[loc],
        blurb: loc === 'ar' ? 'شبكة شركات | صوت اقتصادي | فرص شراكة' : 'Réseau d’entreprises · Voix économique · Opportunités de partenariat',
        socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/' }, { platform: 'facebook', url: 'https://www.facebook.com/' }],
      } as any,
    })
    await payload.updateGlobal({
      slug: 'site-settings',
      locale: loc,
      context: ctx,
      data: {
        siteName: loc === 'ar' ? 'تحالف أعمال ميزاب' : 'MZAB Business Alliance',
        defaultTitle: loc === 'ar' ? 'MZAB Business Alliance — تحالف الثقة' : 'MZAB Business Alliance — L’alliance de la confiance',
        defaultDescription: homeDefaults[loc].who.body.slice(0, 190),
      } as any,
    })
  }
  const navRoutes = ['about', 'values', 'news', 'events', 'contact']
  const navLabels: Record<Loc, string[]> = { ar: ['من نحن', 'قيمنا', 'الأخبار', 'الفعاليات', 'اتصل بنا'], fr: ['À propos', 'Nos valeurs', 'Actualités', 'Événements', 'Contact'] }
  const header = await payload.updateGlobal({
    slug: 'header',
    locale: 'ar',
    context: ctx,
    data: { navItems: navRoutes.map((route, i) => ({ link: { label: navLabels.ar[i], type: 'internal', route } })), cta: { label: 'انضم إلى التحالف', type: 'internal', route: 'contact' } } as any,
  })
  await payload.updateGlobal({
    slug: 'header',
    locale: 'fr',
    context: ctx,
    data: { navItems: (header as any).navItems.map((n: any, i: number) => ({ id: n.id, link: { ...n.link, label: navLabels.fr[i] } })), cta: { label: 'Rejoindre l’alliance', type: 'internal', route: 'contact' } } as any,
  })
  log('globals updated (ar + fr)')

  if ((await payload.count({ collection: 'posts' })).totalDocs > 0) {
    log('posts already exist — skipping content (use SEED_RESET=true to rebuild)')
    process.exit(0)
  }

  /* Media */
  const img = {
    forum: await uploadImage(payload, 'mba-forum', await makeImage('field', 1600, 1000, true), { ar: 'الأيقونة الزجاجية لتحالف أعمال ميزاب', fr: 'Le symbole en verre de MZAB Business Alliance' }),
    green: await uploadImage(payload, 'mba-green', await makeImage('green'), { ar: 'رمز التحالف على خلفية خضراء', fr: 'Le symbole de l’alliance sur fond vert' }),
    navy: await uploadImage(payload, 'mba-navy', await makeImage('navy'), { ar: 'رمز التحالف على خلفية كحلية', fr: 'Le symbole de l’alliance sur fond bleu nuit' }),
    charcoal: await uploadImage(payload, 'mba-charcoal', await makeImage('charcoal'), { ar: 'رمز التحالف على خلفية فحمية', fr: 'Le symbole sur fond anthracite' }),
    mist: await uploadImage(payload, 'mba-mist', await makeImage('mist'), { ar: 'رمز التحالف على خلفية فاتحة', fr: 'Le symbole sur fond clair' }),
  }
  log('media uploaded')

  /* Categories */
  const cat = {
    alliance: await localized(payload, 'categories', { name: 'أخبار التحالف', slug: 'alliance' }, { name: 'Vie de l’alliance', slug: 'alliance' }),
    markets: await localized(payload, 'categories', { name: 'أسواق CEDEAO', slug: 'cedeao' }, { name: 'Marchés CEDEAO', slug: 'cedeao' }),
    partners: await localized(payload, 'categories', { name: 'شراكات', slug: 'partenariats' }, { name: 'Partenariats', slug: 'partenariats' }),
  }

  /* Posts */
  const day = 86_400_000
  const now = Date.now()
  await localized(
    payload,
    'posts',
    {
      title: 'انطلاق تحالف أعمال ميزاب: قيمٌ راسخة، أسواقٌ بلا حدود',
      slug: 'انطلاق-التحالف',
      excerpt: 'في لقائه الرسمي الأول، أعلن التحالف عن هويته ورسالته: جمع المؤسسات الجزائرية تحت راية واحدة نحو أسواق غرب إفريقيا.',
      coverImage: img.forum,
      category: cat.alliance.id,
      author: adminId,
      publishedAt: new Date(now - 20 * day).toISOString(),
      _status: 'published',
      content: doc('rtl', [
        p('rtl', 'احتضن اللقاء الرسمي الأول لتحالف أعمال ميزاب نخبةً من رجال الأعمال وممثلي المؤسسات الجزائرية في قطاعات الصناعة والتجارة والخدمات، حول فكرة واحدة: أن نكون أقوى معاً.'),
        h2('rtl', 'علامة مظلّة لصوت اقتصادي واحد'),
        p('rtl', 'لا يذيب التحالف هوية أعضائه، بل يمنحهم راية مشتركة تفتح الأبواب أمامهم وتختصر الطريق نحو الشركاء والأسواق الجديدة.'),
        quote('rtl', 'الكلمة عقد، والوفاء بها هو رأس مالنا الأول.'),
        upload(img.green),
        h2('rtl', 'الخطوات القادمة'),
        ul('rtl', ['تنظيم أولى البعثات الاقتصادية نحو أسواق CEDEAO', 'إطلاق دليل الأعضاء والخدمات', 'بناء شراكات مع الهيئات والمؤسسات الداعمة للتصدير']),
      ]),
    },
    {
      title: 'Lancement de MZAB Business Alliance : des valeurs ancrées, des marchés sans frontières',
      slug: 'lancement-de-l-alliance',
      excerpt: 'Lors de sa première rencontre officielle, l’alliance a présenté son identité et sa mission : réunir les entreprises algériennes sous une même bannière vers les marchés d’Afrique de l’Ouest.',
      content: doc('ltr', [
        p('ltr', 'La première rencontre officielle de MZAB Business Alliance a réuni des chefs d’entreprise et des représentants de sociétés algériennes de l’industrie, du commerce et des services autour d’une idée simple : être plus forts ensemble.'),
        h2('ltr', 'Une marque ombrelle pour une seule voix économique'),
        p('ltr', 'L’alliance ne dissout pas l’identité de ses membres : elle leur offre une bannière commune qui ouvre les portes et raccourcit le chemin vers les partenaires et les nouveaux marchés.'),
        quote('ltr', 'La parole donnée est un contrat ; la tenir est notre premier capital.'),
        upload(img.green),
        h2('ltr', 'Les prochaines étapes'),
        ul('ltr', ['Organiser les premières missions économiques vers les marchés de la CEDEAO', 'Publier l’annuaire des membres et des services', 'Nouer des partenariats avec les institutions d’appui à l’export']),
      ]),
    },
  )
  await localized(
    payload,
    'posts',
    {
      title: 'أسواق CEDEAO: لماذا الآن؟',
      slug: 'أسواق-cedeao-لماذا-الآن',
      excerpt: 'أكثر من 400 مليون مستهلك وخمس عشرة دولة: قراءة في الفرص التي تفتحها أسواق غرب إفريقيا أمام المؤسسة الجزائرية.',
      coverImage: img.navy,
      category: cat.markets.id,
      author: adminId,
      publishedAt: new Date(now - 9 * day).toISOString(),
      _status: 'published',
      content: doc('rtl', [
        p('rtl', 'تشهد أسواق المجموعة الاقتصادية لدول غرب إفريقيا نمواً متسارعاً في الطلب على المنتجات الصناعية والغذائية ومواد البناء والخدمات اللوجستية.'),
        h2('rtl', 'ميزة القرب والتاريخ'),
        p('rtl', 'يربط الجزائرَ بهذه الأسواق تاريخٌ طويل من التجارة الصحراوية، كان تجّار ميزاب من أبرز روّاده. واليوم، تعيد الطرق العابرة للصحراء والممرات الجديدة رسم خريطة المبادلات.'),
        p('rtl', 'لكن دخول هذه الأسواق منفرداً مكلف ومحفوف بالمخاطر. من هنا تأتي قيمة العمل الجماعي: تقاسم المعلومة، والتمثيل الموحّد، والمرافقة الميدانية.'),
      ]),
    },
    {
      title: 'Marchés de la CEDEAO : pourquoi maintenant ?',
      slug: 'marches-cedeao-pourquoi-maintenant',
      excerpt: 'Plus de 400 millions de consommateurs et quinze pays : décryptage des opportunités que l’Afrique de l’Ouest ouvre à l’entreprise algérienne.',
      content: doc('ltr', [
        p('ltr', 'Les marchés de la Communauté économique des États de l’Afrique de l’Ouest connaissent une forte croissance de la demande en produits industriels et alimentaires, en matériaux de construction et en services logistiques.'),
        h2('ltr', 'L’avantage de la proximité et de l’histoire'),
        p('ltr', 'L’Algérie est liée à ces marchés par une longue histoire de commerce transsaharien, dont les marchands du M’zab furent parmi les pionniers. Aujourd’hui, les routes et les corridors transsahariens redessinent la carte des échanges.'),
        p('ltr', 'Mais aborder ces marchés seul est coûteux et risqué. D’où la valeur de l’action collective : partage de l’information, représentation unifiée et accompagnement sur le terrain.'),
      ]),
    },
  )
  await localized(
    payload,
    'posts',
    {
      title: 'التضامن في الممارسة: كيف يتقاسم الأعضاء الشبكة والمخاطرة',
      slug: 'التضامن-في-الممارسة',
      excerpt: 'من القوافل إلى المؤسسات الحديثة: كيف يترجم التحالف قيمة التضامن إلى أدوات عملية لأعضائه.',
      coverImage: img.charcoal,
      category: cat.partners.id,
      author: adminId,
      publishedAt: new Date(now - 2 * day).toISOString(),
      _status: 'published',
      content: doc('rtl', [
        p('rtl', 'قوة الجماعة تحمي الفرد؛ ننهض معاً أو لا ننهض. ليست هذه العبارة شعاراً فحسب، بل هي منهج عمل.'),
        ul('rtl', ['مجموعات عمل قطاعية تلتقي شهرياً', 'قاعدة معطيات مشتركة حول الأسواق والشركاء', 'آلية لتقاسم تكاليف المعارض والبعثات']),
        p('rtl', 'بهذه الأدوات، تتحول الثقة التي بناها الميزابيون عبر القرون إلى رأس مال مؤسساتي حديث.'),
      ]),
    },
    {
      title: 'La solidarité en pratique : partager le réseau et le risque',
      slug: 'la-solidarite-en-pratique',
      excerpt: 'Des caravanes aux entreprises modernes : comment l’alliance traduit la solidarité en outils concrets pour ses membres.',
      content: doc('ltr', [
        p('ltr', 'La force du groupe protège l’individu ; nous nous élevons ensemble, ou pas du tout. Plus qu’une devise, c’est une méthode de travail.'),
        ul('ltr', ['Des groupes de travail sectoriels qui se réunissent chaque mois', 'Une base de données partagée sur les marchés et les partenaires', 'Un mécanisme de mutualisation des coûts des salons et des missions']),
        p('ltr', 'Grâce à ces outils, la confiance bâtie par les Mozabites au fil des siècles devient un capital institutionnel moderne.'),
      ]),
    },
  )
  log('3 posts created')

  /* Events */
  const at = (iso: string) => new Date(iso).toISOString()
  await localized(
    payload,
    'events',
    {
      title: 'منتدى الأعمال الجزائري — CEDEAO',
      slug: 'منتدى-الأعمال-cedeao',
      excerpt: 'يوم كامل من اللقاءات الثنائية والورشات حول فرص التصدير نحو غرب إفريقيا.',
      startDate: at('2026-12-09T09:00:00+01:00'),
      endDate: at('2026-12-09T17:30:00+01:00'),
      location: 'غرداية، الجزائر',
      mapUrl: 'https://maps.google.com/?q=Ghardaia',
      coverImage: img.forum,
      registrationUrl: 'https://example.org/inscription',
      gallery: [img.green, img.navy, img.mist],
      _status: 'published',
      description: doc('rtl', [
        p('rtl', 'يجمع المنتدى المؤسسات الأعضاء وشركاء من دول CEDEAO حول ورشات قطاعية ولقاءات أعمال ثنائية.'),
        ul('rtl', ['جلسة افتتاحية: رؤية التحالف', 'ورشات: الصناعة، التجارة، الخدمات', 'لقاءات ثنائية مبرمجة مسبقاً']),
      ]),
    },
    {
      title: 'Forum d’affaires Algérie — CEDEAO',
      slug: 'forum-affaires-cedeao',
      excerpt: 'Une journée de rendez-vous B2B et d’ateliers sur les opportunités d’export vers l’Afrique de l’Ouest.',
      location: 'Ghardaïa, Algérie',
      description: doc('ltr', [
        p('ltr', 'Le forum réunit les entreprises membres et des partenaires des pays de la CEDEAO autour d’ateliers sectoriels et de rendez-vous d’affaires.'),
        ul('ltr', ['Séance d’ouverture : la vision de l’alliance', 'Ateliers : industrie, commerce, services', 'Rendez-vous B2B préprogrammés']),
      ]),
    },
  )
  await localized(
    payload,
    'events',
    {
      title: 'بعثة اقتصادية إلى داكار',
      slug: 'بعثة-داكار',
      excerpt: 'بعثة ميدانية لأعضاء التحالف للقاء الموزعين والمستوردين في السنغال.',
      startDate: at('2027-02-16T10:00:00+00:00'),
      endDate: at('2027-02-19T18:00:00+00:00'),
      location: 'داكار، السنغال',
      mapUrl: 'https://maps.google.com/?q=Dakar',
      coverImage: img.navy,
      _status: 'published',
      description: doc('rtl', [p('rtl', 'أربعة أيام من الزيارات واللقاءات مع غرف التجارة والموزعين، بمرافقة لوجستية كاملة.')]),
    },
    {
      title: 'Mission économique à Dakar',
      slug: 'mission-dakar',
      excerpt: 'Une mission de terrain des membres de l’alliance à la rencontre des distributeurs et importateurs sénégalais.',
      location: 'Dakar, Sénégal',
      description: doc('ltr', [p('ltr', 'Quatre jours de visites et de rencontres avec les chambres de commerce et les distributeurs, avec un accompagnement logistique complet.')]),
    },
  )
  await localized(
    payload,
    'events',
    {
      title: 'اللقاء الرسمي الأول',
      slug: 'اللقاء-الرسمي-الأول',
      excerpt: 'إطلاق التحالف وهويته البصرية بحضور المؤسسات المؤسِّسة.',
      startDate: at('2026-03-14T15:00:00+01:00'),
      endDate: at('2026-03-14T19:00:00+01:00'),
      location: 'غرداية، الجزائر',
      coverImage: img.green,
      gallery: [img.forum, img.charcoal, img.mist, img.navy],
      _status: 'published',
      description: doc('rtl', [p('rtl', 'قيمٌ راسخة، أسواقٌ بلا حدود: هكذا أطلق التحالف مسيرته.')]),
    },
    {
      title: 'Première rencontre officielle',
      slug: 'premiere-rencontre-officielle',
      excerpt: 'Lancement de l’alliance et de son identité visuelle en présence des entreprises fondatrices.',
      location: 'Ghardaïa, Algérie',
      description: doc('ltr', [p('ltr', 'Des valeurs ancrées, des marchés sans frontières : ainsi l’alliance a lancé son parcours.')]),
    },
  )
  log('3 events created (2 upcoming, 1 past)')

  await payload.updateGlobal({ slug: 'about-page', context: ctx, data: { image: img.forum } as any })
  await payload.updateGlobal({ slug: 'site-settings', context: ctx, data: { ogImage: img.forum } as any })
  log('done ✔')
  process.exit(0)
}

// `payload run` exits once the module has evaluated, so await at top level.
try {
  await seed()
} catch (err) {
  console.error(err)
  process.exit(1)
}
