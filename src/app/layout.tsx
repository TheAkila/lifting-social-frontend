import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans, Outfit } from 'next/font/google'
import './globals.css'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${ibmPlexSans.variable}`}>
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
