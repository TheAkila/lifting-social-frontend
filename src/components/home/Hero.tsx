'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Trophy, Heart, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gray-200/30 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pre-headline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-black text-white border border-gray-800 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              Sri Lankan Weightlifting Culture
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-black"
          >
            Lift. Train. Inspire.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Where modern fitness meets authentic Sri Lankan weightlifting heritage.
            Join our community, shop premium gear, celebrate strength.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-7 py-3.5 rounded-[10px] font-medium text-base transition-all duration-250 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-black px-7 py-3.5 rounded-[10px] font-medium text-base border-2 border-black hover:border-gray-800 transition-all duration-250"
            >
              Explore Stories
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-black rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 bg-black rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
