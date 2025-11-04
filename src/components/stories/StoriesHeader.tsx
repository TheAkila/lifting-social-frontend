'use client'

import { motion } from 'framer-motion'
import { FaBook, FaVideo, FaTrophy } from 'react-icons/fa'

export default function StoriesHeader() {
  return (
    <section className="hero-bg py-20 mt-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Lifting <span className="gradient-text">Stories</span>
          </h1>
          <p className="text-xl text-brand-light/80 mb-8">
            Inspiring journeys, training insights, and championship moments from Sri Lanka's weightlifting community
          </p>
          
          {/* Story Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <FaBook className="text-4xl text-brand-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-brand-light/60">Articles</div>
            </div>
            <div className="text-center">
              <FaVideo className="text-4xl text-brand-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">30+</div>
              <div className="text-sm text-brand-light/60">Videos</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-brand-light/60">Achievements</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
