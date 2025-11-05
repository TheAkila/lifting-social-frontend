'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import StoryContent from '@/components/stories/StoryContent'
import StoryHeader from '@/components/stories/StoryHeader'
import RelatedStories from '@/components/stories/RelatedStories'
import api from '@/lib/api'

interface Story {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  categoryColor: string
  tags: string[]
  coverImage?: string
  image?: string
  publishedAt: string
  readTime: string
  views: number
  featured: boolean
  videoId?: string
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStory()
  }, [params.slug])

  const loadStory = async () => {
    try {
      const response = await api.get(`/stories/${params.slug}`)
      setStory(response.data)
    } catch (error) {
      console.error('Error fetching story:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-brand-light/70">Loading story...</p>
      </div>
    )
  }

  if (!story) {
    notFound()
  }

  const authorInfo = {
    id: '1',
    name: story.author || 'Lifting Social Team',
    avatar: '/images/authors/team.jpg',
    bio: 'Documenting the incredible stories of Sri Lankan weightlifting.',
  }

  const storyWithAuthor = {
    ...story,
    author: authorInfo,
    coverImage: story.coverImage || story.image,
  }

  return (
    <div className="min-h-screen pt-20">
      <StoryHeader story={storyWithAuthor} />
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <StoryContent content={story.content} />
          
          {/* Author Bio */}
          <div className="card mt-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {authorInfo.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{authorInfo.name}</h3>
                <p className="text-brand-light/70">{authorInfo.bio}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-brand-secondary/50 rounded-full text-sm hover:bg-brand-accent hover:text-brand-dark transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <RelatedStories currentStoryId={story._id} />
      </div>
    </div>
  )
}
