// Converts the TheMixArab TTFs in /assets to WOFF2 for next/font/local.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import ttf2woff2 from 'ttf2woff2'

const weights = ['Regular', 'Bold', 'Black']
mkdirSync('src/fonts', { recursive: true })
for (const w of weights) {
  const out = ttf2woff2(readFileSync(`assets/TheMixArab-${w}.ttf`))
  writeFileSync(`src/fonts/TheMixArab-${w}.woff2`, out)
  console.log(`TheMixArab-${w}.woff2`, out.length)
}
