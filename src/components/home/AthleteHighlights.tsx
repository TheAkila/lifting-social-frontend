'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowRight, Users, Medal } from 'lucide-react'
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium mb-4"
            >
              <Trophy className="w-3 h-3" />
              <span>Our Champions</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl lg:text-4xl font-bold text-zinc-900"
            >
              Meet Sri Lanka's Finest Athletes
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/athletes"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-sm font-medium transition-colors group"
            >
              <span>View all athletes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Athletes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 animate-pulse">
                <div className="aspect-[4/5] bg-zinc-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-200 rounded w-1/3" />
                  <div className="h-6 bg-zinc-200 rounded w-2/3" />
                  <div className="h-4 bg-zinc-200 rounded w-full" />
                </div>
              </div>
            ))
          ) : athletes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Users className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500">No athletes available at the moment.</p>
            </div>
          ) : (
            athletes.map((athlete, index) => (
              <motion.div
                key={athlete._id || athlete.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/athletes/${athlete.slug}`} className="block">
                  <div className="bg-white rounded-[12px] overflow-hidden border border-zinc-100 shadow-soft hover:shadow-card-hover transition-all duration-350 hover:-translate-y-1">
                    {/* Athlete Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {athlete.image ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                          style={{ backgroundImage: `url(${athlete.image})` }} 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                          <Medal className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                      
                      {/* Badge */}
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>Champion</span>
                      </div>
                      
                      {/* Athlete Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <span className="text-xs text-white/70 uppercase tracking-wider font-medium">
                          {athlete.category}
                        </span>
                        <h3 className="font-display text-xl font-bold mt-1 group-hover:text-amber-300 transition-colors">
                          {athlete.name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-sm text-zinc-500 line-clamp-1">
                        {athlete.achievements || "Olympic weightlifter"}
                      </p>
                      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
