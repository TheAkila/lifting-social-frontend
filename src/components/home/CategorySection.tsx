'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Store, BookOpen, Medal, Calendar, Dumbbell, Shirt, ArrowRight, Sparkles } from 'lucide-react'

const categories = [
  {
    name: 'Shop',
    icon: Store,
    href: '/shop',
    description: 'Premium weightlifting gear & apparel',
    color: 'from-slate-900 to-black',
    accent: 'red'
  },
  {
    name: 'Stories',
    icon: BookOpen,
    href: '/stories',
    description: 'Inspiring athlete journeys & updates',
    color: 'from-red-500 to-red-700',
    accent: 'white'
  },
  {
    name: 'Athletes',
    icon: Medal,
    href: '/athletes',
    description: 'Meet our Sri Lankan champions',
    color: 'from-amber-500 to-orange-600',
    accent: 'white'
  },
  {
    name: 'Events',
    icon: Calendar,
    href: '/events',
    description: 'Competitions & tournaments',
    color: 'from-blue-600 to-indigo-700',
    accent: 'white'
  },
  {
    name: 'Coaching',
    icon: Dumbbell,
    href: '/coaching',
    description: 'Professional training programs',
    color: 'from-green-600 to-emerald-700',
    accent: 'white'
  },
  {
    name: 'Apparel',
    icon: Shirt,
    href: '/shop?category=Apparel',
    description: 'Lifestyle & performance wear',
    color: 'from-purple-600 to-pink-600',
    accent: 'white'
  }
]

export default function CategorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-inter font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Our World</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-4xl lg:text-5xl font-black text-black mb-6"
          >
            Everything You Need for
            <span className="text-red-500 block">Your Journey</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-ibm-plex text-xl text-slate-600 leading-relaxed"
          >
            From premium gear to inspiring stories, discover the complete weightlifting lifestyle
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            const isMainCategory = index < 3
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={category.href} className="block h-full">
                  <div className={`relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br ${category.color} hover:shadow-2xl hover:shadow-black/25 transition-all duration-500 hover:-translate-y-2 ${isMainCategory ? 'lg:h-96' : ''}`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                    <div className="absolute bottom-8 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0idXJsKCNncmlkLXBhdHRlcm4pIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHN2ZyBkZWZzPgo8cGF0dGVybiBpZD0iZ3JpZC1wYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJtIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L3N2ZyBkZWZzPgo8L3N2Zz4K')] opacity-30" />
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-between text-white">
                      <div className="flex items-start justify-between">
                        <div className="p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl group-hover:bg-white/30 group-hover:border-white/50 transition-all duration-300">
                          <Icon className="w-8 h-8" />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <ArrowRight className="w-6 h-6" />
                        </motion.div>
                      </div>
                      
                      <div>
                        <h3 className="font-outfit text-2xl lg:text-3xl font-black mb-3 group-hover:text-white/90 transition-colors">
                          {category.name}
                        </h3>
                        <p className="font-inter text-white/80 text-lg leading-relaxed group-hover:text-white/70 transition-colors">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/about"
            className="inline-flex items-center space-x-2 font-inter font-semibold text-slate-600 hover:text-black transition-colors group"
          >
            <span>Learn more about our mission</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
