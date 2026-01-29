'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pt-20 sm:pt-24 md:pt-32">
      <div className="container mx-auto px-4">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[90vh] lg:min-h-[70vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-black/5 text-black px-3.5 py-2 rounded-full w-fit mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs sm:text-sm font-medium">
                Sri Lankan Strength Culture
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-tight"
            >
              Lift Better.
              <br />
              <span className="text-gray-600">Live Stronger.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl"
            >
              Premium gear, inspiring stories, and a thriving community of weightlifters dedicated to their craft.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/stories"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300"
              >
                <span>Read Stories</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
            >
              <div>
                <p className="text-2xl md:text-3xl font-bold text-black">500+</p>
                <p className="text-sm text-gray-500 mt-1">Community Members</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-black">100%</p>
                <p className="text-sm text-gray-500 mt-1">Quality Assured</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-black">24/7</p>
                <p className="text-sm text-gray-500 mt-1">Support Available</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] sm:h-[600px] md:h-[700px] hidden lg:block"
          >
            {/* Large Background Shape */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-3xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center"
              >
                {/* Placeholder for hero image - using gradient for now */}
                <div className="text-white text-center">
                  <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-16 h-16 text-white/30" />
                  </div>
                  <p className="text-white/40 text-sm">Hero Image Placeholder</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-8 left-8 w-20 h-20 bg-white/10 rounded-lg"
              />
              <motion.div
                animate={{
                  y: [20, 0, 20],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-8 right-8 w-32 h-32 border border-white/20 rounded-xl"
              />
            </div>

            {/* Floating Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs z-10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                  ⭐
                </div>
                <div>
                  <p className="font-semibold text-black">Premium Quality</p>
                  <p className="text-xs text-gray-500">Trusted by athletes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Image Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-80 sm:h-96 lg:hidden mt-12 sm:mt-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-12 h-12 text-white/30" />
                </div>
                <p className="text-white/40 text-sm">Hero Image</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-xs text-gray-500 font-medium">Scroll to explore</p>
          <motion.div className="w-5 h-8 border border-gray-300 rounded-full flex justify-center p-2">
            <motion.div className="w-1 h-1 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
