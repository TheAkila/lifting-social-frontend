'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function EventsHeader() {
  return (
    <section className="bg-zinc-950 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium mb-6">
            <Calendar className="w-3 h-3" />
            <span>Upcoming Events</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Events & Competitions
          </h1>
          <p className="text-lg text-zinc-400">
            Join us at competitions, training camps, and seminars across Sri Lanka
          </p>
        </motion.div>
      </div>
    </section>
  )
}
