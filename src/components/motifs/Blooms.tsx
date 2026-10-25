/** Two soft green blooms in opposite corners that breathe slowly (decorative, CSS only). */
export function Blooms({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <span className="animate-breathe absolute -start-[12%] top-[10%] size-[42vmax] rounded-full bg-[radial-gradient(circle,rgb(144_190_65/0.45),transparent_65%)]" />
      <span className="animate-breathe absolute -end-[14%] bottom-[-20%] size-[46vmax] rounded-full bg-[radial-gradient(circle,rgb(144_190_65/0.4),transparent_65%)] [animation-delay:-6s]" />
    </div>
  )
}
