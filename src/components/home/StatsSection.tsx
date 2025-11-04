'use client'

import { motion } from 'framer-motion'
import { FaUsers, FaTrophy, FaHeart, FaFire } from 'react-icons/fa'

const stats = [
  {
    icon: FaUsers,
    value: '1000+',
    label: 'Community Members',
    color: 'text-brand-accent',
  },
  {
    icon: FaTrophy,
    value: '50+',
    label: 'Championship Medals',
    color: 'text-yellow-400',
  },
  {
    icon: FaHeart,
    value: '500+',
    label: 'Athlete Stories',
    color: 'text-brand-primary',
  },
  {
    icon: FaFire,
    value: '100K+',
    label: 'Kilos Lifted Daily',
    color: 'text-orange-500',
  },
]

export default function StatsSection() {
  return (
    <section className="section-padding bg-brand-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/barbell-pattern.svg')] bg-repeat" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">The Movement in Numbers</h2>
          <p className="section-subtitle">
            Building the strongest weightlifting community in Sri Lanka
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-block mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-secondary to-brand-dark border-4 border-brand-light/10 flex items-center justify-center mx-auto">
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className="text-brand-light/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
