import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { getSettings, localizeSettings, sanitizeHex, darken, contrastText } from '@/lib/settings'
import { getLocale } from '@/lib/i18n-server'
import './globals.css'

const display = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const body = Inter({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const settings = await getSettings()
  const l = localizeSettings(settings, locale)
  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    title: {
      default: l.shopName,
      template: `%s · ${l.shopName}`,
    },
    description: l.tagline,
    openGraph: {
      title: l.shopName,
      description: l.tagline,
      type: 'website',
      images: ['/logo.jpg'],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FBF7F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const settings = await getSettings()
  const l = localizeSettings(settings, locale)

  const primary = sanitizeHex(l.themePrimary, '#D91E1E')
  const accent = sanitizeHex(l.themeAccent, '#C89632')
  const primaryHover = darken(primary, 0.14)
  const primaryFg = contrastText(primary)
  const accentFg = contrastText(accent)

  const themeCss = `:root{--primary:${primary};--primary-hover:${primaryHover};--primary-foreground:${primaryFg};--accent:${accent};--accent-foreground:${accentFg};--ring:${primary};}`

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}
