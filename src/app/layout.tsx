import type { Metadata, Viewport } from 'next'
import { Anton, Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

// Controls the mobile browser chrome color (Android Chrome + iOS Safari ≥15)
export const viewport: Viewport = {
  themeColor: '#060c09',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // fills notch/dynamic island area on iOS
}

export const metadata: Metadata = {
  title: 'SULALEGENDS',
  description: 'Draft de Lendas da Copa Libertadores da América',
  // iOS standalone (Add to Home Screen) status-bar style
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: 'Barlow, sans-serif',
          color: '#eafff0',
          margin: 0,
          // Body background matches the landing page darkest shade so
          // overscroll / pull-to-refresh shows the same dark green
          background: '#060c09',
        }}
        className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
