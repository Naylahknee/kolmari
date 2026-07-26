import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import './sidebar-scroll.css'
import { absoluteUrl, getSiteUrl } from '@/lib/site'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair', subsets: ['latin'], weight: ['600', '700', '800'], style: ['normal', 'italic'],
})

const title = 'Nexit | Build your Nexit Plan'
const description = 'Compare Nextinations, review Pathways, build your budget, and turn relocation research into a practical Nexit Plan.'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'Nexit',
  title,
  description,
  icons: {
    icon: [
      { url: '/brand/faviconNexit.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/brand/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/brand/favicon.ico' },
    ],
    apple: [
      { url: '/brand/app-icon-180.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: absoluteUrl('/og.png'), width: 1536, height: 1024, alt: 'Nexit — Build your Nexit Plan' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl('/og.png')] },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
