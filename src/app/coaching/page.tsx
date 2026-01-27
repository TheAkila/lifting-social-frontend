'use client'

import { Suspense } from 'react'
import CoachingHeader from '@/components/coaching/CoachingHeader'
import CoachesGrid from '@/components/coaching/CoachesGrid'

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Suspense fallback={
        <div className="container-custom section-padding">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-[3/4]" />
              ))}
            </div>
          </div>
        </div>
      }>
        <CoachingHeader />
        <div className="container mx-auto px-4 py-12">
          <CoachesGrid />
        </div>
      </Suspense>
    </div>
  )
}
