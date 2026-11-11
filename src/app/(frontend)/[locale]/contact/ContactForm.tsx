'use client'

import { useActionState, useId } from 'react'
import { submitContact, type ContactState } from './actions'
import type { Dictionary } from '@/i18n'
import { Button } from '@/components/ui/Button'

const input =
  'block w-full rounded-[var(--radius-md)] bg-white px-4 py-3 text-ink ring-1 ring-inset ring-border transition-shadow placeholder:text-muted/70 hover:ring-charcoal/30 focus:outline-none focus:ring-2 focus:ring-green aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600'

function Field({ id, label, error, required, optional, children }: { id: string; label: string; error?: string; required?: boolean; optional?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-charcoal">
        {label}
        {required && <span aria-hidden="true" className="text-green"> *</span>}
        {optional && <span className="font-normal text-muted"> ({optional})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * membership: the alliance's membership request (name, company, sector, phone, email; all required).
 * contact: general enquiry with subject and message.
 */
export function ContactForm({ locale, t, variant = 'contact', submitLabel }: { locale: string; t: Dictionary['contact']; variant?: 'membership' | 'contact'; submitLabel?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })
  const uid = useId()
  const id = (k: string) => `${variant}-${k}-${uid.replace(/:/g, '')}`
  const membership = variant === 'membership'
  const messages = { required: t.required, invalidEmail: t.invalidEmail, invalidPhone: t.invalidPhone }
  const err = (k: string) => {
    const code = state.errors?.[k]
    return code ? messages[code] : undefined
  }
  const a11y = (k: string) => (err(k) ? { 'aria-invalid': true, 'aria-describedby': `${id(k)}-error` } : {})
  const optional = membership ? undefined : t.optional

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-green-soft p-8 text-lg font-semibold text-charcoal">
        {membership ? t.joinSuccess : t.success}
      </div>
    )
  }

  return (
    <form action={action} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="form" value={variant} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -z-10 size-0 overflow-hidden opacity-0">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2">
        <Field id={id('name')} label={t.name} required error={err('name')}>
          <input id={id('name')} name="name" required autoComplete="name" className={input} {...a11y('name')} />
        </Field>
      </div>
      <Field id={id('company')} label={t.company} required={membership} optional={optional} error={err('company')}>
        <input id={id('company')} name="company" required={membership} autoComplete="organization" className={input} {...a11y('company')} />
      </Field>
      <Field id={id('sector')} label={t.sector} required={membership} optional={optional} error={err('sector')}>
        <input id={id('sector')} name="sector" required={membership} className={input} {...a11y('sector')} />
      </Field>
      <Field id={id('phone')} label={t.phone} required={membership} optional={optional} error={err('phone')}>
        <input id={id('phone')} name="phone" type="tel" required={membership} autoComplete="tel" dir="ltr" className={`${input} rtl:text-end`} {...a11y('phone')} />
      </Field>
      <Field id={id('email')} label={t.email} required error={err('email')}>
        <input id={id('email')} name="email" type="email" required autoComplete="email" dir="ltr" className={`${input} rtl:text-end`} {...a11y('email')} />
      </Field>
      {!membership && (
        <>
          <div className="sm:col-span-2">
            <Field id={id('subject')} label={t.subject}>
              <select id={id('subject')} name="subject" className={input} defaultValue="membership">
                {Object.entries(t.subjects).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id={id('message')} label={t.message} required error={err('message')}>
              <textarea id={id('message')} name="message" rows={6} required className={`${input} resize-y`} {...a11y('message')} />
            </Field>
          </div>
        </>
      )}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={pending} arrow={!pending}>
          {pending ? t.sending : submitLabel || t.send}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-red-700">
          {state.status === 'error' && !state.errors ? t.error : ''}
        </p>
      </div>
    </form>
  )
}
