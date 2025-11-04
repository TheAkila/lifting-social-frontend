'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaTrophy } from 'react-icons/fa'

const athletes = [
  {
    id: '1',
    name: 'Dilanka Isuru',
    category: '73kg',
    achievements: 'National Champion 2024',
    image: '/images/athletes/athlete-1.jpg',
  },
  {
    id: '2',
    name: 'Chamodi Dilrukshi',
    category: '64kg',
    achievements: 'South Asian Games Medalist',
    image: '/images/athletes/athlete-2.jpg',
  },
  {
    id: '3',
    name: 'Kasun Rajitha',
    category: '81kg',
    achievements: 'Commonwealth Games Qualifier',
    image: '/images/athletes/athlete-3.jpg',
  },
]

export default function AthleteHighlights() {
  return (
    <section className="section-padding bg-brand-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Featured Athletes</h2>
          <p className="section-subtitle">
            Celebrating Sri Lanka's finest Olympic weightlifters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {athletes.map((athlete, index) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="card group cursor-pointer"
            >
              <div className="relative h-80 mb-4 rounded-lg overflow-hidden">
                {/* Placeholder - replace with actual Image */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-secondary flex items-center justify-center">
                  <FaMedal className="text-brand-accent text-6xl" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 text-brand-accent mb-2">
                    <FaTrophy />
                    <span className="text-sm font-semibold">{athlete.category}</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">
                    {athlete.name}
                  </h3>
                  <p className="text-sm text-brand-light/80">
                    {athlete.achievements}
                  </p>
                </div>
              </div>
              <Link
                href={`/athletes/${athlete.id}`}
                className="btn-outline w-full text-center block"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link href="/athletes" className="btn-secondary">
            Meet All Athletes
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
