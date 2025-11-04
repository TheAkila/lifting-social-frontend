'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 text-shadow-lg"
          >
            Lift.{' '}
            <span className="gradient-text">
              Train.
            </span>{' '}
            Inspire.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-light/80 mb-8 max-w-3xl mx-auto"
          >
            Where Sri Lankan weightlifting culture meets modern fitness fashion.
            Join the movement, shop the lifestyle, celebrate the strength.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/stories" className="btn-outline">
              Watch Stories
            </Link>
            <button className="flex items-center space-x-2 text-brand-light hover:text-brand-accent transition-colors group">
              <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center group-hover:bg-brand-accent/30 transition-all">
                <FaPlay className="text-brand-accent ml-1" />
              </div>
              <span className="font-semibold">Play Video</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                500+
              </div>
              <div className="text-sm text-brand-light/60">Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                50+
              </div>
              <div className="text-sm text-brand-light/60">Stories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                1000+
              </div>
              <div className="text-sm text-brand-light/60">Community</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-brand-light/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-brand-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
