# MZAB Business Alliance — website

Bilingual (Arabic RTL by default, French LTR) institutional site for **MZAB Business Alliance (MBA)**.
Next.js 15 (App Router) + Payload CMS 3 in the same app, Supabase Postgres + Supabase Storage (S3 API), deployed on Railway.

- Site: `/ar/…` (default; `/` redirects there) and `/fr/…`
- Admin: `/admin` (blog, events, media, globals — both languages)
- Styleguide (dev only): `/ar/styleguide`, `/fr/styleguide`

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15.4 (App Router, RSC, ISR) — Payload 3.92 requires `>=15.4.11 <15.5` on the 15 line |
| CMS | Payload 3 (Lexical editor with image uploads, versions + drafts, live preview) |
| Database | Supabase Postgres via `@payloadcms/db-postgres` (pooler at runtime, direct for migrations) |
| Media | Supabase Storage through `@payloadcms/storage-s3` (`forcePathStyle: true`), served from the public bucket URL |
| Styling | Tailwind CSS v4, tokens in `src/styles/globals.css`, logical properties only |
| Fonts | TheMixArab (self-hosted WOFF2), Fahkwang + Inter (`next/font/google`) |
| Motion | Framer Motion (`LazyMotion`) for scroll reveals, CSS for the hero/float |
| Email | Resend or SMTP (contact-form notifications) |

## Local setup

```bash
pnpm install
cp .env.example .env          # then set at least these three:
#   PAYLOAD_SECRET=$(openssl rand -hex 32)
#   DATABASE_URI=postgres://mba:mba@127.0.0.1:5432/mba
#   DATABASE_URI_DIRECT=postgres://mba:mba@127.0.0.1:5432/mba
docker compose up -d          # local Postgres on :5432 (or point DATABASE_URI at a Supabase dev project)
pnpm migrate                  # creates the schema (same migrations as production)
pnpm dev
pnpm seed                     # admin + editor users, globals (AR+FR), 3 posts, 3 events, sample images
```

Open http://localhost:3000 (→ `/ar`) and http://localhost:3000/admin.
Seed logins: `admin@mzab-alliance.dz` / `editor@mzab-alliance.dz`, password from `SEED_ADMIN_PASSWORD`
(dev fallback: `ChangeMe-MBA-2026!` — change it; production seeding refuses to run without the variable).

Without `S3_BUCKET`, uploads are stored on disk in `./media` (dev only).

### Useful scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js |
| `pnpm migrate` | `payload migrate` against `DATABASE_URI_DIRECT` |
| `pnpm migrate:create <name>` | new migration from the current config (run against an up-to-date DB) |
| `pnpm seed` (`SEED_RESET=true pnpm seed` to rebuild content) | sample content |
| `pnpm generate:types` / `pnpm generate:importmap` | after changing collections / admin components |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint:logical` | fails on physical `ml-/pr-/left-/text-right…` classes (RTL safety) |
| `pnpm fonts` | rebuild TheMixArab WOFF2 from `assets/*.ttf` (needs `pip install fonttools brotli`): fixes Bold's corrupt `post` table that browsers reject and adds Arabic shaping (GSUB) |
| `node scripts/build-mark.mjs`, `build-wordmark.mjs`, `build-brand-assets.mjs` | regenerate the traced logo paths, static logo SVGs, favicon, OG image, trimmed glass render |

## Supabase setup

1. **Create a project** (pick the region closest to Algeria, e.g. `eu-central-1` Frankfurt).
2. **Database URLs** — Project → *Connect*:
   - *Transaction pooler* (Supavisor, port **6543**) → `DATABASE_URI`, and append `?pgbouncer=true`.
   - *Direct connection* (port **5432**) → `DATABASE_URI_DIRECT` (used only for migrations).
   The app does **not** use Supabase Auth or `supabase-js`; Payload handles users and roles.
3. **Storage bucket** — Storage → *New bucket* → name `media`, **Public bucket: on**.
4. **S3 keys** — Storage → *Settings* → *S3 connection*: copy the endpoint
   (`https://<ref>.supabase.co/storage/v1/s3`) and region, then *New access key* → `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`.
5. Set `NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co` and `S3_BUCKET=media`. Public file URLs become
   `https://<ref>.supabase.co/storage/v1/object/public/media/<file>` (override with `S3_PUBLIC_URL` if needed).
   `*.supabase.co` is whitelisted in `next.config.mjs` → `images.remotePatterns`.
6. Run migrations once: `DATABASE_URI_DIRECT=… pnpm migrate`, then optionally `pnpm seed` (sample images are uploaded through Payload, so they land in the bucket).

**Check the storage wiring:** log into `/admin` → Media → upload an image → the object (plus its `-400x300` and `-800x500` WebP sizes, and a 1920px hero size for larger originals) appears in Supabase → Storage → `media`, and the media URL starts with `…/storage/v1/object/public/media/`. Attach it to a post and open the post on the site.

## Deploying on Railway

1. Push this repository to GitHub and create a Railway service from it. `railway.json` selects the `Dockerfile`.
2. Add the variables from `.env.example` (at minimum `DATABASE_URI`, `DATABASE_URI_DIRECT`, `PAYLOAD_SECRET`,
   `NEXT_PUBLIC_SERVER_URL=https://<your-domain>`, `NEXT_PUBLIC_SUPABASE_URL`, `S3_*`, and `RESEND_API_KEY` or `SMTP_*`, `CONTACT_RECIPIENT`).
3. Deploy. Each deploy runs the **pre-deploy command** `node scripts/migrate.mjs` (Payload migrations on the direct connection) before the new version starts; the app then runs `pnpm start` on port 3000. Health check: `/ar`.
4. Add your custom domain in Railway and update `NEXT_PUBLIC_SERVER_URL`.

The build pre-renders the static pages and needs `DATABASE_URI` and `PAYLOAD_SECRET` at build time (Railway exposes service variables to the Docker build). Content then refreshes via ISR: Payload `afterChange`/`afterDelete` hooks call `revalidateTag` (`posts`, `events`, `pages`, `global:*`), with a 1-hour safety revalidation.

## Content model

**Collections**
- `posts` — title, slug (localized, auto from title), excerpt, cover, Lexical content, category, author, publishedAt, SEO; drafts + autosave.
- `events` — title, slug, start/end, location, map URL, cover, description, gallery, registration URL, SEO; drafts.
- `categories`, `media` (localized required alt, WebP sizes thumbnail/card/hero, focal point), `pages` (block builder: Hero, RichText, Cards, CTA, ImageText — a page with slug `legal` replaces the built-in legal text), `contact-submissions` (written by the form; read-only for editors), `users` (roles `admin` / `editor`; the first user becomes admin).

**Globals** — `header` (nav + CTA), `footer` (contacts, address, socials), `home-page` (hero, who-we-are, pillars, icon meaning, closing CTA, section toggles), `values` (the four values incl. the ▲ split), `about-page` (story, heritage, CEDEAO vision, umbrella model, logo story, timeline, leadership), `site-settings` (default SEO, OG image, contact recipient).
Empty CMS fields fall back to the defaults in `src/content/defaults.ts` (brand-book copy), per language.

**Roles** — editors see and manage posts, events, categories and media, and can read contact submissions. Everything else (globals, pages, users) is admin-only.

**Preview** — "Preview" / live preview in the admin opens `/next/preview?path=…`, which enables Next draft mode for logged-in staff; a gold bar lets you exit.

## Internationalisation

- `src/i18n/config.ts` (locales, `dir`, Intl tags — Arabic uses Western digits: `ar-DZ-u-nu-latn`), `ar.ts` / `fr.ts` (typed UI dictionaries), `routes.ts` (localized path segments: `/fr/a-propos`, `/fr/valeurs`, `/fr/actualites`, `/fr/evenements`, `/fr/mentions-legales`; Arabic uses ASCII segments).
- `src/middleware.ts` redirects `/` and unprefixed paths, rewrites French segments to the internal folders, and 308-redirects wrong-locale segments (`/fr/about` → `/fr/a-propos`).
- The language switcher keeps the current page; detail pages declare their localized slugs (`SetAlternates`).
- Every content field in Payload is `localized`; `fallback: true` for collections.

## Design system

Tokens and the component inventory follow the brand book (`assets/MBA_brand_identity.pdf`); see `/ar/styleguide`.
Key rules: green `#90BE41` is for accents/CTAs with **charcoal text on it** (white on green fails contrast); `--color-green-ink #4E7A1F` and `--color-gold-ink #7F7318` are the AA-safe text variants. The logo never mirrors; slanted corners, hairlines and arrows do.

## Quality

- Lighthouse (local production build, this repo's seed): Accessibility, Best Practices and SEO 100 on all tested pages; Performance 99–100 on desktop and ~90–93 on simulated mobile (LCP is the hero image under slow-4G throttling). Re-measure on the real host/CDN.
- SEO: per-page `generateMetadata` with hreflang (`ar-DZ`, `fr-DZ`, `x-default`), canonical URLs, localized `sitemap.xml`, `robots.txt`, OG images, JSON-LD (Organization, NewsArticle, Event).
- Accessibility: skip link, focus-visible green outline, keyboard-operable drawer (focus trap, Esc), gallery lightbox (`<dialog>`, arrow keys follow reading direction), `prefers-reduced-motion` respected.

## Notes

- **Fonts:** TheMixArab is a commercial typeface; make sure the client's licence covers web embedding.
- **Placeholder contact email** `contact@mzab-alliance.dz` (the brand-book mockup is unreadable) — edit it in *Footer*.
- Sample images are generated from the brand assets (no stock photography); replace them with real photos.
