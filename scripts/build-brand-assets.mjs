// Builds favicons, app icons and the default OG image from the SVGs extracted from the brand book.
// Run after: python scripts/extract-logo-pdf.py   →   node scripts/build-brand-assets.mjs
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'

const INK = '#030405'
const GREEN = '#1b8453'

/** Inner markup + viewBox of an extracted SVG, so it can be re-composed inside another SVG. */
function parts(file) {
  const svg = readFileSync(file, 'utf8')
  const [x, y, w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number)
  const body = svg.replace(/^.*?<\/title>/s, '').replace(/<\/svg>\s*$/, '')
  return { x, y, w, h, body }
}

/** Places an SVG part centred in a box of size×size, scaled to `fill` of the box width. */
function placed(p, size, fill, cy = size / 2) {
  const s = (size * fill) / p.w
  const tx = (size - p.w * s) / 2 - p.x * s
  const ty = cy - (p.h * s) / 2 - p.y * s
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})">${p.body}</g>`
}

const mark = parts('public/brand/mark-color.svg')
const markWhite = parts('public/brand/mark-white.svg')
const logoWhite = parts('public/brand/logo-white.svg')

// 1. Favicon: the "A" + triangle, transparent background, optically centred a little low.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${placed(mark, 64, 0.92, 34)}</svg>`
writeFileSync('public/brand/favicon.svg', favicon)
writeFileSync('src/app/icon.svg', favicon)

// 2. App icons: white mark on ink, rounded square for 512 (Android maskable-safe padding).
const appIcon = (size, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/>${placed(markWhite, size, 0.62, size * 0.53)}</svg>`
await sharp(Buffer.from(appIcon(180, 0))).png().toFile('src/app/apple-icon.png')
await sharp(Buffer.from(appIcon(512, 0))).png().toFile('public/brand/icon-512.png')

// 3. Default OG image 1200×630: ink background, white logo, the brand book's green corner triangles.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${INK}"/>
<path d="M0 395 L135 630 H0 Z" fill="${GREEN}"/>
<path d="M1200 440 L1090 630 H1200 Z" fill="${GREEN}"/>
<path d="M0 0 H42 L0 72 Z" fill="${GREEN}"/>
<g transform="translate(0 0)">${placed(logoWhite, 1200, 0.56, 315)}</g>
</svg>`
await sharp(Buffer.from(og)).png().toFile('public/brand/og-default.png')
console.log('brand assets ok')
