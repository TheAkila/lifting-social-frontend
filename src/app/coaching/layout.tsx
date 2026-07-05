import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Coaching',
  description: 'Get coaching from certified Olympic weightlifting coaches who have produced national champions.',
}

export default function CoachingLayout({ children }: { children: React.ReactNode }) {
  return children
}