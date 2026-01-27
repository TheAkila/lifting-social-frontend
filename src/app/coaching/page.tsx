import CoachingHeader from '@/components/coaching/CoachingHeader'
import CoachesGrid from '@/components/coaching/CoachesGrid'

export const metadata = {
  title: 'Coaching | Lifting Social',
  description: 'Find experienced Olympic weightlifting coaches in Sri Lanka. Professional training and personalized programs.',
}

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-white">
      <CoachingHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CoachesGrid />
      </div>
    </div>
  )
}
