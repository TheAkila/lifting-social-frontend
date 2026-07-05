import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Supplements / Nutrition',
  description: 'Shop supplements and nutrition built to fuel strength, recovery, and performance.',
}

export default function SupplementsLayout({ children }: { children: React.ReactNode }) {
  return children
}