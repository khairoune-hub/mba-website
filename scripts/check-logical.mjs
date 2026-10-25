// Fails if physical left/right utilities slip into components (RTL safety). Use ms-/me-/ps-/pe-/start-/end- instead.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const bad = /(?<![\w-])(?:-?m[lr]-|-?p[lr]-|-?left-|-?right-|text-left|text-right|border-[lr](?:-|\b)|rounded-[lr]-|rounded-[tb][lr]-|float-(?:left|right)|scroll-[mp][lr]-)/
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(path.join(d, f)).isDirectory() ? walk(path.join(d, f)) : [path.join(d, f)]))
const files = walk('src').filter((f) => /\.(tsx?|css)$/.test(f) && !f.includes('payload-types') && !f.includes('(payload)') && !f.includes('migrations'))
let errors = 0
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const classes = [...line.matchAll(/className=\{?[`'"]([^`'"]*)/g)].map((m) => m[1]).join(' ')
    if (classes && bad.test(classes)) {
      console.log(`${f}:${i + 1}  ${classes.match(bad)[0]}`)
      errors++
    }
  })
}
if (errors) {
  console.error(`\n${errors} physical direction class(es) found.`)
  process.exit(1)
}
console.log(`✓ ${files.length} files use logical properties only`)
