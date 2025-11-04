'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaTrophy, FaInstagram, FaFacebook } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function AthletesGrid() {
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/athletes')
      .then((res) => {
        if (!mounted) return
        setAthletes(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch athletes', err)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-light/70">Loading athletes...</p>
      </div>
    )
  }

  if (athletes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-light/70">No athletes found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {athletes.map((athlete, index) => (
        <motion.div
          key={athlete._id || athlete.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/athletes/${athlete.slug}`}>
            <div className="card group cursor-pointer hover:scale-105 transition-all">
              {/* Featured Badge */}
              {athlete.featured && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ FEATURED
                </div>
              )}

              {/* Athlete Image */}
              <div className="relative h-80 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                {athlete.image ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${athlete.image})` }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaTrophy className="text-white/30 text-8xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-brand-accent text-brand-dark text-sm font-bold rounded-full">
                    {athlete.category}
                  </span>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-2 text-brand-accent mb-2">
                    <FaTrophy />
                    <span className="text-sm font-semibold">{athlete.achievements}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">
                    {athlete.name}
                  </h3>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-brand-accent font-bold text-lg">{athlete.snatch}kg</div>
                  <div className="text-xs text-brand-light/60">Snatch</div>
                </div>
                <div className="text-center">
                  <div className="text-brand-accent font-bold text-lg">{athlete.cleanAndJerk}kg</div>
                  <div className="text-xs text-brand-light/60">C&J</div>
                </div>
                <div className="text-center">
                  <div className="text-brand-primary font-bold text-lg">{athlete.total}kg</div>
                  <div className="text-xs text-brand-light/60">Total</div>
                </div>
              </div>

              {/* Medals */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-brand-dark text-xs font-bold">{athlete.medals?.gold || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-brand-dark text-xs font-bold">{athlete.medals?.silver || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{athlete.medals?.bronze || 0}</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center justify-center space-x-3">
                {athlete.socialMedia?.instagram && (
                  <a
                    href={`https://instagram.com/${athlete.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-light hover:text-brand-accent transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram className="text-2xl" />
                  </a>
                )}
                {athlete.socialMedia?.facebook && (
                  <a
                    href={`https://facebook.com/${athlete.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-light hover:text-brand-accent transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaFacebook className="text-2xl" />
                  </a>
                )}
              </div>

              {/* View Profile Button */}
              <button className="w-full mt-4 btn-outline text-center">
                View Full Profile
              </button>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
