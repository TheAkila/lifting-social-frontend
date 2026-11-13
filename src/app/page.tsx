import Hero from '@/components/home/Hero'
import MissionSection from '@/components/home/MissionSection'
import LiveNowSection from '@/components/home/LiveNowSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import NationalsFeatureSection from '@/components/home/NationalsFeatureSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <MissionSection />
      <LiveNowSection />
      <FeaturedProducts />
      <NationalsFeatureSection />
    </div>
  )
}
