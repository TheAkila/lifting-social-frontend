'use client'

import { motion } from 'framer-motion'

export default function ShopHeader() {
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
            Shop the <span className="gradient-text">Movement</span>
          </h1>
          <p className="text-xl text-brand-light/80">
            Premium weightlifting apparel and gear designed for champions
          </p>
        </motion.div>
      </div>
    </section>
  )
}
