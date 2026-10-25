'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'
import type { Dictionary } from '@/i18n'
import { Button } from '@/components/ui/Button'

const input =
  'block w-full rounded-[14px] bg-white px-4 py-3 text-ink ring-1 ring-inset ring-border transition-shadow placeholder:text-muted/70 hover:ring-charcoal/30 focus:outline-none focus:ring-2 focus:ring-green-ink aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600'

function Field({ name, label, error, required, children }: { name: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-charcoal">
        {label}
        {required && <span aria-hidden="true" className="text-green-ink"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm({ locale, t }: { locale: string; t: Dictionary['contact'] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })
  const err = (k: string) => {
    const code = state.errors?.[k]
    return code ? (code === 'invalidEmail' ? t.invalidEmail : t.required) : undefined
  }
  const a11y = (k: string) => (err(k) ? { 'aria-invalid': true, 'aria-describedby': `${k}-error` } : {})

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-green-soft p-8 text-lg font-semibold text-charcoal">
        {t.success}
      </div>
    )
  }

  return (
    <form action={action} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -z-10 size-0 overflow-hidden opacity-0">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field name="name" label={t.name} required error={err('name')}>
        <input id="name" name="name" required autoComplete="name" className={input} {...a11y('name')} />
      </Field>
      <Field name="email" label={t.email} required error={err('email')}>
        <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className={`${input} rtl:text-end`} {...a11y('email')} />
      </Field>
      <Field name="phone" label={t.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" dir="ltr" className={`${input} rtl:text-end`} />
      </Field>
      <Field name="company" label={t.company}>
        <input id="company" name="company" autoComplete="organization" className={input} />
      </Field>
      <div className="sm:col-span-2">
        <Field name="subject" label={t.subject}>
          <select id="subject" name="subject" className={input} defaultValue="membership">
            {Object.entries(t.subjects).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field name="message" label={t.message} required error={err('message')}>
          <textarea id="message" name="message" rows={6} required className={`${input} resize-y`} {...a11y('message')} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={pending} arrow={!pending}>
          {pending ? t.sending : t.send}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-red-700">
          {state.status === 'error' && !state.errors ? t.error : ''}
        </p>
      </div>
    </form>
  )
}
