import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Events',
  description: 'Join fitness events, competitions, training camps, and seminars across Sri Lanka.',
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}