import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Media Support',
  description: 'Book media support for sports photography and live event coverage built for weightlifting.',
}

export default function SportsMediaLayout({ children }: { children: React.ReactNode }) {
  return children
}