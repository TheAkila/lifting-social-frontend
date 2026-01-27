'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export default function ShopHeader() {
  return (
    <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium mb-4 sm:mb-6">
            <ShoppingBag className="w-3 h-3" />
            <span>Premium Collection</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
            Shop the Movement
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 px-4">
            Premium weightlifting apparel and gear designed for champions
          </p>
        </motion.div>
      </div>
    </section>
  )
}
