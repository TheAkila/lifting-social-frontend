'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaTrophy, FaInstagram, FaFacebook } from 'react-icons/fa'

const athletes = [
  {
    id: '1',
    slug: 'dilanka-isuru',
    name: 'Dilanka Isuru',
    category: '73kg',
    gender: 'Male',
    snatch: 145,
    cleanAndJerk: 175,
    total: 320,
    achievements: 'National Champion 2024',
    medals: { gold: 5, silver: 3, bronze: 2 },
    image: '/images/athletes/dilanka.jpg',
    featured: true,
    socialMedia: {
      instagram: '@dilanka_lifts',
      facebook: 'dilanka.isuru',
    },
  },
  {
    id: '2',
    slug: 'chamodi-dilrukshi',
    name: 'Chamodi Dilrukshi',
    category: '64kg',
    gender: 'Female',
    snatch: 85,
    cleanAndJerk: 110,
    total: 195,
    achievements: 'South Asian Games Silver Medalist',
    medals: { gold: 3, silver: 5, bronze: 1 },
    image: '/images/athletes/chamodi.jpg',
    featured: true,
    socialMedia: {
      instagram: '@chamodi_lifts',
    },
  },
  {
    id: '3',
    slug: 'kasun-rajitha',
    name: 'Kasun Rajitha',
    category: '81kg',
    gender: 'Male',
    snatch: 155,
    cleanAndJerk: 190,
    total: 345,
    achievements: 'Commonwealth Games Qualifier',
    medals: { gold: 7, silver: 2, bronze: 3 },
    image: '/images/athletes/kasun.jpg',
    featured: false,
    socialMedia: {
      instagram: '@kasun_rajitha',
      facebook: 'kasun.rajitha',
    },
  },
  {
    id: '4',
    slug: 'sanduni-fernando',
    name: 'Sanduni Fernando',
    category: '55kg',
    gender: 'Female',
    snatch: 72,
    cleanAndJerk: 92,
    total: 164,
    achievements: 'National Record Holder',
    medals: { gold: 4, silver: 2, bronze: 1 },
    image: '/images/athletes/sanduni.jpg',
    featured: true,
    socialMedia: {
      instagram: '@sanduni_lifts',
    },
  },
  {
    id: '5',
    slug: 'nimal-silva',
    name: 'Nimal Silva',
    category: '89kg',
    gender: 'Male',
    snatch: 165,
    cleanAndJerk: 200,
    total: 365,
    achievements: 'Olympic Hopeful 2028',
    medals: { gold: 6, silver: 4, bronze: 2 },
    image: '/images/athletes/nimal.jpg',
    featured: false,
    socialMedia: {
      facebook: 'nimal.silva.lifts',
    },
  },
  {
    id: '6',
    slug: 'tharika-jayasinghe',
    name: 'Tharika Jayasinghe',
    category: '76kg',
    gender: 'Female',
    snatch: 95,
    cleanAndJerk: 120,
    total: 215,
    achievements: 'Asian Championship Participant',
    medals: { gold: 2, silver: 3, bronze: 4 },
    image: '/images/athletes/tharika.jpg',
    featured: false,
    socialMedia: {
      instagram: '@tharika_strong',
    },
  },
]

export default function AthletesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {athletes.map((athlete, index) => (
        <motion.div
          key={athlete.id}
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaTrophy className="text-white/30 text-8xl" />
                </div>
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
                    <span className="text-brand-dark text-xs font-bold">{athlete.medals.gold}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-brand-dark text-xs font-bold">{athlete.medals.silver}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{athlete.medals.bronze}</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center justify-center space-x-3">
                {athlete.socialMedia.instagram && (
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
                {athlete.socialMedia.facebook && (
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
