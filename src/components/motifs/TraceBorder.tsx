/** A green hairline that draws around its (group) parent on hover. Parent needs `group relative`. */
export function TraceBorder({ radius = 28 }: { radius?: number }) {
  return (
    <svg aria-hidden="true" className="trace-border pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
      <rect x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx={radius} ry={radius} fill="none" stroke="var(--color-green)" strokeWidth="1.5" pathLength={1} />
    </svg>
  )
}
