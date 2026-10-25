import { MbaMark } from '../brand/MbaMark'
import { Hairlines } from '../motifs/Hairlines'
import { ButtonLink } from '../ui/Button'
import { MailIcon, PhoneIcon } from '../ui/icons'
import { Reveal } from '../ui/Reveal'

/** Green closing band with the on-green mark and contact details. */
export function CtaBand({ title, body, buttonLabel, buttonHref, phone, email }: { title: string; body: string; buttonLabel: string; buttonHref: string; phone: string; email: string }) {
  return (
    <section className="container-mba pb-[var(--section-y)]" aria-labelledby="cta-title">
      <div className="bg-green-band relative isolate overflow-hidden rounded-[var(--radius-lg)] px-6 py-14 text-navy sm:px-12 md:py-20">
        <Hairlines preset="band" tone="white" />
        <MbaMark variant="onGreen" className="pointer-events-none absolute -bottom-6 end-[-2%] h-[70%] w-auto opacity-25" />
        <Reveal className="relative max-w-2xl">
          <h2 id="cta-title" className="t-h2 !text-navy">
            {title}
          </h2>
          <p className="t-lead mt-5 !text-navy/90">{body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={buttonHref} variant="navy" arrow>
              {buttonLabel}
            </ButtonLink>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 font-semibold hover:underline" dir="ltr">
              <PhoneIcon className="size-5" />
              {phone}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 font-semibold hover:underline" dir="ltr">
              <MailIcon className="size-5" />
              {email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
