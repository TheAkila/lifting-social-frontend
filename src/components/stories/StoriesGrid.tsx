'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowRight, FaClock, FaUser, FaYoutube } from 'react-icons/fa'

const stories = [
  {
    id: '1',
    slug: 'from-village-to-victory',
    title: 'From Village Gym to National Stage: Dilanka\'s Journey',
    excerpt: 'How a young lifter from rural Sri Lanka overcame obstacles to become a national champion through dedication and perseverance.',
    author: 'Lifting Social Team',
    authorAvatar: '/images/authors/team.jpg',
    date: '2024-10-25',
    readTime: '5 min read',
    category: 'Athlete Story',
    categoryColor: 'bg-brand-primary',
    image: '/images/stories/story-1.jpg',
    views: 1250,
    featured: true,
  },
  {
    id: '2',
    slug: 'science-of-snatch',
    title: 'The Science of the Snatch: Biomechanics Explained',
    excerpt: 'Breaking down the technical aspects of Olympic weightlifting\'s most challenging lift with expert analysis.',
    author: 'Coach Pradeep Fernando',
    authorAvatar: '/images/authors/coach.jpg',
    date: '2024-10-20',
    readTime: '8 min read',
    category: 'Training',
    categoryColor: 'bg-brand-accent',
    image: '/images/stories/story-2.jpg',
    views: 980,
    featured: false,
  },
  {
    id: '3',
    slug: 'championship-2024-highlights',
    title: 'National Championship 2024: Record-Breaking Performances',
    excerpt: 'Relive the most exciting moments from this year\'s competition with highlights and athlete interviews.',
    author: 'Kasun Rajapaksa',
    authorAvatar: '/images/authors/kasun.jpg',
    date: '2024-10-15',
    readTime: '3 min read',
    category: 'Events',
    categoryColor: 'bg-yellow-500',
    image: '/images/stories/story-3.jpg',
    views: 2100,
    featured: true,
    videoId: 'dQw4w9WgXcQ', // YouTube video ID
  },
  {
    id: '4',
    slug: 'nutrition-for-lifters',
    title: 'Nutrition Guide for Serious Lifters',
    excerpt: 'Essential dietary strategies for building strength and maintaining optimal weight class.',
    author: 'Dr. Chamari Silva',
    authorAvatar: '/images/authors/dr-silva.jpg',
    date: '2024-10-10',
    readTime: '6 min read',
    category: 'Training',
    categoryColor: 'bg-brand-accent',
    image: '/images/stories/story-4.jpg',
    views: 1450,
    featured: false,
  },
  {
    id: '5',
    slug: 'womens-weightlifting-rise',
    title: 'The Rise of Women\'s Weightlifting in Sri Lanka',
    excerpt: 'How female athletes are breaking barriers and setting new standards in the sport.',
    author: 'Nadeesha Perera',
    authorAvatar: '/images/authors/nadeesha.jpg',
    date: '2024-10-05',
    readTime: '7 min read',
    category: 'News',
    categoryColor: 'bg-purple-500',
    image: '/images/stories/story-5.jpg',
    views: 1680,
    featured: true,
  },
  {
    id: '6',
    slug: 'olympic-dreams',
    title: 'Olympic Dreams: Next Generation of Lifters',
    excerpt: 'Meet the young athletes training for a shot at representing Sri Lanka on the world stage.',
    author: 'Lifting Social Team',
    authorAvatar: '/images/authors/team.jpg',
    date: '2024-09-28',
    readTime: '5 min read',
    category: 'Athlete Story',
    categoryColor: 'bg-brand-primary',
    image: '/images/stories/story-6.jpg',
    views: 1920,
    featured: false,
  },
]

export default function StoriesGrid() {
  return (
    <div className="space-y-12">
      {/* Featured Story */}
      {stories.filter(s => s.featured)[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <FeaturedStory story={stories.filter(s => s.featured)[0]} />
        </motion.div>
      )}

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.slice(1).map((story, index) => (
          <motion.article
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card group cursor-pointer hover:scale-105 transition-transform"
          >
            <Link href={`/stories/${story.slug}`}>
              {/* Image */}
              <div className="relative h-56 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                  {story.videoId ? (
                    <FaYoutube className="text-white/50 text-6xl" />
                  ) : (
                    <span className="text-white/50 font-bold text-lg">
                      {story.category}
                    </span>
                  )}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${story.categoryColor} text-white text-xs font-bold rounded-full`}>
                    {story.category}
                  </span>
                </div>

                {/* Video Badge */}
                {story.videoId && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <FaYoutube className="text-white text-xl" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors line-clamp-2">
                {story.title}
              </h3>

              <p className="text-brand-light/70 text-sm mb-4 line-clamp-3">
                {story.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-brand-light/50 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <FaUser />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{story.readTime}</span>
                  </div>
                </div>
                <span>{story.views.toLocaleString()} views</span>
              </div>

              {/* Read More */}
              <div className="flex items-center text-brand-accent font-semibold group-hover:gap-2 transition-all">
                Read More
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="btn-secondary">
          Load More Stories
        </button>
      </div>
    </div>
  )
}

function FeaturedStory({ story }: { story: typeof stories[0] }) {
  return (
    <div className="card overflow-hidden">
      <Link href={`/stories/${story.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-80 md:h-auto rounded-lg overflow-hidden bg-gradient-to-br from-brand-primary to-brand-secondary">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/50 font-bold text-2xl">
                FEATURED
              </span>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 ${story.categoryColor} text-white text-sm font-bold rounded-full`}>
                {story.category}
              </span>
            </div>

            {/* Featured Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-yellow-500 text-brand-dark text-sm font-bold rounded-full">
                ⭐ FEATURED
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 hover:text-brand-accent transition-colors">
              {story.title}
            </h2>
            
            <p className="text-brand-light/80 text-lg mb-6">
              {story.excerpt}
            </p>

            <div className="flex items-center space-x-4 text-sm text-brand-light/60 mb-6">
              <div className="flex items-center space-x-2">
                <FaUser />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock />
                <span>{story.readTime}</span>
              </div>
              <span>{story.views.toLocaleString()} views</span>
            </div>

            <div className="flex items-center text-brand-accent font-bold text-lg group hover:gap-3 transition-all">
              Read Full Story
              <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
