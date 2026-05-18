import CoachingHeader from '@/components/coaching/CoachingHeader'
import CoachesGrid from '@/components/coaching/CoachesGrid'

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-white">
      <CoachingHeader />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <CoachesGrid />
      </section>
    </main>
  )
}
