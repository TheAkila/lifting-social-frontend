import type { Metadata } from 'next'
import { Inter, IBM_Plex_Sans, Outfit } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LiftBotChat from '@/components/Chatbot/LiftBotChat'
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
  title: 'Lifting Social | Sri Lankan Olympic Weightlifting Culture',
  description: 'A lifestyle brand fusing Olympic weightlifting culture, Sri Lankan athletic pride, and modern fitness fashion. Shop apparel, watch athlete stories, join the movement.',
  keywords: 'Olympic weightlifting, Sri Lanka, fitness apparel, athlete stories, weightlifting culture',
  authors: [{ name: 'Lifting Social' }],
  openGraph: {
    title: 'Lifting Social',
    description: 'Sri Lankan Olympic Weightlifting Lifestyle Brand',
    type: 'website',
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
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <LiftBotChat />
        </Providers>
      </body>
    </html>
  )
}
