'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, BookOpen, Users, ArrowRight } from 'lucide-react'

const ctaSections = [
  {
    icon: ShoppingBag,
    title: 'Shop Apparel',
    description: 'Premium lifting gear designed for performance and style',
    href: '/shop',
    gradient: 'from-zinc-900 to-zinc-800',
    iconBg: 'bg-brand-accent',
  },
  {
    icon: BookOpen,
    title: 'Watch Stories',
    description: 'Inspiring journeys of Sri Lankan weightlifting champions',
    href: '/stories',
    gradient: 'from-violet-600 to-indigo-700',
    iconBg: 'bg-white/20',
  },
  {
    icon: Users,
    title: 'Join the Team',
    description: 'Become part of the Lifting Social community',
    href: '/signup',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-white/20',
  },
]

export default function CTASections() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctaSections.map((cta, index) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={cta.href} className="block group">
                <div className={`relative h-64 rounded-[12px] overflow-hidden bg-gradient-to-br ${cta.gradient} p-6 flex flex-col justify-between`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 ${cta.iconBg} rounded-[10px] flex items-center justify-center`}>
                    <cta.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      {cta.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {cta.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
