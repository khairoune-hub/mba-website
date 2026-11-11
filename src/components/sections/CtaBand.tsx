import type { ReactNode } from 'react'
import { Eyebrow } from '../ui/SectionHeader'
import { MailIcon, PhoneIcon } from '../ui/icons'

/** Membership section (`id="adhesion"`): intro and contact details on green, the form on a white card. */
export function CtaBand({ eyebrow, title, body, phone, email, children }: { eyebrow: string; title: string; body: string; phone: string; email: string; children: ReactNode }) {
  return (
    <section id="adhesion" className="on-dark scroll-mt-20 bg-green text-white" aria-labelledby="cta-title">
      <div className="container-mba section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h2 id="cta-title" className="t-h2 mt-3 !text-white">
            {title}
          </h2>
          <p className="t-lead mt-5 !text-white/90">{body}</p>
          <ul className="mt-10 space-y-4 text-white">
            <li>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-3 font-semibold hover:underline" dir="ltr">
                <PhoneIcon className="size-5" />
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-3 font-semibold hover:underline" dir="ltr">
                <MailIcon className="size-5" />
                {email}
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-6 text-ink shadow-[var(--shadow-lift)] sm:p-10 lg:col-span-7">{children}</div>
      </div>
    </section>
  )
}
