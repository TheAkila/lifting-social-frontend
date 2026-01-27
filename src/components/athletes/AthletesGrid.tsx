'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Instagram, Facebook } from 'lucide-react'
import { Athlete } from '@/types'

interface AthletesGridProps {
  athletes: Athlete[]
}

export default function AthletesGrid({ athletes }: AthletesGridProps) {
  if (athletes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">No athletes found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {athletes.map((athlete) => (
        <Link
          key={athlete.id}
          href={`/athletes/${athlete.slug}`}
          className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Image */}
          <div className="relative w-full overflow-hidden bg-zinc-100" style={{ paddingBottom: '133.33%' }}>
            {athlete.image ? (
              <Image
                src={athlete.image}
                alt={athlete.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                <Trophy className="w-16 h-16 text-zinc-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {athlete.name}
            </h3>

            {/* Category */}
            {athlete.category && (
              <p className="text-sm text-zinc-500 mb-3">{athlete.category}</p>
            )}

            {/* Stats */}
            {athlete.snatch && athlete.clean_and_jerk && (
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Snatch:</span>
                  <span className="font-medium text-zinc-900">{athlete.snatch}kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Clean & Jerk:</span>
                  <span className="font-medium text-zinc-900">{athlete.clean_and_jerk}kg</span>
                </div>
                <div className="flex justify-between text-sm border-t border-zinc-200 pt-1 mt-2">
                  <span className="text-zinc-600 font-medium">Total:</span>
                  <span className="font-semibold text-zinc-900">
                    {athlete.snatch + athlete.clean_and_jerk}kg
                  </span>
                </div>
              </div>
            )}

            {/* Medals */}
            {(athlete.gold_medals || athlete.silver_medals || athlete.bronze_medals) && (
              <div className="flex gap-3 mb-4 pb-4 border-b border-zinc-200">
                {athlete.gold_medals && athlete.gold_medals > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-zinc-700">{athlete.gold_medals}</span>
                  </div>
                )}
                {athlete.silver_medals && athlete.silver_medals > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <div className="w-5 h-5 rounded-full bg-zinc-400 flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-zinc-700">{athlete.silver_medals}</span>
                  </div>
                )}
                {athlete.bronze_medals && athlete.bronze_medals > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <div className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-zinc-700">{athlete.bronze_medals}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {(athlete.instagram || athlete.facebook) && (
              <div className="flex gap-3 mb-4">
                {athlete.instagram && (
                  <a
                    href={athlete.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-400 hover:text-pink-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {athlete.facebook && (
                  <a
                    href={athlete.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-400 hover:text-blue-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            {/* View Profile Link */}
            <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
              VIEW PROFILE →
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
