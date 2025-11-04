'use client'

import { motion } from 'framer-motion'
import { FaMedal, FaTrophy, FaUsers } from 'react-icons/fa'

export default function AthletesHeader() {
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
            Our <span className="gradient-text">Champions</span>
          </h1>
          <p className="text-xl text-brand-light/80 mb-8">
            Meet the elite athletes representing Sri Lankan weightlifting pride on national and international stages
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <FaUsers className="text-4xl text-brand-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-brand-light/60">Athletes</div>
            </div>
            <div className="text-center">
              <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-brand-light/60">Champions</div>
            </div>
            <div className="text-center">
              <FaMedal className="text-4xl text-brand-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">120+</div>
              <div className="text-sm text-brand-light/60">Medals</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
