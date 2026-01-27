'use client'

import { motion } from 'framer-motion'

export default function AthletesHeader() {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
              Our Champions
            </h1>
            <p className="text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Meet the elite athletes representing Sri Lankan weightlifting on national and international stages
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
