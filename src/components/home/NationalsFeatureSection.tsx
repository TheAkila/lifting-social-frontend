'use client'

import { motion } from 'framer-motion'

export default function NationalsFeatureSection() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1 relative w-full aspect-video rounded-2xl overflow-hidden shadow-card-hover bg-zinc-100"
        >
          <iframe
            src="https://www.youtube.com/embed/hjhng5vFzZ0"
            title="LiftingSocial at National Sports Festival 2026"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 md:order-2 text-center md:text-left"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-4">
            LiftingSocial at National Sports Festival 2026
          </h2>
          <p className="text-base sm:text-lg font-semibold text-zinc-900 mb-2">
            Taking Lifting Social to the national stage!
          </p>
          <p className="text-base sm:text-lg text-zinc-600">
            Our journey at the 50th National Sports Festival 2026, bringing technology to Sri Lankan
            weightlifting. Building, improving, and pushing Sri Lankan weightlifting forward through
            technology.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
