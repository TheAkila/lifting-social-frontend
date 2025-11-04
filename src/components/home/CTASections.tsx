'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaDumbbell, FaBook, FaUsers } from 'react-icons/fa'

const ctaSections = [
  {
    icon: FaDumbbell,
    title: 'Shop Apparel',
    description: 'Premium lifting gear designed for performance and style',
    href: '/shop',
    color: 'from-brand-primary to-red-600',
  },
  {
    icon: FaBook,
    title: 'Watch Stories',
    description: 'Inspiring journeys of Sri Lankan weightlifting champions',
    href: '/stories',
    color: 'from-brand-accent to-orange-600',
  },
  {
    icon: FaUsers,
    title: 'Join the Team',
    description: 'Become part of the Lifting Social community',
    href: '/community/join',
    color: 'from-brand-secondary to-blue-600',
  },
]

export default function CTASections() {
  return (
    <section className="section-padding bg-brand-dark">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctaSections.map((cta, index) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={cta.href}>
                <div className="relative group h-80 rounded-xl overflow-hidden cursor-pointer">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cta.color} transition-transform duration-500 group-hover:scale-110`}
                  />

                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-center p-8 z-10">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="mb-6"
                    >
                      <cta.icon className="text-6xl text-white drop-shadow-lg" />
                    </motion.div>
                    <h3 className="text-3xl font-display font-bold text-white mb-3 text-shadow">
                      {cta.title}
                    </h3>
                    <p className="text-white/90 mb-6 text-shadow">
                      {cta.description}
                    </p>
                    <div className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold transform group-hover:bg-white/30 transition-all">
                      Learn More →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
