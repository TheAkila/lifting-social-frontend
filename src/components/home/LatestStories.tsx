'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaClock } from 'react-icons/fa'

const stories = [
  {
    id: '1',
    title: 'From Village Gym to National Stage',
    excerpt: 'How Dilanka Isuru overcame obstacles to become a champion...',
    author: 'Lifting Social Team',
    date: '2024-10-25',
    readTime: '5 min read',
    category: 'Athlete Story',
    image: '/images/stories/story-1.jpg',
  },
  {
    id: '2',
    title: 'The Science of the Snatch',
    excerpt: 'Breaking down the technical aspects of Olympic weightlifting...',
    author: 'Coach Pradeep',
    date: '2024-10-20',
    readTime: '8 min read',
    category: 'Training',
    image: '/images/stories/story-2.jpg',
  },
  {
    id: '3',
    title: 'Championship Highlights 2024',
    excerpt: 'Relive the most exciting moments from this year\'s competition...',
    author: 'Lifting Social Media',
    date: '2024-10-15',
    readTime: '3 min read',
    category: 'Events',
    image: '/images/stories/story-3.jpg',
  },
]

export default function LatestStories() {
  return (
    <section className="section-padding bg-brand-secondary/20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Latest Stories</h2>
          <p className="section-subtitle">
            Inspiring tales from the Sri Lankan weightlifting community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group cursor-pointer hover:scale-105 transition-transform"
            >
              <Link href={`/stories/${story.id}`}>
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                  {/* Placeholder image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/50 font-bold">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-accent text-brand-dark text-xs font-bold rounded-full">
                      {story.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">
                  {story.title}
                </h3>

                <p className="text-brand-light/70 text-sm mb-4 line-clamp-2">
                  {story.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-brand-light/50 mb-4">
                  <span>{story.author}</span>
                  <div className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>{story.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                  Read More
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/stories" className="btn-secondary">
            View All Stories
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
