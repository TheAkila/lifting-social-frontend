'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Trophy, Heart, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-zinc-800/50 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pre-headline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-zinc-300 text-sm font-medium">
              Sri Lankan Weightlifting Culture
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="text-white">Lift. </span>
            <span className="text-brand-accent">Train. </span>
            <span className="text-white">Inspire.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Where modern fitness meets authentic Sri Lankan weightlifting heritage.
            Join our community, shop premium gear, celebrate strength.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-rose-600 text-white px-7 py-3.5 rounded-[10px] font-medium text-base transition-all duration-250 shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-7 py-3.5 rounded-[10px] font-medium text-base border border-zinc-700 hover:border-zinc-600 transition-all duration-250"
            >
              Explore Stories
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto"
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-[12px] p-5 sm:p-6 hover:border-zinc-700 transition-colors duration-250">
              <Users className="w-5 h-5 text-brand-accent mb-3 mx-auto" />
              <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-zinc-500 text-xs sm:text-sm">Active Athletes</div>
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-[12px] p-5 sm:p-6 hover:border-zinc-700 transition-colors duration-250">
              <Trophy className="w-5 h-5 text-brand-accent mb-3 mx-auto" />
              <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-zinc-500 text-xs sm:text-sm">Success Stories</div>
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-[12px] p-5 sm:p-6 hover:border-zinc-700 transition-colors duration-250">
              <Heart className="w-5 h-5 text-brand-accent mb-3 mx-auto" />
              <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">1K+</div>
              <div className="text-zinc-500 text-xs sm:text-sm">Community</div>
            </div>
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
          className="w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 bg-brand-accent rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
