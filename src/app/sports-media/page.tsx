'use client'

import Link from 'next/link'
import { Camera, Video, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  title: string
  image_url: string
  alt_text: string
  category: string
}

export default function SportsMediaPage() {
  const [coverImages, setCoverImages] = useState<{ photography: GalleryImage | null; events: GalleryImage | null }>({
    photography: null,
    events: null,
  })

  useEffect(() => {
    fetchCoverImages()
  }, [])

  const fetchCoverImages = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) return

      const response = await fetch(`${apiUrl}/gallery?limit=100`)
      if (!response.ok) throw new Error('Failed to fetch')

      const json = await response.json()
      console.log('Sports media hub gallery API response:', json)
      const images = json.data || json
      const imageArray = Array.isArray(images) ? images : []
      console.log('Gallery images available:', imageArray.length)

      // Get first image from Competition/Training category for photography
      const photographyImage = imageArray.find((img: GalleryImage) => ['Competition', 'Training', 'Moments'].includes(img.category))
      console.log('Photography cover image found:', !!photographyImage)

      // Get first image from Events category for live events
      const eventsImage = imageArray.find((img: GalleryImage) => img.category === 'Events')
      console.log('Events cover image found:', !!eventsImage)

      setCoverImages({
        photography: photographyImage || null,
        events: eventsImage || null,
      })
    } catch (error) {
      console.error('Error fetching cover images:', error)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Sports Media Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-6 sm:mb-8">
              Capturing the power, passion, and precision of weightlifting through professional photography and live event coverage
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Sports Photography */}
            <Link
              href="/sports-media/photography"
              className="group bg-zinc-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden relative">
                {coverImages.photography ? (
                  <>
                    <Image
                      src={coverImages.photography.image_url}
                      alt={coverImages.photography.alt_text}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  </>
                ) : (
                  <Camera className="w-16 sm:w-20 h-16 sm:h-20 text-white/50" />
                )}
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-4 group-hover:text-brand-accent transition-colors">
                  Sports Photography
                </h2>
                <p className="text-zinc-600 mb-6">
                  Professional photography services capturing the intensity and athleticism of weightlifting competitions and training sessions.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-medium">
                  <span>View Gallery</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Live Sports Events */}
            <Link
              href="/sports-media/live-events"
              className="group bg-zinc-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden relative">
                {coverImages.events ? (
                  <>
                    <Image
                      src={coverImages.events.image_url}
                      alt={coverImages.events.alt_text}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  </>
                ) : (
                  <Video className="w-16 sm:w-20 h-16 sm:h-20 text-white/50" />
                )}
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-zinc-900 mb-4 group-hover:text-brand-accent transition-colors">
                  Live Sports Events
                </h2>
                <p className="text-zinc-600 mb-6">
                  Complete live event coverage including live streaming, real-time updates, and comprehensive event documentation.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-medium">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

     
    </div>
  )
}
