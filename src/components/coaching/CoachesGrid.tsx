'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Mail, Phone, Award } from 'lucide-react'
import { getCoaches } from '@/lib/api'

interface Coach {
  id: string
  name: string
  slug: string
  title: string
  bio: string
  specializations: string[]
  certifications: string[]
  experience: number
  availability: string
  email: string
  phone: string
  image?: string
  featured: boolean
  champions_count: number
}

export default function CoachesGrid() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCoaches() {
      try {
        setLoading(true)
        const data = await getCoaches()
        setCoaches(data)
      } catch (error) {
        console.error('Error fetching coaches:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCoaches()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">Loading coaches...</p>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">No coaches available at the moment</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Image */}
          <div className="relative w-full overflow-hidden bg-zinc-100" style={{ paddingBottom: '133.33%' }}>
            {coach.image ? (
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                <Trophy className="w-16 h-16 text-zinc-400" />
              </div>
            )}
            {coach.featured && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-zinc-900 text-xs font-medium px-3 py-1 rounded-full">
                FEATURED
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-zinc-900 mb-1">
              {coach.name}
            </h3>
            <p className="text-sm text-indigo-600 font-medium mb-3">{coach.title}</p>
            
            <p className="text-sm text-zinc-600 mb-4 line-clamp-3">{coach.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-zinc-600">
                  <span className="font-semibold text-zinc-900">{coach.champions_count}</span> Champions
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-zinc-600">
                  <span className="font-semibold text-zinc-900">{coach.experience}</span> Years
                </span>
              </div>
            </div>

            {/* Specializations */}
            {coach.specializations && coach.specializations.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {coach.specializations.slice(0, 3).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex gap-2">
              <a
                href={`mailto:${coach.email}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`tel:${coach.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded text-sm font-medium hover:bg-zinc-200 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>

            {/* Availability */}
            <div className="mt-4 text-xs text-zinc-500 text-center">
              {coach.availability}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
