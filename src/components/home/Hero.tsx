'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Hero() {
  const images = [
    '/images/hero-background.jpg',
    '/images/hero-background-2.jpg',
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, images.length])

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
    setAutoPlay(false)
    // Resume auto-play after 8 seconds of inactivity
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 8000)
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="relative w-full h-screen">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Lifting Social Hero ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={100}
              sizes="100vw"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevImage}
        className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextImage}
        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImageIndex
                ? 'bg-white w-8 h-2 sm:w-10 sm:h-2.5'
                : 'bg-white/50 hover:bg-white/75 w-2 h-2 sm:w-2.5 sm:h-2.5'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
