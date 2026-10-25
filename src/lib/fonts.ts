import localFont from 'next/font/local'
import { Fahkwang, Inter } from 'next/font/google'

/** TheMixArab (self-hosted). Regular for body, Bold for headings, Black for display. */
export const themix = localFont({
  src: [
    { path: '../fonts/TheMixArab-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/TheMixArab-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/TheMixArab-Black.woff2', weight: '900', style: 'normal' },
  ],
  // Preloading all weights on every page costs mobile LCP; the browser fetches what each page uses.
  preload: false,
  variable: '--font-themix',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
})

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const fahkwang = Fahkwang({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fahkwang',
  display: 'swap',
  preload: false,
})
