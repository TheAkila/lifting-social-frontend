import Hero from '@/components/home/Hero'
import LiveNowSection from '@/components/home/LiveNowSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import LatestStories from '@/components/home/LatestStories'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <LiveNowSection />
      <FeaturedProducts />
      <LatestStories />
    </div>
  )
}
