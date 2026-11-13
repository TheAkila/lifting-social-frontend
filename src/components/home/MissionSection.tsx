'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function MissionSection() {
  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-4">
          Our Mission
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 mb-6">
          To elevate Sri Lankan Olympic weightlifting by creating a platform that connects athletes, celebrates achievements, provides quality gear, and inspires the next generation of champions.
        </p>
        <Link
          href="/about"
          className="group inline-flex flex-col items-center text-xs font-semibold uppercase tracking-widest text-zinc-900"
        >
          <span className="inline-flex items-center gap-2">
            Read Our Story
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="mt-2 h-px w-full bg-zinc-300 group-hover:bg-zinc-900 transition-colors" />
        </Link>
      </motion.div>
    </section>
  )
}
