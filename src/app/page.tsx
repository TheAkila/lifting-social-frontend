import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import AthleteHighlights from '@/components/home/AthleteHighlights'
import CTASections from '@/components/home/CTASections'
import StatsSection from '@/components/home/StatsSection'
import LatestStories from '@/components/home/LatestStories'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <AthleteHighlights />
      <StatsSection />
      <LatestStories />
      <CTASections />
    </>
  )
}
