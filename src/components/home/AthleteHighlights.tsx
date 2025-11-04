'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaMedal, FaTrophy } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function AthleteHighlights() {
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get('/athletes')
      .then((res) => {
        if (!mounted) return
        // Get first 3 featured athletes, or just first 3
        const featured = res.data.filter((a: any) => a.featured).slice(0, 3)
        setAthletes(featured.length >= 3 ? featured : res.data.slice(0, 3))
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
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-brand-light/70">Loading athletes...</p>
            </div>
          ) : athletes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-brand-light/70">No athletes available.</p>
            </div>
          ) : (
            athletes.map((athlete, index) => (
              <motion.div
                key={athlete._id || athlete.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="card group cursor-pointer"
              >
                <div className="relative h-80 mb-4 rounded-lg overflow-hidden">
                  {athlete.image ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${athlete.image})` }} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-secondary flex items-center justify-center">
                      <FaMedal className="text-brand-accent text-6xl" />
                    </div>
                  )}
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
                  href={`/athletes/${athlete.slug}`}
                  className="btn-outline w-full text-center block"
                >
                  View Profile
                </Link>
              </motion.div>
            ))
          )}
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
