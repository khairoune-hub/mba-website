'use client'

import { useState } from 'react'
import { LinkIcon, SocialIcon } from './icons'

export function ShareButtons({ url, title, labels }: { url: string; title: string; labels: { share: string; copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { name: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'x', href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { name: 'whatsapp', href: `https://wa.me/?text=${t}%20${u}` },
  ]
  const btn = 'inline-flex size-10 items-center justify-center rounded-full text-charcoal ring-1 ring-inset ring-border transition hover:bg-green hover:ring-green'
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-charcoal">{labels.share}</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
          <SocialIcon name={l.name} className="size-4" />
          <span className="sr-only">{l.name}</span>
        </a>
      ))}
      <button
        type="button"
        className={btn}
        onClick={async () => {
          await navigator.clipboard?.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
      >
        <LinkIcon className="size-4" />
        <span className="sr-only">{labels.copy}</span>
      </button>
      <span role="status" className="text-sm text-green-ink">{copied ? labels.copied : ''}</span>
    </div>
  )
}
