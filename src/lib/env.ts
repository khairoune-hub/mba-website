/** Fails fast with one readable message instead of a cascade of "missing secret key" query errors. */
const required: Record<string, string> = {
  PAYLOAD_SECRET: 'a long random string — generate one with `openssl rand -hex 32`',
  DATABASE_URI: 'your Postgres URL (Supabase pooler on port 6543 with ?pgbouncer=true, or postgres://mba:mba@127.0.0.1:5432/mba locally)',
}

const missing = Object.keys(required).filter((k) => !process.env[k]?.trim())
if (missing.length) {
  throw new Error(
    `\n\nMissing environment variable(s) in .env:\n${missing.map((k) => `  • ${k}: ${required[k]}`).join('\n')}\n\nCopy .env.example to .env, fill these in, then restart the server.\n`,
  )
}

export {}
