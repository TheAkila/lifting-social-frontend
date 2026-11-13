import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans, Outfit, Archivo } from 'next/font/google'
import './globals.css'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import TrustBar from '@/components/layout/TrustBar'
import Footer from '@/components/layout/Footer'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
})

// Used only for the announcement bar and main nav bar, matching the bold
// grotesk look of the reference site (store.weightliftinghouse.com), which
// uses proprietary uploaded fonts we can't license/reuse directly.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-nav',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Premium Gear for Champions',
  description:
    'Premium gear for champions with supplements and nutrition, coaching, media support, fitness events, and the Lifting Social story.',
  keywords: 'premium gear, supplements, nutrition, coaching, media support, fitness events, lifting social',
  authors: [{ name: 'Lifting Social' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Premium Gear for Champions',
    description: 'Shop premium gear, supplements, coaching, media support, and fitness events from Lifting Social.',
    type: 'website',
  },
  verification: {
    google: 'm-QE0gMGK93HzmOl922QcmXbEE6n0emfU7Aobf7ObHA',
    other: {
      'facebook-domain-verification': 'wnpakk8tt8mx2504ir3cx5wbx6feln',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${ibmPlexSans.variable} ${archivo.variable}`}>
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <TrustBar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
