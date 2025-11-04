'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'

const relatedStories = [
  {
    id: '2',
    slug: 'science-of-snatch',
    title: 'The Science of the Snatch',
    excerpt: 'Breaking down biomechanics...',
    category: 'Training',
    categoryColor: 'bg-brand-accent',
    readTime: '8 min read',
  },
  {
    id: '3',
    slug: 'championship-2024',
    title: 'National Championship 2024 Highlights',
    excerpt: 'Record-breaking performances...',
    category: 'Events',
    categoryColor: 'bg-yellow-500',
    readTime: '3 min read',
  },
  {
    id: '4',
    slug: 'nutrition-guide',
    title: 'Nutrition Guide for Lifters',
    excerpt: 'Essential dietary strategies...',
    category: 'Training',
    categoryColor: 'bg-brand-accent',
    readTime: '6 min read',
  },
]

export default function RelatedStories({ currentStoryId }: { currentStoryId: string }) {
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-display font-bold mb-8">Related Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedStories.map((story, index) => (
          <motion.article
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105 transition-transform"
          >
            <Link href={`/stories/${story.slug}`}>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/50 font-bold">{story.category}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${story.categoryColor} text-white text-xs font-bold rounded-full`}>
                    {story.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">
                {story.title}
              </h3>
              
              <p className="text-brand-light/70 text-sm mb-4">
                {story.excerpt}
              </p>
              
              <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                Read More
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
