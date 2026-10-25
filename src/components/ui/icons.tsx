type P = { className?: string }
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/** Points in the reading direction (→ in LTR, ← in RTL). */
export const ArrowIcon = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`flip-rtl ${className}`} aria-hidden="true" {...base}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)
/** Points against the reading direction (back). */
export const ArrowBackIcon = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`flip-rtl ${className}`} aria-hidden="true" {...base}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const ChevronIcon = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={`flip-rtl ${className}`} aria-hidden="true" {...base}>
    <path d="M9 5l7 7-7 7" />
  </svg>
)
export const MenuIcon = ({ className = 'size-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
export const CloseIcon = ({ className = 'size-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const CalendarIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)
export const ClockIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)
export const PinIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
export const PhoneIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />
  </svg>
)
export const MailIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
)
export const GlobeIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" />
  </svg>
)
export const LinkIcon = ({ className = 'size-5' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
)
const solid = { fill: 'currentColor' }
export const SocialIcon = ({ name, className = 'size-5' }: P & { name: string }) => {
  const paths: Record<string, string> = {
    linkedin: 'M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.7h.1c.4-.8 1.4-1.9 3.3-1.9 3.5 0 4.2 2.2 4.2 5.2V21h-3v-6.2c0-1.5 0-3.3-2-3.3s-2.4 1.6-2.4 3.2V21H9z',
    facebook: 'M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.4V21z',
    x: 'M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.5 4.7H5.7z',
    instagram: 'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7v7.2c-.1 2.4-1.3 3.6-3.7 3.7H8.4c-2.4-.1-3.6-1.3-3.7-3.7V8.4c.1-2.4 1.3-3.6 3.7-3.7zM12 3c-2.4 0-2.7 0-3.7.1C5 3.2 3.2 5 3.1 8.3v7.4C3.2 19 5 20.8 8.3 20.9h7.4c3.3-.1 5.1-1.9 5.2-5.2V8.3C20.8 5 19 3.2 15.7 3.1z',
    youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z',
    whatsapp: 'M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 16.4a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.8.7.8-2.7-.2-.3A7.4 7.4 0 1 1 12 19.4zm4-5.5c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1-.6.7-.7.9-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.6 2.6 0 0 0-.8 1.9 4.5 4.5 0 0 0 1 2.4 10.3 10.3 0 0 0 4 3.5c1.5.6 2 .7 2.8.6a2.3 2.3 0 0 0 1.5-1.1 1.9 1.9 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3z',
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...solid}>
      <path d={paths[name] ?? paths.linkedin} />
    </svg>
  )
}
