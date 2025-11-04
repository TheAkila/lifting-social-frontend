import AthletesHeader from '@/components/athletes/AthletesHeader'
import AthletesGrid from '@/components/athletes/AthletesGrid'
import AthletesFilters from '@/components/athletes/AthletesFilters'

export const metadata = {
  title: 'Athletes | Lifting Social',
  description: 'Meet the champions of Sri Lankan Olympic weightlifting. Discover their stories, achievements, and records.',
}

export default function AthletesPage() {
  return (
    <div className="min-h-screen pt-20">
      <AthletesHeader />
      <div className="container-custom section-padding">
        <AthletesFilters />
        <AthletesGrid />
      </div>
    </div>
  )
}
