import { Tri } from './Tri'
import { TriDrop } from '../motion/TriDrop'

/**
 * A value word with the ▲ set into it, as in the brand book (الأمـ▲ـانة).
 * Arabic: the split sits on a tatweel so the letters stay joined. French: the triangle sits on the baseline between syllables.
 */
export function ValueWord({ before, after, title, className = '' }: { before: string; after: string; title: string; className?: string }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`} aria-label={title} role="text">
      <span aria-hidden="true">{before}</span>
      <TriDrop className="self-end">
        <Tri className="mx-[0.04em] size-[0.42em] translate-y-[-0.16em] [:lang(ar)_&]:translate-y-[-0.3em]" />
      </TriDrop>
      <span aria-hidden="true">{after}</span>
    </span>
  )
}
