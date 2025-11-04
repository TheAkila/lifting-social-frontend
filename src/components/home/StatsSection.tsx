'use client'

import { motion } from 'framer-motion'
import { FaUsers, FaTrophy, FaHeart, FaFire } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface Stats {
  athletes: number
  stories: number
  events: number
  products: number
  users: number
  medals: {
    total: number
    gold: number
    silver: number
    bronze: number
  }
  storyViews: number
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Fallback to default values if API fails
      setStats({
        athletes: 0,
        stories: 0,
        events: 0,
        products: 0,
        users: 0,
        medals: { total: 0, gold: 0, silver: 0, bronze: 0 },
        storyViews: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <section className="section-padding bg-brand-dark relative overflow-hidden">
        <div className="container-custom text-center">
          <p className="text-brand-light/70">Loading statistics...</p>
        </div>
      </section>
    )
  }

  const displayStats = [
    {
      icon: FaUsers,
      value: `${stats.users}+`,
      label: 'Community Members',
      color: 'text-brand-accent',
    },
    {
      icon: FaTrophy,
      value: `${stats.medals.total}+`,
      label: 'Championship Medals',
      color: 'text-yellow-400',
    },
    {
      icon: FaHeart,
      value: `${stats.stories}+`,
      label: 'Athlete Stories',
      color: 'text-brand-primary',
    },
    {
      icon: FaFire,
      value: `${stats.athletes}+`,
      label: 'Featured Athletes',
      color: 'text-orange-500',
    },
  ]
  return (
    <section className="section-padding bg-brand-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/barbell-pattern.svg')] bg-repeat" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">The Movement in Numbers</h2>
          <p className="section-subtitle">
            Building the strongest weightlifting community in Sri Lanka
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-secondary to-brand-dark border-4 border-brand-light/10 flex items-center justify-center mx-auto">
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className="text-brand-light/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
