import CoachingHeader from '@/components/coaching/CoachingHeader'
import CoachesGrid from '@/components/coaching/CoachesGrid'

export const metadata = {
  title: 'Coaching | Lifting Social',
  description: 'Find experienced Olympic weightlifting coaches in Sri Lanka. Professional training and personalized programs.',
}

export default function CoachingPage() {
  return (
    <div className="min-h-screen pt-20">
      <CoachingHeader />
      <div className="container-custom section-padding">
        <CoachesGrid />
      </div>
    </div>
  )
}
