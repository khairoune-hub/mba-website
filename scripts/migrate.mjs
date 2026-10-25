// Runs Payload migrations against the *direct* Supabase connection (port 5432).
// The pooler (6543, transaction mode) does not support the session features migrations need.
//   node scripts/migrate.mjs            → payload migrate
//   node scripts/migrate.mjs create foo → payload migrate:create foo
import { spawnSync } from 'node:child_process'

const [sub, ...rest] = process.argv.slice(2)
const direct = process.env.DATABASE_URI_DIRECT || process.env.DATABASE_URI
if (!direct) {
  console.error('DATABASE_URI_DIRECT (or DATABASE_URI) is required')
  process.exit(1)
}
const cmd = sub ? [`migrate:${sub}`, ...rest] : ['migrate']
const res = spawnSync('pnpm', ['exec', 'payload', ...cmd], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URI: direct, PAYLOAD_DB_PUSH: 'false' },
})
process.exit(res.status ?? 1)
