import { MbaMark } from '../brand/MbaMark'
import { PatternField } from '../motifs/PatternField'

/** Used when a post or event has no cover image. */
export function CardPlaceholder() {
  return (
    <div className="bg-radial-field absolute inset-0 flex items-center justify-center">
      <PatternField opacity={0.05} />
      <MbaMark className="relative h-14 w-auto opacity-90" />
    </div>
  )
}
