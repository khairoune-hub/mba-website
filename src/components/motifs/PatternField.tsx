import { PATH_A, PATH_M, PATH_SUMMIT } from '../brand/mark-paths'

/** Faint repeating outline of the mark (brochure / badge background). */
export function PatternField({ className = '', opacity = 0.07 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      <defs>
        <pattern id="mba-pattern" width="150" height="130" patternUnits="userSpaceOnUse" patternTransform="translate(10 10)">
          <g transform="scale(0.12)" fill="none" stroke="var(--color-charcoal)" strokeOpacity={opacity * 6} strokeWidth="10">
            <path d={PATH_M} />
            <path d={PATH_A} />
            <path d={PATH_SUMMIT} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mba-pattern)" opacity={opacity * 8} />
    </svg>
  )
}
