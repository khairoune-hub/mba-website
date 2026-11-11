import { MbaMark } from '../brand/MbaMark'

/** Used when a post or event has no cover image. */
export function CardPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-mist">
      <MbaMark className="h-12 w-auto opacity-80" />
    </div>
  )
}
