'use client'

import { motion } from 'framer-motion'
import { Dumbbell, Zap, TrendingUp } from 'lucide-react'

export default function ShopHeader() {
  return (
    <section className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,rgba(255,255,255,.1)_35px,rgba(255,255,255,.1)_70px)] bg-[length:70px_70px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
         
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-4 sm:mb-6 leading-tight">
            Premium Gear for Champions
          </h1>
        </motion.div>
      </div>
    </section>
  )
}
