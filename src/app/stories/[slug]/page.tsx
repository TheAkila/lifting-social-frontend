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
  is_external?: boolean
  original_url?: string
  source_name?: string
  source_url?: string
  external_author?: string
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="animate-pulse text-zinc-400">Loading story...</div>
      </div>
    )
  }

  if (!story) {
    notFound()
  }

  const authorInfo = {
    id: '1',
    name: story.external_author || story.author || 'Lifting Social Team',
    avatar: '/images/authors/team.jpg',
    bio: story.is_external && story.source_name 
      ? `Article from ${story.source_name}` 
      : 'Documenting the incredible stories of Sri Lankan weightlifting.',
  }

  const storyWithAuthor = {
    ...story,
    author: authorInfo,
    coverImage: story.coverImage || story.image,
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <StoryHeader story={storyWithAuthor} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <StoryContent 
            content={story.content} 
            isExternal={story.is_external}
            originalUrl={story.original_url}
            sourceName={story.source_name}
          />
          
          {/* Author Bio - Only show for non-external posts or at the end */}
          {!story.is_external && (
            <div className="mt-16 pt-8 border-t border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {authorInfo.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-zinc-900">{authorInfo.name}</h3>
                <p className="text-zinc-500 text-sm">{authorInfo.bio}</p>
              </div>
            </div>
          </div>
          )}

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          <RelatedStories currentStoryId={story._id} />
        </div>
      </div>
    </div>
  )
}
