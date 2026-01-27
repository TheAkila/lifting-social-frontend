'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4">
              About Lifting Social
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 px-4">
              More than a brand—we're a movement celebrating Sri Lankan weightlifting culture
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-4 sm:mb-6">Our Mission</h2>
            <p className="text-base sm:text-lg text-zinc-600 text-center mb-6 sm:mb-8">
              To elevate Sri Lankan Olympic weightlifting by creating a platform that connects athletes, 
              celebrates achievements, provides quality gear, and inspires the next generation of champions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-brand-dark">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 text-brand-light/80"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-6 sm:mb-8">Our Story</h2>
            
            <p className="text-base sm:text-lg">
              Lifting Social was born from a simple observation: Sri Lankan weightlifters had incredible 
              talent but lacked a unified platform to showcase their achievements, connect with supporters, 
              and access quality training gear.
            </p>
            
            <p className="text-base sm:text-lg">
              Founded in 2023, we started with a vision to change this. What began as a small online 
              community quickly grew into a comprehensive lifestyle brand that serves athletes, coaches, 
              and fans across the island.
            </p>
            
            <p className="text-base sm:text-lg">
              Today, Lifting Social is proud to be Sri Lanka's premier Olympic weightlifting platform, 
              offering premium apparel, telling inspiring athlete stories, connecting coaches with students, 
              and building a community that celebrates every lift, every achievement, and every dream.
            </p>
            
            <p className="text-base sm:text-lg font-semibold text-blue-600">
              We're not just selling products—we're building a legacy. Join us in lifting Sri Lankan 
              weightlifting to new heights.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
