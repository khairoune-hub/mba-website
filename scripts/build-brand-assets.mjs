// Builds web brand assets from /assets and the traced mark: trimmed glass render, favicons, default OG image.
import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

mkdirSync('public/brand', { recursive: true })
const src = readFileSync('src/components/brand/mark-paths.ts', 'utf8')
const get = (k) => src.match(new RegExp(`${k} = '([^']+)'`))[1]
const M = get('PATH_M'), A = get('PATH_A'), S = get('PATH_SUMMIT'), W = get('PATH_WORDMARK')

// 1. Glass render, trimmed to its content.
const glass = await sharp('assets/glass-icon.webp').trim({ threshold: 2 }).toBuffer({ resolveWithObject: true })
await sharp(glass.data).webp({ quality: 88, alphaQuality: 90 }).toFile('public/brand/glass.webp')
console.log('glass', glass.info.width, glass.info.height)

// 2. Favicon (SVG) + PNG icons.
const markSvg = (size, pad, bg) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad - 130} ${794 + pad * 2} ${794 + pad * 2}">${bg ? `<rect x="${-pad}" y="${-pad - 130}" width="${794 + pad * 2}" height="${794 + pad * 2}" rx="${(794 + pad * 2) * 0.22}" fill="${bg}"/>` : ''}<path fill="#90BE41" d="${M}"/><path fill="#424243" d="${A}"/><path fill="#90BE41" d="${S}"/></svg>`
writeFileSync('public/brand/favicon.svg', markSvg(64, 20))
writeFileSync('src/app/icon.svg', markSvg(64, 20))
await sharp(Buffer.from(markSvg(180, 110, '#ffffff'))).png().toFile('src/app/apple-icon.png')
await sharp(Buffer.from(markSvg(512, 110, '#ffffff'))).png().toFile('public/brand/icon-512.png')

// 3. Default OG image 1200×630: soft field + lockup.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
 <radialGradient id="c" cx="50%" cy="45%" r="70%"><stop offset="35%" stop-color="#fff"/><stop offset="100%" stop-color="#e9e8e8"/></radialGradient>
 <radialGradient id="g1" cx="0%" cy="25%" r="45%"><stop offset="0%" stop-color="#90BE41" stop-opacity=".6"/><stop offset="100%" stop-color="#90BE41" stop-opacity="0"/></radialGradient>
 <radialGradient id="g2" cx="100%" cy="90%" r="45%"><stop offset="0%" stop-color="#90BE41" stop-opacity=".6"/><stop offset="100%" stop-color="#90BE41" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="url(#c)"/><rect width="1200" height="630" fill="url(#g1)"/><rect width="1200" height="630" fill="url(#g2)"/>
<path d="M0 470 H760 a40 40 0 0 0 36 -24 L960 0" fill="none" stroke="#90BE41" stroke-opacity=".5"/>
<g transform="translate(150 215) scale(0.474)"><path fill="#90BE41" d="${M}"/><path fill="#424243" d="${A}"/><path fill="#90BE41" d="${S}"/><path fill="#424243" fill-rule="evenodd" d="${W}"/></g>
</svg>`
await sharp(Buffer.from(og)).png().toFile('public/brand/og-default.png')
console.log('ok')

// 4. Static logo lockups per variant (cached by the browser instead of inlined in every page).
const fills = {
  color: ['#90BE41', '#424243', '#90BE41', '#424243'],
  onDark: ['#90BE41', '#FFFFFF', '#90BE41', '#FFFFFF'],
  onGreen: ['#FFFFFF', '#424243', '#FFFFFF', '#424243'],
  mono: ['#424243', '#424243', '#424243', '#424243'],
  white: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
}
for (const [variant, [m, a, s, w]] of Object.entries(fills)) {
  const shapes = `<path fill="${m}" d="${M}"/><path fill="${a}" d="${A}"/><path fill="${s}" d="${S}"/>`
  const word = `<path fill="${w}" fill-rule="evenodd" d="${W}"/>`
  writeFileSync(`public/brand/logo-${variant}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1896 534"><title>MZAB Business Alliance</title>${shapes}${word}</svg>`)
  writeFileSync(`public/brand/logo-stacked-${variant}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 964 1110"><title>MZAB Business Alliance</title><g transform="translate(85 0)">${shapes}</g><g transform="translate(-932 590)">${word}</g></svg>`)
}
console.log('logos ok')
