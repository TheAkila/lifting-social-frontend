import StoriesHeader from '@/components/stories/StoriesHeader'
import StoriesGrid from '@/components/stories/StoriesGrid'
import StoriesCategories from '@/components/stories/StoriesCategories'

export const metadata = {
  title: 'Lifting Stories | Lifting Social',
  description: 'Inspiring stories from Sri Lankan Olympic weightlifting athletes, training tips, and event coverage.',
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen pt-20">
      <StoriesHeader />
      <div className="container-custom section-padding">
        <StoriesCategories />
        <StoriesGrid />
      </div>
    </div>
  )
}
