import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import LatestStories from '@/components/home/LatestStories'
import CTASections from '@/components/home/CTASections'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      <LatestStories />
      <CTASections />
    </div>
  )
}
