'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa'
import api from '@/lib/api'

interface Coach {
  _id: string
  name: string
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
  championsCount: number
}

export default function CoachesGrid() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const response = await api.get('/coaches')
      setCoaches(response.data)
    } catch (error) {
      console.error('Error fetching coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-light/70">Loading coaches...</p>
      </div>
    )
  }

  if (coaches.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-brand-light/70">No coaches available at the moment.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-12">
        <p className="text-brand-light/70 text-lg">
          All our coaches are certified by the International Weightlifting Federation (IWF) and have proven track records in developing champions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coaches.map((coach, index) => (
          <motion.div
            key={coach._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card relative"
          >
            {coach.featured && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-brand-dark px-3 py-1 rounded-full text-xs font-bold">
                ⭐ FEATURED
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {coach.image ? (
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">
                      {coach.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-display font-bold mb-1">{coach.name}</h3>
                <p className="text-brand-accent font-semibold mb-2">{coach.title}</p>
                <p className="text-brand-light/70 mb-4">{coach.bio}</p>

                {coach.specializations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {coach.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-secondary/50 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 text-brand-accent">
                      <FaMedal />
                      <span className="text-sm font-semibold">{coach.championsCount} Champions</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-brand-light/70">
                      <FaCheckCircle />
                      <span className="text-sm">{coach.experience} years Experience</span>
                    </div>
                  </div>
                </div>

                {coach.certifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Certifications:</h4>
                    <div className="space-y-1">
                      {coach.certifications.map((cert, idx) => (
                        <div key={idx} className="text-xs text-brand-light/60">
                          • {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={`mailto:${coach.email}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-accent text-brand-dark rounded-lg hover:bg-brand-accent/90 transition-colors text-sm font-semibold"
                  >
                    <FaEnvelope />
                    <span>Email</span>
                  </a>
                  <a
                    href={`tel:${coach.phone}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-secondary rounded-lg hover:bg-brand-secondary/80 transition-colors text-sm font-semibold"
                  >
                    <FaPhone />
                    <span>Call</span>
                  </a>
                </div>

                <div className="mt-4 text-xs text-brand-light/50">
                  Available: {coach.availability}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card mt-12 text-center"
      >
        <h3 className="text-2xl font-display font-bold mb-4">
          Ready to Start Your Journey?
        </h3>
        <p className="text-brand-light/70 mb-6">
          Contact us to schedule a consultation with one of our expert coaches
        </p>
        <Link href="/contact" className="btn-primary inline-block">
          Get Started Today
        </Link>
      </motion.div>
    </div>
  )
}
