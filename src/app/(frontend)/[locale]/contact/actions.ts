'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { isLocale } from '@/i18n/config'

export type ContactState = { status: 'idle' | 'success' | 'error'; errors?: Partial<Record<string, string>> }

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  subject: z.enum(['membership', 'partnership', 'press', 'other']).default('other'),
  message: z.string().trim().min(10).max(5000),
  locale: z.string(),
})

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
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] = issue.path[0] === 'email' ? 'invalidEmail' : 'required'
    return { status: 'error', errors }
  }
  const data = parsed.data
  const locale = isLocale(data.locale) ? data.locale : 'ar'

  try {
    const payload = await getPayloadClient()
    const doc = await payload.create({
      collection: 'contact-submissions',
      data: { name: data.name, email: data.email, phone: data.phone || undefined, company: data.company || undefined, subject: data.subject, message: data.message, locale },
      overrideAccess: true,
    })

    const settings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null)
    const to = process.env.CONTACT_RECIPIENT || settings?.contactRecipient
    if (to) {
      try {
        await payload.sendEmail({
          to,
          replyTo: data.email,
          subject: `[MBA] ${data.subject} — ${data.name}`,
          html: `<h2>Nouveau message / رسالة جديدة</h2>
            <p><b>Nom:</b> ${esc(data.name)}<br/><b>Email:</b> ${esc(data.email)}<br/><b>Tél:</b> ${esc(data.phone || '—')}<br/><b>Entreprise:</b> ${esc(data.company || '—')}<br/><b>Objet:</b> ${esc(data.subject)}<br/><b>Langue:</b> ${locale}</p>
            <p style="white-space:pre-wrap">${esc(data.message)}</p>`,
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
