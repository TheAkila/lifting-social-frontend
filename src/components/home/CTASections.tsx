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
    bgColor: 'bg-black',
    iconBg: 'bg-white',
    iconColor: 'text-black',
  },
  {
    icon: BookOpen,
    title: 'Watch Stories',
    description: 'Inspiring journeys of Sri Lankan weightlifting champions',
    href: '/stories',
    bgColor: 'bg-white border-2 border-black',
    iconBg: 'bg-black',
    iconColor: 'text-white',
    textColor: 'text-black',
  },
  {
    icon: Users,
    title: 'Join the Team',
    description: 'Become part of the Lifting Social community',
    href: '/signup',
    bgColor: 'bg-black',
    iconBg: 'bg-white',
    iconColor: 'text-black',
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
                <div className={`relative h-64 rounded-[12px] overflow-hidden ${cta.bgColor} p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 ${cta.iconBg} rounded-[10px] flex items-center justify-center`}>
                    <cta.icon className={`w-6 h-6 ${cta.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className={`text-2xl font-display font-bold ${cta.textColor || 'text-white'} mb-2`}>
                      {cta.title}
                    </h3>
                    <p className={`${cta.textColor ? 'text-gray-600' : 'text-white/80'} text-sm mb-4`}>
                      {cta.description}
                    </p>
                    <div className={`inline-flex items-center gap-2 ${cta.textColor || 'text-white'} text-sm font-medium group-hover:gap-3 transition-all`}>
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
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
