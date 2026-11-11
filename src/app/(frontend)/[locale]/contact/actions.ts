'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { isLocale } from '@/i18n/config'

export type ErrorCode = 'required' | 'invalidEmail' | 'invalidPhone'
export type ContactState = { status: 'idle' | 'success' | 'error'; errors?: Partial<Record<string, ErrorCode>> }

const opt = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))
const phone = z.string().trim().regex(/^\+?[\d\s().-]{6,25}$/)

const base = {
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  locale: z.string(),
}

/** Membership request (home page): the five fields asked for by the alliance, all required. */
const membership = z.object({
  ...base,
  form: z.literal('membership'),
  company: z.string().trim().min(2).max(160),
  sector: z.string().trim().min(2).max(160),
  phone,
})

/** General contact (contact page): message required, the rest optional. */
const contact = z.object({
  ...base,
  form: z.literal('contact'),
  company: opt(160),
  sector: opt(160),
  phone: phone.optional().or(z.literal('')),
  subject: z.enum(['membership', 'partnership', 'press', 'other']).default('other'),
  message: z.string().trim().min(10).max(5000),
})

const schema = z.discriminatedUnion('form', [membership, contact])

// Simple in-memory rate limit: 5 submissions / 10 minutes per IP (per instance).
const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (form.get('website')) return { status: 'success' }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return { status: 'error' }

  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) {
    const errors: Partial<Record<string, ErrorCode>> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      const empty = !String(form.get(key) ?? '').trim()
      errors[key] = empty ? 'required' : key === 'email' ? 'invalidEmail' : key === 'phone' ? 'invalidPhone' : 'required'
    }
    return { status: 'error', errors }
  }
  const data = parsed.data
  const locale = isLocale(data.locale) ? data.locale : 'ar'
  const subject = data.form === 'membership' ? 'membership' : data.subject
  const message = data.form === 'contact' ? data.message : undefined

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        sector: data.sector || undefined,
        subject,
        message,
        locale,
      },
      overrideAccess: true,
    })

    const settings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
    const to = process.env.CONTACT_RECIPIENT || settings?.contactRecipient
    if (to) {
      try {
        const title = subject === 'membership' ? 'Demande d’adhésion / طلب انضمام' : 'Nouveau message / رسالة جديدة'
        await payload.sendEmail({
          to,
          replyTo: data.email,
          subject: `[MBA] ${subject} — ${data.name}`,
          html: `<h2>${title}</h2>
            <p><b>Nom:</b> ${esc(data.name)}<br/><b>Entreprise:</b> ${esc(data.company || '—')}<br/><b>Domaine d’activité:</b> ${esc(data.sector || '—')}<br/><b>Tél:</b> ${esc(data.phone || '—')}<br/><b>Email:</b> ${esc(data.email)}<br/><b>Objet:</b> ${esc(subject)}<br/><b>Langue:</b> ${locale}</p>
            ${message ? `<p style="white-space:pre-wrap">${esc(message)}</p>` : ''}`,
        })
        await payload.update({ collection: 'contact-submissions', id: doc.id, data: { emailed: true }, overrideAccess: true })
      } catch (err) {
        payload.logger.error({ err }, 'contact email failed')
      }
    }
    return { status: 'success' }
  } catch (err) {
    console.error('[contact]', (err as Error).message)
    return { status: 'error' }
  }
}
