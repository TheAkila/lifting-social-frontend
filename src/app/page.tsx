import Hero from '@/components/home/Hero'
import LiveNowSection from '@/components/home/LiveNowSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <LiveNowSection />
      <FeaturedProducts />
    </div>
  )
}
