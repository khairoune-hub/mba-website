// Vectorises the "MZAB / BUSINESS / ALLIANCE" wordmark from assets/logo-color.webp.
// Output coordinates share the mark's origin (see build-mark.mjs): the mark sits at 0..794 × 0..534.
import sharp from 'sharp'
import potrace from 'potrace'
import { readFileSync, writeFileSync } from 'node:fs'

const SCALE = 2
const region = { left: 950, top: 290, width: 1000, height: 520 } // in source px
const ORIGIN = { x: 44, y: 265 } // mark top-left in source px

const buf = await sharp('assets/logo-color.webp')
  .extract(region)
  .flatten({ background: '#ffffff' })
  .resize(region.width * SCALE, region.height * SCALE, { kernel: 'lanczos3' })
  .greyscale()
  .png()
  .toBuffer()

const d = await new Promise((resolve, reject) => {
  const p = new potrace.Potrace({ threshold: 140, turdSize: 20, optTolerance: 1.0, alphaMax: 1.0 })
  p.loadImage(buf, (err) => {
    if (err) return reject(err)
    resolve(p.getPathTag().match(/ d="([^"]+)"/)[1].replace(/, /g, " ").replace(/ ?([MCLZ]) ?/g, "$1"))
  })
})

// Rescale path numbers into mark coordinates.
const offX = region.left - ORIGIN.x
const offY = region.top - ORIGIN.y
let axis = 0
const out = d.replace(/-?\d+(\.\d+)?/g, (n) => {
  const v = parseFloat(n) / SCALE + (axis++ % 2 === 0 ? offX : offY)
  return (+v.toFixed(1)).toString()
})

const file = 'src/components/brand/mark-paths.ts'
const src = readFileSync(file, 'utf8').replace(/\n\/\*\* Wordmark[\s\S]*$/, '\n')
writeFileSync(
  file,
  src.trimEnd() +
    `\n/** Wordmark "MZAB / BUSINESS / ALLIANCE" (vectorised by scripts/build-wordmark.mjs), same origin as the mark. */\nexport const PATH_WORDMARK = '${out}'\n/** Full horizontal lockup box. */\nexport const LOCKUP_VIEWBOX = '0 0 1896 534'\n`,
)
console.log('wordmark length', out.length)
