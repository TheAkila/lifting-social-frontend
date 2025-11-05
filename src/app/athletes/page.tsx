'use client'

import { useState } from 'react'
import AthletesHeader from '@/components/athletes/AthletesHeader'
import AthletesGrid from '@/components/athletes/AthletesGrid'
import AthletesFilters from '@/components/athletes/AthletesFilters'

export default function AthletesPage() {
  const [filters, setFilters] = useState({
    category: 'All',
    gender: 'All',
    searchQuery: '',
  })

  return (
    <div className="min-h-screen pt-20">
      <AthletesHeader />
      <div className="container-custom section-padding">
        <AthletesFilters filters={filters} setFilters={setFilters} />
        <AthletesGrid filters={filters} />
      </div>
    </div>
  )
}
