import localFont from 'next/font/local'
import { Fahkwang, Inter } from 'next/font/google'

/**
 * TheMixArab (self-hosted). Regular for body, Bold for headings, Black for display.
 * The WOFF2 files are rebuilt by scripts/build-fonts.py (the supplied TTFs have no GSUB and Bold is rejected by browsers as-is).
 */
export const themix = localFont({
  src: [
    { path: '../fonts/TheMixArab-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/TheMixArab-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/TheMixArab-Black.woff2', weight: '900', style: 'normal' },
  ],
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
