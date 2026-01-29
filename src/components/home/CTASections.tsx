'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, BookOpen, Users, ArrowRight } from 'lucide-react'

const ctaSections = [
  {
    icon: ShoppingBag,
    title: 'Shop Premium Gear',
    description: 'Explore our curated collection of lifting apparel and equipment',
    href: '/shop',
    bgColor: 'from-black to-gray-900',
    textColor: 'text-white',
    buttonColor: 'bg-white hover:bg-gray-100 text-black',
  },
  {
    icon: BookOpen,
    title: 'Read Stories',
    description: 'Inspiring journeys of athletes pushing their limits',
    href: '/stories',
    bgColor: 'from-gray-100 to-gray-50',
    textColor: 'text-black',
    buttonColor: 'bg-black hover:bg-gray-900 text-white',
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Connect with lifters, share experiences, grow together',
    href: '/signup',
    bgColor: 'from-black to-gray-900',
    textColor: 'text-white',
    buttonColor: 'bg-white hover:bg-gray-100 text-black',
  },
]

export default function CTASections() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ctaSections.map((cta, index) => (
            <motion.div
              key={cta.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={cta.href} className="block group h-full">
                <div className={`relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${cta.bgColor} p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                  {/* Icon */}
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 ${cta.bgColor === 'from-black to-gray-900' ? 'bg-white/10' : 'bg-black/10'} rounded-xl flex items-center justify-center mb-6`}
                    >
                      <cta.icon className={`w-7 h-7 ${cta.textColor}`} />
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-2xl sm:text-3xl font-display font-bold ${cta.textColor} mb-3`}>
                      {cta.title}
                    </h3>

                    {/* Description */}
                    <p className={`${cta.textColor === 'text-white' ? 'text-white/70' : 'text-black/60'} text-base`}>
                      {cta.description}
                    </p>
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ gap: '12px' }}
                    className={`inline-flex items-center gap-2 ${cta.buttonColor} px-6 py-3 rounded-lg font-semibold text-sm transition-all self-start`}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
