'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Heart, Flame } from 'lucide-react'
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

  const displayStats = [
    {
      icon: Users,
      value: stats?.users || 0,
      suffix: '+',
      label: 'Community Members',
      color: 'bg-rose-500',
    },
    {
      icon: Trophy,
      value: stats?.medals?.total || 0,
      suffix: '+',
      label: 'Championship Medals',
      color: 'bg-amber-500',
    },
    {
      icon: Heart,
      value: stats?.stories || 0,
      suffix: '+',
      label: 'Athlete Stories',
      color: 'bg-violet-500',
    },
    {
      icon: Flame,
      value: stats?.athletes || 0,
      suffix: '+',
      label: 'Featured Athletes',
      color: 'bg-orange-500',
    },
  ]

  return (
    <section className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
            The Movement in Numbers
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Building the strongest weightlifting community in Sri Lanka
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-[12px] p-6 text-center hover:border-zinc-700 transition-colors">
                <div className={`w-12 h-12 ${stat.color} rounded-[10px] flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="font-display text-3xl lg:text-4xl font-bold text-white mb-1">
                  {loading ? (
                    <span className="text-zinc-600">—</span>
                  ) : (
                    <>
                      {stat.value.toLocaleString()}
                      <span className="text-brand-accent">{stat.suffix}</span>
                    </>
                  )}
                </div>
                
                <p className="text-zinc-500 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
