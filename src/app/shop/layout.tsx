import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Gear for Champions',
  description: 'Shop premium gear for champions, plus apparel, accessories, and supplements nutrition.',
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}