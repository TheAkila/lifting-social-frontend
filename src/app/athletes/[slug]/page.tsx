'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaMedal, 
  FaInstagram, 
  FaFacebook, 
  FaDumbbell,
  FaCalendar,
  FaStar,
  FaChartLine
} from 'react-icons/fa'
import api from '@/lib/api'

interface Athlete {
  _id: string
  name: string
  slug: string
  bio: string
  image: string
  category: string
  gender: string
  snatch: number
  cleanAndJerk: number
  total: number
  achievements: string
  goldMedals: number
  silverMedals: number
  bronzeMedals: number
  featured: boolean
  instagram?: string
  facebook?: string
  createdAt?: string
}

export default function AthleteProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAthlete = async () => {
      try {
        const res = await api.get(`/athletes/${params.slug}`)
        setAthlete(res.data)
        setLoading(false)
      } catch (err: any) {
        console.error('Failed to load athlete', err)
        setError(err.response?.data?.message || 'Athlete not found')
        setLoading(false)
      }
    }

    if (params.slug) {
      loadAthlete()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark pt-28 pb-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-accent border-t-transparent mx-auto mb-4" />
            <p className="text-brand-light/70">Loading athlete profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-brand-dark pt-28 pb-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <FaTrophy className="text-brand-light/30 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-light mb-2">Athlete Not Found</h2>
            <p className="text-brand-light/70 mb-6">{error}</p>
            <Link href="/athletes" className="btn-primary inline-block">
              Back to Athletes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalMedals = athlete.goldMedals + athlete.silverMedals + athlete.bronzeMedals

  return (
    <div className="min-h-screen bg-brand-dark pt-28 pb-12">
      <div className="container-custom">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            href="/athletes" 
            className="inline-flex items-center space-x-2 text-brand-light hover:text-brand-accent transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Athletes</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card sticky top-24">
              {/* Featured Badge */}
              {athlete.featured && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <FaStar />
                  <span>FEATURED</span>
                </div>
              )}

              {/* Profile Image */}
              <div className="relative h-80 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                {athlete.image ? (
                  <img 
                    src={athlete.image} 
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaTrophy className="text-white/30 text-8xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
              </div>

              {/* Name and Category */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-display font-bold text-brand-light mb-2">
                  {athlete.name}
                </h1>
                <div className="flex items-center justify-center space-x-2">
                  <span className="px-4 py-1 bg-brand-accent text-brand-dark text-sm font-bold rounded-full">
                    {athlete.category}
                  </span>
                  <span className="px-4 py-1 bg-brand-secondary text-brand-light text-sm font-bold rounded-full">
                    {athlete.gender}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-brand-light/5 rounded-lg">
                  <span className="text-brand-light/70">Snatch PR</span>
                  <span className="text-brand-accent font-bold text-xl">{athlete.snatch}kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-brand-light/5 rounded-lg">
                  <span className="text-brand-light/70">Clean & Jerk PR</span>
                  <span className="text-brand-accent font-bold text-xl">{athlete.cleanAndJerk}kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-brand-primary/20 rounded-lg border border-brand-primary">
                  <span className="text-brand-light/70">Total</span>
                  <span className="text-brand-primary font-bold text-2xl">{athlete.total}kg</span>
                </div>
              </div>

              {/* Medals Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-brand-light mb-3 flex items-center space-x-2">
                  <FaMedal className="text-brand-accent" />
                  <span>Medals</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-2">
                      <span className="text-brand-dark text-xl font-bold">{athlete.goldMedals}</span>
                    </div>
                    <span className="text-xs text-brand-light/70">Gold</span>
                  </div>
                  <div className="text-center p-3 bg-gray-400/10 rounded-lg border border-gray-400/30">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center mx-auto mb-2">
                      <span className="text-brand-dark text-xl font-bold">{athlete.silverMedals}</span>
                    </div>
                    <span className="text-xs text-brand-light/70">Silver</span>
                  </div>
                  <div className="text-center p-3 bg-orange-600/10 rounded-lg border border-orange-600/30">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-xl font-bold">{athlete.bronzeMedals}</span>
                    </div>
                    <span className="text-xs text-brand-light/70">Bronze</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-brand-light/70 text-sm">Total Medals: </span>
                  <span className="text-brand-accent font-bold text-lg">{totalMedals}</span>
                </div>
              </div>

              {/* Social Media */}
              {(athlete.instagram || athlete.facebook) && (
                <div className="pt-6 border-t border-brand-light/10">
                  <h3 className="text-sm font-bold text-brand-light/70 mb-3 text-center">
                    CONNECT
                  </h3>
                  <div className="flex items-center justify-center space-x-4">
                    {athlete.instagram && (
                      <a
                        href={`https://instagram.com/${athlete.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
                      >
                        <FaInstagram className="text-xl" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {athlete.facebook && (
                      <a
                        href={`https://facebook.com/${athlete.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                      >
                        <FaFacebook className="text-xl" />
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Bio Section */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-brand-light mb-4 flex items-center space-x-2">
                <FaDumbbell className="text-brand-accent" />
                <span>About</span>
              </h2>
              <p className="text-brand-light/80 leading-relaxed whitespace-pre-line">
                {athlete.bio || 'No biography available yet.'}
              </p>
            </div>

            {/* Achievements Section */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-brand-light mb-4 flex items-center space-x-2">
                <FaTrophy className="text-brand-accent" />
                <span>Major Achievements</span>
              </h2>
              <div className="space-y-3">
                {athlete.achievements ? (
                  athlete.achievements.split(',').map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-brand-light/5 rounded-lg hover:bg-brand-light/10 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center mt-1">
                        <FaTrophy className="text-brand-dark text-sm" />
                      </div>
                      <p className="text-brand-light flex-1">{achievement.trim()}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-brand-light/60 text-center py-8">
                    No achievements recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-brand-light mb-4 flex items-center space-x-2">
                <FaChartLine className="text-brand-accent" />
                <span>Performance Stats</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 rounded-lg border border-brand-accent/20">
                  <div className="text-center">
                    <FaDumbbell className="text-brand-accent text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold text-brand-accent mb-1">
                      {athlete.snatch}kg
                    </div>
                    <div className="text-sm text-brand-light/70">Snatch Personal Record</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/5 rounded-lg border border-brand-secondary/20">
                  <div className="text-center">
                    <FaDumbbell className="text-brand-secondary text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold text-brand-secondary mb-1">
                      {athlete.cleanAndJerk}kg
                    </div>
                    <div className="text-sm text-brand-light/70">Clean & Jerk PR</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-lg border border-brand-primary/20">
                  <div className="text-center">
                    <FaTrophy className="text-brand-primary text-3xl mx-auto mb-3" />
                    <div className="text-3xl font-bold text-brand-primary mb-1">
                      {athlete.total}kg
                    </div>
                    <div className="text-sm text-brand-light/70">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competition Record */}
            <div className="card">
              <h2 className="text-2xl font-display font-bold text-brand-light mb-4 flex items-center space-x-2">
                <FaMedal className="text-brand-accent" />
                <span>Competition Record</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-brand-light/5 rounded-lg text-center">
                  <div className="text-5xl font-bold text-brand-accent mb-2">
                    {totalMedals}
                  </div>
                  <div className="text-brand-light/70">Total Medals</div>
                </div>
                <div className="p-6 bg-brand-light/5 rounded-lg text-center">
                  <div className="text-5xl font-bold text-brand-primary mb-2">
                    {athlete.category}
                  </div>
                  <div className="text-brand-light/70">Weight Category</div>
                </div>
              </div>
              
              {/* Medal Breakdown */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-4xl font-bold text-yellow-500 mb-1">
                    {athlete.goldMedals}
                  </div>
                  <div className="text-sm text-brand-light/70">Gold Medals</div>
                </div>
                <div className="text-center p-4 bg-gray-400/10 rounded-lg">
                  <div className="text-4xl font-bold text-gray-400 mb-1">
                    {athlete.silverMedals}
                  </div>
                  <div className="text-sm text-brand-light/70">Silver Medals</div>
                </div>
                <div className="text-center p-4 bg-orange-600/10 rounded-lg">
                  <div className="text-4xl font-bold text-orange-600 mb-1">
                    {athlete.bronzeMedals}
                  </div>
                  <div className="text-sm text-brand-light/70">Bronze Medals</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="card bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border-brand-accent/30">
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-brand-light mb-2">
                  Inspired by {athlete.name.split(' ')[0]}?
                </h3>
                <p className="text-brand-light/80 mb-6">
                  Start your own weightlifting journey with expert coaching and training programs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link href="/coaching" className="btn-primary">
                    Find a Coach
                  </Link>
                  <Link href="/events" className="btn-outline">
                    View Events
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
